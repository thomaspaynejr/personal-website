'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function checkAdmin() {
  const supabase = await createClient()
  if (!supabase) return false
  
  const { data: { user } } = await supabase.auth.getUser()
  return user?.user_metadata?.role === 'admin'
}

// --- Portfolio Project Actions ---

export async function upsertPortfolioProject(formData: FormData) {
  const isAdmin = await checkAdmin()
  if (!isAdmin) return { error: 'Unauthorized' }

  const supabase = await createClient()
  if (!supabase) return { error: 'Database connection failed' }

  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const tech = (formData.get('tech') as string).split(',').map(t => t.trim())
  const demo_url = formData.get('demo_url') as string
  const source_url = formData.get('source_url') as string
  const display_order = parseInt(formData.get('display_order') as string || '0')

  const data = { title, description, tech, demo_url, source_url, display_order }

  let error;
  if (id) {
    ({ error } = await supabase.from('portfolio_projects').update(data).eq('id', id))
  } else {
    ({ error } = await supabase.from('portfolio_projects').insert([data]))
  }

  if (error) return { error: error.message }

  revalidatePath('/portfolio')
  revalidatePath('/admin')
  return { success: true }
}

export async function deletePortfolioProject(id: string) {
  const isAdmin = await checkAdmin()
  if (!isAdmin) return { error: 'Unauthorized' }

  const supabase = await createClient()
  if (!supabase) return { error: 'Database connection failed' }

  const { error } = await supabase.from('portfolio_projects').delete().eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/portfolio')
  revalidatePath('/admin')
  return { success: true }
}

// --- Tracker Project Actions ---

export async function upsertTrackerProject(formData: FormData) {
  const isAdmin = await checkAdmin()
  if (!isAdmin) return { error: 'Unauthorized' }

  const supabase = await createClient()
  if (!supabase) return { error: 'Database connection failed' }

  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const status = formData.get('status') as string
  const progress = parseInt(formData.get('progress') as string || '0')

  const data = { name, description, status, progress }

  let error;
  if (id) {
    ({ error } = await supabase.from('tracker_projects').update(data).eq('id', id))
  } else {
    ({ error } = await supabase.from('tracker_projects').insert([data]))
  }

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/admin')
  return { success: true }
}

export async function deleteTrackerProject(id: string) {
  const isAdmin = await checkAdmin()
  if (!isAdmin) return { error: 'Unauthorized' }

  const supabase = await createClient()
  if (!supabase) return { error: 'Database connection failed' }

  const { error } = await supabase.from('tracker_projects').delete().eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/admin')
  return { success: true }
}

// --- Timeline Actions (Refined) ---

export async function upsertTimelineEvent(formData: FormData) {
  const isAdmin = await checkAdmin()
  if (!isAdmin) return { error: 'Unauthorized' }

  const supabase = await createClient()
  if (!supabase) return { error: 'Database connection failed' }

  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const date = formData.get('date') as string
  const icon_type = formData.get('icon_type') as string || 'clock'

  const data = { title, description, date, icon_type }

  let error;
  if (id) {
    ({ error } = await supabase.from('timeline_events').update(data).eq('id', id))
  } else {
    ({ error } = await supabase.from('timeline_events').insert([data]))
  }

  if (error) return { error: error.message }

  revalidatePath('/')
  revalidatePath('/admin')
  return { success: true }
}

export async function setUserBlockStatus(userId: string, isBlocked: boolean) {
  const isAdmin = await checkAdmin()
  if (!isAdmin) return { error: 'Unauthorized' }

  const supabase = await createClient()
  if (!supabase) return { error: 'Database connection failed' }

  const { error } = await supabase
    .from('profiles')
    .update({ is_blocked: isBlocked })
    .eq('id', userId)

  if (error) return { error: error.message }

  revalidatePath('/admin')
  return { success: true }
}

export async function deleteTimelineEvent(id: string) {
  const isAdmin = await checkAdmin()
  if (!isAdmin) return { error: 'Unauthorized' }

  const supabase = await createClient()
  if (!supabase) return { error: 'Database connection failed' }

  const { error } = await supabase
    .from('timeline_events')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/')
  revalidatePath('/admin')
  return { success: true }
}
