import { createPWLinearIssue } from './sync-linear.mjs';

const newTasks = [
  {
    title: 'Admin Analytics Hub & Quick Reply Manager (/admin)',
    description: 'Added real-time analytics telemetry metrics cards (timeline events, active projects, articles, unread messages, registered users) and quick email reply tools with direct deletion in Admin Messages tab.',
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
