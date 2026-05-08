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

## 5. UI Updates
- **Update:** Updated the Navbar link from "LOGIN" to "LOGIN (JOIN)" to better reflect account creation availability.
