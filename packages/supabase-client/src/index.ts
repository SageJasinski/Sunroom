// ============================================================
// Sunroom — Supabase Client
// ============================================================
// This module provides the singleton Supabase client and
// typed helpers for database operations.
//
// Storage adapter will be injected by the consuming app
// (expo-secure-store on mobile, localStorage on web).
// ============================================================

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

let client: SupabaseClient<Database> | null = null;

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  storage?: {
    getItem: (key: string) => Promise<string | null>;
    setItem: (key: string, value: string) => Promise<void>;
    removeItem: (key: string) => Promise<void>;
  };
}

/**
 * Initialize the Supabase client singleton.
 * Call this once at app startup.
 */
export function initSupabase(config: SupabaseConfig): SupabaseClient<Database> {
  if (client) return client;

  client = createClient<Database>(config.url, config.anonKey, {
    auth: {
      storage: config.storage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false, // Required for React Native
    },
  });

  return client;
}

/**
 * Get the initialized Supabase client.
 * Throws if called before initSupabase().
 */
export function getSupabase(): SupabaseClient<Database> {
  if (!client) {
    throw new Error(
      'Supabase client not initialized. Call initSupabase() first.'
    );
  }
  return client;
}

// Re-export types for convenience
export type { Database } from './database.types';
export type { SupabaseClient } from '@supabase/supabase-js';
