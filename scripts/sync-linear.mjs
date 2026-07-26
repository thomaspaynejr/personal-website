import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const match = env.match(/LINEAR_API_KEY=(.+)/);
const apiKey = match ? match[1].trim() : '';

const TEAM_ID = 'bcd1b747-fb05-4137-a966-532968cc3c7b';
const STATE_DONE = '2c4e8584-9876-45ce-ae68-304886873c6f';
const STATE_TODO = 'e197b8a1-4382-45b1-aff1-0162563c65ff';

const issues = [
  {
    title: 'Codebase Cleanup & Strict TypeScript Refactor',
    description: 'Eliminated 50+ explicit any types across AdminClient.tsx, ProjectDashboard.tsx, NavbarClient.tsx, Portfolio, client.ts, and server.ts. Added strict TypeScript interfaces. Replaced unsafe supabase! assertions with safe optional checks across server components. 0 build & ESLint errors.',
    stateId: STATE_DONE
  },
  {
    title: 'Interactive Developer HUD (Cmd+K)',
    description: 'Built TerminalHUD.tsx, a Framer Motion-powered Command Line Interface triggered globally via Cmd+K, Ctrl+K, backtick, or floating badge. Features autocomplete (Tab), command history (Up/Down), live theme toggling, system diagnostics, bio, project listings, skills breakdown, and quick navigation.',
    stateId: STATE_DONE
  },
  {
    title: 'Dynamic Open Graph Social Cards & Complete SEO Package',
    description: 'Generate dynamic @vercel/og social cards for portfolio projects and pages. Add structured JSON-LD schema for Person, WebSite, and CreativeWork. Implement automated sitemap.ts and robots.ts.',
    stateId: STATE_TODO
  },
  {
    title: 'Real-Time Presence & Admin Visitor Analytics',
    description: 'Implement live visitor presence counter via Supabase Realtime channels. Build Admin analytics widget for pageviews and project views. Integrate Resend API for automatic email notifications on contact submissions.',
    stateId: STATE_TODO
  },
  {
    title: 'Technical Micro-Journal / Writing Section',
    description: 'Build dedicated articles/blog section for technical writeups, military-to-tech transition thoughts, and architecture notes. Add tag filtering, estimated read times, and code block syntax highlighting.',
    stateId: STATE_TODO
  }
];

async function createLinearIssue(issue) {
  const query = `
    mutation IssueCreate($input: IssueCreateInput!) {
      issueCreate(input: $input) {
        success
        issue {
          id
          identifier
          title
          url
        }
      }
    }
  `;

  const variables = {
    input: {
      teamId: TEAM_ID,
      title: issue.title,
      description: issue.description,
      stateId: issue.stateId
    }
  };

  const response = await fetch('https://api.linear.app/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': apiKey
    },
    body: JSON.stringify({ query, variables })
  });

  const data = await response.json();
  return data;
}

async function main() {
  console.log('🚀 Syncing issues to Linear...');
  for (const issue of issues) {
    try {
      const res = await createLinearIssue(issue);
      if (res.data?.issueCreate?.success) {
        const created = res.data.issueCreate.issue;
        console.log(`✅ [${created.identifier}] Created: "${created.title}" -> ${created.url}`);
      } else {
        console.error(`❌ Error creating "${issue.title}":`, JSON.stringify(res));
      }
    } catch (err) {
      console.error(`❌ Exception creating "${issue.title}":`, err);
    }
  }
  console.log('\n🎉 Linear Sync Completed!');
}

main();
