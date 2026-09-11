'use client';

import React, { useEffect, useState } from 'react';
import { ListFilter, ChevronDown, ChevronUp } from 'lucide-react';

export interface TOCItem {
  id: string;
  text: string;
  level: number; // 2 for h2, 3 for h3, 4 for h4
}

export function extractTOC(content: string): TOCItem[] {
  const lines = content.split('\n');
  const items: TOCItem[] = [];
  const seenSlugs = new Map<string, number>();

  for (const line of lines) {
    const trimmed = line.trim();
    const headingMatch = trimmed.match(/^(#{2,4})\s+(.+)$/);
    if (!headingMatch) continue;

    const hashes = headingMatch[1];
    const text = headingMatch[2]
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/`([^`]+)`/g, '$1')
      .trim();

    let slug = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    if (seenSlugs.has(slug)) {
      const count = seenSlugs.get(slug)! + 1;
      seenSlugs.set(slug, count);
      slug = `${slug}-${count}`;
    } else {
      seenSlugs.set(slug, 1);
    }

    items.push({
      id: slug,
      text,
      level: hashes.length
    });
  }

  return items;
}

export default function TableOfContents({ content }: { content: string }) {
  const [activeId, setActiveId] = useState<string>('');
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const items = extractTOC(content);

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      {
        rootMargin: '-10% 0px -70% 0px',
        threshold: 0.1
      }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
      setIsOpenMobile(false);
    }
  };

  return (
    <nav aria-label="Table of contents" className="my-6 rounded-xl border border-border-custom/40 bg-card/40 backdrop-blur-md p-4 text-xs font-mono select-none">
      {/* Mobile Toggle Header */}
      <div
        onClick={() => setIsOpenMobile(!isOpenMobile)}
        className="flex items-center justify-between cursor-pointer md:cursor-default"
      >
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-action">
          <ListFilter size={12} />
          <span>TABLE OF CONTENTS</span>
          <span className="text-accent/60">({items.length})</span>
        </div>
        <button
          type="button"
          aria-label="Toggle Table of Contents"
          className="md:hidden text-accent hover:text-action cursor-none"
        >
          {isOpenMobile ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* List (Always open on md+, collapsible on mobile) */}
      <div className={`mt-3 space-y-1.5 ${isOpenMobile ? 'block' : 'hidden md:block'}`}>
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollToHeading(item.id)}
              className={`w-full text-left transition-all duration-200 block py-1 cursor-none ${
                item.level === 3 ? 'pl-4 text-[10px]' : item.level === 4 ? 'pl-8 text-[9px]' : 'text-[11px]'
              } ${
                isActive
                  ? 'text-action font-bold translate-x-1'
                  : 'text-accent hover:text-foreground'
              }`}
            >
              <span className="mr-1 opacity-50">{isActive ? '▸' : '•'}</span>
              <span>{item.text}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
