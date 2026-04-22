# GEMINI AGENT RULES // THOMAS PAYNE WEBSITE

This codebase uses an experimental/future version of **Next.js 16**. Standard training data for Next.js 13/14/15 **WILL NOT** always apply.

## // CRITICAL CONVENTIONS

- **[PROXY]** `middleware.ts` is deprecated. Use `proxy.ts` in the root directory.
  - Export a named or default function called `proxy(request: NextRequest)`.
  - Reference: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`.
- **[TYPESCRIPT]** Native HTML elements (like `<label>`) are strictly typed. Do not pass custom non-standard attributes (e.g., `underline`) directly to them; use `className` with Tailwind instead.
- **[BUILD]** The `npm run dev` script runs in the background (`&`). If the process persists after closing the terminal, find and kill the PID (usually port 3000/3001) using `lsof -i :3000`.

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

---
*Maintained by Gemini for Thomas Payne.*
