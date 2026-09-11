import { createClient } from '@/lib/supabase/server';

interface FeedArticle {
  title: string;
  slug: string;
  excerpt: string;
  published_at: string;
  tags?: string[];
}

const FALLBACK_FEED_ARTICLES: FeedArticle[] = [
  {
    title: 'Discipline Over Motivation: Lessons from Military Service to Software Engineering',
    slug: 'discipline-over-motivation',
    excerpt: 'How military rigor, structured execution, and relentless consistency shape modern high-throughput software architecture.',
    published_at: '2026-08-01T00:00:00.000Z',
    tags: ['Engineering', 'Military', 'Leadership', 'Architecture']
  },
  {
    title: 'Building Monochromatic Minimalist Interfaces with Framer Motion',
    slug: 'building-monochromatic-minimalist-interfaces',
    excerpt: 'Exploring Yeezy-inspired dark grayscale aesthetics, shrunk typography, and buttery 60fps spring physics.',
    published_at: '2026-07-28T00:00:00.000Z',
    tags: ['UI/UX', 'Framer Motion', 'Design', 'Next.js']
  },
  {
    title: 'Next.js 16 Async Server Components & Turbopack In-Depth',
    slug: 'nextjs-16-async-server-components-turbopack',
    excerpt: 'Navigating breaking changes in Next.js 16 including promise-based searchParams, proxy.ts middleware, and Server Action limits.',
    published_at: '2026-07-20T00:00:00.000Z',
    tags: ['Next.js 16', 'TypeScript', 'Turbopack', 'Performance']
  }
];

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thomaspayne.dev';
  let articles: FeedArticle[] = [];

  try {
    const supabase = await createClient();
    if (supabase) {
      const { data } = await supabase
        .from('articles')
        .select('title, slug, excerpt, published_at, tags')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (data && data.length > 0) {
        articles = data as FeedArticle[];
      }
    }
  } catch {
    // Graceful fallback if offline
  }

  if (articles.length === 0) {
    articles = FALLBACK_FEED_ARTICLES;
  }

  const itemsXml = articles
    .map((article) => {
      const articleUrl = `${siteUrl}/writing/${article.slug}`;
      const pubDate = new Date(article.published_at).toUTCString();
      const categories = (article.tags || [])
        .map((tag) => `<category>${escapeXml(tag)}</category>`)
        .join('');

      return `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <description>${escapeXml(article.excerpt || '')}</description>
      <pubDate>${pubDate}</pubDate>
      ${categories}
    </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Thomas Payne // Technical Writing</title>
    <link>${siteUrl}/writing</link>
    <description>Technical essays, architecture teardowns, and engineering notes by Thomas Payne.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate'
    }
  });
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}
