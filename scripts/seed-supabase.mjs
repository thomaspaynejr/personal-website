import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Parse .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const getEnvVar = (key) => {
  const match = envContent.match(new RegExp(`${key}=(.+)`));
  return match ? match[1].trim() : '';
};

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DEFAULT_ABOUT = {
  id: '00000000-0000-0000-0000-000000000001',
  bio_text: 'Software engineer and former military specialist focused on building resilient full-stack systems, high-performance web interfaces, and automated agentic AI architectures.',
  journey_text: 'My path into technology began with rigorous systems discipline in the military, transitioning into software architecture, Next.js 16, and autonomous agent workflows.',
  hero_image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
  social_links: [
    { name: 'GitHub', href: 'https://github.com/thomaspaynejr', icon_type: 'github' },
    { name: 'LinkedIn', href: 'https://linkedin.com/in/thomaspaynejr', icon_type: 'linkedin' }
  ]
};

const DEFAULT_TIMELINE = [
  {
    date: 'AUG 2026',
    title: 'Personal Website v2 Launch',
    description: 'Deploys Next.js 16 Turbopack portfolio with Yeezy-inspired Obsidian design system, Terminal HUD CLI (Cmd+K), and Supabase backend.',
    icon_type: 'clock'
  },
  {
    date: 'MAY 2026',
    title: 'Linear & Agentic Integration',
    description: 'Configured automated GraphQL Linear issue synchronization for Team Nebuchadnezzar (PW-1 through PW-13).',
    icon_type: 'activity'
  },
  {
    date: 'JAN 2026',
    title: 'Autonomous AI Coding Systems',
    description: 'Researched and integrated subagent multi-threaded agent workflows with Antigravity 2.0 CLI tooling.',
    icon_type: 'plus'
  },
  {
    date: 'SEP 2025',
    title: 'Military Service & Systems Specialization',
    description: 'Applied high-stakes operational discipline, risk management, and systems thinking from military duty to software architecture.',
    icon_type: 'heart'
  }
];

const DEFAULT_PORTFOLIO = [
  {
    title: 'Personal Website v2 (Obsidian Edition)',
    description: 'Next.js 16 Turbopack personal website featuring a custom Terminal HUD CLI, interactive dark mode, technical writing platform, and Supabase RLS.',
    tech: ['Next.js 16', 'TypeScript', 'Supabase', 'Framer Motion', 'Tailwind CSS'],
    demo_url: 'https://thomaspayne.dev',
    source_url: 'https://github.com/thomaspaynejr/personal-website',
    display_order: 1
  },
  {
    title: 'Antigravity CLI Agentic Suite',
    description: 'Automated developer command-line agent with multi-threaded subagent dispatch, task management, and Linear GraphQL sync.',
    tech: ['Node.js', 'TypeScript', 'GraphQL', 'Linear API'],
    demo_url: 'https://linear.app',
    source_url: 'https://github.com/thomaspaynejr',
    display_order: 2
  }
];

const DEFAULT_TRACKER = [
  {
    name: 'Personal Website v2',
    status: 'COMPLETED',
    progress: 100,
    description: 'Fully built with Next.js 16, Terminal HUD, Articles section, and Supabase database integration.'
  },
  {
    name: 'Agentic Subagent Workflow Framework',
    status: 'ACTIVE',
    progress: 85,
    description: 'Multi-agent coordination protocol with stateful task execution and background schedule notifications.'
  },
  {
    name: 'Custom Synthetic UI Design System',
    status: 'RESEARCHING',
    progress: 50,
    description: 'Exploring monochromatic Yeezy-inspired UI components with framer-motion physics springs.'
  }
];

const DEFAULT_EXPERIENCES = [
  {
    company: 'Lead Software Architect',
    position: 'Autonomous Systems & Web Applications',
    period: '2024 - PRESENT',
    description: 'Architected high-performance web applications and agentic automation pipelines using Next.js, Supabase, and TypeScript.',
    highlights: ['Built Next.js 16 Turbopack platform with 100% build pass rate', 'Integrated GraphQL Linear API workflow automation'],
    skills: ['TypeScript', 'Next.js 16', 'Supabase', 'Linear API', 'Tailwind CSS'],
    display_order: 1
  },
  {
    company: 'Military Specialist & Systems Analyst',
    position: 'Armed Forces',
    period: '2020 - 2024',
    description: 'Executed high-stakes operational duties, network communications, and technical command procedures under strict timelines.',
    highlights: ['Maintained 99.9% uptime on field command communication equipment', 'Received accolades for operational precision and leadership'],
    skills: ['Leadership', 'Systems Analysis', 'Security Protocols', 'Operational Planning'],
    display_order: 2
  }
];

const DEFAULT_ARTICLES = [
  {
    title: 'Discipline Over Motivation: Lessons from Military Service to Software Engineering',
    slug: 'discipline-over-motivation',
    excerpt: 'How military operational discipline, system redundancy, and high-stakes risk management shape top-tier software architecture and developer productivity.',
    content: `# Discipline Over Motivation: Lessons from Military Service to Software Engineering

In high-stakes environments, motivation is a luxury—discipline is a requirement.

When operating under strict operational constraints, you quickly learn that systems, procedures, and relentless execution trump inspiration every single time.

## 1. Redundancy is Not Optional
In military communications, single points of failure are unacceptable. The exact same principle applies to modern software architecture:
- Fail-safe database fallbacks
- Strict typing with TypeScript
- Graceful client-side degradation

## 2. Standard Operating Procedures (SOPs)
Every pull request, build, and deployment should follow rigorous automated checks before hitting production.

\`\`\`bash
# Standard Release Command
npx tsc --noEmit && npm run build && git push origin main
\`\`\`

Discipline builds consistent output. Motivation merely starts the spark.`,
    tags: ['Military', 'Engineering', 'Leadership', 'Architecture'],
    reading_time: '4 min read',
    published_at: '2026-08-01T00:00:00.000Z',
    is_published: true
  },
  {
    title: 'Building Monochromatic Minimalist Interfaces: The Yeezy Aesthetic in Web Design',
    slug: 'building-monochromatic-minimalist-interfaces',
    excerpt: 'Deep dive into Yeezy-inspired Obsidian design systems: pure black, slate grays, shrunk typography, micro-interactions, and 60fps spring physics.',
    content: `# Building Monochromatic Minimalist Interfaces

Minimalism isn't the absence of design—it's the relentless elimination of noise.

## The Obsidian Color System
By constraining your color palette to pure black (\`#000000\`), obsidian dark cards (\`#111111\`), slate borders (\`#222222\`), and pure white accents (\`#FFFFFF\`), every element on screen demands intentionality.

\`\`\`css
:root {
  --background: #FFFFFF;
  --foreground: #000000;
  --action: #000000;
}

.dark {
  --background: #000000;
  --foreground: #FFFFFF;
  --action: #FFFFFF;
}
\`\`\`

## Typography Shrunken Hierarchy
Using 8px to 10px uppercase JetBrains Mono labels creates a sleek developer aesthetic while maximizing content readability.`,
    tags: ['UI/UX', 'Design', 'CSS', 'Framer Motion'],
    reading_time: '3 min read',
    published_at: '2026-07-28T00:00:00.000Z',
    is_published: true
  },
  {
    title: 'Next.js 16 Async Server Components & Turbopack Optimization',
    slug: 'nextjs-16-async-server-components-turbopack',
    excerpt: 'Navigating Next.js 16 async params, route handler proxies, Turbopack incremental builds, and zero-latency Supabase server queries.',
    content: `# Next.js 16 Async Server Components & Turbopack Optimization

Next.js 16 introduces powerful async routing paradigms that redefine how server components consume parameters and headers.

## 1. Async Route Parameters
In Next.js 16, dynamic route parameters (\`params\` and \`searchParams\`) are returned as Promises that MUST be awaited:

\`\`\`tsx
export default async function ArticleDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  // Query DB with slug
}
\`\`\`

## 2. Proxy over Middleware
Next.js 16 prefers \`proxy.ts\` at the root for request interception instead of legacy \`middleware.ts\`.

This ensures ultra-fast compilation under Turbopack.`,
    tags: ['Next.js 16', 'TypeScript', 'Turbopack', 'Performance'],
    reading_time: '5 min read',
    published_at: '2026-07-20T00:00:00.000Z',
    is_published: true
  }
];

async function seed() {
  console.log('🌱 Starting Supabase Auto-Seeding Script...');

  // 1. Seed About Content
  try {
    const { error } = await supabase.from('about_content').upsert([DEFAULT_ABOUT]);
    if (error) console.log('⚠️ about_content:', error.message);
    else console.log('✅ about_content table seeded successfully');
  } catch (e) {
    console.log('⚠️ about_content error:', e.message);
  }

  // 2. Seed Timeline Events
  try {
    const { data: existing } = await supabase.from('timeline_events').select('id').limit(1);
    if (!existing || existing.length === 0) {
      const { error } = await supabase.from('timeline_events').insert(DEFAULT_TIMELINE);
      if (error) console.log('⚠️ timeline_events:', error.message);
      else console.log(`✅ timeline_events table seeded with ${DEFAULT_TIMELINE.length} events`);
    } else {
      console.log('ℹ️ timeline_events already contains data, skipping');
    }
  } catch (e) {
    console.log('⚠️ timeline_events error:', e.message);
  }

  // 3. Seed Portfolio Projects
  try {
    const { data: existing } = await supabase.from('portfolio_projects').select('id').limit(1);
    if (!existing || existing.length === 0) {
      const { error } = await supabase.from('portfolio_projects').insert(DEFAULT_PORTFOLIO);
      if (error) console.log('⚠️ portfolio_projects:', error.message);
      else console.log(`✅ portfolio_projects table seeded with ${DEFAULT_PORTFOLIO.length} projects`);
    } else {
      console.log('ℹ️ portfolio_projects already contains data, skipping');
    }
  } catch (e) {
    console.log('⚠️ portfolio_projects error:', e.message);
  }

  // 4. Seed Tracker Projects
  try {
    const { data: existing } = await supabase.from('tracker_projects').select('id').limit(1);
    if (!existing || existing.length === 0) {
      const { error } = await supabase.from('tracker_projects').insert(DEFAULT_TRACKER);
      if (error) console.log('⚠️ tracker_projects:', error.message);
      else console.log(`✅ tracker_projects table seeded with ${DEFAULT_TRACKER.length} items`);
    } else {
      console.log('ℹ️ tracker_projects already contains data, skipping');
    }
  } catch (e) {
    console.log('⚠️ tracker_projects error:', e.message);
  }

  // 5. Seed Experiences
  try {
    const { data: existing } = await supabase.from('experiences').select('id').limit(1);
    if (!existing || existing.length === 0) {
      const { error } = await supabase.from('experiences').insert(DEFAULT_EXPERIENCES);
      if (error) console.log('⚠️ experiences:', error.message);
      else console.log(`✅ experiences table seeded with ${DEFAULT_EXPERIENCES.length} roles`);
    } else {
      console.log('ℹ️ experiences already contains data, skipping');
    }
  } catch (e) {
    console.log('⚠️ experiences error:', e.message);
  }

  // 6. Seed Articles
  try {
    const { data: existing } = await supabase.from('articles').select('id').limit(1);
    if (!existing || existing.length === 0) {
      const { error } = await supabase.from('articles').insert(DEFAULT_ARTICLES);
      if (error) console.log('⚠️ articles:', error.message);
      else console.log(`✅ articles table seeded with ${DEFAULT_ARTICLES.length} articles`);
    } else {
      console.log('ℹ️ articles already contains data, skipping');
    }
  } catch (e) {
    console.log('⚠️ articles error:', e.message);
  }

  console.log('🎉 Supabase Auto-Seeding process completed!');
}

seed();
