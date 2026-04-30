// ============================================================
// Sunroom — Root Layout
// ============================================================
// This is the top-level layout for the entire app.
// It loads fonts, manages the splash screen, and will
// eventually handle auth state to route users to either
// the senior or family experience.
// ============================================================

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      />
    </>
  );
}
