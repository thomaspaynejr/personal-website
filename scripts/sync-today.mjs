import { createPWLinearIssue } from './sync-linear.mjs';

const todayTasks = [
  {
    title: 'Full Site UX & Monochromatic Typography Refinement',
    description: 'Cleaned up heading hierarchy in /about and added auto-scroll functionality to TerminalHUD command screen.',
    isDone: true
  },
  {
    title: 'Writing & Technical Articles Section (/writing)',
    description: 'Implemented /writing and /writing/[slug] routes with search, tag filters, Next.js 16 async params, Supabase articles table, fallback essays, and Admin Dashboard Articles Manager.',
    isDone: true
  },
  {
    title: 'Interactive Terminal HUD Overhaul (Cmd+K)',
    description: 'Expanded TerminalHUD with dynamic background FX toggles (matrix/lightning), CLI messaging (message <text>), system telemetry benchmark (bench), and route navigation (goto <route>).',
    isDone: true
  },
  {
    title: 'Live System Health Telemetry & Developer Git Ticker (/dashboard)',
    description: 'Added Supabase DB latency ping, Next.js 16 Turbopack status, build verification status, and recent Git commit ticker stream to /dashboard.',
    isDone: true
  },
  {
    title: 'Journey Feed Search & Category Tag Filters (/)',
    description: 'Integrated live search input and category tag filter pills (ALL, BUILD, MILESTONE, MILITARY, LEARNING) on home page activity feed.',
    isDone: true
  },
  {
    title: 'Dark Mode Filter Bar & Action Button Contrast Fix',
    description: 'Resolved white-on-white text contrast issue in dark mode for selected filter pills across TimelineDashboard, WritingClient, AdminClient, and ProjectDashboard by updating active text class to text-background.',
    isDone: true
  }
];

async function main() {
  console.log('🚀 Syncing today\'s completed tasks to Linear Nebuchadnezzar (PW)...');
  for (const task of todayTasks) {
    try {
      const res = await createPWLinearIssue(task);
      console.log(`✅ Synced: "${task.title}" ->`, res?.data?.issueCreate?.issue?.identifier || 'OK', res?.data?.issueCreate?.issue?.url || '');
    } catch (err) {
      console.error(`❌ Failed: "${task.title}":`, err);
    }
  }
  console.log('🎉 Linear sync complete!');
}

main();
