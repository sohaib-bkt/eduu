import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
    console.error(
        'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Add them to .env locally or to your hosting provider, then rebuild.'
    );
}

export const supabase = createClient(
    supabaseUrl ?? '',
    supabaseAnonKey ?? ''
);
