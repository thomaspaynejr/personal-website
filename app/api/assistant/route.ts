import { NextResponse } from 'next/server';

interface KnowledgeTopic {
  keywords: string[];
  title: string;
  response: string;
}

const KNOWLEDGE_BASE: KnowledgeTopic[] = [
  {
    keywords: ['military', 'service', 'discipline', 'army', 'navy', 'veteran', 'soldier', 'background'],
    title: 'Military Service & Systems Discipline',
    response: `Thomas Payne is a software engineer and former military service member. His engineering philosophy is heavily shaped by operational discipline, high-stakes accountability, and structured execution. 

Key Principles from Service:
1. Systems Over Motivation: Motivation fluctuates, but disciplined workflows and resilient architectures endure.
2. Graceful Degradation: Mission-critical systems must have deterministic error handling when external networks or dependencies fail.
3. Continuous Execution: Progress is built brick by brick, commit by commit.`
  },
  {
    keywords: ['stack', 'tech', 'technologies', 'skills', 'tools', 'languages', 'frontend', 'backend', 'framework'],
    title: 'Technical Stack & Architecture',
    response: `Thomas specializes in high-performance full-stack web applications and autonomous agent architectures:
- Frontend: Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS 4, Framer Motion.
- Backend & DB: Node.js, Supabase (PostgreSQL with Row Level Security), Server Actions, REST & GraphQL APIs.
- Tooling & Automation: Antigravity CLI, Linear GraphQL API, Git automation, ESLint 9.`
  },
  {
    keywords: ['next', 'nextjs', 'next.js', 'turbopack', 'react 19', '16'],
    title: 'Next.js 16 & Turbopack Implementation',
    response: `This personal website is built on cutting-edge Next.js 16.2.1 and React 19.2.4:
- Async Params: All dynamic route parameters (\`params\` and \`searchParams\`) are asynchronous Promises awaited before fetching.
- Root Proxy: Superseded deprecated \`middleware.ts\` with root-level \`proxy.ts\` for session management.
- Turbopack Optimization: Sub-100ms rebuilds, zero experimental CSS animation panics, and 20MB Server Action payload allowances in \`next.config.ts\`.`
  },
  {
    keywords: ['design', 'theme', 'yeezy', 'obsidian', 'monochrome', 'black', 'styling', 'aesthetic', 'minimalism'],
    title: 'Monochromatic Obsidian Design Philosophy',
    response: `The visual identity follows a strict Yeezy-inspired Obsidian monochromatic palette:
- Palette: #000000 (Pure Black), #1A1A1A (Charcoal), #DEDEDE (Stone), #FFFFFF (Light Mode).
- Philosophy: Eliminating non-essential color noise forces UI elements to rely on contrast, whitespace, and physics.
- Micro-interactions: Framer Motion spring physics (\`useSpring\`, \`useMotionValue\`) power the Mac-style dock magnification and custom magnetic cursor at 60fps.`
  },
  {
    keywords: ['projects', 'portfolio', 'built', 'work', 'antigravity', 'agentic', 'apps'],
    title: 'Featured Production Projects',
    response: `Key projects in Thomas's portfolio:
1. Personal Website v2 (Obsidian Edition): Full-stack developer platform featuring interactive Terminal HUD, dynamic Markdown writing engine, RSS 2.0 syndication, and Supabase backend.
2. Antigravity CLI Agentic Suite: Multi-threaded autonomous developer agent coordinating subagent tasks and synchronizing issues with Linear Team Nebuchadnezzar.
3. Case Studies: Explore in-depth architectural teardowns at /portfolio.`
  },
  {
    keywords: ['contact', 'hire', 'email', 'message', 'reach', 'connect', 'linkedin', 'github'],
    title: 'Contact & Collaboration',
    response: `You can reach Thomas directly through:
- Terminal CLI: Type 'message <your message>' directly in this HUD to send a message to the admin inbox.
- Contact Form: Visit /contact to submit inquiries.
- GitHub: github.com/thomaspaynejr
- LinkedIn: Available via the site footer links.`
  },
  {
    keywords: ['writing', 'articles', 'blog', 'essays', 'read', 'feed', 'rss'],
    title: 'Technical Writing & Publications',
    response: `Thomas regularly writes on software architecture and engineering discipline:
- 'Discipline Over Motivation: Lessons from Military Service to Software Engineering'
- 'Building Monochromatic Minimalist Interfaces with Framer Motion'
- 'Next.js 16 Async Server Components & Turbopack In-Depth'
All essays feature live syntax highlighting, table of contents, and RSS syndication at /feed.xml.`
  }
];

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json({
        answer: "Please provide a query after 'ask'. Example: 'ask what is your tech stack?' or 'ask tell me about your military background'."
      });
    }

    const cleanQuery = query.toLowerCase();

    // Match topics based on keyword occurrence
    let bestMatch: KnowledgeTopic | null = null;
    let highestScore = 0;

    for (const topic of KNOWLEDGE_BASE) {
      let score = 0;
      for (const kw of topic.keywords) {
        if (cleanQuery.includes(kw)) {
          score += 1;
        }
      }
      if (score > highestScore) {
        highestScore = score;
        bestMatch = topic;
      }
    }

    if (bestMatch && highestScore > 0) {
      return NextResponse.json({
        topic: bestMatch.title,
        answer: bestMatch.response
      });
    }

    // Default overview answer if no specific keyword matched
    return NextResponse.json({
      topic: 'Thomas Payne Overview',
      answer: `Thomas Payne is a software engineer and former military service member specializing in Next.js 16, TypeScript, Supabase, and autonomous agent systems.

Try asking about:
- 'ask military' (His background and discipline principles)
- 'ask tech stack' (Technologies, frameworks, and architecture)
- 'ask projects' (Featured portfolio builds and case studies)
- 'ask design' (Monochromatic Yeezy-inspired Obsidian aesthetic)
- 'ask contact' (Ways to get in touch or collaborate)`
    });
  } catch {
    return NextResponse.json({
      answer: "Unable to process query at this time. Type 'help' to see standard commands."
    }, { status: 500 });
  }
}
