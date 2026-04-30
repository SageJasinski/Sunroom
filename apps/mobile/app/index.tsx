// ============================================================
// Sunroom — Auth Router (Index)
// ============================================================
// This is the entry point that decides where to send the user:
// - Not logged in → (auth)/login
// - Logged in, no family → (auth)/onboard
// - Logged in, role=senior → (senior)
// - Logged in, role=admin|member → (family)
// ============================================================

import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../lib/auth-context';
import { colors } from '@sunroom/ui';

export default function AuthRouter() {
  const router = useRouter();
  const { isLoading, user, role, hasFamily } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      // Not authenticated → login screen
      router.replace('/(auth)/login');
      return;
    }

    if (!hasFamily) {
      // Authenticated but no family → onboarding
      router.replace('/(auth)/onboard');
      return;
    }

    if (role === 'senior') {
      // Senior users → walled garden
      router.replace('/(senior)');
      return;
    }

    // Admin or member → family dashboard
    router.replace('/(family)');
  }, [isLoading, user, role, hasFamily, router]);

  // Show a loading spinner while determining auth state
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.senior.accent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.senior.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
