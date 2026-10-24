import { PostgrestQueryBuilder, SupabaseClientLike } from './query';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isSupabaseAdminConfigured = Boolean(supabaseUrl && supabaseServiceKey);

export function createAdminClient(): SupabaseClientLike | null {
  if (!isSupabaseAdminConfigured) {
    return null;
  }
  return {
    from: (table: string) => new PostgrestQueryBuilder(supabaseUrl, supabaseServiceKey, table),
  };
}
