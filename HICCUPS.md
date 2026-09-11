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

