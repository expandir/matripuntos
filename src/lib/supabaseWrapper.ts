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
      error.message?.includes('JWT claims invalid') ||
      error.message?.includes('session_not_found')
    ) {
      console.log('Session error detected, attempting refresh...');

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

    if (error || !session) {
      console.log('No valid session, attempting refresh...');
      const { data: { session: newSession }, error: refreshError } = await supabase.auth.refreshSession();

      if (refreshError || !newSession) {
        console.error('Session refresh failed:', refreshError);
        localStorage.removeItem('matripuntos-auth');
        return false;
      }

      console.log('Session refreshed successfully');
      return true;
    }

    return true;
  } catch (error) {
    console.error('Error ensuring valid session:', error);
    return false;
  }
}
