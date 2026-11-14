import fs from 'fs';
import path from 'path';

// Load Linear API key from env or .env.local
let apiKey = process.env.LINEAR_API_KEY || '';
if (!apiKey) {
  try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const env = fs.readFileSync(envPath, 'utf8');
      const match = env.match(/LINEAR_API_KEY=(.+)/);
      if (match) apiKey = match[1].trim();
    }
  } catch {
    // ignore
  }
}

export const TEAM_PW_ID = '1609f9eb-8e93-43b9-b034-4bdc918e591e';
export const PROJECT_PW_ID = '249d6358-419a-445a-b71f-180b213d56ca';
export const STATE_DONE = '794ea5ff-2a4e-469b-9b37-3fe1a3037a31';

export const taskPayload = {
  title: 'Obsidian Vault: Mobile Synchronization, Responsive Card Styling, & Cross-Platform Font Hardening',
  description: `### 🎯 Objective & Summary
Configured and synchronized Thomas Payne's personal Obsidian vault for complete visual and operational parity between Obsidian Desktop (macOS) and Obsidian Mobile (iOS/Android).

---

### 🛠️ Key Architectural Changes & Steps Taken
1. **Forced Dark Mode Protocol (\`.obsidian/app.json\`):**
   - Changed \`baseColorScheme\` from \`"adapt"\` to \`"dark"\`.
   - Prevents mobile operating system daytime light modes from forcing Obsidian into an unstyled light theme, maintaining the neon Tokyo Night palette.

2. **Cross-Platform Web Font Support (\`.obsidian/snippets/vault-styling.css\`):**
   - Injected Google Fonts \`@import\` for JetBrains Mono (\`weights: 300..800\`).
   - Mapped \`--default-font\`, \`--font-text\`, \`--font-monospace\`, and \`--font-interface\` across \`.is-mobile\` and \`.is-phone\` containers, eliminating fallback to default system sans-serif fonts.

3. **Mobile-Responsive Dataview Cards & Tables (\`.obsidian/snippets/vault-styling.css\`):**
   - Implemented 2-column responsive card grids for mobile phone viewports (\`repeat(2, minmax(0, 1fr))\` on \`@media (max-width: 600px)\`).
   - Constrained media cover and poster heights (\`max-height: 160px; object-fit: cover\`) with rounded corners.
   - Added touch-friendly horizontal scrolling container rules for wide tables (Navigation Matrix on Home.md and CTF Targets table).

4. **Plugin Cross-Platform Guardrails Audit:**
   - Identified that \`execute-code\` and \`obisidian-note-linker\` are marked \`"isDesktopOnly": true\` by their developers and safely bypassed by Obsidian Mobile by design.
   - Preserved all 347 folder and note icon definitions in \`.obsidian/plugins/obsidian-icon-folder/data.json\`.
   - Documented the required Obsidian Sync toggle configuration (enabling "Community plugin settings").

5. **Authoritative Runbook Creation:**
   - Authored permanent reference specification: \`Resources/Reference/Mobile Sync & Styling Runbook.md\`.
   - Updated \`AGENTS.md\` full documentation index and registered runbook icon in \`data.json\` to maintain 100% coverage.`,
  isDone: true
};

async function createPWLinearIssue(task) {
  if (!apiKey) {
    throw new Error('LINEAR_API_KEY is not set. Please provide a valid Personal API Key.');
  }

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
      teamId: TEAM_PW_ID,
      projectId: PROJECT_PW_ID,
      title: task.title,
      description: task.description,
      stateId: STATE_DONE
    }
  };

  const response = await fetch('https://api.linear.app/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': apiKey.startsWith('Bearer ') ? apiKey : apiKey
    },
    body: JSON.stringify({ query, variables })
  });

  return await response.json();
}

async function main() {
  console.log('🚀 Attempting sync to Linear Team Nebuchadnezzar (PW)...');
  try {
    const res = await createPWLinearIssue(taskPayload);
    if (res.errors) {
      console.error('❌ Linear GraphQL Error:', res.errors);
      console.log('\n📋 Fallback: You can copy and paste the task details or provide an updated Personal API Key (lin_api_...).');
    } else {
      console.log('✅ Successfully created Linear Issue:');
      console.log('Identifier:', res?.data?.issueCreate?.issue?.identifier);
      console.log('URL:', res?.data?.issueCreate?.issue?.url);
    }
  } catch (err) {
    console.error('❌ Error executing Linear sync:', err.message);
  }
}

if (process.argv[1] && process.argv[1].endsWith('sync-obsidian-mobile.mjs')) {
  main();
}
