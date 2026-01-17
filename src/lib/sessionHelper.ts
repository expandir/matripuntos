import { supabase } from './supabase';

export async function checkSession(): Promise<boolean> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Session error:', error);
      return false;
    }

    return session !== null;
  } catch (error) {
    console.error('Error checking session:', error);
    return false;
  }
}

export async function ensureSession(): Promise<void> {
  const hasSession = await checkSession();

  if (!hasSession) {
    throw new Error('No active session. Please log in again.');
  }
}
