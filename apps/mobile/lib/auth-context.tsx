// ============================================================
// Sunroom — Auth Context
// ============================================================
// Provides auth state (user, session, role, family) to the
// entire app tree. Handles role-based routing decisions.
// ============================================================

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import {
  getSupabase,
  getMyMembership,
  signIn as sbSignIn,
  signUp as sbSignUp,
  signOut as sbSignOut,
  createFamily as sbCreateFamily,
  joinFamily as sbJoinFamily,
} from '@sunroom/supabase-client';
import type { FamilyRole } from '@sunroom/shared';

export interface FamilyInfo {
  id: string;
  name: string;
  invite_code: string;
}

export interface AuthState {
  /** Whether the auth state has been loaded from storage */
  isLoading: boolean;
  /** The current Supabase session */
  session: Session | null;
  /** The current user */
  user: User | null;
  /** The user's role in their family */
  role: FamilyRole | null;
  /** Whether the user is a trusted caller */
  isTrustedCaller: boolean;
  /** The user's family info */
  family: FamilyInfo | null;
  /** The user's family_id */
  familyId: string | null;
  /** Whether the user has completed onboarding (has a family) */
  hasFamily: boolean;
}

export interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  createFamily: (familyName: string) => Promise<FamilyInfo>;
  joinFamily: (inviteCode: string) => Promise<FamilyInfo>;
  refreshMembership: () => Promise<void>;
}

const AuthContext = createContext<(AuthState & AuthActions) | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    session: null,
    user: null,
    role: null,
    isTrustedCaller: false,
    family: null,
    familyId: null,
    hasFamily: false,
  });

  // Load membership data after auth state is available
  const loadMembership = useCallback(async () => {
    try {
      console.log('[AuthProvider] Loading membership...');
      const membership = await getMyMembership();
      console.log('[AuthProvider] Membership result:', membership ? 'found' : 'none');
      if (membership) {
        setState(prev => ({
          ...prev,
          role: membership.role,
          isTrustedCaller: membership.isTrustedCaller,
          family: membership.family,
          familyId: membership.familyId,
          hasFamily: true,
          isLoading: false,
        }));
      } else {
        setState(prev => ({
          ...prev,
          role: null,
          isTrustedCaller: false,
          family: null,
          familyId: null,
          hasFamily: false,
          isLoading: false,
        }));
      }
    } catch (err) {
      console.warn('[AuthProvider] Failed to load membership:', err);
      setState(prev => ({
        ...prev,
        role: null,
        isTrustedCaller: false,
        family: null,
        familyId: null,
        hasFamily: false,
        isLoading: false,
      }));
    }
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const sb = getSupabase();

    // Get initial session
    sb.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // User is authenticated — set user but keep isLoading=true
        // until loadMembership() completes (it will set isLoading=false)
        setState(prev => ({
          ...prev,
          session,
          user: session.user,
        }));
      } else {
        // No user — done loading, go straight to login
        setState(prev => ({
          ...prev,
          session: null,
          user: null,
          isLoading: false,
        }));
      }
    });

    // Subscribe to auth changes (login/logout events)
    const { data: { subscription } } = sb.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setState(prev => ({
            ...prev,
            session,
            user: session.user,
          }));
        } else {
          setState(prev => ({
            ...prev,
            session: null,
            user: null,
            role: null,
            family: null,
            familyId: null,
            hasFamily: false,
            isLoading: false,
          }));
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // When user changes, load their membership
  // isLoading stays true until this completes
  useEffect(() => {
    if (state.user) {
      loadMembership();
    }
  }, [state.user?.id, loadMembership]);

  // -- Actions --

  const signIn = useCallback(async (email: string, password: string) => {
    await sbSignIn(email, password);
    // onAuthStateChange will update state automatically
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName: string) => {
    await sbSignUp(email, password, displayName);
  }, []);

  const signOut = useCallback(async () => {
    await sbSignOut();
    setState(prev => ({
      ...prev,
      session: null,
      user: null,
      role: null,
      isTrustedCaller: false,
      family: null,
      familyId: null,
      hasFamily: false,
    }));
  }, []);

  const createFamily = useCallback(async (familyName: string) => {
    const family = await sbCreateFamily(familyName);
    await loadMembership();
    return family as FamilyInfo;
  }, [loadMembership]);

  const joinFamily = useCallback(async (inviteCode: string) => {
    const family = await sbJoinFamily(inviteCode);
    await loadMembership();
    return family as FamilyInfo;
  }, [loadMembership]);

  const value: AuthState & AuthActions = {
    ...state,
    signIn,
    signUp,
    signOut,
    createFamily,
    joinFamily,
    refreshMembership: loadMembership,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth state and actions.
 * Must be used inside an AuthProvider.
 */
export function useAuth(): AuthState & AuthActions {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return ctx;
}
