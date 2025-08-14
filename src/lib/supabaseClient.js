// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Use Vite envs if present; fall back to your known-good values.
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://mfgrfhediiiopoxtnsqc.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mZ3JmaGVkaWlpb3BveHRuc3FjIiwicm9zZSI6ImFub24iLCJpYXQiOjE3NTUxNTMwMTUsImV4cCI6MjA3MDcyOTAxNX0.dcoQTVg5zpjAej8_xTkzWtu8EAKZCF-WOQq4p07f4f4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
