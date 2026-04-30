// ============================================================
// Sunroom — Family Route Group Layout
// ============================================================
// Modern dashboard with tab navigation.
// Tabs: Home, Members, Device, Settings
// ============================================================

import { Tabs } from 'expo-router';
import { colors, typography } from '@sunroom/ui';

export default function FamilyLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.family.surface,
          borderTopColor: colors.family.border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.family.accent,
        tabBarInactiveTintColor: colors.family.textSecondary,
        tabBarLabelStyle: {
          ...typography.family.caption,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="members"
        options={{
          title: 'Members',
          tabBarLabel: 'Members',
        }}
      />
      <Tabs.Screen
        name="device"
        options={{
          title: 'Device',
          tabBarLabel: 'Device',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
        }}
      />
    </Tabs>
  );
}
