import { createPWLinearIssue } from './sync-linear.mjs';

const newTasks = [
  {
    title: 'Phase 4: Admin CMS Studio & Media Asset Pipeline (Split-pane Markdown Studio & Supabase Storage MediaDropzone)',
    description: 'Developed AdminMarkdownStudio.tsx featuring a split-pane live Markdown editor with syntax formatting toolbar, real-time preview, word/character metrics, and reading time estimation. Engineered MediaDropzone.tsx providing drag-and-drop client uploads to Supabase Storage with instant thumbnail previews and manual URL fallback.',
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
