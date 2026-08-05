import { createPWLinearIssue } from './sync-linear.mjs';

const newTasks = [
  {
    title: 'Supabase Auto-Seeding Utility Script (scripts/seed-supabase.mjs)',
    description: 'Built a 1-click Node.js seeding utility script (scripts/seed-supabase.mjs) that populates Supabase database tables (about_content, timeline_events, portfolio_projects, tracker_projects, experiences, articles) with initial content.',
    isDone: true
  }
];

async function main() {
  console.log('🚀 Syncing new task to Linear Nebuchadnezzar (PW)...');
  for (const task of newTasks) {
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
