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
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession();

    if (error) {
      console.error('Session refresh error:', error);
      throw new Error('No active session. Please log in again.');
    }

    if (!session) {
      throw new Error('No active session. Please log in again.');
    }
  } catch (error: any) {
    console.error('Error ensuring session:', error);
    throw new Error('No active session. Please log in again.');
  }
}
