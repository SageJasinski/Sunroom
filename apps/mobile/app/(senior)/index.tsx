// ============================================================
// Sunroom — Senior Home Screen (Placeholder)
// ============================================================
// This is the ONLY screen the senior ever sees.
// It will contain the contact grid and clock widget.
// Implemented fully in Phase 3.
// ============================================================

import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '@sunroom/ui';

export default function SeniorHomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🌞</Text>
      <Text style={styles.greeting}>Good evening</Text>
      <Text style={styles.clock}>9:56 PM</Text>
      <Text style={styles.date}>Tuesday, April 29</Text>
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
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  greeting: {
    ...typography.senior.contactName,
    color: colors.senior.text,
    marginBottom: spacing.md,
  },
  clock: {
    ...typography.senior.clock,
    color: colors.senior.text,
    marginBottom: spacing.xs,
  },
  date: {
    ...typography.senior.date,
    color: colors.senior.textSecondary,
  },
});
