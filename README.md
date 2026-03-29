# THOMAS PAYNE // PERSONAL DASHBOARD & AUTHENTICATED TIMELINE

An ultra-minimalist, high-contrast developer hub built with **Next.js 16**, **Supabase**, and **Framer Motion**. Optimized for performance, technical discipline, and a deep monochromatic "Yeezy-inspired" aesthetic.

## // CORE SYSTEMS

- **[AUTH]** Secure user authentication system via Supabase Auth (Sign Up / Login / Persistent Sessions).
- **[DASHBOARD]** Live project tracker monitoring build progress with animated status indicators.
- **[TIMELINE]** Interactive "Journey Feed" with persistent likes and threaded comments for authenticated users.
- **[ANIMATION]** Premium staggered reveals and section transitions powered by Framer Motion.
- **[UX]** Custom minimalist ring cursor and horizontal scroll progress bar.

## // TECH STACK

- **Framework:** Next.js 16 (App Router)
- **Database/Auth:** Supabase (PostgreSQL + Auth)
- **Styling:** Tailwind CSS 4 (Grayscale Obsidian Palette)
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Typography:** JetBrains Mono

## // LOCAL SETUP

1. **Clone & Install:**
   ```bash
   git clone https://github.com/[USERNAME]/personal-website.git
   npm install
   ```

2. **Environment Configuration:**
   Create a `.env.local` file with your Supabase credentials:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

3. **Database Initialization:**
   Run the SQL schema provided in the documentation to initialize `projects`, `timeline_events`, and `timeline_comments` tables.

## // ARCHITECTURAL NOTES

- **Middleware:** Uses standard `middleware.ts` for session handling.
- **Components:** Hybrid architecture with Server Components for data fetching and Client Components for interactivity.
- **Design:** Strict monochromatic ethos focusing on #000000 (Black), #1A1A1A (Charcoal), and #DEDEDE (Stone).

---
*Built with code and discipline by Thomas Payne.*
