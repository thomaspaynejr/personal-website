import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project-id')) {
    console.warn("Supabase credentials missing or invalid. Auth will not work.")
    return null as any;
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}
