# // THOMAS PAYNE PORTFOLIO & PLATFORM
## Production Verification Checklist v2.0 (Post-Hardening)

This updated checklist focuses on newly hardened subsystems, unresolved test items, and strategic roadmap decisions. 
Items previously verified and marked complete have been moved to the **Verified Archive** below.

---

### Part I: Retest Newly Hardened Subsystems (Immediate Priority)

#### 1. Tactile Keystroke Audio in Developer HUD (`Cmd+K`)
*The oscillator was upgraded from inaudible 35Hz sub-bass to an authentic dual-layer mechanical switch sound (1400Hz snap + 260Hz thock) with singleton audio context auto-resume.*
- [ ] **Toggle Confirmation Chimes**:
  - Open HUD (`Cmd+K` or backtick `` ` ``).
  - Click the **Volume** icon in the window header or type `audio on`: Confirm an ascending dual-tone chime (`440Hz` $\rightarrow$ `880Hz`) plays immediately.
  - Click volume icon again or type `audio off`: Confirm a descending chime (`600Hz` $\rightarrow$ `300Hz`) plays.
- [ ] **Audible Typing Clicks**:
  - Turn `audio on` and type in the prompt: Confirm crisp, satisfying mechanical switch clicks on every keystroke through your laptop or desktop speakers.
- [ ] **Persistence Across Reloads**:
  - Refresh the browser, reopen the HUD, and type: Confirm audio state persists from `localStorage` without needing re-activation.

#### 2. Precision Center-Dot Magnetic Cursor (`CustomCursor.tsx`)
*Upgraded to a zero-lag pinpoint center dot tracking exact client coordinates, paired with a fluid spring halo ring.*
- [ ] **Zero-Latency Aiming**: Move your mouse across the screen. Confirm the inner pinpoint dot moves with **0ms lag** exactly beneath your physical cursor.
- [ ] **Hover Expansion**: Hover over links in `<Navbar />`, `<Footer />`, and filter pills. Confirm the outer halo ring scales up (`scale: 1.4`) with smooth accent tinting.
- [ ] **100% Click Accuracy**: Click small buttons and links throughout the site:
  - Visit `/portfolio/personal-website-v2-obsidian-edition`.
  - Click **Live Demo** and **Repository**: Confirm links register and open immediately in a new tab without click-miss offset.

#### 3. Portfolio Tech Icon Stability (`TechIcon.tsx`)
*Fixed Framer Motion Infinity distance calculation on mouse tracking.*
- [ ] **Console Cleanliness**: Open browser DevTools (`Cmd+Option+I` -> Console).
- [ ] Hover over and click between different projects and tech icons on `/portfolio`: Confirm **zero console errors or warnings** are logged.

#### 4. Admin Markdown Studio Smoothness (`AdminMarkdownStudio.tsx`)
*Enhanced with Tab indentation, Cmd shortcuts, and synchronized split-pane scrolling.*
- [ ] **Tab Key Indentation**: Navigate to `/admin` -> Articles. Click in the editor textarea and press `Tab`: Confirm it inserts 2 spaces cleanly without defocusing.
- [ ] **Keyboard Shortcuts**: Select some text in the editor and test:
  - `Cmd+B` (or `Ctrl+B`): Wraps in `**bold**`.
  - `Cmd+I` (or `Ctrl+I`): Wraps in `*italic*`.
  - `Cmd+K` (or `Ctrl+K`): Wraps in `[text](url)`.
- [ ] **Synchronized Scrolling**: In Split mode (`Columns`), scroll the left textarea: Confirm the right preview pane automatically and smoothly scrolls in sync.

---

### Part II: Remaining Feature Verifications

#### 5. Journey Feed Attachments & Lightbox (Located on Home Page `/`)
*Note: These attachments live on the Home page feed (`TimelineDashboard.tsx`), not in the telemetry dashboard or portfolio.*
- [ ] **Expandable Code Snippets**: Scroll down the Home page feed (`/`) to any event with code. Click the code header to expand, and click the copy button to test 1-click clipboard copy with checkmark feedback.
- [ ] **Image Attachments & Lightbox**: Find a timeline event containing an image thumbnail. Click the thumbnail: Confirm animated full-screen Framer Motion lightbox opens. Test closing via the `X` button and `Esc` key.

#### 6. Technical Writing Deep Dive (`/writing/[slug]`)
- [ ] **Table of Contents Scroll-Spy**: Open `/writing/discipline-over-motivation`. Scroll down the article and verify the active heading highlights automatically in the TOC. Click any heading in the TOC to verify smooth anchor scrolling.
- [ ] **Syntax Highlighter (`CodeBlock.tsx`)**: Open `/writing/nextjs-16-async-server-components`. Confirm syntax tokens are cleanly colored, line numbers appear, and the top-right copy button copies code to clipboard.
- [ ] **Article Reading Progress**: Confirm the spring bar at the very top of the screen tracks article reading completion.

#### 7. Media Asset Dropzone (`MediaDropzone.tsx` in `/admin`)
- [ ] **Supabase Drag & Drop**: In `/admin`, drag an image file onto the media dropzone. Confirm upload spinner appears, image uploads to Supabase Storage `hero-images`, and thumbnail preview renders cleanly via `next/image`. Test remove button (`X`).

#### 8. SEO, OpenGraph & Sitemap
- [ ] **Dynamic Sitemap (`/sitemap.xml`)**: Open `http://localhost:3000/sitemap.xml`. Verify static routes (`/`, `/about`, `/portfolio`, `/writing`, `/dashboard`, `/contact`), dynamic writing articles, and portfolio case studies are all indexed with valid XML.
- [ ] **Social Meta Tags**: Right-click on `/` or any article and inspect `<head>`. Confirm `og:title`, `og:description`, `og:image`, and `twitter:card` tags are present.
- [ ] **CI Workflow**: Verify that `.github/workflows/ci.yml` passes on GitHub on pull requests or commits.

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
- [x] **Admin Route Protection & Metrics**: Role-based access and real-time dashboard analytics cards.
- [x] **Admin Quick Reply**: 1-click `mailto:` email action and message deletion.
- [x] **Robots Endpoint**: `/robots.txt` crawler rules allowing public pages while protecting `/admin` and `/api/`.

---

### Part IV: Aesthetic & Strategic Roadmap Decisions

1. **Obsidian Palette & Theme Direction**:
   *You noted you may want to adjust the monochromatic palette.* Which visual aesthetic would you like to explore?
   - **Option A (Titanium & Slate)**: Subtle deep navy/slate undertones (`#0B0E14`, `#151B26`) with ice-blue accents.
   - **Option B (Monokai Pro Obsidian)**: Deep charcoal with selective minimalist neon accents (electric emerald or amber).
   - **Option C (Stealth Carbon)**: Pure matte carbon weaves with bone-white typography.
   - **Option D (Refined Yeezy Grayscale)**: Keep pure monochrome, but soften contrast with warm graphite gradients.

2. **Article Engagement Features**:
   - Would you like to add interactive applause/like counters or view metrics to article deep dives (`/writing/[slug]`)?

3. **Visitor Telemetry Dashboard**:
   - Would you like an anonymous visitor telemetry tracker in `/admin` (tracking daily unique visits and top used CLI commands)?
