import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function requireAuth() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      redirect('/auth/login')
    }

    return user
  } catch (error) {
    console.error('Auth check failed:', error)
    redirect('/auth/login')
  }
}

export async function requireAdmin() {
  // DEMO MODE: Allow all users to access admin routes
  // Comment out this return to re-enable admin authentication
  return null

  /* PRODUCTION CODE (commented out for demo):
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      redirect('/auth/login')
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (profileError || !profile?.is_admin) {
      redirect('/')
    }

    return user
  } catch (error) {
    console.error('Admin check failed:', error)
    redirect('/')
  }
  */
}

// Helper to safely get user without redirecting
export async function getOptionalUser() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      console.warn('Optional auth check failed:', error.message)
      return null
    }

    return user
  } catch (error) {
    console.warn('Optional auth check error:', error)
    return null
  }
}