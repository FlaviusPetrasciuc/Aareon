'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Admin client to check allowed_users / profiles (bypasses RLS)
function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function signIn(formData: FormData) {
  const supabase = await createClient()
  const admin = getAdminClient()

  const email = (formData.get('email') as string).trim().toLowerCase()
  const password = formData.get('password') as string

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Look up the user's role from profiles
  const { data: profile, error: profileError } = await admin
    .from('profiles')
    .select('role')
    .eq('auth_user_id', data.user.id)
    .single()

  if (profileError || !profile) {
    return { error: 'No profile found for this account' }
  }

  revalidatePath('/', 'layout')

  if (profile.role === 'director') {
    redirect('/director-dashboard')
  } else {
    redirect('/manager-dashboard')
  }
}

export async function signUp(formData: FormData) {
  const supabase = await createClient()
  const admin = getAdminClient()

  const email = (formData.get('email') as string).trim().toLowerCase()
  const password = formData.get('password') as string
  const origin = formData.get('origin') as string

  // Check the email is in the allowed list and get its role
  const { data: allowedUser, error: allowedError } = await admin
    .from('allowed_users')
    .select('email, role')
    .eq('email', email)
    .single()

  if (allowedError || !allowedUser) {
    return { error: 'This email is not authorised to register.' }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Create the profile linked to this auth user with the correct role
  if (data.user) {
    const { error: profileError } = await admin
      .from('profiles')
      .insert({
        auth_user_id: data.user.id,
        email,
        role: allowedUser.role,
      })

    if (profileError) {
      console.error('Profile creation error:', profileError)
      return { error: 'Account created but profile setup failed. Contact support.' }
    }
  }

  return { success: 'Check your email for the confirmation link.' }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
