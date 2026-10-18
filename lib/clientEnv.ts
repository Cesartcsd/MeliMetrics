type PublicClientEnv = {
  supabaseUrl: string | null;
  supabaseAnonKey: string | null;
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? '';

if ((supabaseUrl && !supabaseAnonKey) || (!supabaseUrl && supabaseAnonKey)) {
  throw new Error('VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY devem ser configuradas juntas.');
}

export const clientEnv: PublicClientEnv = Object.freeze({
  supabaseUrl: supabaseUrl || null,
  supabaseAnonKey: supabaseAnonKey || null,
});
