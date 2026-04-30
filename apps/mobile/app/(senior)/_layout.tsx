// ============================================================
// Sunroom — Senior Route Group Layout
// ============================================================
// The "walled garden" — absolutely no navigation chrome.
// No headers, no tab bars, no back buttons.
// This layout locks the senior into a single-screen experience.
// ============================================================

import { Stack } from 'expo-router';
import { colors } from '@sunroom/ui';

export default function SeniorLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        gestureEnabled: false, // Prevent swipe-back navigation
        contentStyle: {
          backgroundColor: colors.senior.background,
        },
      }}
    />
  );
}
