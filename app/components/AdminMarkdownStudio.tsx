'use client';

import React, { useState, useRef, useMemo } from 'react';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  Code,
  Terminal,
  Quote,
  List,
  ListOrdered,
  Link as LinkIcon,
  Minus,
  Columns,
  Eye,
  Edit3,
  LayoutGrid,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

interface AdminMarkdownStudioProps {
  name?: string;
  initialValue?: string;
  placeholder?: string;
  onChange?: (val: string) => void;
  rows?: number;
}

type ViewMode = 'blocks' | 'split' | 'edit' | 'preview';

type BlockType = 'h1' | 'h2' | 'h3' | 'paragraph' | 'code' | 'quote' | 'list' | 'divider';

interface EditorBlock {
  id: string;
  type: BlockType;
  text: string;
  lang?: string;
}

let blockSequence = 1000;
function createEditorBlock(type: BlockType): EditorBlock {
  blockSequence += 1;
  return {
    id: `blk-${blockSequence}`,
    type,
    text: '',
    lang: type === 'code' ? 'tsx' : undefined,
  };
}

function parseMarkdownToBlocks(md: string): EditorBlock[] {
  if (!md.trim()) {
    return [{ id: 'blk-0', type: 'paragraph', text: '' }];
  }

  const lines = md.split('\n');
  const blocks: EditorBlock[] = [];
  let i = 0;
  let idCounter = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === '') {
      i++;
      continue;
    }

    // Code block ```lang
    if (trimmed.startsWith('```')) {
      const lang = trimmed.slice(3).trim() || 'tsx';
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++;
      blocks.push({
        id: `blk-${idCounter++}`,
        type: 'code',
        text: codeLines.join('\n'),
        lang,
      });
      continue;
    }

    // Divider ---
    if (/^---+$/.test(trimmed)) {
      blocks.push({
        id: `blk-${idCounter++}`,
        type: 'divider',
        text: '',
      });
      i++;
      continue;
    }

    // Headings
    const hMatch = trimmed.match(/^(#{1,3})\s*(.*)$/);
    if (hMatch) {
      const level = hMatch[1].length;
      const type: BlockType = level === 1 ? 'h1' : level === 2 ? 'h2' : 'h3';
      blocks.push({
        id: `blk-${idCounter++}`,
        type,
        text: hMatch[2],
      });
      i++;
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('>')) {
      const qLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        qLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      blocks.push({
        id: `blk-${idCounter++}`,
        type: 'quote',
        text: qLines.join('\n'),
      });
      continue;
    }

    // Bullet List
    if (/^[-*]\s+/.test(trimmed)) {
      const lLines: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        lLines.push(lines[i].trim().replace(/^[-*]\s+/, ''));
        i++;
      }
      blocks.push({
        id: `blk-${idCounter++}`,
        type: 'list',
        text: lLines.join('\n'),
      });
      continue;
    }

    // Paragraph
    const pLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].trim().startsWith('#') &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].trim().startsWith('>') &&
      !/^[-*]\s+/.test(lines[i].trim()) &&
      !/^---+$/.test(lines[i].trim())
    ) {
      pLines.push(lines[i]);
      i++;
    }

    if (pLines.length > 0) {
      blocks.push({
        id: `blk-${idCounter++}`,
        type: 'paragraph',
        text: pLines.join('\n'),
      });
    } else {
      i++;
    }
  }

  return blocks.length > 0 ? blocks : [{ id: 'blk-0', type: 'paragraph', text: '' }];
}

function serializeBlocksToMarkdown(blocks: EditorBlock[]): string {
  return blocks
    .map((b) => {
      switch (b.type) {
        case 'h1':
          return `# ${b.text}`;
        case 'h2':
          return `## ${b.text}`;
        case 'h3':
          return `### ${b.text}`;
        case 'code':
          return `\`\`\`${b.lang || 'tsx'}\n${b.text}\n\`\`\``;
        case 'quote':
          return b.text
            .split('\n')
            .map((line) => `> ${line}`)
            .join('\n');
        case 'list':
          return b.text
            .split('\n')
            .map((line) => `- ${line}`)
            .join('\n');
        case 'divider':
          return `---`;
        case 'paragraph':
        default:
          return b.text;
      }
    })
    .join('\n\n');
}

export default function AdminMarkdownStudio({
  name = 'content',
  initialValue = '',
  placeholder = 'Write your markdown essay or notes here...',
  onChange,
  rows = 12,
}: AdminMarkdownStudioProps) {
  const [content, setContent] = useState(initialValue);
  const [blocks, setBlocks] = useState<EditorBlock[]>(() => parseMarkdownToBlocks(initialValue));
  const [viewMode, setViewMode] = useState<ViewMode>('blocks');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const stats = useMemo(() => {
    const trimmed = content.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = content.length;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    return { words, chars, readingTime: `${readingTime} min read` };
  }, [content]);

  const handleRawChange = (newVal: string) => {
    setContent(newVal);
    if (onChange) onChange(newVal);
  };

  const updateBlocks = (nextBlocks: EditorBlock[]) => {
    setBlocks(nextBlocks);
    const nextMd = serializeBlocksToMarkdown(nextBlocks);
    setContent(nextMd);
    if (onChange) onChange(nextMd);
  };

  const switchMode = (nextMode: ViewMode) => {
    if (nextMode === 'blocks' && viewMode !== 'blocks') {
      setBlocks(parseMarkdownToBlocks(content));
    }
    setViewMode(nextMode);
  };

  const handleBlockChange = (id: string, patch: Partial<EditorBlock>) => {
    const next = blocks.map((b) => (b.id === id ? { ...b, ...patch } : b));
    updateBlocks(next);
  };

  const addBlockAfter = (index: number, type: BlockType = 'paragraph') => {
    const newBlock = createEditorBlock(type);
    const next = [...blocks.slice(0, index + 1), newBlock, ...blocks.slice(index + 1)];
    updateBlocks(next);
  };

  const removeBlock = (index: number) => {
    if (blocks.length <= 1) {
      updateBlocks([{ id: 'blk-0', type: 'paragraph', text: '' }]);
      return;
    }
    const next = blocks.filter((_, idx) => idx !== index);
    updateBlocks(next);
  };

  const moveBlock = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    updateBlocks(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      insertSnippet('  ', '', '');
      return;
    }

    if (e.metaKey || e.ctrlKey) {
      if (e.key.toLowerCase() === 'b') {
        e.preventDefault();
        insertSnippet('**', '**', 'bold text');
      } else if (e.key.toLowerCase() === 'i') {
        e.preventDefault();
        insertSnippet('*', '*', 'italic text');
      } else if (e.key.toLowerCase() === 'k') {
        e.preventDefault();
        insertSnippet('[', '](https://...)', 'link text');
      }
    }
  };

  const handleEditorScroll = () => {
    const textarea = textareaRef.current;
    const preview = previewRef.current;
    if (!textarea || !preview || viewMode !== 'split') return;

    const maxTextareaScroll = textarea.scrollHeight - textarea.clientHeight;
    if (maxTextareaScroll > 0) {
      const scrollRatio = textarea.scrollTop / maxTextareaScroll;
      const maxPreviewScroll = preview.scrollHeight - preview.clientHeight;
      preview.scrollTop = scrollRatio * maxPreviewScroll;
    }
  };

  const insertSnippet = (before: string, after: string = '', defaultText: string = '') => {
    if (viewMode === 'blocks') {
      const mapType: Record<string, BlockType> = {
        '## ': 'h2',
        '### ': 'h3',
        '```tsx\n': 'code',
        '> ': 'quote',
        '- ': 'list',
        '\n---\n': 'divider',
      };
      if (before in mapType) {
        addBlockAfter(blocks.length - 1, mapType[before]);
        return;
      }
    }

    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || defaultText;

    const newContent =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end);

    handleRawChange(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  return (
    <div className="rounded-xl border border-border-custom/40 bg-card/40 backdrop-blur-md overflow-hidden font-mono shadow-sm transition-all">
      {/* Always persist hidden input so submitting in Blocks or Preview mode never loses content */}
      <input type="hidden" name={name} value={content} />

      {/* Studio Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between p-2.5 bg-background/50 border-b border-border-custom/30 gap-2 select-none text-xs">
        {/* Quick Format Tools */}
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => insertSnippet('**', '**', 'bold text')}
            className="p-1.5 rounded hover:bg-card border border-transparent hover:border-border-custom/30 text-accent hover:text-action cursor-none transition-colors"
            title="Bold"
          >
            <Bold size={13} />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('*', '*', 'italic text')}
            className="p-1.5 rounded hover:bg-card border border-transparent hover:border-border-custom/30 text-accent hover:text-action cursor-none transition-colors"
            title="Italic"
          >
            <Italic size={13} />
          </button>
          <div className="h-4 w-px bg-border-custom/40 mx-0.5" />
          <button
            type="button"
            onClick={() => insertSnippet('## ', '', 'Section Heading')}
            className="p-1.5 rounded hover:bg-card border border-transparent hover:border-border-custom/30 text-accent hover:text-action cursor-none transition-colors"
            title="Heading 2"
          >
            <Heading2 size={13} />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('### ', '', 'Subsection')}
            className="p-1.5 rounded hover:bg-card border border-transparent hover:border-border-custom/30 text-accent hover:text-action cursor-none transition-colors"
            title="Heading 3"
          >
            <Heading3 size={13} />
          </button>
          <div className="h-4 w-px bg-border-custom/40 mx-0.5" />
          <button
            type="button"
            onClick={() => insertSnippet('`', '`', 'code')}
            className="p-1.5 rounded hover:bg-card border border-transparent hover:border-border-custom/30 text-accent hover:text-action cursor-none transition-colors"
            title="Inline Code"
          >
            <Code size={13} />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('```tsx\n', '\n```', '// Code snippet here')}
            className="p-1.5 rounded hover:bg-card border border-transparent hover:border-border-custom/30 text-accent hover:text-action cursor-none transition-colors"
            title="Code Block"
          >
            <Terminal size={13} />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('> ', '', 'Insight or quote')}
            className="p-1.5 rounded hover:bg-card border border-transparent hover:border-border-custom/30 text-accent hover:text-action cursor-none transition-colors"
            title="Quote"
          >
            <Quote size={13} />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('- ', '', 'List item')}
            className="p-1.5 rounded hover:bg-card border border-transparent hover:border-border-custom/30 text-accent hover:text-action cursor-none transition-colors"
            title="Bullet List"
          >
            <List size={13} />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('1. ', '', 'Numbered item')}
            className="p-1.5 rounded hover:bg-card border border-transparent hover:border-border-custom/30 text-accent hover:text-action cursor-none transition-colors"
            title="Numbered List"
          >
            <ListOrdered size={13} />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('[', '](https://...)', 'Link Text')}
            className="p-1.5 rounded hover:bg-card border border-transparent hover:border-border-custom/30 text-accent hover:text-action cursor-none transition-colors"
            title="Link"
          >
            <LinkIcon size={13} />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('\n---\n', '', '')}
            className="p-1.5 rounded hover:bg-card border border-transparent hover:border-border-custom/30 text-accent hover:text-action cursor-none transition-colors"
            title="Divider"
          >
            <Minus size={13} />
          </button>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-card/60 p-1 rounded-lg border border-border-custom/40">
          <button
            type="button"
            onClick={() => switchMode('blocks')}
            className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-none transition-all ${
              viewMode === 'blocks'
                ? 'bg-action text-background'
                : 'text-accent hover:text-foreground'
            }`}
            title="Notion-Style Visual Block Editor"
          >
            <LayoutGrid size={11} />
            <span>Blocks</span>
          </button>
          <button
            type="button"
            onClick={() => switchMode('split')}
            className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider hidden sm:flex items-center gap-1 cursor-none transition-all ${
              viewMode === 'split'
                ? 'bg-action text-background'
                : 'text-accent hover:text-foreground'
            }`}
          >
            <Columns size={11} />
            <span>Split</span>
          </button>
          <button
            type="button"
            onClick={() => switchMode('edit')}
            className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-none transition-all ${
              viewMode === 'edit'
                ? 'bg-action text-background'
                : 'text-accent hover:text-foreground'
            }`}
          >
            <Edit3 size={11} />
            <span>Raw</span>
          </button>
          <button
            type="button"
            onClick={() => switchMode('preview')}
            className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-none transition-all ${
              viewMode === 'preview'
                ? 'bg-action text-background'
                : 'text-accent hover:text-foreground'
            }`}
          >
            <Eye size={11} />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* VISUAL BLOCK EDITOR MODE (Notion-style alternative to raw markdown split preview) */}
      {viewMode === 'blocks' && (
        <div className="p-4 sm:p-5 bg-background/20 space-y-3 max-h-[540px] overflow-y-auto">
          <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-accent/70 pb-1 border-b border-border-custom/20">
            <span>Visual Block Composer &bull; Click any block to style &amp; edit</span>
            <span>{blocks.length} {blocks.length === 1 ? 'Block' : 'Blocks'}</span>
          </div>

          <div className="space-y-2.5">
            {blocks.map((block, index) => (
              <div
                key={block.id}
                className="group relative rounded-xl border border-border-custom/30 hover:border-action/50 bg-card/40 p-3 transition-all space-y-2"
              >
                {/* Block Header Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {(['h1', 'h2', 'h3', 'paragraph', 'code', 'quote', 'list', 'divider'] as BlockType[]).map(
                      (t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => handleBlockChange(block.id, { type: t })}
                          className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider cursor-none transition-all ${
                            block.type === t
                              ? 'bg-action text-background'
                              : 'bg-background/60 text-accent hover:text-foreground border border-border-custom/30'
                          }`}
                        >
                          {t === 'paragraph' ? 'Text' : t}
                        </button>
                      )
                    )}
                    {block.type === 'code' && (
                      <input
                        type="text"
                        value={block.lang || 'tsx'}
                        onChange={(e) => handleBlockChange(block.id, { lang: e.target.value })}
                        placeholder="lang"
                        className="ml-1 w-16 px-1.5 py-0.5 rounded bg-background border border-border-custom text-[8px] text-action font-mono uppercase outline-none focus:border-action"
                      />
                    )}
                  </div>

                  {/* Block Actions */}
                  <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => moveBlock(index, -1)}
                      disabled={index === 0}
                      className="p-1 text-accent hover:text-action disabled:opacity-25 cursor-none"
                      title="Move Up"
                    >
                      <ArrowUp size={11} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveBlock(index, 1)}
                      disabled={index === blocks.length - 1}
                      className="p-1 text-accent hover:text-action disabled:opacity-25 cursor-none"
                      title="Move Down"
                    >
                      <ArrowDown size={11} />
                    </button>
                    <button
                      type="button"
                      onClick={() => addBlockAfter(index, 'paragraph')}
                      className="p-1 text-accent hover:text-action cursor-none"
                      title="Insert Block Below"
                    >
                      <Plus size={11} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeBlock(index)}
                      className="p-1 text-accent hover:text-red-500 cursor-none"
                      title="Remove Block"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>

                {/* Block Visual Input Surface */}
                {block.type === 'divider' ? (
                  <div className="py-2">
                    <hr className="border-border-custom/60" />
                  </div>
                ) : block.type === 'h1' ? (
                  <input
                    type="text"
                    value={block.text}
                    onChange={(e) => handleBlockChange(block.id, { text: e.target.value })}
                    placeholder="Primary Section Title (H1)..."
                    className="w-full bg-transparent text-lg sm:text-xl font-bold uppercase tracking-tight text-foreground outline-none border-b border-border-custom/30 pb-1"
                  />
                ) : block.type === 'h2' ? (
                  <div className="flex items-center gap-2 border-b border-border-custom/30 pb-1">
                    <span className="text-action font-bold">#</span>
                    <input
                      type="text"
                      value={block.text}
                      onChange={(e) => handleBlockChange(block.id, { text: e.target.value })}
                      placeholder="Section Heading (H2)..."
                      className="w-full bg-transparent text-sm sm:text-base font-bold uppercase tracking-tight text-foreground outline-none"
                    />
                  </div>
                ) : block.type === 'h3' ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-action/60 text-xs font-bold">##</span>
                    <input
                      type="text"
                      value={block.text}
                      onChange={(e) => handleBlockChange(block.id, { text: e.target.value })}
                      placeholder="Subsection Heading (H3)..."
                      className="w-full bg-transparent text-xs sm:text-sm font-bold uppercase tracking-tight text-foreground outline-none"
                    />
                  </div>
                ) : block.type === 'code' ? (
                  <textarea
                    value={block.text}
                    onChange={(e) => handleBlockChange(block.id, { text: e.target.value })}
                    placeholder="// Paste or write code snippet..."
                    rows={Math.max(3, block.text.split('\n').length)}
                    className="w-full bg-background/80 rounded-lg p-3 border border-border-custom/40 text-[11px] font-mono text-action outline-none focus:border-action resize-y leading-relaxed"
                  />
                ) : block.type === 'quote' ? (
                  <div className="border-l-2 border-action pl-3 bg-background/30 py-1.5 rounded-r-lg">
                    <textarea
                      value={block.text}
                      onChange={(e) => handleBlockChange(block.id, { text: e.target.value })}
                      placeholder="Key insight, callout, or quote..."
                      rows={Math.max(2, block.text.split('\n').length)}
                      className="w-full bg-transparent italic text-xs text-accent outline-none resize-y leading-relaxed"
                    />
                  </div>
                ) : block.type === 'list' ? (
                  <div className="space-y-1">
                    <textarea
                      value={block.text}
                      onChange={(e) => handleBlockChange(block.id, { text: e.target.value })}
                      placeholder="One bullet item per line..."
                      rows={Math.max(2, block.text.split('\n').length)}
                      className="w-full bg-background/30 rounded-lg p-2.5 border border-border-custom/20 text-xs text-foreground/90 outline-none focus:border-action resize-y leading-relaxed"
                    />
                    <p className="text-[8px] text-accent/60 uppercase tracking-widest">
                      Each line renders as a bullet item (•)
                    </p>
                  </div>
                ) : (
                  <textarea
                    value={block.text}
                    onChange={(e) => handleBlockChange(block.id, { text: e.target.value })}
                    placeholder={placeholder}
                    rows={Math.max(2, block.text.split('\n').length)}
                    className="w-full bg-transparent text-xs text-foreground/90 outline-none resize-y leading-relaxed"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Quick Add Block Bar */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2">
            <span className="text-[8px] font-bold uppercase tracking-widest text-accent mr-1">
              + Append Block:
            </span>
            {(
              [
                { type: 'paragraph', label: 'Paragraph' },
                { type: 'h2', label: 'Heading 2' },
                { type: 'h3', label: 'Heading 3' },
                { type: 'code', label: 'Code Block' },
                { type: 'quote', label: 'Quote' },
                { type: 'list', label: 'Bullet List' },
                { type: 'divider', label: 'Divider' },
              ] as { type: BlockType; label: string }[]
            ).map((item) => (
              <button
                key={item.type}
                type="button"
                onClick={() => addBlockAfter(blocks.length - 1, item.type)}
                className="px-2 py-1 rounded-md bg-card hover:bg-action hover:text-background border border-border-custom/40 text-[8px] font-bold uppercase tracking-widest text-accent transition-all cursor-none"
              >
                + {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SPLIT / RAW / PREVIEW MODES */}
      {viewMode !== 'blocks' && (
        <div
          className={`grid ${
            viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
          } divide-y lg:divide-y-0 lg:divide-x divide-border-custom/30 min-h-[280px]`}
        >
          {/* Raw Editor Pane */}
          {(viewMode === 'edit' || viewMode === 'split') && (
            <div className="p-3 bg-background/30 flex flex-col">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => handleRawChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onScroll={handleEditorScroll}
                placeholder={placeholder}
                rows={rows}
                className="w-full h-full min-h-[280px] bg-transparent border-0 outline-none text-xs text-foreground/90 font-mono resize-y leading-relaxed"
              />
            </div>
          )}

          {/* Live Preview Pane */}
          {(viewMode === 'preview' || viewMode === 'split') && (
            <div
              ref={previewRef}
              className="p-5 bg-card/20 overflow-y-auto max-h-[500px] min-h-[280px] transition-all scroll-smooth"
            >
              <div className="text-[9px] font-bold uppercase tracking-widest text-accent/60 mb-3 border-b border-border-custom/20 pb-1">
                Live Preview
              </div>
              {content.trim() ? (
                <MarkdownRenderer content={content} />
              ) : (
                <p className="text-xs text-accent/50 italic">
                  Markdown preview will appear here in real-time as you write...
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Studio Footer Telemetry */}
      <div className="flex items-center justify-between px-4 py-2 bg-background/50 border-t border-border-custom/30 text-[9px] text-accent uppercase tracking-widest select-none">
        <div className="flex items-center gap-3">
          <span>{stats.words} Words</span>
          <span>•</span>
          <span>{stats.chars} Characters</span>
        </div>
        <div className="text-action font-bold">{stats.readingTime}</div>
      </div>
    </div>
  );
}
