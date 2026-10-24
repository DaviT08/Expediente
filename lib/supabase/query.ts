export interface SupabaseResponse<T = unknown> {
  data: T | null;
  error: { message: string } | null;
}

export class PostgrestQueryBuilder {
  private url: string;
  private key: string;
  private table: string;
  private selectCols: string = '*';
  private filters: string[] = [];
  private orderClause: string = '';
  private limitCount?: number;
  private offsetCount?: number;
  private onConflict?: string;
  private isMaybeSingle: boolean = false;
  private isSingle: boolean = false;
  private method: string = 'GET';
  private body?: unknown;
  private preferHeader?: string;

  constructor(supabaseUrl: string, supabaseKey: string, table: string) {
    this.url = supabaseUrl.replace(/\/$/, '');
    this.key = supabaseKey;
    this.table = table;
  }

  select(columns: string = '*') {
    this.selectCols = columns.replace(/\s+/g, '');
    this.method = 'GET';
    return this;
  }

  eq(column: string, value: string | number | boolean) {
    this.filters.push(`${column}=eq.${encodeURIComponent(String(value))}`);
    return this;
  }

  ilike(column: string, pattern: string) {
    this.filters.push(`${column}=ilike.${encodeURIComponent(pattern)}`);
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    const dir = options?.ascending === false ? 'desc' : 'asc';
    this.orderClause = `order=${column}.${dir}`;
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  offset(count: number) {
    this.offsetCount = count;
    return this;
  }

  maybeSingle() {
    this.isMaybeSingle = true;
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  upsert(record: Record<string, unknown> | Array<Record<string, unknown>>, options?: { onConflict?: string }) {
    this.method = 'POST';
    this.body = record;
    // No PostgREST, on_conflict vai na URL (não no cabeçalho Prefer).
    this.preferHeader = 'resolution=merge-duplicates,return=minimal';
    this.onConflict = options?.onConflict;
    return this;
  }

  delete() {
    this.method = 'DELETE';
    return this;
  }

  async then<TResult1 = SupabaseResponse, TResult2 = never>(
    onfulfilled?: ((value: SupabaseResponse) => TResult1 | PromiseLike<TResult1>) | null,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    try {
      const queryParts: string[] = [];
      if (this.method === 'GET') {
        queryParts.push(`select=${this.selectCols}`);
      }
      for (const f of this.filters) {
        queryParts.push(f);
      }
      if (this.orderClause) {
        queryParts.push(this.orderClause);
      }
      if (this.limitCount !== undefined) {
        queryParts.push(`limit=${this.limitCount}`);
      }
      if (this.offsetCount !== undefined) {
        queryParts.push(`offset=${this.offsetCount}`);
      }
      if (this.method === 'POST' && this.onConflict) {
        queryParts.push(`on_conflict=${encodeURIComponent(this.onConflict)}`);
      }

      const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
      const endpoint = `${this.url}/rest/v1/${this.table}${queryString}`;

      const headers: Record<string, string> = {
        apikey: this.key,
        Authorization: `Bearer ${this.key}`,
        'Content-Type': 'application/json',
      };
      if (this.preferHeader) {
        headers['Prefer'] = this.preferHeader;
      }

      const res = await fetch(endpoint, {
        method: this.method,
        headers,
        body: this.body ? JSON.stringify(this.body) : undefined,
        cache: 'no-store',
      });

      if (!res.ok) {
        const errText = await res.text();
        const result: SupabaseResponse = { data: null, error: { message: errText || res.statusText } };
        return onfulfilled ? onfulfilled(result) : (result as unknown as TResult1);
      }

      if (res.status === 204) {
        const result: SupabaseResponse = { data: null, error: null };
        return onfulfilled ? onfulfilled(result) : (result as unknown as TResult1);
      }

      const text = await res.text();
      const json = text ? JSON.parse(text) : null;
      let data = json;
      if (this.isMaybeSingle || this.isSingle) {
        data = Array.isArray(json) ? json[0] ?? null : json;
      }

      const result: SupabaseResponse = { data, error: null };
      return onfulfilled ? onfulfilled(result) : (result as unknown as TResult1);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro na requisição ao Supabase';
      const result: SupabaseResponse = { data: null, error: { message } };
      return onfulfilled ? onfulfilled(result) : (result as unknown as TResult1);
    }
  }
}

export interface SupabaseClientLike {
  from: (table: string) => PostgrestQueryBuilder;
}
