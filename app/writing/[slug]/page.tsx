import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ArrowLeft, Clock, Calendar, Tag, Share2, BookOpen } from 'lucide-react';
import { FadeIn } from '@/app/components/Animations';
import { Article } from '../page';

// Sample fallback articles if Supabase is unseeded
const DEFAULT_ARTICLES: Record<string, Article> = {
  'discipline-over-motivation': {
    id: 'sample-1',
    title: 'Discipline Over Motivation: Lessons from Military Service to Software Engineering',
    slug: 'discipline-over-motivation',
    excerpt: 'How military rigor, structured execution, and relentless consistency shape modern high-throughput software architecture.',
    content: `### Grounded in Structure

Transitioning from military service to software engineering teaches a fundamental lesson: **motivation is volatile, but systems and discipline endure.**

When building complex applications with modern stacks like **Next.js 16**, **Supabase**, and **Tailwind CSS 4**, software architecture demands clear constraints and strict standards.

#### Core Principles of Applied Discipline

1. **Standardize Workflows**: Codebases thrive when conventions are strictly defined and documented.
2. **Resilience & Graceful Failures**: Every external dependency (APIs, databases, network routes) must have deterministic error handling.
3. **Continuous Execution**: Progress is built brick by brick, commit by commit.

---

### Operating Under Constraints

In both operational environments and system engineering, constraints breed clarity. Monochromatic minimalism isn't just an aesthetic choice—it's a philosophy of eliminating clutter to focus purely on performance, functionality, and execution.

> "Discipline equals freedom." — Jocko Willink

When you strip away non-essential visual noise, what remains is pure signal: fast load times, robust type safety, and clean user experience.`,
    tags: ['Engineering', 'Military', 'Leadership', 'Architecture'],
    reading_time: '4 min read',
    published_at: '2026-08-01T00:00:00.000Z',
    is_published: true
  },
  'building-monochromatic-minimalist-interfaces': {
    id: 'sample-2',
    title: 'Building Monochromatic Minimalist Interfaces with Framer Motion',
    slug: 'building-monochromatic-minimalist-interfaces',
    excerpt: 'Exploring Yeezy-inspired dark grayscale aesthetics, shrunk typography, and buttery 60fps spring physics.',
    content: `### The Power of Constraint

Restricting a color palette to obsidian tones (\`#000000\`, \`#1A1A1A\`, \`#DEDEDE\`) forces UI elements to rely on contrast, whitespace, and physics.

#### Micro-Interactions & Spring Physics
By replacing heavy CSS transitions with Framer Motion \`useSpring\` and \`useMotionValue\`, layout thrashing is eliminated while producing butter-smooth cursor tracking and section reveals.

\`\`\`tsx
const cursorX = useSpring(mouseX, { stiffness: 400, damping: 28 });
const cursorY = useSpring(mouseY, { stiffness: 400, damping: 28 });
\`\`\`

#### Shrunk Typography Hierarchy
- Headings: \`text-2xl\` or \`text-lg\` (uppercase, tracking-tight)
- Body: \`text-xs\` or \`text-[11px]\` (leading-relaxed)
- Badges & Labels: \`text-[9px]\` or \`text-[8px]\` (tracking-widest)`,
    tags: ['UI/UX', 'Framer Motion', 'Design', 'Next.js'],
    reading_time: '3 min read',
    published_at: '2026-07-28T00:00:00.000Z',
    is_published: true
  },
  'nextjs-16-async-server-components-turbopack': {
    id: 'sample-3',
    title: 'Next.js 16 Async Server Components & Turbopack In-Depth',
    slug: 'nextjs-16-async-server-components-turbopack',
    excerpt: 'Navigating breaking changes in Next.js 16 including promise-based searchParams, proxy.ts middleware, and Server Action limits.',
    content: `### Embracing Next.js 16

Next.js 16 brings powerful performance upgrades with Turbopack, but introduces key architectural shifts:

- \`searchParams\` and \`params\` are now Promises that **must be awaited** in Server Components.
- \`middleware.ts\` is superseded by root-level \`proxy.ts\`.
- Default Server Action payload limits require explicit scaling in \`next.config.ts\`.

#### Awaiting Parameters in Next.js 16
\`\`\`tsx
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Fetch article data using slug...
}
\`\`\``,
    tags: ['Next.js 16', 'TypeScript', 'Turbopack', 'Performance'],
    reading_time: '5 min read',
    published_at: '2026-07-20T00:00:00.000Z',
    is_published: true
  }
};

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  let article: Article | null = null;

  if (supabase) {
    const { data } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (data) {
      article = data as Article;
    }
  }

  // Fallback to sample article dictionary if not found in DB
  if (!article && DEFAULT_ARTICLES[slug]) {
    article = DEFAULT_ARTICLES[slug];
  }

  if (!article) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-10 space-y-8 font-sans">
      {/* Back Button */}
      <FadeIn>
        <Link
          href="/writing"
          className="inline-flex items-center gap-2 text-xs font-bold text-accent hover:text-action transition-all uppercase tracking-widest group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Writing</span>
        </Link>
      </FadeIn>

      {/* Article Header Card */}
      <FadeIn delay={0.1}>
        <article className="bg-card/40 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-border-custom/30 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 text-[10px] text-accent uppercase tracking-widest font-mono border-b border-border-custom/30 pb-4">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Calendar size={12} className="text-action" />
                {new Date(article.published_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock size={12} className="text-action" />
                {article.reading_time}
              </span>
            </div>
            <div className="flex items-center gap-1 text-action">
              <BookOpen size={12} />
              <span>ESSAY // NOTE</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-foreground leading-tight">
            {article.title}
          </h1>

          <p className="text-sm text-accent leading-relaxed italic border-l-2 border-action pl-4 py-1">
            {article.excerpt}
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {article.tags?.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md bg-background/60 text-accent border border-border-custom/30"
              >
                <Tag size={10} className="text-action" />
                #{tag}
              </span>
            ))}
          </div>
        </article>
      </FadeIn>

      {/* Article Content */}
      <FadeIn delay={0.2}>
        <div className="bg-card/40 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-border-custom/30 shadow-sm text-xs text-foreground/90 leading-relaxed whitespace-pre-wrap space-y-4 font-mono">
          {article.content}
        </div>
      </FadeIn>

      {/* Footer Navigation & Share */}
      <FadeIn delay={0.3}>
        <div className="flex justify-between items-center bg-card/40 backdrop-blur-md p-5 rounded-xl border border-border-custom/30 text-xs font-mono">
          <Link
            href="/writing"
            className="text-[10px] font-bold text-accent hover:text-foreground uppercase tracking-widest flex items-center gap-2"
          >
            <ArrowLeft size={12} />
            <span>All Articles</span>
          </Link>
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert('Article URL copied to clipboard!');
              }
            }}
            className="text-[10px] font-bold text-action hover:underline uppercase tracking-widest flex items-center gap-1.5 cursor-none"
          >
            <Share2 size={12} />
            <span>Share Link _</span>
          </button>
        </div>
      </FadeIn>
    </main>
  );
}
