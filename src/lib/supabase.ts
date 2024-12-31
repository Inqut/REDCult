import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lnjrbciznlkxbdclbkne.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuanJiY2l6bmxreGJkY2xia25lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2NTY4NjgsImV4cCI6MjA1MTIzMjg2OH0.DQo3adQ_ca1GVTk4gwrAI-rMvks5AaJw-paxlrIOdZE';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Test connection and auth status
export const testConnection = async () => {
  try {
    // Test basic query
    const { data, error } = await supabase.from('profiles').select('count');
    if (error) throw error;

    // Test auth connection
    const { data: session } = await supabase.auth.getSession();
    
    return true;
  } catch (error) {
    console.error('Supabase connection error:', error);
    return false;
  }
};