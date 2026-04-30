// ============================================================
// Sunroom — Auth Route Group Layout
// ============================================================
// Screens for login, sign-up, and device provisioning.
// No navigation chrome — clean, focused auth flows.
// ============================================================

import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    />
  );
}
