// ============================================================
// Sunroom — Root Layout
// ============================================================
// Initializes Supabase, wraps the app in AuthProvider, and
// handles role-based routing to the correct experience.
// ============================================================

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { initSupabase } from '@sunroom/supabase-client';
import { AuthProvider } from '../lib/auth-context';
import { Platform } from 'react-native';

// Initialize Supabase singleton at module load time
// EXPO_PUBLIC_ env vars are available via process.env in Expo
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Platform-specific storage adapter
// On web, use localStorage. On native, we'd use expo-secure-store.
const storageAdapter = Platform.OS === 'web'
  ? {
      getItem: async (key: string) => localStorage.getItem(key),
      setItem: async (key: string, value: string) => localStorage.setItem(key, value),
      removeItem: async (key: string) => localStorage.removeItem(key),
    }
  : undefined; // Will use Supabase's default AsyncStorage on native

initSupabase({
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
  storage: storageAdapter,
});

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      />
    </AuthProvider>
  );
}
