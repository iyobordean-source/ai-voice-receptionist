import { createClient } from "@supabase/supabase-js";

const viteEnv = import.meta.env ?? {};
const runtimeEnv = typeof process === "undefined" ? {} : process.env;

const supabaseUrl =
  viteEnv.VITE_SUPABASE_URL ?? runtimeEnv.VITE_SUPABASE_URL;
const supabaseAnonKey =
  viteEnv.VITE_SUPABASE_ANON_KEY ?? runtimeEnv.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
