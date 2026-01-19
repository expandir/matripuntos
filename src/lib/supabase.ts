import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase config:', {
  url: supabaseUrl ? '✓ Configured' : '✗ Missing',
  key: supabaseAnonKey ? '✓ Configured' : '✗ Missing',
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!');
  console.error('VITE_SUPABASE_URL:', supabaseUrl);
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '[PRESENT]' : '[MISSING]');
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: false,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'matripuntos-auth',
    flowType: 'pkce',
  },
  global: {
    headers: {
      'X-Client-Info': 'matripuntos-web',
    },
  },
});

console.log('Supabase client initialized successfully');
