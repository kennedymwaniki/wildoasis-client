import { createClient } from "@supabase/supabase-js";

//! the SUPABASE_KEY allows us to bypass row level security and perfrom all operations because our api is only allowed to authenticated users , but the client requires all operations
export const supabase = createClient(
  process.env.supabaseUrl,
  process.env.SUPABASE_KEY
);
