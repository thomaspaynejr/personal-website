'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * TIMELINE ENGAGEMENT
 */

export async function toggleTimelineLike(eventId: string) {
  const supabase = await createClient()
  if (!supabase) return { error: 'Database connection failed' }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Authentication required' }

  // Check if like exists
  const { data: existingLike, error: fetchError } = await supabase
    .from('timeline_likes')
    .select('id')
    .eq('event_id', eventId)
    .eq('user_id', user.id)
    .single()

  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    return { error: fetchError.message }
  }

  if (existingLike) {
    // Unlike
    const { error: deleteError } = await supabase
      .from('timeline_likes')
      .delete()
      .eq('id', existingLike.id)
    
    if (deleteError) return { error: deleteError.message }
  } else {
    // Like
    const { error: insertError } = await supabase
      .from('timeline_likes')
      .insert([{ event_id: eventId, user_id: user.id }])
    
    if (insertError) return { error: insertError.message }
  }

  revalidatePath('/')
  return { success: true }
}

export async function postTimelineComment(eventId: string, text: string) {
  const supabase = await createClient()
  if (!supabase) return { error: 'Database connection failed' }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Authentication required' }

  if (!text || text.trim() === '') return { error: 'Comment text is required' }

  const { error } = await supabase
    .from('timeline_comments')
    .insert([{ 
      event_id: eventId, 
      user_id: user.id, 
      text: text.trim() 
    }])

  if (error) return { error: error.message }

  revalidatePath('/')
  return { success: true }
}

export async function deleteTimelineComment(commentId: string) {
  const supabase = await createClient()
  if (!supabase) return { error: 'Database connection failed' }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Authentication required' }

  // RLS will handle permission (user can only delete their own comments unless admin)
  const { error } = await supabase
    .from('timeline_comments')
    .delete()
    .eq('id', commentId)

  if (error) return { error: error.message }

  revalidatePath('/')
  return { success: true }
}

/**
 * CONTACT FORM
 */

export async function sendContactMessage(formData: FormData) {
  const supabase = await createClient()
  if (!supabase) return { error: 'Database connection failed' }

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const message = formData.get('message') as string

  if (!name || !email || !message) {
    return { error: 'All fields are required' }
  }

  const { error } = await supabase
    .from('contact_messages')
    .insert([{ name, email, message }])

  if (error) return { error: error.message }

  return { success: true }
}
