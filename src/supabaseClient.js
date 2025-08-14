import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mfgrfhediiiopoxtnsqc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mZ3JmaGVkaWlpb3BveHRuc3FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNTMwMTUsImV4cCI6MjA3MDcyOTAxNX0.dcoQTVg5zpjAej8_xTkzWtu8EAKZCF-WOQq4p07f4f4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
