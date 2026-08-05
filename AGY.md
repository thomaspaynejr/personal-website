y# AGY AGENT RULES // THOMAS PAYNE WEBSITE

This codebase uses an experimental/future version of **Next.js 16**. Standard training data for Next.js 13/14/15 **WILL NOT** always apply.

## // CRITICAL CONVENTIONS

- **[WORKFLOW]** **NEVER** trust a simple browser refresh for UI changes. If a change (like removing icons) isn't showing, **RESTART** the `npm run dev` process. Next.js 16 caching is aggressive.
- **[PROXY]** `middleware.ts` is deprecated. Use `proxy.ts` in the root directory.
  - Export a named or default function called `proxy(request: NextRequest)`.
  - Reference: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`.
- **[TYPESCRIPT]** Native HTML elements (like `<label>`) are strictly typed. Do not pass custom non-standard attributes (e.g., `underline`) directly to them; use `className` with Tailwind instead.
- **[BUILD]** The `npm run dev` script runs in the background (`&`). If the process persists after closing the terminal, find and kill the PID (usually port 3000/3001) using `lsof -i :3000`.
- **[TURBOPACK]** Avoid experimental CSS features like `animation-timeline: scroll()`. They can cause Turbopack to panic (crash). Use `framer-motion` (`useScroll`) for scroll-linked animations instead.
- **[GIT CRITICAL RULE]** EVERY TIME you work on an issue and complete a change, you MUST ALWAYS automatically stage, commit, and push the updates to the GitHub repository using git commands. Use concise, descriptive commit messages. NEVER forget to push to GitHub as we move forward.
- **[SUPABASE]** Use `.env.local` for local development. Ensure `NEXT_PUBLIC_SUPABASE_URL` follows the `https://[ref].supabase.co` format.

## // ARCHITECTURAL KNOWLEDGE

- **Styling:** Uses Tailwind CSS 4 with a strict monochromatic palette (#000000, #1A1A1A, #DEDEDE).
- **Minimalist Aesthetic:** Enforces a "shrunk" design language. 
  - Headings: `text-2xl` or `text-lg` (avoiding `text-4xl`).
  - Body/Inputs: `text-xs` or `text-[10px]`.
  - Layout: `max-w-5xl` or `max-w-3xl` for content containers.
- **Components:**
  - `TechIcon`: Sophisticated Mac-style Dock magnification component using `framer-motion`.
  - `LightStrike`: Global background effect. Triggers every 5s with a main bolt and 2-3 distant bolts. High Z-index (`z-[10]`) to appear above Matrix Rain.
- **Icons:** Powered by `react-icons/si` (Simple Icons) and `lucide-react`.
- **Auth:** Supabase Auth via `@supabase/ssr`.
- **Docs:** Internal Next.js docs in `node_modules/next/dist/docs/`.

## // DATABASE SCHEMA (DEPLOYED & VERIFIED)

- **`about_content`**: Dynamic text and Hero image URL.
- **`experiences`**: Modular work history. Fields: `title`, `period`, `description`, `display_order`.
- **`profiles`**: User metadata (username, block status). Extended from `auth.users`.
- **`portfolio_projects`**: Public projects. Fields: `title`, `description`, `tech` (array), `demo_url`, `source_url`.
- **`tracker_projects`**: Internal/Active tracking. Fields: `name`, `status` (Enum), `progress`, `description`.
- **`timeline_events`**: The Journey feed. Fields: `date`, `title`, `description`, `icon_type`.
- **`timeline_likes/comments`**: Engagement metrics linked to timeline events.
- **`contact_messages`**: Secure storage for contact form submissions.

### Security Model
- **Admin Role:** Defined in `auth.users.raw_user_meta_data -> 'role' = 'admin'`.
- **RLS:** Public read-only for content; Admin full access; Authenticated engagement (likes/comments).
- **Enforcement:** All administrative server actions in `app/actions/admin.ts` call `checkAdmin()`. Authenticated engagement actions are in `app/actions/engagement.ts`.

## // ENGAGEMENT & INTERACTION

- **Timeline:** Users can "Like" and "Comment" on journey events. Data is persisted in `timeline_likes` and `timeline_comments`.
- **Contact:** Form submissions are saved to `contact_messages` and are viewable by admins via the **Messages** tab in the dashboard.
- **Socials:** Social links are fully dynamic, managed via the Admin panel, and rendered across the site (About page and Footer).
- **Profiles:** User usernames are synced between `auth.users` metadata and the public `profiles` table for relational consistency in comments.

## // LESSONS LEARNED & HICCUPS

- **[NEXTJS 16]**: `searchParams` and `params` are now Promises. Must be `await`-ed in Server Components (e.g., Login/Signup/Profile pages).
- **[SERVER ACTIONS]**: Default body limit is 1MB. Increased to 20MB in `next.config.ts` via `experimental.serverActions.bodySizeLimit`. 
- **[FILE UPLOADS]**: Client-side uploads to Supabase Storage bypass Next.js body limits and are more reliable for large images.
- **[ANIMATIONS]**: Background effects (Matrix/Lightning) must pause when the tab is hidden (`visibilitychange`) to prevent CPU spikes and browser freezes on navigation.
- **[SUPABASE URL]**: `NEXT_PUBLIC_SUPABASE_URL` must be the base URL only. Appending `/rest/v1/` causes Auth 404 errors.
- **[ICONS]**: `react-icons/si` can have inconsistent naming or missing exports (e.g., `SiLinkedin`). Preferred fallback is `react-icons/fa6` for social brands.
- **[PORT CONFLICTS]**: Resolved by automating port 3000 cleanup in `package.json` dev script: `(lsof -t -i:3000 | xargs kill -9 || true) && next dev`.

## // AGENT ACTIVITY LOG (ANNOTATIONS)

- **[UI/UX Refinement]**: Refactored `CustomCursor.tsx` to use `framer-motion` (`useMotionValue`, `useSpring`) for buttery smooth 60fps physics, removing conflicting Tailwind CSS transitions and expensive `getComputedStyle` layout thrashing.
- **[UI/UX Polish]**: Added a contextual 3-way hover state to `CustomCursor.tsx` ('none', 'normal', 'nav'). When hovering over links in the `<nav>` or `<footer>`, the cursor shrinks by half (`scale: 0.5`) and fills solid (`bg-action`) for a precise 'magnetic dot' feel.
- **[Mobile UX]**: Implemented horizontal scrolling for `<Navbar />` on mobile screens. Used `overflow-x-auto` with a custom hidden scrollbar utility (`.no-scrollbar`) and applied `shrink-0` to all links to prevent layout clipping while maintaining the "shrunk" minimalist aesthetic.
- **[Mobile UX Dropdown Refactor]**: Upgraded the mobile navbar to a Framer Motion-powered dropdown hamburger menu. Extracted the UI into a new `NavbarClient.tsx` Client Component while keeping `Navbar.tsx` as a pure Server Component for auth data fetching. The new dropdown features an animated backdrop-blur menu, positioned cleanly on the left side of the screen with the light/dark mode toggle balancing it on the right.
- **[UI Polish & Animations]**: Integrated `framer-motion` `FadeIn`, `StaggerContainer`, and `StaggerItem` wrapper components with native `className` support to create smooth layouts for the Portfolio page, About page, and Footer.
- **[Interactive Feedback]**: Enhanced the Timeline Feed and Admin Dashboard (Project Tracker, Content Managers) with buttery smooth `AnimatePresence` expanding and collapsing interactions for forms and tabs.
- **[Code Quality & TypeScript Refactor]**: Performed complete codebase cleanup. Eliminated over 50 explicit `any` types across `AdminClient.tsx`, `ProjectDashboard.tsx`, `NavbarClient.tsx`, `Portfolio`, `lib/supabase/client.ts`, and `lib/supabase/server.ts`. Added strict TypeScript interfaces (`TimelineEvent`, `Profile`, `PortfolioProject`, `TrackerProject`, `AboutContent`, `Experience`, `ContactMessage`). Fixed unsafe `supabase!` assertions with safe optional checks across server components (`about`, `admin`, `dashboard`, `portfolio`, `page.tsx`, `Footer`). Removed all unused variables and imports, achieving 0 build/type errors and 0 ESLint errors.
- **[Interactive Developer HUD]**: Built `TerminalHUD.tsx`, a Framer Motion-powered Command Line Interface triggered globally via `Cmd+K`, `Ctrl+K`, backtick (``` ` ```), or floating `[CLI ⌘K]` badge. Features autocomplete (`Tab`), command history (`Up/Down`), live theme toggling, system diagnostics (`sys`/`status`), bio, project listings, skills breakdown, and quick navigation.
- **[Linear Integration & API Sync]**: Configured Linear Team **Nebuchadnezzar (`PW`)** and Project **Personal Website**. Synced GraphQL issues `PW-1` through `PW-11` (100% Complete) covering all features built today. Added helper scripts `scripts/sync-linear.mjs` and `scripts/sync-today.mjs`.
- **[Writing & Articles Feature]**: Implemented `/writing` and `/writing/[slug]` routes with tag filtering, search, reading time badges, Next.js 16 async params, Supabase `articles` table integration, fallback sample write-ups, terminal `writing` command, and full Admin Dashboard Article Manager (`upsertArticle`/`deleteArticle`).
- **[Terminal HUD Overhaul]**: Expanded `TerminalHUD.tsx` with dynamic background FX controls (`matrix` / `lightning` on/off toggles with `localStorage` persistence and `fx-toggle` events), direct CLI messaging (`message <text>`) with server action transmit, system telemetry benchmark (`bench` / `ping`), and instant route navigation (`goto <route>`).
- **[System Dashboard Telemetry]**: Enhanced `/dashboard` with a live telemetry status panel (Supabase DB latency ping, Next.js 16 Turbopack compiler health, build status 100% passing) and a Developer Git Ticker stream displaying recent commits.
- **[Rich Journey Feed Filters]**: Integrated live search input and category tag filter pills (`ALL`, `#BUILD`, `#MILESTONE`, `#MILITARY`, `#LEARNING`) into `TimelineDashboard.tsx` on the home page.
- **[Dark Mode Contrast Fix]**: Fixed selected filter pill text readability in dark mode across `TimelineDashboard.tsx`, `WritingClient.tsx`, `AdminClient.tsx`, and `ProjectDashboard.tsx` by switching active state text utility from `text-white` to `text-background` (which dynamically turns black on white in dark mode and white on black in light mode).

---
*Maintained by Antigravity for Thomas Payne.*
