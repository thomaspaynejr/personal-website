import { createPWLinearIssue } from './sync-linear.mjs';

const newTasks = [
  {
    title: 'Phase 5: Agentic AI Assistant & Tactile Audio Keystroke Synthesis in Terminal HUD',
    description: 'Engineered POST /api/assistant knowledge endpoint answering queries regarding military background, technical stack, Next.js 16 architecture, obsidian design philosophy, and portfolio projects. Built Web Audio API mechanical switch oscillator synthesizer (playMechanicalClick) providing tactile keystroke audio in TerminalHUD.tsx, complete with ask <query>, audio [on|off], header volume toggle button, and persistent localStorage state.',
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
