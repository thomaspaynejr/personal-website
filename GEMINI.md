# GEMINI AGENT RULES // THOMAS PAYNE WEBSITE

This codebase uses an experimental/future version of **Next.js 16**. Standard training data for Next.js 13/14/15 **WILL NOT** always apply.

## // CRITICAL CONVENTIONS

- **[PROXY]** `middleware.ts` is deprecated. Use `proxy.ts` in the root directory.
  - Export a named or default function called `proxy(request: NextRequest)`.
  - Reference: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`.
- **[TYPESCRIPT]** Native HTML elements (like `<label>`) are strictly typed. Do not pass custom non-standard attributes (e.g., `underline`) directly to them; use `className` with Tailwind instead.
- **[BUILD]** The `npm run dev` script runs in the background (`&`). If the process persists after closing the terminal, find and kill the PID (usually port 3000/3001) using `lsof -i :3000`.
- **[TURBOPACK]** Avoid experimental CSS features like `animation-timeline: scroll()`. They can cause Turbopack to panic (crash). Use `framer-motion` (`useScroll`) for scroll-linked animations instead.
- **[GIT]** After every successful change and verification, automatically stage, commit, and push the updates to the GitHub repository. Use concise, descriptive commit messages following the Conventional Commits standard.
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

## // DATABASE SCHEMA (DEPLOYED)

- **`profiles`**: User metadata (username, block status). Extended from `auth.users`.
- **`portfolio_projects`**: Public projects. Fields: `title`, `description`, `tech` (array), `demo_url`, `source_url`.
- **`tracker_projects`**: Internal/Active tracking. Fields: `name`, `status` (Enum), `progress`, `description`.
- **`timeline_events`**: The Journey feed. Fields: `date`, `title`, `description`, `icon_type`.
- **`timeline_likes/comments`**: Engagement metrics linked to timeline events.
- **`contact_messages`**: Secure storage for contact form submissions.

### Security Model
- **Admin Role:** Defined in `auth.users.raw_user_meta_data -> 'role' = 'admin'`.
- **RLS:** Public read-only for content; Admin full access; Authenticated engagement (likes/comments).
- **Status:** Schema applied to Supabase on May 8, 2026.

---
*Maintained by Gemini for Thomas Payne.*
