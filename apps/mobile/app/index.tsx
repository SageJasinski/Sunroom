// ============================================================
// Sunroom — Index (Entry Point)
// ============================================================
// Temporary landing screen. In Phase 1, this will redirect
// to (auth)/login, (senior)/home, or (family)/home based on
// the user's auth state and role.
// ============================================================

import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '@sunroom/ui';

export default function IndexScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🌞</Text>
      <Text style={styles.title}>Sunroom</Text>
      <Text style={styles.subtitle}>
        Bringing families closer, effortlessly.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.senior.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emoji: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.senior.clock,
    color: colors.senior.text,
    fontFamily: typography.fontFamily.display,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.family.h3,
    color: colors.senior.textSecondary,
    fontFamily: typography.fontFamily.primary,
    textAlign: 'center',
  },
});
