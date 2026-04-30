// ============================================================
// Sunroom — Sign Up Screen
// ============================================================

import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { showAlert } from '../../lib/alert';
import { useRouter } from 'expo-router';
import { useAuth } from '../../lib/auth-context';
import { colors, typography, spacing, radii } from '@sunroom/ui';

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!displayName.trim() || !email.trim() || !password.trim()) {
      showAlert('Missing fields', 'Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      showAlert('Weak password', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await signUp(email.trim(), password, displayName.trim());
      // After signup, user will be redirected to onboarding (create/join family)
      router.replace('/');
    } catch (err: any) {
      console.error('Signup error:', err);
      const msg = err?.message || err?.error_description || err?.msg || JSON.stringify(err) || 'Something went wrong.';
      showAlert('Sign up failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        {/* Header */}
        <Text style={styles.emoji}>🌞</Text>
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Join your family on Sunroom</Text>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Your name</Text>
            <TextInput
              style={styles.input}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="e.g. Maddie"
              placeholderTextColor={colors.family.textSecondary}
              autoCapitalize="words"
              textContentType="name"
              autoComplete="name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={colors.family.textSecondary}
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="6+ characters"
              placeholderTextColor={colors.family.textSecondary}
              secureTextEntry
              textContentType="newPassword"
              autoComplete="new-password"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Login link */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.linkContainer}
        >
          <Text style={styles.linkText}>
            Already have an account?{' '}
            <Text style={styles.linkAccent}>Sign in</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  },
  subtitle: {
    ...typography.family.body,
    color: colors.family.textSecondary,
    marginBottom: spacing['2xl'],
  },
  form: {
    width: '100%',
    maxWidth: 400,
    gap: spacing.md,
  },
  inputGroup: {
    gap: spacing.xxs,
  },
  label: {
    ...typography.family.bodySm,
    color: colors.family.textSecondary,
    marginLeft: spacing.xxs,
  },
  input: {
    backgroundColor: colors.family.surface,
    borderWidth: 1,
    borderColor: colors.family.border,
    borderRadius: radii.md,
    padding: spacing.md,
    color: colors.family.text,
    ...typography.family.body,
  },
  button: {
    backgroundColor: colors.family.accent,
    borderRadius: radii.md,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
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
  linkAccent: {
    color: colors.family.accent,
    fontWeight: '600',
  },
});
