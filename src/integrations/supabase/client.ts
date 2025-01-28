import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://mgpdjmnscmscxausdlgk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ncGRqbW5zY21zY3hhdXNkbGdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4MTAzNzEsImV4cCI6MjA1MjM4NjM3MX0.x4KKA9_Ykg8XujjOtXvkCTqyE1SLyto5T3bVLhoIFGw";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
});