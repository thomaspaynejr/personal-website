# Project Hiccups & Fixes - Personal Website

This document tracks the technical challenges encountered during the Supabase and Next.js 16 integration.

## 1. Next.js 16 Breaking Changes
- **Issue:** `searchParams` and `params` accessed synchronously caused runtime errors.
- **Error:** `Error: Route "/login" used searchParams.error. searchParams is a Promise...`
- **Fix:** Updated `LoginPage`, `SignupPage`, and `ProfilePage` to `await searchParams` before accessing properties.

## 2. Supabase URL Configuration
- **Issue:** Authentication returned 404 "Invalid path specified in request URL".
- **Cause:** `NEXT_PUBLIC_SUPABASE_URL` was configured with the `/rest/v1/` suffix.
- **Fix:** Reverted the URL to the base format: `https://[project-id].supabase.co`.

## 3. Ghost Processes & Port Conflicts
- **Issue:** `npm run dev` failed because port 3000 was already in use, even after closing the terminal.
- **Cause:** The `dev` script uses `&` (backgrounding), which can leave orphans.
- **Fix:** Used `lsof -i :3000` to identify PID 26614 and 57986, followed by `kill -9`.

## 4. Supabase API Key
- **Issue:** "Invalid API key" errors during auth attempts.
- **Cause:** Incorrect or extra spaces in `.env.local` for `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **Fix:** Refreshed the key from the Supabase dashboard and ensured clean formatting in `.env.local`.

## 5. Dark Mode Contrast on Filter & Action Pills
- **Issue:** Selected filter pills and active buttons became illegible in dark mode when hardcoded `text-white` was applied over light accent or dark foreground backgrounds.
- **Cause:** Monochromatic styling inversion between light mode (#FFFFFF background, #000000 foreground) and dark mode (#000000 background, #FFFFFF foreground).
- **Fix:** Switched active utility classes from `text-white` to `text-background`, ensuring optimal contrast in both light mode (black on white) and dark mode (white on black).

## 6. Navigation Freeze
- **Issue:** Site freezes when navigating back from an external link (e.g., GitHub).
- **Cause:** Background animations (Matrix/Light) resumed simultaneously with high CPU usage.
- **Fix:** Switched external links to `target="_blank"`, added `visibilitychange` listeners to pause animations when tab is inactive, and optimized cleanup logic.

## 7. Server Action Body Limit
- **Issue:** 1MB limit for image uploads via Server Actions.
- **Fix:** Increased limit to 20MB in `next.config.ts` and refactored to client-side uploads directly to Supabase Storage for better stability.

## 8. React 19 & ESLint 9 Strict Effect Rules (`react-hooks/set-state-in-effect`)
- **Issue:** `npm run lint` failed with `Error: Calling setState synchronously within an effect can trigger cascading renders` in `LightStrike.tsx`, `MatrixRain.tsx`, and `ProjectDashboard.tsx`.
- **Cause:** ESLint 9's React compiler rule flags synchronous `setState` calls directly in `useEffect` bodies during initial mount.
- **Fix:**
  - In canvas FX (`LightStrike`, `MatrixRain`), deferred client-side `localStorage` state checks with `setTimeout(() => setEnabled(false), 0)`.
  - In `ProjectDashboard`, replaced `useEffect` prop syncing with the official React render-time state adjustment pattern (`prevInitialProjects !== initialProjects`).

## 9. Next.js Turbopack Link Routing in Dynamic Overlays
- **Issue:** ESLint rule `@next/next/no-html-link-for-pages` flagged raw `<a>` elements in `TerminalHUD.tsx`, triggering full-page browser document refreshes instead of client-side transitions.
- **Cause:** Hardcoded anchor tags used inside CLI command output templates.
- **Fix:** Replaced raw `<a>` tags with `next/link` `<Link>` components, bound to close modal handlers (`onClick={() => setIsOpen(false)}`) to maintain snappy SPA navigation and Turbopack route cache.

## 10. Offline / Unseeded Supabase Resilience Pattern
- **Issue:** When Supabase is paused, rate-limited, or unseeded during development, server component fetches could throw uncaught exceptions, breaking page compilation or rendering error boundaries.
- **Fix:** Wrapped server-side Supabase queries in resilient `try-catch` blocks and provided deterministic default fallback datasets (`DEFAULT_ARTICLES`, `DEFAULT_TIMELINE`, default fallback about texts) so the site remains 100% operational offline.

## 11. Next.js 16 Dynamic Route Promise Unwrapping
- **Issue:** In dynamic routes such as `app/writing/[slug]/page.tsx`, accessing `params.slug` directly resulted in TypeScript and runtime errors.
- **Cause:** Next.js 16 marks `params` and `searchParams` as asynchronous `Promise` objects.
- **Fix:** Typed page props as `{ params: Promise<{ slug: string }> }` and unwrapped parameters via `const { slug } = await params;` prior to data fetching.

## 12. Monochromatic Markdown & Heading Slug Synchronization
- **Issue:** Anchor links in the Table of Contents failed to scroll to headings or missed elements when headings contained punctuation or inline formatting (e.g., `Next.js 16`, `###`, backticks).
- **Cause:** Discrepancies between the TOC extraction regex and the markdown heading renderer's ID generator.
- **Fix:** Unified the slug generator across `TableOfContents.tsx` and `MarkdownRenderer.tsx` by stripping inline markdown delimiters (`**`, `*`, `` ` ``), sanitizing special characters, normalizing whitespace to hyphens, and tracking collision counts (`seenSlugs`) to guarantee matching anchor IDs.

## 13. Lucide React Brand Icon Restrictions
- **Issue:** Next.js Turbopack build failed with `Export Github doesn't exist in target module lucide-react`.
- **Cause:** `lucide-react` focuses strictly on general UI glyphs and intentionally excludes proprietary brand/social logos (e.g., GitHub, Twitter/X, Instagram, LinkedIn).
- **Fix:** Switched brand icon imports in `PortfolioClient.tsx` and `app/portfolio/[slug]/page.tsx` to `FaGithub` from `react-icons/fa6`, maintaining aesthetic and architectural alignment with `Footer.tsx`.

## 14. Web Audio Context Lifetime & Keystroke Audio Synthesis
- **Issue:** Calling Web Audio API oscillators on every keystroke without proper lifecycle management can lead to browser console warnings regarding `AudioContext` limits, resource exhaustion, or blocked autoplay when initialized outside user interaction.
- **Fix:** Instantiated short-lived, self-closing `AudioContext` instances with ramp-down exponential decays (140Hz -> 35Hz in 35ms) and wrapped them in `try-catch` blocks. Closed contexts via `ctx.close()` post-playback to prevent memory leaks and ensure cross-browser compatibility.

## 15. Next.js 16 Dynamic Sitemap Typing with Supabase Clients
- **Issue:** `npm run build` failed during TypeScript verification with `Type error: Parameter 'a' implicitly has an 'any' type` when mapping Supabase query results in `app/sitemap.ts`.
- **Cause:** Supabase SDK queries on untyped table selections default to `any[]` or `unknown[]` without explicit schema typing.
- **Fix:** Declared a strict `SitemapArticle` interface (`slug`, `updated_at`, `published_at`) and cast the result array before array transformation.

## 16. Web Audio Frequency Selection & Browser Autoplay Suspended State
- **Issue:** Keystroke audio in `TerminalHUD.tsx` was inaudible on laptop speakers, and refreshing the page left the `AudioContext` in a suspended state.
- **Cause:** 35Hz sub-bass frequencies fall below the physical frequency response curve of laptop/MacBook speakers. In addition, browser autoplay security policies default freshly created contexts to `suspended` until resumed by a user gesture.
- **Fix:** Switched to dual-layer mechanical switch acoustics (1400Hz -> 450Hz tactile snap + 260Hz -> 90Hz bottom-out thock) managed via a singleton `getSharedAudioContext()` that automatically calls `.resume()` and plays audible toggle tones.

## 17. Custom Cursor Lag Offset vs. Real Click Coordinates
- **Issue:** With `cursor-none` enabled on `<body>`, clicking small buttons and links (such as "Live Demo" and "View Source" in case studies) felt inconsistent or missed.
- **Cause:** Framer Motion spring physics on a single cursor element introduce an intentional ~100-200ms trailing lag. The visual circle lagged behind the true physical mouse coordinates where the browser dispatches click events.
- **Fix:** Refactored `CustomCursor.tsx` to a dual-layer architecture: a zero-latency center pinpoint dot tracking true client coordinates immediately without spring lag, paired with a fluid outer spring halo that floats and expands around it on interactive hover.

## 18. MarkdownRenderer Infinite Loop on Heading / Real-Time Typing
- **Issue:** Typing `#` or `##` in real-time inside the Admin Markdown Studio editor froze the browser tab with 100% CPU lockup.
- **Cause:** In `MarkdownRenderer.tsx`, the paragraph parsing loop checked `!lines[i].trim().startsWith('#')` and broke out before pushing to `pLines`. However, the heading regex required `/^(#{1,4})\s+(.+)$/`. When typing `#` alone, neither branch consumed the line, leaving `i` unincremented and triggering an infinite loop.
- **Fix:** Relaxed heading regex to `/^(#{1,4})(\s+.*)?$/` to safely handle partial header typing, and added a guaranteed `else { i++; }` advancement fallback in the paragraph loop.

## 19. Web Audio Psychoacoustics & User Sound Perception
- **Issue:** Keystroke clicks at 1400Hz and ascending 440/880Hz confirmation chimes sounded harsh, shrill, and arcade-like on laptop speakers.
- **Cause:** High-frequency pure sine/triangle oscillators lack mechanical body resonance and acoustic dampening, creating sharp digital beeps rather than physical key feedback.
- **Fix:** Redesigned sound synthesis around low-frequency dampened mechanical keyboard acoustics (triangle wave sweeping 220Hz down to 65Hz in 14ms at soft 0.04 gain). Introduced selectable sound profiles (`thock`, `haptic`, `click`, `soft`) via `audio [mode]` in `TerminalHUD.tsx`. User testing revealed strong preference for the `haptic` and `soft` sound family (subtle Apple trackpad / modern UI micro-taps).

## 20. Dynamic Route Slug Mismatches in Offline Mode
- **Issue:** Navigating to `/writing/nextjs-16-async-server-components` threw 404 "Article Not Found" when running without a seeded database.
- **Cause:** The default article was keyed as `nextjs-16-async-server-components-turbopack`, while checklist links omitted the `-turbopack` suffix.
- **Fix:** Added an explicit slug alias in `DEFAULT_ARTICLES` in `app/writing/[slug]/page.tsx` mapping both slug variants to the same 4-section architecture deep dive.

## 21. Unseeded Home Timeline Feed Rendering & Missing Test Wireframes
- **Issue:** The Home page Journey Feed was completely blank when `timeline_events` table was unseeded, preventing verification of expandable code snippets and image lightboxes.
- **Cause:** `app/page.tsx` returned `timeline: []` when database rows were absent without providing structured fallback events.
- **Fix:** Seeded a deterministic `DEFAULT_TIMELINE` fallback in `app/page.tsx` featuring 4 categorized events (`#BUILD`, `#MILESTONE`, `#MILITARY`, `#LEARNING`), an expandable Web Audio code block with copy button, and a photographic thumbnail linked to the Framer Motion lightbox modal.



