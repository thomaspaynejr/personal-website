import { createPWLinearIssue } from './sync-linear.mjs';

const newTasks = [
  {
    title: 'QA Hardening: Dual-Layer Audio Synthesizer, Precision Center Dot Cursor, TechIcon Clamp & Studio Shortcuts',
    description: 'Resolved user checklist feedback: Upgraded Web Audio synthesizer with dual-layer authentic mechanical switch acoustics (1400Hz -> 450Hz click + 260Hz -> 90Hz thock) and singleton context management with auto-resume, making keystroke audio crystal clear on laptop speakers. Re-engineered CustomCursor.tsx to a zero-lag pinpoint center dot paired with a fluid outer spring halo, eliminating click-miss offset on small buttons ("Live Demo", "View Source"). Hardened TechIcon.tsx against Framer Motion Infinity distance errors. Enhanced AdminMarkdownStudio.tsx with Tab indentation, Cmd+B/I/K shortcuts, and synchronized editor-preview scrolling.',
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
