// ============================================================
// Sunroom — Onboarding Screen
// ============================================================
// After signup, users land here to either:
// 1. Create a new family (becomes admin)
// 2. Join an existing family via invite code (becomes member)
// ============================================================

import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { showAlert } from '../../lib/alert';
import { useRouter } from 'expo-router';
import { useAuth } from '../../lib/auth-context';
import { colors, typography, spacing, radii, shadows } from '@sunroom/ui';

type Mode = 'choose' | 'create' | 'join';

export default function OnboardScreen() {
  const router = useRouter();
  const { createFamily, joinFamily } = useAuth();
  const [mode, setMode] = useState<Mode>('choose');
  const [familyName, setFamilyName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!familyName.trim()) {
      showAlert('Missing name', 'Give your family a name.');
      return;
    }
    setLoading(true);
    try {
      await createFamily(familyName.trim());
      router.replace('/');
    } catch (err: any) {
      showAlert('Error', err.message || 'Failed to create family.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!inviteCode.trim()) {
      showAlert('Missing code', 'Please enter the invite code.');
      return;
    }
    setLoading(true);
    try {
      await joinFamily(inviteCode.trim());
      router.replace('/');
    } catch (err: any) {
      showAlert('Error', err.message || 'Invalid invite code.');
    } finally {
      setLoading(false);
    }
  };

  // -- Choose mode --
  if (mode === 'choose') {
    return (
      <View style={styles.container}>
        <View style={styles.inner}>
          <Text style={styles.emoji}>👋</Text>
          <Text style={styles.title}>Welcome to Sunroom</Text>
          <Text style={styles.subtitle}>
            Let's get you connected with your family
          </Text>

          <View style={styles.cards}>
            {/* Create family */}
            <TouchableOpacity
              style={styles.card}
              onPress={() => setMode('create')}
              activeOpacity={0.8}
            >
              <Text style={styles.cardEmoji}>🏠</Text>
              <Text style={styles.cardTitle}>Create a family</Text>
              <Text style={styles.cardDesc}>
                Start a new family space and invite your loved ones
              </Text>
            </TouchableOpacity>

            {/* Join family */}
            <TouchableOpacity
              style={styles.card}
              onPress={() => setMode('join')}
              activeOpacity={0.8}
            >
              <Text style={styles.cardEmoji}>🔗</Text>
              <Text style={styles.cardTitle}>Join a family</Text>
              <Text style={styles.cardDesc}>
                Enter an invite code from a family member
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // -- Create or Join form --
  const isCreate = mode === 'create';

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.emoji}>{isCreate ? '🏠' : '🔗'}</Text>
        <Text style={styles.title}>
          {isCreate ? 'Name your family' : 'Join your family'}
        </Text>
        <Text style={styles.subtitle}>
          {isCreate
            ? 'This is what everyone will see in the app'
            : 'Enter the invite code you received'}
        </Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            value={isCreate ? familyName : inviteCode}
            onChangeText={isCreate ? setFamilyName : setInviteCode}
            placeholder={isCreate ? 'e.g. The Jasinski Family' : 'e.g. a1b2c3d4e5f6'}
            placeholderTextColor={colors.family.textSecondary}
            autoCapitalize={isCreate ? 'words' : 'none'}
            autoFocus
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={isCreate ? handleCreate : handleJoin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>
                {isCreate ? 'Create Family' : 'Join Family'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => setMode('choose')}
          style={styles.linkContainer}
        >
          <Text style={styles.linkText}>← Go back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.family.background,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emoji: {
    fontSize: 56,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.family.h1,
    color: colors.family.text,
    marginBottom: spacing.xxs,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.family.body,
    color: colors.family.textSecondary,
    marginBottom: spacing['2xl'],
    textAlign: 'center',
    maxWidth: 320,
  },
  cards: {
    width: '100%',
    maxWidth: 400,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.family.surface,
    borderWidth: 1,
    borderColor: colors.family.border,
    borderRadius: radii.xl,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.md,
  },
  cardEmoji: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  cardTitle: {
    ...typography.family.h3,
    color: colors.family.text,
    marginBottom: spacing.xxs,
  },
  cardDesc: {
    ...typography.family.bodySm,
    color: colors.family.textSecondary,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 400,
    gap: spacing.md,
  },
  input: {
    backgroundColor: colors.family.surface,
    borderWidth: 1,
    borderColor: colors.family.border,
    borderRadius: radii.md,
    padding: spacing.md,
    color: colors.family.text,
    ...typography.family.body,
    textAlign: 'center',
    fontSize: 20,
  },
  button: {
    backgroundColor: colors.family.accent,
    borderRadius: radii.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    ...typography.family.button,
    color: colors.white,
  },
  linkContainer: {
    marginTop: spacing.xl,
  },
  linkText: {
    ...typography.family.body,
    color: colors.family.textSecondary,
  },
});
