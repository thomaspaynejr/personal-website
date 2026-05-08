'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = await createClient()
  if (!supabase) return redirect('/login?error=' + encodeURIComponent('Supabase not configured'))

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error('Login Error:', error.message, error)
    return redirect('/login?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  if (!supabase) return redirect('/signup?error=' + encodeURIComponent('Supabase not configured'))

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    console.error('Signup Error:', error.message, error)
    return redirect('/signup?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  if (!supabase) return redirect('/profile?error=' + encodeURIComponent('Supabase not configured'))

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string

  const updateData: any = {
    data: { username }
  }

  if (email && email.trim() !== '') {
    updateData.email = email
  }

  if (password && password.trim() !== '') {
    updateData.password = password
  }

  const { error } = await supabase.auth.updateUser(updateData)

  if (error) {
    return redirect('/profile?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/profile')
  return redirect('/profile?success=' + encodeURIComponent('Profile updated successfully. Please check your email for confirmation if you changed it.'))
}

export async function signout() {
  const supabase = await createClient()
  if (supabase) {
    await supabase.auth.signOut()
  }
  revalidatePath('/', 'layout')
  redirect('/')
}
