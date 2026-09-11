import { createPWLinearIssue } from './sync-linear.mjs';

const newTasks = [
  {
    title: 'Phase 1: Foundation Hardening, SEO & Asset Pipeline (OpenGraph, Sitemap, Robots, Next/Image, CI Workflow)',
    description: 'Configured images.remotePatterns in next.config.ts and migrated all raw img tags to next/image across About, MediaDropzone, and TimelineDashboard, achieving 0 ESLint warnings. Upgraded root metadata with full OpenGraph, Twitter Cards, robots directives, and canonical URL alternates in app/layout.tsx. Implemented dynamic generateMetadata for /writing/[slug] and /portfolio/[slug]. Created dynamic app/sitemap.ts and app/robots.ts. Configured GitHub Actions CI workflow in .github/workflows/ci.yml.',
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
