# // THOMAS PAYNE PORTFOLIO & PLATFORM
## Comprehensive Production & QA Verification Checklist

This checklist provides a systematic, step-by-step verification guide to test every subsystem, route, interaction, and fail-safe across the codebase.

---

### 1. Build Integrity & CI Pipeline
- [ ] **Lint Verification**: Run `npm run lint` in your terminal. Ensure output reports **`0 errors, 0 warnings`** with zero `@next/next/no-img-element` or hook warnings.
- [ ] **Turbopack Production Build**: Run `npm run build`. Confirm that all 16 static and dynamic routes compile successfully without TypeScript errors.
- [ ] **GitHub Actions CI (`.github/workflows/ci.yml`)**: Push any commit to `main` or open a PR, and verify that the GitHub Actions job passes both lint and build stages automatically.

---

### 2. Developer HUD & Agentic AI (CLI v2.0)
*Trigger options:* Press `Cmd+K` (Mac), `Ctrl+K` (Windows/Linux), backtick (``` ` ```), or click the floating `[CLI ⌘K]` badge in the bottom-right corner.

- [ ] **Modal Appearance & Focus**: Opening the HUD smoothly displays the Framer Motion modal and auto-focuses the input prompt (`>`).
- [ ] **Tactile Keystroke Audio**:
  - Click the **Volume** icon in the HUD header bar, or enter command `audio on`.
  - Type characters in the input field: Confirm distinct, subtle mechanical switch audio clicks (Web Audio API triangle oscillator).
  - Enter `audio off` or click the header button again: Confirm keystrokes are muted.
  - Refresh the page and reopen HUD: Confirm audio state persists via `localStorage` (`fx_terminal_audio`).
- [ ] **Agentic AI Assistant (`ask <query>`)**:
  - Test `ask what is your tech stack?`: Confirm animated Bot loader followed by formatted technical stack card.
  - Test `ask tell me about your military background`: Confirm principles card (Discipline, Systems over Motivation).
  - Test `ask what projects have you built?`: Confirm portfolio overview card.
  - Test `ask hello` (general query): Confirm fallback overview card with suggested prompts.
- [ ] **Autocomplete**: Type `wr` and press `Tab` $\rightarrow$ auto-completes to `writing`. Type `pro` + `Tab` $\rightarrow$ auto-completes to `projects`.
- [ ] **Command History Navigation**: Type several commands (`help`, `bio`, `bench`), then press `Up Arrow` and `Down Arrow` to cycle through previous inputs.
- [ ] **Direct CLI Transmit**: Type `message Hello Thomas, testing from the HUD CLI!` $\rightarrow$ Confirm green transmission confirmation and check that the record appears in Admin Messages inbox.
- [ ] **Telemetry Benchmark**: Type `bench` or `ping` $\rightarrow$ Confirm DOM node count, viewport dimensions, network type, and JS heap status.
- [ ] **Background FX Toggles**:
  - Enter `matrix off` / `matrix on` $\rightarrow$ confirms Matrix rain canvas toggles and updates `localStorage`.
  - Enter `lightning off` / `lightning on` $\rightarrow$ confirms LightStrike canvas toggles and updates `localStorage`.
- [ ] **Route Navigation**: Type `goto portfolio`, `goto writing`, or `goto about` $\rightarrow$ confirm smooth client routing.
- [ ] **Screen Controls**: Type `clear` $\rightarrow$ screen clears. Type `exit` or hit `Esc` $\rightarrow$ HUD closes cleanly.

---

### 3. Visual Identity, Themes & Micro-Interactions
- [ ] **Obsidian Monochromatic Palette**: Verify deep blacks (`#000000`), dark grays (`#1A1A1A`), stone accents (`#DEDEDE`), and high-contrast typography across all screens.
- [ ] **Magnetic Custom Cursor (`CustomCursor.tsx`)**:
  - Move cursor around: Confirm butter-smooth 60fps spring tracking without lagging or layout jitter.
  - Hover over buttons/links in `<Navbar />` or `<Footer />`: Confirm cursor scales down to `0.5x` and turns solid `bg-action` (magnetic dot state).
- [ ] **Theme Switching**: Click the Sun/Moon toggle in the navigation bar.
  - In **Dark Mode**: Background is deep obsidian, active tags are stark white with black text (`text-background`).
  - In **Light Mode**: Background is clean white/light gray, active tags invert cleanly with zero unreadable contrast issues.
- [ ] **Reading Progress Bar (`ScrollProgressBar.tsx`)**: Scroll down any long page $\rightarrow$ confirm the top spring-animated indicator advances smoothly proportional to scroll depth.
- [ ] **Responsive Mobile Navigation (`NavbarClient.tsx`)**:
  - Resize browser window to mobile width (< 768px).
  - Confirm desktop link dock hides and hamburger icon appears on the left, with theme toggle on the right.
  - Tap hamburger: Confirm Framer Motion backdrop-blur dropdown expands smoothly. Tap outside or select link: Menu closes.

---

### 4. Home Page & Interactive Journey Feed (`/`)
- [ ] **Feed Search & Tag Filtering**:
  - Click filter pills: `#ALL`, `#BUILD`, `#MILESTONE`, `#MILITARY`, `#LEARNING`. Confirm feed list instantly filters to matching categories.
  - Type keywords in the search input $\rightarrow$ confirm live text matching on titles and descriptions.
- [ ] **Code Snippet Attachments**: Find any timeline entry containing code $\rightarrow$ click the code block expander and verify the 1-click copy button works with animated checkmark feedback.
- [ ] **Image Attachments & Lightbox**: Find any timeline event with an image attachment $\rightarrow$ click the thumbnail $\rightarrow$ verify full-screen animated Framer Motion lightbox opens with close button and Esc support.
- [ ] **Social Interactions**: Log in as a user and verify liking a timeline item triggers immediate optimistic count increment.

---

### 5. Technical Writing Engine (`/writing` & `/writing/[slug]`)
- [ ] **Writing Catalog (`/writing`)**:
  - Verify live search input filters articles by title, excerpt, and tags.
  - Verify reading time badges (e.g. `4 min read`) appear on all article cards.
- [ ] **RSS 2.0 XML Feed**:
  - Click the **RSS 2.0 Feed** button on `/writing` or visit `/feed.xml` directly in your browser.
  - Verify browser displays valid XML with `<rss version="2.0">`, `<channel>`, pubDate, and article items.
- [ ] **Article Deep Dive (`/writing/[slug]`)**:
  - Open an article (e.g. `/writing/discipline-over-motivation`).
  - **Table of Contents (`TableOfContents.tsx`)**: Verify automated extraction of H2/H3 headings. Scroll the page and confirm the active heading updates in the TOC in real-time via `IntersectionObserver`. Click any TOC heading to verify smooth scrolling.
  - **Syntax Tokenizer (`CodeBlock.tsx`)**: Verify high-contrast monochromatic code highlighting, line numbering, language pill badge, and 1-click clipboard copy button.
  - **Article Reading Progress**: Verify dedicated top spring bar tracks reading completion.
  - **Offline Resilience**: Disconnect internet or pause Supabase $\rightarrow$ verify fallback article loads without 500 server crashes.

---

### 6. Interactive Portfolio & Deep-Dive Case Studies (`/portfolio` & `/portfolio/[slug]`)
- [ ] **Portfolio Filter Dock (`PortfolioClient.tsx`)**:
  - Search by project name in the live filter input.
  - Click tech stack pills (`#Next.js 16`, `#TypeScript`, `#Supabase`, `#Framer Motion`) $\rightarrow$ cards filter reactively.
  - Verify GitHub icon is rendered using `FaGithub` with correct brand geometry.
- [ ] **Case Study Deep Dive (`/portfolio/[slug]`)**:
  - Open `/portfolio/personal-website-v2-obsidian-edition`.
  - Confirm ASCII system topology diagram renders cleanly in code container.
  - Verify Problem Statement, Architecture, Measurable Metrics, and Trade-offs sections are populated.
  - Test **Live Demo** and **View Source** buttons.

---

### 7. Activity Tracker & Diagnostics Dashboard (`/dashboard`)
- [ ] **Telemetry Health Status**: Verify latency ping, Turbopack compiler indicator, and 100% build passing status.
- [ ] **Active Projects Tracker**: Verify active engineering cards, progress bars, and status pills.
- [ ] **Git Ticker Stream**: Confirm live list of recent Git commits displays chronological activity.

---

### 8. Admin CMS Studio & Media Asset Pipeline (`/admin`)
- [ ] **Route Protection**: If unauthenticated or guest, verify user is prompted with admin sign-in.
- [ ] **Real-Time Analytics Metrics**: Verify dashboard cards for Total Events, Active Projects, Published Articles, Unread Messages, and Registered Users.
- [ ] **Split-Pane Markdown Studio (`AdminMarkdownStudio.tsx`)**:
  - Navigate to **Articles** tab in Admin.
  - Test formatting toolbar buttons: **B** (Bold), *I* (Italic), **H2**, **H3**, **CodeBlock**, **Quote**, **List**, **Link**.
  - Verify live preview pane updates simultaneously as you type.
  - Verify word count, character count, and estimated reading time update dynamically.
- [ ] **Media Asset Dropzone (`MediaDropzone.tsx`)**:
  - Drag and drop an image (`PNG`/`JPG`/`WEBP`) onto the dropzone.
  - Verify upload spinner displays, thumbnail renders cleanly via Next.js `<Image />` without console warnings, and URL auto-populates.
  - Test remove button (`X`) to clear preview.
- [ ] **Messages & Quick Reply**: Check incoming contact messages. Click **Reply** $\rightarrow$ opens native email client via `mailto:`. Test **Delete** button to remove message.

---

### 9. SEO, Social Graph & Robots
- [ ] **Dynamic Sitemap (`/sitemap.xml`)**:
  - Open `http://localhost:3000/sitemap.xml` (or production URL).
  - Verify XML structure containing all static pages (`/`, `/about`, `/portfolio`, `/writing`, `/dashboard`, `/contact`), dynamic articles (`/writing/[slug]`), and portfolio case studies (`/portfolio/[slug]`).
- [ ] **Robots Rules (`/robots.txt`)**:
  - Open `http://localhost:3000/robots.txt`.
  - Verify `Allow: /`, `Disallow: /admin`, `Disallow: /api/`, and `Sitemap: https://thomaspayne.dev/sitemap.xml`.
- [ ] **OpenGraph & Twitter Meta**:
  - Right-click and inspect `<head>` on home page and any writing page.
  - Verify presence of `og:title`, `og:description`, `og:image`, `twitter:card` (`summary_large_image`), and canonical URL tags.
