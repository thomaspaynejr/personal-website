import { createPWLinearIssue } from './sync-linear.mjs';

const newTasks = [
  {
    title: 'Phase 3: Interactive Portfolio Deep Dives & System Case Studies (/portfolio/[slug], tech filters, live demo links)',
    description: 'Built interactive PortfolioClient with real-time search and tech stack filter pills, and created dedicated /portfolio/[slug] system case study routes featuring architectural diagrams, challenge/solution breakdowns, reading progress, and live demo links.',
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
