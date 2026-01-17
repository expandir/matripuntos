import { supabase } from './supabase';

export async function withSessionRefresh<T>(
  operation: () => Promise<T>
): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    if (
      error.message?.includes('Auth session missing') ||
      error.message?.includes('JWT expired') ||
      error.message?.includes('refresh_token')
    ) {
      console.log('Session error detected, attempting refresh...');

      const hasStoredSession = localStorage.getItem('matripuntos-auth');

      if (!hasStoredSession) {
        console.log('No stored session found, cannot refresh');
        throw new Error('Session expired. Please log in again.');
      }

      try {
        const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();

        if (refreshError || !session) {
          console.error('Session refresh failed:', refreshError);
          localStorage.removeItem('matripuntos-auth');
          throw new Error('Session expired. Please log in again.');
        }

        console.log('Session refreshed successfully, retrying operation...');
        return await operation();
      } catch (refreshError) {
        console.error('Failed to refresh session:', refreshError);
        localStorage.removeItem('matripuntos-auth');
        throw new Error('Session expired. Please log in again.');
      }
    }

    throw error;
  }
}

export async function ensureValidSession(): Promise<boolean> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Session error:', error);
      return false;
    }

    if (!session) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error ensuring valid session:', error);
    return false;
  }
}
