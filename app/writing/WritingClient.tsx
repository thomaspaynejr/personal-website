'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Clock, Tag, BookOpen, ArrowUpRight } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/Animations';
import { Article } from './page';

export default function WritingClient({ initialArticles }: { initialArticles: Article[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    initialArticles.forEach((art) => art.tags?.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [initialArticles]);

  // Filtered articles based on search & tag selection
  const filteredArticles = useMemo(() => {
    return initialArticles.filter((article) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTag = !selectedTag || article.tags?.includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [initialArticles, searchQuery, selectedTag]);

  return (
    <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      {/* Header Section */}
      <FadeIn>
        <section className="bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-border-custom/30 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-bold text-foreground tracking-[0.2em] uppercase">
            <BookOpen size={12} className="text-action" />
            WRITING // TECHNICAL NOTES & INSIGHTS
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-action">
            Articles & Documentation
          </h1>
          <p className="text-accent text-xs leading-relaxed max-w-2xl">
            A repository of write-ups covering software architecture, discipline, military transitions, and modern Web engineering.
          </p>

          {/* Search & Tag Filter Bar */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center border-t border-border-custom/30">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" />
              <input
                type="text"
                placeholder="Search articles or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background/50 border border-border-custom rounded-xl pl-8 pr-4 py-2 text-xs text-foreground outline-none focus:border-action transition-all"
              />
            </div>

            {/* Clear Filters Indicator */}
            {(selectedTag || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedTag(null);
                  setSearchQuery('');
                }}
                className="text-[9px] font-bold text-action uppercase tracking-widest hover:underline self-start sm:self-auto"
              >
                Clear Filters _
              </button>
            )}
          </div>

          {/* Tag Pills */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest transition-all ${
                  selectedTag === null
                    ? 'bg-action text-white border border-action'
                    : 'bg-card/60 text-accent hover:text-foreground border border-border-custom/50'
                }`}
              >
                ALL ({initialArticles.length})
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest transition-all ${
                    selectedTag === tag
                      ? 'bg-action text-white border border-action'
                      : 'bg-card/60 text-accent hover:text-foreground border border-border-custom/50'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </section>
      </FadeIn>

      {/* Articles Feed */}
      <StaggerContainer delay={0.1} className="space-y-4">
        {filteredArticles.map((article) => (
          <StaggerItem key={article.id}>
            <Link
              href={`/writing/${article.slug}`}
              className="block group bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-border-custom/30 hover:border-action transition-all duration-300 shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
                <h2 className="text-base font-bold text-foreground group-hover:text-action transition-colors uppercase tracking-tight flex items-center gap-2">
                  <span>{article.title}</span>
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-action shrink-0" />
                </h2>
                <div className="flex items-center gap-3 text-[9px] text-accent shrink-0 font-medium uppercase tracking-widest">
                  <span className="flex items-center gap-1">
                    <Clock size={10} className="text-action" />
                    {article.reading_time}
                  </span>
                  <span>•</span>
                  <span>
                    {new Date(article.published_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              <p className="text-xs text-accent/90 leading-relaxed mb-4 line-clamp-2">
                {article.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border-custom/20">
                {article.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-background/60 text-accent border border-border-custom/30"
                  >
                    <Tag size={8} className="text-action" />
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          </StaggerItem>
        ))}

        {!filteredArticles.length && (
          <div className="bg-card/30 rounded-2xl p-12 text-center border border-border-custom/30">
            <p className="text-xs text-accent uppercase tracking-widest italic">
              No articles found matching your query.
            </p>
          </div>
        )}
      </StaggerContainer>
    </main>
  );
}
