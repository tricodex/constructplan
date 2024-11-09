import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { type Database } from './database.types';

export const createClient = async () => {
  const cookieStore = await cookies(); // Await the Promise
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options) {
          cookieStore.set(name, value, options);
        },
        remove(name: string) {
          cookieStore.delete(name);
        },
      },
    }
  );
};
