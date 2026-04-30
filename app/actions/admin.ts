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

export async function updateTimelineEvent(formData: FormData) {
  const isAdmin = await checkAdmin()
  if (!isAdmin) return { error: 'Unauthorized' }

  const supabase = await createClient()
  if (!supabase) return { error: 'Database connection failed' }

  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const date = formData.get('date') as string

  const { error } = await supabase
    .from('timeline_events')
    .update({ title, description, date })
    .eq('id', id)

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
