import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// Replace these with your Supabase project URL and anon key
const supabaseUrl = 'https://ksbatlwxnhragdrfuhob.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzYmF0bHd4bmhyYWdkcmZ1aG9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MTcyNDIsImV4cCI6MjA1ODk5MzI0Mn0.IDppicT-_xPzAX9NCGWNBk4-f3FuFhX3S7OMF46GVrc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: Platform.OS === 'web' ? localStorage : AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
}); 