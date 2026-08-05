import { createClient } from '@/lib/supabase/server';
import WritingClient from './WritingClient';

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  reading_time: string;
  published_at: string;
  is_published: boolean;
}

const DEFAULT_ARTICLES: Article[] = [
  {
    id: 'sample-1',
    title: 'Discipline Over Motivation: Lessons from Military Service to Software Engineering',
    slug: 'discipline-over-motivation',
    excerpt: 'How military rigor, structured execution, and relentless consistency shape modern high-throughput software architecture.',
    content: `### Grounded in Structure

Transitioning from military service to software engineering teaches a fundamental lesson: motivation is volatile, but systems and discipline endure.

When building complex applications with modern stacks like **Next.js 16**, **Supabase**, and **Tailwind CSS 4**, software architecture demands clear constraints and strict standards.

#### Key Takeaways:
1. **Standardize Workflows**: Codebases thrive when conventions are strictly defined and documented.
2. **Resilience & Graceful Failures**: Every external dependency (APIs, databases, network routes) must have deterministic error handling.
3. **Continuous Execution**: Progress is built brick by brick, commit by commit.`,
    tags: ['Engineering', 'Military', 'Leadership', 'Architecture'],
    reading_time: '4 min read',
    published_at: '2026-08-01T00:00:00.000Z',
    is_published: true
  },
  {
    id: 'sample-2',
    title: 'Building Monochromatic Minimalist Interfaces with Framer Motion',
    slug: 'building-monochromatic-minimalist-interfaces',
    excerpt: 'Exploring Yeezy-inspired dark grayscale aesthetics, shrunk typography, and buttery 60fps spring physics.',
    content: `### The Power of Constraint

Restricting a color palette to obsidian tones (#000000, #1A1A1A, #DEDEDE) forces UI elements to rely on contrast, whitespace, and physics.

#### Micro-Interactions & Spring Physics
By replacing heavy CSS transitions with Framer Motion \`useSpring\` and \`useMotionValue\`, layout thrashing is eliminated while producing butter-smooth cursor tracking and section reveals.`,
    tags: ['UI/UX', 'Framer Motion', 'Design', 'Next.js'],
    reading_time: '3 min read',
    published_at: '2026-07-28T00:00:00.000Z',
    is_published: true
  },
  {
    id: 'sample-3',
    title: 'Next.js 16 Async Server Components & Turbopack In-Depth',
    slug: 'nextjs-16-async-server-components-turbopack',
    excerpt: 'Navigating breaking changes in Next.js 16 including promise-based searchParams, proxy.ts middleware, and Server Action limits.',
    content: `### Embracing Next.js 16

Next.js 16 brings powerful performance upgrades with Turbopack, but introduces key architectural shifts:
- \`searchParams\` and \`params\` are now Promises that must be awaited in Server Components.
- \`middleware.ts\` is superseded by root-level \`proxy.ts\`.
- Default Server Action payload limits require explicit scaling in \`next.config.ts\`.`,
    tags: ['Next.js 16', 'TypeScript', 'Turbopack', 'Performance'],
    reading_time: '5 min read',
    published_at: '2026-07-20T00:00:00.000Z',
    is_published: true
  }
];

export default async function WritingPage() {
  const supabase = await createClient();
  
  let articles: Article[] = [];

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (!error && data && data.length > 0) {
        articles = data as Article[];
      }
    } catch {
      // Supabase is unseeded or offline - fallback to default sample articles
    }
  }

  // Fallback to sample articles if DB has no articles yet
  if (articles.length === 0) {
    articles = DEFAULT_ARTICLES;
  }

  return <WritingClient initialArticles={articles} />;
}
