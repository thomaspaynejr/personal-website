import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, Layers, Calendar, User, Share2 } from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';
import { createClient } from '@/lib/supabase/server';
import { FadeIn } from '@/app/components/Animations';
import TechIcon from '@/app/components/TechIcon';
import MarkdownRenderer from '@/app/components/MarkdownRenderer';
import ArticleReadingProgress from '@/app/components/ArticleReadingProgress';
import { slugifyTitle, PortfolioProject } from '../PortfolioClient';

interface CaseStudyData {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  role: string;
  timeline: string;
  tech: string[];
  demo_url?: string;
  source_url?: string;
  content: string;
}

const DEFAULT_CASE_STUDIES: Record<string, CaseStudyData> = {
  'personal-website-v2-obsidian-edition': {
    id: 'pw-v2',
    slug: 'personal-website-v2-obsidian-edition',
    title: 'Personal Website v2 (Obsidian Edition)',
    tagline: 'High-contrast Yeezy-inspired developer hub with interactive Terminal HUD, Supabase SSR, and Next.js 16 Turbopack architecture.',
    role: 'Lead Full-Stack Architect',
    timeline: '2026 // Active Production',
    tech: ['Next.js 16', 'TypeScript', 'Supabase', 'Framer Motion', 'Tailwind CSS'],
    demo_url: 'https://thomaspayne.dev',
    source_url: 'https://github.com/thomaspaynejr/personal-website',
    content: `## 01 // Problem Statement & Objectives

Most developer portfolios are static brochures that fail to showcase actual technical capability, architectural discipline, or real-time system performance.

The objective of **Personal Website v2** was to build an ultra-resilient developer hub operating as a living operating system with:
1. **Next.js 16 Turbopack Foundation**: Harness cutting-edge async Server Components, root proxy middleware, and sub-100ms incremental builds.
2. **Terminal HUD Command Line Interface**: A global keyboard-driven terminal (\`Cmd+K\`) supporting route jumps, background FX toggles, and live contact dispatch.
3. **Monochromatic Yeezy-Inspired Aesthetic**: Complete elimination of non-essential color noise, relying exclusively on obsidian grays (#000000, #1A1A1A, #DEDEDE) and buttery 60fps spring physics.
4. **Resilient Supabase Layer**: Full relational data persistence for timeline feed comments, likes, and project tracking with zero-crash offline fallback patterns.

---

## 02 // System Architecture & Topology

\`\`\`bash
                      [ Client Browser ]
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
            [ Next.js 16 App ]    [ Terminal HUD ]
            (Turbopack Engine)    (Cmd+K Command Bus)
                    │                   │
                    ├─────────┬─────────┤
                    ▼         ▼         ▼
               (Server)   (Client)   (Actions)
               SSR Pages  UI Springs Server API
                    │         │         │
                    └─────────┼─────────┘
                              ▼
                     [ Supabase Cloud ]
                     (PostgreSQL + RLS)
\`\`\`

### Architectural Constraints & Design Decisions
- **Next.js 16 App Router**: Leveraged asynchronous Server Component data fetching with dynamic streaming promises.
- **Root Proxy Pattern**: Implemented \`proxy.ts\` to handle session token refreshes and route interception without deprecated middleware patterns.
- **Framer Motion Spring Physics**: Replaced heavy CSS transitions with \`useSpring\` and \`useMotionValue\` to eliminate layout thrashing and maintain 60fps on retina displays.

---

## 03 // Technical Challenges & Engineering Trade-Offs

### 1. React 19 & ESLint 9 Strict Effect Rules
During migration to React 19 and Next.js 16, canvas animation components (\`LightStrike.tsx\` and \`MatrixRain.tsx\`) triggered compiler warnings for synchronous \`setState\` inside \`useEffect\`.
- **Solution**: Decoupled external \`localStorage\` state checks via \`setTimeout(() => setEnabled(false), 0)\` and transitioned prop-syncing in \`ProjectDashboard.tsx\` to render-time state derivation.

### 2. Next.js 16 Dynamic Route Promise Unwrapping
Next.js 16 changed \`params\` and \`searchParams\` from plain objects to asynchronous Promises.
\`\`\`tsx
export default async function CaseStudyPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  // Deterministic data resolution...
}
\`\`\`

### 3. Monochromatic Color Token Inversion
Active filter badges became invisible in dark mode when hardcoded \`text-white\` was paired with dark accents.
- **Solution**: Refactored to semantic token \`text-background\`, ensuring white-on-black in light mode and black-on-white in dark mode.

---

## 04 // Measurable Results & Impact

- **Build Performance**: 100% successful static page generation across all routes in under 1.5s with Turbopack.
- **Code Quality**: Achieved 0 ESLint errors and 0 TypeScript compilation errors under strict configuration.
- **User Experience**: Command-line terminal HUD navigable in <50ms keystroke response latency.`
  },
  'antigravity-cli-agentic-suite': {
    id: 'ag-suite',
    slug: 'antigravity-cli-agentic-suite',
    title: 'Antigravity CLI Agentic Suite',
    tagline: 'Autonomous developer command-line agent with multi-threaded subagent dispatch, task management, and Linear GraphQL sync.',
    role: 'Autonomous Systems Engineer',
    timeline: '2026 // Active Framework',
    tech: ['Node.js', 'TypeScript', 'GraphQL', 'Linear API'],
    demo_url: 'https://linear.app',
    source_url: 'https://github.com/thomaspaynejr',
    content: `## 01 // Overview & High-Stakes Objective

Modern software development requires juggling issue trackers, Git repositories, code reviews, and multi-file refactors.

The **Antigravity CLI Agentic Suite** provides an autonomous multi-threaded coding workflow that coordinates specialized subagents to:
1. Conduct codebase research and dependency graph exploration in isolated worker threads.
2. Synchronize engineering progress automatically to **Linear Team Nebuchadnezzar (PW)** using GraphQL mutations.
3. Enforce deterministic task completion with automatic testing, lint verification, and Git push mandates.

---

## 02 // Agent Dispatch Architecture

\`\`\`bash
                     [ Antigravity Core CLI ]
                                │
                 ┌──────────────┴──────────────┐
                 ▼                             ▼
        [ Research Subagent ]        [ Execution Subagent ]
        (Read-Only Explorer)         (TypeScript / Edit)
                 │                             │
                 └──────────────┬──────────────┘
                                ▼
                    [ Task Verification Gate ]
                    (npm run lint && npm run build)
                                │
                 ┌──────────────┴──────────────┐
                 ▼                             ▼
        [ Linear GraphQL Sync ]        [ Git Remote Push ]
        (PW-1 ... PW-14 Auto)          (github.com/thomaspaynejr)
\`\`\`

---

## 03 // Key Engineering Decisions

### 1. Multi-Agent Isolation
Worker agents run in isolated subagent conversation contexts to avoid cluttering parent planner token budgets. Research tasks run in dedicated containers and report actionable summaries back to the orchestrator.

### 2. Linear GraphQL Mutex Sync
Automated synchronization of development tasks to Linear via GraphQL mutations:
\`\`\`typescript
const mutation = \`
  mutation IssueCreate($input: IssueCreateInput!) {
    issueCreate(input: $input) {
      success
      issue { identifier title url }
    }
  }
\`;
\`\`\`

### 3. Mandatory Verification Loop
Every code change must pass two independent verification gates (\`npm run lint\` and \`npm run build\`) before automatic staging, commit, and remote push.`
  }
};

export default async function ProjectCaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  let project: PortfolioProject | null = null;

  if (supabase) {
    try {
      const { data } = await supabase.from('portfolio_projects').select('*');
      if (data) {
        // Find matching project by slug or title slug
        const match = data.find((p: PortfolioProject) => {
          const generated = p.slug || slugifyTitle(p.title);
          return generated === slug || p.id === slug;
        });
        if (match) project = match as PortfolioProject;
      }
    } catch {
      // Offline fallback
    }
  }

  // Lookup in default case studies dictionary
  const caseStudy = DEFAULT_CASE_STUDIES[slug] || (project ? {
    id: project.id,
    slug,
    title: project.title,
    tagline: project.description,
    role: 'Full-Stack Developer',
    timeline: '2026 // Production',
    tech: project.tech || ['TypeScript', 'Next.js', 'React'],
    demo_url: project.demo_url,
    source_url: project.source_url,
    content: `## 01 // Overview
${project.description}

## 02 // Technology Stack
This project leverages modern software design patterns and performance-focused technologies including ${project.tech?.join(', ') || 'TypeScript'}.

## 03 // Architecture & Implementation
Engineered with modular components, strict typing, and high reliability standards. Built with discipline and attention to detail.`
  } : null);

  if (!caseStudy) {
    notFound();
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-10 space-y-8 font-sans">
      <ArticleReadingProgress />

      {/* Back Button */}
      <FadeIn>
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-xs font-bold text-accent hover:text-action transition-all uppercase tracking-widest group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Portfolio</span>
        </Link>
      </FadeIn>

      {/* Hero Header Card */}
      <FadeIn delay={0.1}>
        <section className="bg-card/40 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-border-custom/30 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 text-[10px] text-accent uppercase tracking-widest font-mono border-b border-border-custom/30 pb-4">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <User size={12} className="text-action" />
                {caseStudy.role}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar size={12} className="text-action" />
                {caseStudy.timeline}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-action font-bold">
              <Layers size={12} />
              <span>SYSTEM CASE STUDY</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-foreground leading-tight">
            {caseStudy.title}
          </h1>

          <p className="text-sm text-accent leading-relaxed italic border-l-2 border-action pl-4 py-1">
            {caseStudy.tagline}
          </p>

          {/* Action Links & Tech Dock */}
          <div className="pt-4 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center border-t border-border-custom/20">
            <div className="flex flex-wrap items-center -ml-2">
              <TechIcon items={caseStudy.tech} />
            </div>

            <div className="flex items-center gap-4 font-mono text-[11px]">
              {caseStudy.demo_url && (
                <a
                  href={caseStudy.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-action text-background font-bold uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-1.5 cursor-none"
                >
                  <ExternalLink size={12} />
                  <span>Live Demo</span>
                </a>
              )}
              {caseStudy.source_url && (
                <a
                  href={caseStudy.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-card border border-border-custom hover:border-action text-action font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-none"
                >
                  <FaGithub size={12} />
                  <span>Repository</span>
                </a>
              )}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Case Study Content Body */}
      <FadeIn delay={0.2}>
        <div className="bg-card/40 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-border-custom/30 shadow-sm">
          <MarkdownRenderer content={caseStudy.content} />
        </div>
      </FadeIn>

      {/* Footer Navigation & Share */}
      <FadeIn delay={0.3}>
        <div className="flex justify-between items-center bg-card/40 backdrop-blur-md p-5 rounded-xl border border-border-custom/30 text-xs font-mono">
          <Link
            href="/portfolio"
            className="text-[10px] font-bold text-accent hover:text-foreground uppercase tracking-widest flex items-center gap-2"
          >
            <ArrowLeft size={12} />
            <span>All Projects</span>
          </Link>
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert('Case study URL copied to clipboard!');
              }
            }}
            className="text-[10px] font-bold text-action hover:underline uppercase tracking-widest flex items-center gap-1.5 cursor-none"
          >
            <Share2 size={12} />
            <span>Share Case Study _</span>
          </button>
        </div>
      </FadeIn>
    </main>
  );
}
