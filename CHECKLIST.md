# // THOMAS PAYNE PORTFOLIO & PLATFORM
## Production Verification Checklist v3.0 (Post-Feedback Hardening)

This checklist addresses your direct testing feedback across audio, cursor styles, markdown editor stability, dummy timeline attachments, article links, and SEO/CI verification.

---

### Part I: Freshly Updated Subsystems (Ready for Retest)

#### 1. Warm Organic Tactile Audio (`TerminalHUD.tsx`)
*Replaced harsh 1400Hz arcade beeps with authentic dampened mechanical keyboard "thock" and added selectable sound profiles.*
- [ ] **Mellow Confirmation Chimes**:
  - Press `Cmd+K` or backtick (`` ` ``) to open the HUD.
  - Click the **Volume** icon in the HUD header or type `audio on`: Confirm a warm, soft musical chime plays (`220Hz` $\rightarrow$ `277Hz`, zero high-pitched ringing).
  - Click again or type `audio off`: Confirm a soft downward tap plays.
- [ ] **Dampened Mechanical Keystroke Sound ("Thock")**:
  - Turn `audio on` and type commands in the HUD. Notice the deep, low-frequency acoustic keycap tap (modeled after lubed mechanical switches).
- [ ] **Selectable Audio Profiles**:
  - Test the alternate sound profiles in the HUD:
    - Type `audio thock`: Deep, dampened mechanical switch bottom-out (default).
    - Type `audio haptic`: Ultra-subtle Apple/Linear trackpad micro-tap.
    - Type `audio click`: Crisp tactile switch with a subtle transient tick.
    - Type `audio soft`: Whisper-quiet muted pop.

#### 2. Alternate Cursor Modes (`CustomCursor.tsx`)
*Added 3 switchable cursor styles to match your aesthetic preference.*
- [ ] **Test Cursor Styles via Terminal HUD (`Cmd+K`)**:
  - **Dual Mode (Default)**: Type `cursor dual`. Pinpoint center dot with zero latency plus a fluid spring trailing halo ring.
  - **Minimal Mode**: Type `cursor minimal`. Single precision dot with spring hover expansion—ultra-clean Yeezy minimalist aesthetic without the outer ring.
  - **Tactical Bracket Mode**: Type `cursor bracket`. Corner crosshair HUD brackets that rotate on button hover—cyber/military tactical aesthetic.

#### 3. Markdown Studio Header Freeze Resolution (`MarkdownRenderer.tsx`)
*Fixed the infinite loop bug where typing `#` or empty headers froze browser CPU.*
- [ ] **Heading Typing Stability**:
  - Navigate to `/admin` -> **Articles**.
  - In the Markdown editor, type `#`, `##`, `###`, and press `Enter`.
  - Type full titles (e.g. `# New Architectural Benchmark`). Confirm the right-hand preview updates instantly in real time **with 0% CPU freeze**.

#### 4. Home Page Timeline Events & Attachments (`/`)
*Added rich fallback events with code snippets and image attachments so the feed is never empty.*
- [ ] **Expandable Code Snippet**:
  - Visit the Home page (`/`) and scroll down to the **Journey Feed**.
  - Look for `#BUILD // Next.js 16 Architecture & Web Audio Synthesis`.
  - Click the code header to expand the embedded Web Audio code block.
  - Click the **COPY** button: Confirm button changes to green `COPIED` with checkmark feedback.
- [ ] **Image Attachment & Animated Lightbox**:
  - In the feed, locate `#MILESTONE // Monochromatic Obsidian Design System v2.0`.
  - Click the preview image thumbnail: Confirm full-screen animated Framer Motion lightbox opens.
  - Test closing the lightbox by pressing `Esc` or clicking the `X` button.
- [ ] **Filter Pills & Comments**:
  - Click the `#BUILD`, `#MILESTONE`, `#MILITARY`, and `#LEARNING` filter pills to verify instantaneous tag filtering.
  - Click the comment bubble on `#BUILD` to view the 2 sample comments and test posting a comment.

#### 5. Technical Writing Deep Dive (`/writing/[slug]`)
*Added slug aliases and rich multi-section articles to guarantee zero 404s.*
- [ ] **Article Resolution**:
  - Open `/writing/nextjs-16-async-server-components`.
  - Confirm the page resolves cleanly with all 4 architectural sections, code snippets, and callouts.
- [ ] **Table of Contents Scroll-Spy**:
  - Open `/writing/discipline-over-motivation` or `/writing/nextjs-16-async-server-components`.
  - Scroll down the article: Confirm the active heading automatically highlights in the right-hand TOC dock.
  - Click any TOC section heading: Confirm smooth anchor jump scrolling.
- [ ] **Syntax Token Colors (`CodeBlock.tsx`)**:
  - Confirm keywords (`export`, `default`, `async`, `const`), strings, and types are styled cleanly in monochromatic accents.

#### 6. Portfolio Case Studies & Clickable Titles (`/portfolio`)
*Added 2 additional flagship case studies (4 total) and made project titles directly clickable.*
- [ ] **Clickable Project Titles**:
  - Visit `/portfolio`.
  - Click on the title of any project card (e.g. **Distributed Telemetry Engine** or **Tactical Operations C2 Matrix**): Confirm it navigates immediately to the case study.
- [ ] **Case Study Deep Dive**:
  - Verify all 4 case study routes render with topology diagrams and engineering specs:
    - `/portfolio/personal-website-v2-obsidian-edition`
    - `/portfolio/antigravity-cli-agentic-suite`
    - `/portfolio/distributed-telemetry-engine`
    - `/portfolio/tactical-operations-c2-matrix`

---

### Part II: Remaining Items & How to Check (SEO & CI)

#### 7. How to Check Social Meta Tags (OpenGraph / Twitter)
- [ ] **Browser Console 1-Click Verification**:
  1. Open your browser to `http://localhost:3000/` (or any article like `/writing/discipline-over-motivation`).
  2. Open DevTools: press `Cmd + Option + I` and select the **Console** tab.
  3. Paste this command and hit `Enter`:
  ```javascript
  console.table(Array.from(document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"]')).map(m => ({ property: m.getAttribute('property') || m.getAttribute('name'), content: m.getAttribute('content') })));
  ```
  4. Confirm an ASCII table prints showing `og:title`, `og:description`, `og:image`, `twitter:card`, and `twitter:creator`.
  *(Alternatively: Right-click anywhere on the page -> "View Page Source" and search `Cmd+F` for `og:`).*

#### 8. How to Check GitHub Actions CI Workflow
- [ ] **GitHub Web Interface Verification**:
  1. Once changes are pushed to GitHub, open your repository in the browser:
     [github.com/thomaspaynejr/personal-website](https://github.com/thomaspaynejr/personal-website)
  2. Click the **Actions** tab along the top navigation bar.
  3. Look at the top workflow run (named after your latest commit).
  4. Confirm both jobs (`Build & Typecheck` and `ESLint Check`) pass with green checkmarks.

#### 9. Media Asset Dropzone (`MediaDropzone.tsx` in `/admin`)
- [ ] **Supabase Storage Upload**:
  - Navigate to `/admin`.
  - In the Article editor, drag and drop an image file (`.png`, `.jpg`, or `.webp`) onto the media dropzone.
  - Confirm the loading spinner shows and the thumbnail preview displays with an `X` delete button.

---

### Part III: Verified & Passing Items (Archive)
- [x] **Turbopack Production Build**: 16 static and dynamic pages compiled with 0 errors.
- [x] **Terminal HUD Agentic AI (`ask <query>`)**: Knowledge queries (tech stack, military, projects, general).
- [x] **Terminal HUD Autocomplete & History**: `Tab` completion and `Up/Down` arrow command history.
- [x] **Terminal Direct CLI Messaging**: `message <msg>` transmission to Supabase admin messages table.
- [x] **Terminal Telemetry Benchmark**: `bench` / `ping` diagnostics.
- [x] **Terminal Background FX Toggles**: `matrix on/off` and `lightning on/off` with state persistence.
- [x] **Terminal Route Navigation**: `goto <route>` jumping to pages.
- [x] **Theme Switching**: Dark / Light mode contrast and dynamic text-background tokens.
- [x] **Top Scroll Progress Bar**: Proportional reading line on main pages.
- [x] **Responsive Mobile Navigation**: Dropdown hamburger menu on mobile screens (< 768px).
- [x] **Journey Feed Search & Filters**: Live search input and `#BUILD`, `#MILESTONE`, `#MILITARY` tag pills.
- [x] **Writing Catalog & RSS**: Article search, reading time badges, and valid `/feed.xml` endpoint.
- [x] **Portfolio Filter Dock**: Search and tech tag filter pills with `FaGithub` brand icons.
- [x] **Portfolio Tech Icon Mouse Tracking**: Infinity distance bug fixed with zero console errors.
- [x] **Admin Route Protection & Metrics**: Role-based access and real-time dashboard analytics cards.
- [x] **Admin Quick Reply**: 1-click `mailto:` email action and message deletion.
- [x] **Robots Endpoint**: `/robots.txt` crawler rules allowing public pages while protecting `/admin` and `/api/`.
- [x] **Dynamic Sitemap (`/sitemap.xml`)**: XML index of all static routes, writing articles, and case studies.

---

### Part IV: Design Direction Choices

1. **Audio Sound Preference**:
   - Which sound profile do you prefer for typing in the HUD?
     - `thock` (dampened mechanical switch - current default)
     - `haptic` (Apple/Linear trackpad tap)
     - `click` (tactile Cherry MX feel)
     - `soft` (whisper pop)

2. **Cursor Style Preference**:
   - Which cursor style feels best in daily use?
     - `dual` (center dot + trailing spring halo)
     - `minimal` (clean single dot without ring)
     - `bracket` (tactical HUD crosshairs)
