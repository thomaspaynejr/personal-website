'use client';

import React from 'react';
import Link from 'next/link';
import CodeBlock from './CodeBlock';

interface MarkdownRendererProps {
  content: string;
}

function parseInline(text: string): React.ReactNode[] {
  const elements: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Inline code `code`
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      elements.push(
        <code
          key={key++}
          className="px-1.5 py-0.5 rounded bg-background/90 border border-border-custom/40 text-[11px] font-mono text-action"
        >
          {codeMatch[1]}
        </code>
      );
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // Bold **text**
    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
    if (boldMatch) {
      elements.push(
        <strong key={key++} className="font-bold text-foreground">
          {parseInline(boldMatch[1])}
        </strong>
      );
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // Italic *text*
    const italicMatch = remaining.match(/^\*([^*]+)\*/);
    if (italicMatch) {
      elements.push(
        <em key={key++} className="italic text-accent/90">
          {parseInline(italicMatch[1])}
        </em>
      );
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // Link [text](url)
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      const linkText = linkMatch[1];
      const linkUrl = linkMatch[2];
      const isInternal = linkUrl.startsWith('/') || linkUrl.startsWith('#');

      if (isInternal) {
        elements.push(
          <Link
            key={key++}
            href={linkUrl}
            className="text-action underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            {linkText}
          </Link>
        );
      } else {
        elements.push(
          <a
            key={key++}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-action underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            {linkText}
          </a>
        );
      }
      remaining = remaining.slice(linkMatch[0].length);
      continue;
    }

    // Regular text up to the next special character
    const nextSpecialIndex = remaining.search(/[`*\[]/);
    if (nextSpecialIndex === -1) {
      elements.push(remaining);
      break;
    } else if (nextSpecialIndex === 0) {
      // Unmatched special character, consume 1 char
      elements.push(remaining[0]);
      remaining = remaining.slice(1);
    } else {
      elements.push(remaining.slice(0, nextSpecialIndex));
      remaining = remaining.slice(nextSpecialIndex);
    }
  }

  return elements;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const lines = content.split('\n');
  const blocks: React.ReactNode[] = [];
  const seenSlugs = new Map<string, number>();

  let i = 0;
  let blockKey = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Code block fence ```lang
    if (trimmed.startsWith('```')) {
      const lang = trimmed.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      // Skip closing ```
      if (i < lines.length) i++;
      blocks.push(
        <CodeBlock
          key={blockKey++}
          code={codeLines.join('\n')}
          language={lang || 'bash'}
        />
      );
      continue;
    }

    // 2. Horizontal rule ---
    if (/^---{1,}$/.test(trimmed)) {
      blocks.push(<hr key={blockKey++} className="border-border-custom/30 my-6" />);
      i++;
      continue;
    }

    // 3. Headings #, ##, ###, ####
    const headingMatch = trimmed.match(/^(#{1,4})(\s+.*)?$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const rawText = (headingMatch[2] || '').trim();
      const cleanText = rawText
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/`([^`]+)`/g, '$1');

      let slug = cleanText
        ? cleanText
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
        : `section-${blockKey}`;

      if (seenSlugs.has(slug)) {
        const count = seenSlugs.get(slug)! + 1;
        seenSlugs.set(slug, count);
        slug = `${slug}-${count}`;
      } else {
        seenSlugs.set(slug, 1);
      }

      if (level === 1) {
        blocks.push(
          <h1
            key={blockKey++}
            id={slug}
            className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-foreground mt-8 mb-4 border-b border-border-custom/20 pb-2 scroll-mt-20"
          >
            {parseInline(rawText || 'Heading')}
          </h1>
        );
      } else if (level === 2) {
        blocks.push(
          <h2
            key={blockKey++}
            id={slug}
            className="text-lg sm:text-xl font-bold uppercase tracking-tight text-foreground mt-8 mb-4 border-b border-border-custom/20 pb-2 scroll-mt-20 flex items-center gap-2"
          >
            <span className="text-action opacity-60">#</span>
            <span>{parseInline(rawText || 'Heading')}</span>
          </h2>
        );
      } else if (level === 3) {
        blocks.push(
          <h3
            key={blockKey++}
            id={slug}
            className="text-sm sm:text-base font-bold uppercase tracking-tight text-foreground mt-6 mb-3 scroll-mt-20 flex items-center gap-1.5"
          >
            <span className="text-action/50 text-xs">##</span>
            <span>{parseInline(rawText || 'Heading')}</span>
          </h3>
        );
      } else {
        blocks.push(
          <h4
            key={blockKey++}
            id={slug}
            className="text-xs font-bold uppercase tracking-widest text-action mt-4 mb-2 scroll-mt-20"
          >
            {parseInline(rawText || 'Heading')}
          </h4>
        );
      }
      i++;
      continue;
    }

    // 4. Blockquotes > text
    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().slice(1).trim());
        i++;
      }
      blocks.push(
        <blockquote
          key={blockKey++}
          className="border-l-2 border-action pl-4 my-4 italic text-accent text-xs leading-relaxed bg-card/20 py-2 rounded-r-lg"
        >
          {parseInline(quoteLines.join(' '))}
        </blockquote>
      );
      continue;
    }

    // 5. Unordered lists - item or * item
    if (/^[-*]\s+/.test(trimmed)) {
      const listItems: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^[-*]\s+/, ''));
        i++;
      }
      blocks.push(
        <ul key={blockKey++} className="space-y-1.5 my-3 pl-2 text-xs">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-foreground/90">
              <span className="text-action font-bold select-none">•</span>
              <span className="flex-1">{parseInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // 6. Ordered lists 1. item
    if (/^\d+\.\s+/.test(trimmed)) {
      const listItems: { num: string; text: string }[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        const match = lines[i].trim().match(/^(\d+)\.\s+(.+)$/);
        if (match) {
          listItems.push({ num: match[1], text: match[2] });
        }
        i++;
      }
      blocks.push(
        <ol key={blockKey++} className="space-y-2 my-3 pl-2 text-xs">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-foreground/90">
              <span className="text-action font-mono text-[10px] font-bold select-none pt-0.5">
                {item.num}.
              </span>
              <span className="flex-1">{parseInline(item.text)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // 7. Empty line
    if (trimmed === '') {
      i++;
      continue;
    }

    // 8. Regular paragraph
    const pLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^#{1,4}(\s|$)/.test(lines[i].trim()) &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].trim().startsWith('>') &&
      !/^[-*]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim()) &&
      !/^---{1,}$/.test(lines[i].trim())
    ) {
      pLines.push(lines[i]);
      i++;
    }

    if (pLines.length > 0) {
      blocks.push(
        <p key={blockKey++} className="text-xs text-foreground/85 leading-relaxed my-3 font-mono">
          {parseInline(pLines.join(' '))}
        </p>
      );
    } else {
      // Guaranteed loop advancement to prevent any infinite loop freeze
      i++;
    }
  }

  return <div className="space-y-1">{blocks}</div>;
}
