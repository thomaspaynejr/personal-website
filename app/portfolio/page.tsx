import { createClient } from '@/lib/supabase/server';
import PortfolioClient, { PortfolioProject, slugifyTitle } from './PortfolioClient';

const DEFAULT_PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'pw-v2',
    slug: 'personal-website-v2-obsidian-edition',
    title: 'Personal Website v2 (Obsidian Edition)',
    description: 'Next.js 16 Turbopack developer hub featuring custom Terminal HUD CLI, interactive dark mode, technical writing platform, and Supabase RLS.',
    tech: ['Next.js 16', 'TypeScript', 'Supabase', 'Framer Motion', 'Tailwind CSS'],
    demo_url: 'https://thomaspayne.dev',
    source_url: 'https://github.com/thomaspaynejr/personal-website',
    display_order: 1
  },
  {
    id: 'ag-suite',
    slug: 'antigravity-cli-agentic-suite',
    title: 'Antigravity CLI Agentic Suite',
    description: 'Automated developer command-line agent with multi-threaded subagent dispatch, task management, and Linear GraphQL sync.',
    tech: ['Node.js', 'TypeScript', 'GraphQL', 'Linear API'],
    demo_url: 'https://linear.app',
    source_url: 'https://github.com/thomaspaynejr',
    display_order: 2
  }
];

export default async function PortfolioPage() {
  const supabase = await createClient();
  let projects: PortfolioProject[] = [];

  if (supabase) {
    try {
      const { data } = await supabase
        .from('portfolio_projects')
        .select('*')
        .order('display_order', { ascending: true });

      if (data && data.length > 0) {
        projects = data.map((p: PortfolioProject) => ({
          ...p,
          slug: p.slug || slugifyTitle(p.title)
        }));
      }
    } catch {
      // Offline fallback
    }
  }

  if (projects.length === 0) {
    projects = DEFAULT_PORTFOLIO_PROJECTS;
  }

  return <PortfolioClient initialProjects={projects} />;
}
