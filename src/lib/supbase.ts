import { createClient } from "@supabase/supabase-js";


const supabaseURL = import.meta.env.VITE_SUPBASE_PROJECT_URL!;
const supabaseAnonKey = import.meta.env.VITE_ANON_SUPABASE_KEY!;


export const supabase = createClient(supabaseURL, supabaseAnonKey);