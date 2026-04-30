// ============================================================
// Sunroom — Login Screen (Placeholder)
// ============================================================
// Will be implemented in Phase 1 with Supabase Auth.
// ============================================================

import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '@sunroom/ui';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Sunroom</Text>
      <Text style={styles.subtitle}>Sign in to get started</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.family.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  title: {
    ...typography.family.h1,
    color: colors.family.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.family.body,
    color: colors.family.textSecondary,
  },
});
