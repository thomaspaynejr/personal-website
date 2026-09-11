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
  },
  {
    id: 'telemetry-engine',
    slug: 'distributed-telemetry-engine',
    title: 'Distributed Telemetry Engine',
    description: 'High-throughput metrics aggregator processing gRPC telemetry streams, edge health probes, and sub-millisecond anomaly detection.',
    tech: ['Go', 'gRPC', 'Docker', 'PostgreSQL', 'Redis'],
    demo_url: 'https://thomaspayne.dev/dashboard',
    source_url: 'https://github.com/thomaspaynejr',
    display_order: 3
  },
  {
    id: 'c2-matrix',
    slug: 'tactical-operations-c2-matrix',
    title: 'Tactical Operations C2 Matrix',
    description: 'Mission-critical command and control system built on military operational doctrine with offline-first synchronization and cryptographic integrity.',
    tech: ['TypeScript', 'Next.js', 'WebSockets', 'Tailwind CSS'],
    demo_url: 'https://thomaspayne.dev',
    source_url: 'https://github.com/thomaspaynejr',
    display_order: 4
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
