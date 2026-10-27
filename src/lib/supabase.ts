// ============================================================
// Mock Supabase Client — In-memory store, zero external dependencies
// Fully mimics Supabase JS v2 client interface
// ============================================================
import { User, Ride, Booking, Review } from '@/types';
import { mockUsers, mockRides, mockBookings, mockReviews } from './mock-data';

// In-memory database tables
export interface DatabaseSchema {
  users: User[];
  rides: Ride[];
  bookings: Booking[];
  reviews: Review[];
}

const db: DatabaseSchema = {
  users: [...mockUsers],
  rides: [...mockRides],
  bookings: [...mockBookings],
  reviews: [...mockReviews],
};

let currentUser: User | null = null;

// Safe UUID generator compatible across all browsers, secure and non-secure contexts (HTTP/IP)
function generateId(prefix = 'id'): string {
  try {
    if (
      typeof window !== 'undefined' &&
      window.isSecureContext &&
      typeof crypto !== 'undefined' &&
      typeof crypto.randomUUID === 'function'
    ) {
      return crypto.randomUUID();
    }
  } catch {
    // Non-secure context or crypto error, use fallback
  }

  // Pure JavaScript UUID v4 fallback (100% reliable in HTTP / mobile / network IP contexts)
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
  return `${prefix}_${uuid}`;
}

// ---- Auth ----
export const supabaseAuth = {
  async signUp({
    email,
    password,
    options,
  }: {
    email: string;
    password?: string;
    options?: { data?: Partial<User> };
  }) {
    void password;
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { data: { user: null }, error: { message: 'Enter a valid email address.' } };
    }

    const existing = db.users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) return { data: { user: null }, error: { message: 'Email already registered. Please sign in.' } };

    const isEduDomain =
      cleanEmail.endsWith('.edu') ||
      cleanEmail.endsWith('.edu.in') ||
      cleanEmail.endsWith('.ac.in') ||
      cleanEmail.includes('@campus.') ||
      cleanEmail.includes('@university.') ||
      cleanEmail.includes('@college.') ||
      cleanEmail.includes('@student.');

    const newUser: User = {
      id: generateId('user'),
      email: cleanEmail,
      full_name: options?.data?.full_name || cleanEmail.split('@')[0],
      phone: options?.data?.phone || '',
      college_id: options?.data?.college_id || `STU${Math.floor(1000 + Math.random() * 9000)}`,
      role: options?.data?.role || 'rider',
      vehicle_type: options?.data?.vehicle_type ?? null,
      vehicle_number: options?.data?.vehicle_number ?? null,
      rating: 5.0,
      is_verified: isEduDomain,
      created_at: new Date().toISOString(),
    };

    db.users.push(newUser);
    currentUser = newUser;

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('cc_user', JSON.stringify(newUser));
      } catch {
        // Safe fallback for restricted storage environments
      }
    }
    return { data: { user: newUser }, error: null };
  },

  async signInWithPassword({ email, password }: { email: string; password?: string }) {
    void password;
    const cleanEmail = (email || '').trim().toLowerCase();
    const user = db.users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) return { data: { user: null }, error: { message: 'Invalid email or password.' } };
    currentUser = user;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('cc_user', JSON.stringify(user));
      } catch {
        // Safe fallback for restricted storage environments
      }
    }
    return { data: { user }, error: null };
  },

  async signOut() {
    currentUser = null;
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('cc_user');
      } catch {
        // Safe fallback
      }
    }
    return { error: null };
  },

  async getUser() {
    if (currentUser) return { data: { user: currentUser }, error: null };
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('cc_user');
        if (stored) {
          currentUser = JSON.parse(stored);
          return { data: { user: currentUser }, error: null };
        }
      } catch {
        // ignore parsing/storage errors
      }
    }
    return { data: { user: null }, error: null };
  },

  onAuthStateChange(callback: (event: string, session: { user: User | null } | null) => void) {
    if (currentUser) {
      callback('SIGNED_IN', { user: currentUser });
    }
    return {
      data: {
        subscription: {
          unsubscribe: () => {},
        },
      },
    };
  },
};

// ---- Generic query builders ----
export type TableName = keyof DatabaseSchema;

export class QueryBuilder<T extends object> {
  private table: T[];
  private filters: Array<(row: T) => boolean> = [];
  private orderField: keyof T | null = null;
  private orderAsc = true;
  private limitCount: number | null = null;
  private singleRow = false;

  constructor(table: T[]) {
    this.table = table;
  }

  select(columns?: string) {
    void columns;
    return this;
  }

  eq(field: keyof T, value: unknown) {
    this.filters.push(row => row[field] === value);
    return this;
  }

  neq(field: keyof T, value: unknown) {
    this.filters.push(row => row[field] !== value);
    return this;
  }

  gte(field: keyof T, value: unknown) {
    this.filters.push(row => (row[field] as number) >= (value as number));
    return this;
  }

  lte(field: keyof T, value: unknown) {
    this.filters.push(row => (row[field] as number) <= (value as number));
    return this;
  }

  gt(field: keyof T, value: unknown) {
    this.filters.push(row => (row[field] as number) > (value as number));
    return this;
  }

  lt(field: keyof T, value: unknown) {
    this.filters.push(row => (row[field] as number) < (value as number));
    return this;
  }

  in(field: keyof T, values: unknown[]) {
    this.filters.push(row => values.includes(row[field]));
    return this;
  }

  order(field: keyof T, options?: { ascending?: boolean }) {
    this.orderField = field;
    this.orderAsc = options?.ascending !== false;
    return this;
  }

  limit(n: number) {
    this.limitCount = n;
    return this;
  }

  single() {
    this.singleRow = true;
    return this;
  }

  async then(resolve: (result: { data: T | T[] | null; error: null | { message: string } }) => void) {
    let results = this.table.filter(row => this.filters.every(f => f(row)));
    if (this.orderField) {
      const field = this.orderField;
      results = results.slice().sort((a, b) => {
        const valA = a[field];
        const valB = b[field];
        if (valA < valB) return this.orderAsc ? -1 : 1;
        if (valA > valB) return this.orderAsc ? 1 : -1;
        return 0;
      });
    }
    if (this.limitCount !== null) results = results.slice(0, this.limitCount);
    if (this.singleRow) {
      resolve({ data: results[0] || null, error: null });
    } else {
      resolve({ data: results, error: null });
    }
  }
}

export class InsertBuilder<T extends object> {
  constructor(private table: T[], private rows: T | T[]) {}
  select(columns?: string) {
    void columns;
    return this;
  }
  single() {
    return this;
  }
  async then(resolve: (result: { data: T | T[] | null; error: null }) => void) {
    const items = Array.isArray(this.rows) ? this.rows : [this.rows];
    items.forEach(item => this.table.push(item));
    resolve({ data: Array.isArray(this.rows) ? items : items[0], error: null });
  }
}

export class UpdateBuilder<T extends object> {
  private filters: Array<(row: T) => boolean> = [];
  constructor(private table: T[], private updates: Partial<T>) {}

  eq(field: keyof T, value: unknown) {
    this.filters.push(row => row[field] === value);
    return this;
  }

  select(columns?: string) {
    void columns;
    return this;
  }

  async then(resolve: (result: { data: T[]; error: null }) => void) {
    const updated: T[] = [];
    this.table.forEach((row, i) => {
      if (this.filters.every(f => f(row))) {
        Object.assign(this.table[i], this.updates);
        updated.push(this.table[i]);
      }
    });
    resolve({ data: updated, error: null });
  }
}

export class DeleteBuilder<T extends object> {
  private filters: Array<(row: T) => boolean> = [];
  constructor(private table: T[]) {}

  eq(field: keyof T, value: unknown) {
    this.filters.push(row => row[field] === value);
    return this;
  }

  async then(resolve: (result: { data: T[]; error: null }) => void) {
    const deleted: T[] = [];
    for (let i = this.table.length - 1; i >= 0; i--) {
      if (this.filters.every(f => f(this.table[i]))) {
        deleted.push(this.table.splice(i, 1)[0]);
      }
    }
    resolve({ data: deleted, error: null });
  }
}

// ---- Main Supabase Client interface ----
export const supabase = {
  auth: supabaseAuth,

  from<T extends TableName>(tableName: T) {
    type Row = DatabaseSchema[T][number];
    const table = (db[tableName] || []) as unknown as Row[];
    return {
      select: (columns?: string) => {
        const qb = new QueryBuilder<Row>(table);
        qb.select(columns);
        return qb;
      },
      insert: (rows: Row | Row[]) => new InsertBuilder<Row>(table, rows),
      update: (updates: Partial<Row>) => new UpdateBuilder<Row>(table, updates),
      delete: () => new DeleteBuilder<Row>(table),
    };
  },

  channel(name: string) {
    void name;
    return {
      on(_event: string, _filter: unknown, callback: (payload: unknown) => void) {
        void _event;
        void _filter;
        void callback;
        return this;
      },
      subscribe(callback?: (status: string) => void) {
        if (callback) callback('SUBSCRIBED');
        return {
          unsubscribe: () => {},
        };
      },
    };
  },

  storage: {
    from(bucket: string) {
      void bucket;
      return {
        upload: async (path: string, file: unknown) => {
          void path;
          void file;
          return { data: { path }, error: null };
        },
        getPublicUrl: (path: string) => ({
          data: { publicUrl: `/uploads/${path}` },
        }),
      };
    },
  },

  // Direct database access for admin inspection and testing
  _db: db,
};

export default supabase;
