// Family Dashboard — Device Monitor Tab (Placeholder)

import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '@sunroom/ui';

export default function DeviceScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Device</Text>
      <Text style={styles.subtitle}>Monitor the senior tablet</Text>
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
