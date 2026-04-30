import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/^"|"$/g, '');
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.replace(/^"|"$/g, '');

export const createClient = () => {
  if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase credentials missing");
    return null as any;
  }
  return createBrowserClient(
    supabaseUrl,
    supabaseKey,
  );
};
