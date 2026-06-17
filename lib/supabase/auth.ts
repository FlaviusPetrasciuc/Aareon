import { createClient } from '@/lib/supabase/client';
import { Profile } from './types';

export async function getCurrentUser() {
  const supabase = createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    console.error('Error getting current user:', error);
    return null;
  }
  
  return user;
}

export async function getCurrentUserProfile(): Promise<Profile | null> {
  const supabase = createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    console.error('Error getting current user:', error);
    return null;
  }
  
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('auth_user_id', user.id)
    .single();
  
  if (profileError) {
    console.error('Error getting user profile:', profileError);
    return null;
  }
  
  return profile;
}

export async function getManagerId(): Promise<string | null> {
  const profile = await getCurrentUserProfile();
  return profile?.profile_id || null;
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user;
}

// For development: temporary function to use a hardcoded user
export async function getDevUser() {
  // Replace with your actual auth_user_id from Supabase
  const DEV_AUTH_USER_ID = '19eef69f-eff0-4634-91b9-01cdeb8dd0ad';
  
  const supabase = createClient();
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('auth_user_id', DEV_AUTH_USER_ID)
    .single();
  
  if (error) {
    console.error('Error getting dev user profile:', error);
    return null;
  }
  
  return profile;
}