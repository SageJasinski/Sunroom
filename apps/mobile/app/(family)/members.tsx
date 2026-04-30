// Family Dashboard — Members Tab (Placeholder)

import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '@sunroom/ui';

export default function MembersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Members</Text>
      <Text style={styles.subtitle}>Manage family members and roles</Text>
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
