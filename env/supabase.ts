import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://sibwwmiezbbzfutxzqgv.supabase.co'; // <-- your Project URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpYnd3bWllemJiemZ1dHh6cWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxNDI1MTEsImV4cCI6MjA2NDcxODUxMX0.7jIOW0-BecR72-vzNPEfgMMnwRQaoXbveaICm822J1Q'; // <-- your anon public key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);