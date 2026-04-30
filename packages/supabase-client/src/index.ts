// ============================================================
// Sunroom — Supabase Client
// ============================================================
// Singleton Supabase client + auth helpers.
// Storage adapter injected at init (expo-secure-store / localStorage).
// ============================================================

import { createClient, type SupabaseClient, type Session, type User } from '@supabase/supabase-js';
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

// ---- Auth Helpers ----

/**
 * Sign up a new user with email/password.
 * Also creates their profile row.
 */
export async function signUp(email: string, password: string, displayName: string) {
  const sb = getSupabase();

  const { data: authData, error: authError } = await sb.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
    },
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error('Sign up failed: no user returned');

  // Create user row
  const { error: profileError } = await sb.from('users').insert({
    id: authData.user.id,
    display_name: displayName,
  });

  if (profileError) throw profileError;

  return authData;
}

/**
 * Sign in with email/password.
 */
export async function signIn(email: string, password: string) {
  const sb = getSupabase();
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  const sb = getSupabase();
  const { error } = await sb.auth.signOut();
  if (error) throw error;
}

/**
 * Get the current session.
 */
export async function getSession(): Promise<Session | null> {
  const sb = getSupabase();
  const { data: { session } } = await sb.auth.getSession();
  return session;
}

/**
 * Generate a random hex invite code (12 characters = 6 bytes).
 */
function generateInviteCode(): string {
  const bytes = new Uint8Array(6);
  // crypto.getRandomValues works in both browser and React Native
  if (typeof globalThis.crypto !== 'undefined' && globalThis.crypto.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    // Fallback: Math.random (less secure, but works everywhere)
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Create a new family and set the current user as admin.
 */
export async function createFamily(familyName: string) {
  const sb = getSupabase();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Generate invite code client-side (pgcrypto may not be available on remote DB)
  const inviteCode = generateInviteCode();

  // Create family
  const { data: family, error: familyError } = await sb
    .from('families')
    .insert({ name: familyName, invite_code: inviteCode })
    .select()
    .single();

  if (familyError) throw familyError;

  // Add current user as admin
  const { error: memberError } = await sb.from('family_members').insert({
    family_id: family.id,
    user_id: user.id,
    role: 'admin',
    is_trusted_caller: true, // Admin is trusted by default
  });

  if (memberError) throw memberError;

  return family;
}

/**
 * Join an existing family using an invite code.
 */
export async function joinFamily(inviteCode: string) {
  const sb = getSupabase();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Look up family by invite code
  const { data: family, error: lookupError } = await sb
    .from('families')
    .select('id, name')
    .eq('invite_code', inviteCode.trim().toLowerCase())
    .single();

  if (lookupError || !family) throw new Error('Invalid invite code');

  // Add user as member
  const { error: joinError } = await sb.from('family_members').insert({
    family_id: family.id,
    user_id: user.id,
    role: 'member',
    is_trusted_caller: false,
  });

  if (joinError) throw joinError;

  return family;
}

/**
 * Get the current user's family membership (role, family info).
 * Returns the most recent membership if the user belongs to multiple families.
 */
export async function getMyMembership() {
  const sb = getSupabase();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null;

  const { data, error } = await sb
    .from('family_members')
    .select(`
      role,
      is_trusted_caller,
      family_id,
      families (
        id,
        name,
        invite_code
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('[getMyMembership] Query error:', error.code, error.message);
    return null;
  }
  if (!data) return null;

  return {
    role: data.role as 'admin' | 'member' | 'senior',
    isTrustedCaller: data.is_trusted_caller,
    familyId: data.family_id,
    family: data.families as { id: string; name: string; invite_code: string },
  };
}

/**
 * Get all members in the current user's family.
 */
export async function getFamilyMembers(familyId: string) {
  const sb = getSupabase();

  const { data, error } = await sb
    .from('family_members')
    .select(`
      role,
      is_trusted_caller,
      created_at,
      user_id,
      users (
        id,
        display_name,
        avatar_url
      )
    `)
    .eq('family_id', familyId);

  if (error) throw error;
  return data;
}

// Re-export types for convenience
export type { Database } from './database.types';
export type { SupabaseClient, Session, User } from '@supabase/supabase-js';
