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
  Edit3 
} from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

interface AdminMarkdownStudioProps {
  name?: string;
  initialValue?: string;
  placeholder?: string;
  onChange?: (val: string) => void;
  rows?: number;
}

type ViewMode = 'split' | 'edit' | 'preview';

export default function AdminMarkdownStudio({
  name = 'content',
  initialValue = '',
  placeholder = 'Write your markdown essay or notes here...',
  onChange,
  rows = 12
}: AdminMarkdownStudioProps) {
  const [content, setContent] = useState(initialValue);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const stats = useMemo(() => {
    const trimmed = content.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = content.length;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    return { words, chars, readingTime: `${readingTime} min read` };
  }, [content]);

  const handleChange = (newVal: string) => {
    setContent(newVal);
    if (onChange) onChange(newVal);
  };

  const insertSnippet = (before: string, after: string = '', defaultText: string = '') => {
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

    handleChange(newContent);

    // Reposition cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  return (
    <div className="rounded-xl border border-border-custom/40 bg-card/40 backdrop-blur-md overflow-hidden font-mono shadow-sm">
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
            onClick={() => setViewMode('edit')}
            className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-none transition-all ${
              viewMode === 'edit'
                ? 'bg-action text-background'
                : 'text-accent hover:text-foreground'
            }`}
          >
            <Edit3 size={11} />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('split')}
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
            onClick={() => setViewMode('preview')}
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

      {/* Editor / Preview Content Area */}
      <div className={`grid ${viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} divide-y lg:divide-y-0 lg:divide-x divide-border-custom/30 min-h-[280px]`}>
        {/* Editor Pane */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className="p-3 bg-background/30 flex flex-col">
            <textarea
              ref={textareaRef}
              name={name}
              value={content}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={placeholder}
              rows={rows}
              className="w-full h-full min-h-[260px] bg-transparent border-0 outline-none text-xs text-foreground/90 font-mono resize-y leading-relaxed"
            />
          </div>
        )}

        {/* Live Preview Pane */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className="p-5 bg-card/20 overflow-y-auto max-h-[500px]">
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

      {/* Studio Footer Telemetry */}
      <div className="flex items-center justify-between px-4 py-2 bg-background/50 border-t border-border-custom/30 text-[9px] text-accent uppercase tracking-widest select-none">
        <div className="flex items-center gap-3">
          <span>{stats.words} Words</span>
          <span>•</span>
          <span>{stats.chars} Characters</span>
        </div>
        <div className="text-action font-bold">
          {stats.readingTime}
        </div>
      </div>
    </div>
  );
}
