import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

interface SitemapArticle {
  slug: string;
  updated_at?: string;
  published_at?: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thomaspayne.dev';
  const now = new Date().toISOString();

  // Core static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/writing`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.7,
    },
  ];

  // Dynamic writing articles from Supabase
  let articleRoutes: MetadataRoute.Sitemap = [];
  try {
    const supabase = await createClient();
    if (supabase) {
      const { data: articles } = await supabase
        .from('articles')
        .select('slug, updated_at, published_at')
        .eq('is_published', true);

      if (articles && articles.length > 0) {
        articleRoutes = (articles as SitemapArticle[]).map((a) => ({
          url: `${baseUrl}/writing/${a.slug}`,
          lastModified: a.updated_at || a.published_at || now,
          changeFrequency: 'monthly',
          priority: 0.8,
        }));
      }
    }
  } catch {
    // Offline or unseeded DB fallback
  }

  // Sample articles fallback if DB returned empty
  if (articleRoutes.length === 0) {
    const sampleSlugs = [
      'discipline-over-motivation',
      'building-monochromatic-minimalist-interfaces',
      'nextjs-16-async-server-components',
    ];
    articleRoutes = sampleSlugs.map((slug) => ({
      url: `${baseUrl}/writing/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    }));
  }

  // Dynamic portfolio case study routes
  const caseStudyRoutes: MetadataRoute.Sitemap = [
    'personal-website-v2-obsidian-edition',
    'linear-graph-agent-sync',
    'tactical-matrix-hud',
  ].map((slug) => ({
    url: `${baseUrl}/portfolio/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...articleRoutes, ...caseStudyRoutes];
}
