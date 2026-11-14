import { createPWLinearIssue } from './sync-linear.mjs';

const newTasks = [
  {
    title: 'Sensory & Authoring Upgrade: Pure/Carbon/Graphite Colorways, Reactive Bracket Cursor, Soft Tactile Audio & Notion-Style Block Editor',
    description: 'Completed full repo audit (restored node_modules to root, configured turbopack.root, created dynamic /og-image.png route, fixed Admin Studio preview submit & form keys). Locked in the 3 monochromatic colorways (Obsidian Pure, Stealth Carbon, Yeezy Graphite) with Navbar Sensory Studio popover. Set reactive Tactical Bracket cursor as default alongside illuminated-core Minimal mode. Locked in cushioned Soft low-pass tactile audio profile. Built Notion-style Visual Block Composer (Blocks mode) in AdminMarkdownStudio.tsx with slash commands and reordering.',
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
