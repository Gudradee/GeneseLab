import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Project = {
  id: string;
  name: string;
  description: string;
  participants: string;
  image_url: string | null;
  project_link: string | null;
  created_at: string;
  vote_count?: number;
  user_voted?: boolean;
};
