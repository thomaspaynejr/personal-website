import { createPWLinearIssue } from './sync-linear.mjs';

const newTasks = [
  {
    title: 'Phase 2: Technical Writing & Knowledge Engine (Markdown, Syntax Highlighter, TOC, Reading Progress, RSS Feed)',
    description: 'Built custom monochromatic syntax highlighter (CodeBlock.tsx) with 1-click copy, automated TableOfContents extraction with scroll-spy, ArticleReadingProgress spring bar, MarkdownRenderer supporting rich formatting, and RSS 2.0 XML feed endpoint (/feed.xml).',
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
