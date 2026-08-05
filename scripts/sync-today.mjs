import { createPWLinearIssue } from './sync-linear.mjs';

const newTasks = [
  {
    title: 'Rich Journey Feed Code Snippets & Image Lightbox Attachments (/)',
    description: 'Added optional code snippet rendering with 1-click clipboard copy button and image attachment thumbnails with animated Framer Motion Lightbox modal preview to timeline events.',
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
