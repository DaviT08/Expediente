import { PostgrestQueryBuilder, SupabaseClientLike } from './query';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export function getSupabaseClient(): SupabaseClientLike | null {
  if (!isSupabaseConfigured) {
    return null;
  }
  return {
    from: (table: string) => new PostgrestQueryBuilder(supabaseUrl, supabaseAnonKey, table),
  };
}
