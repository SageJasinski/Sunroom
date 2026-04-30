// ============================================================
// Sunroom — Cross-Platform Alert
// ============================================================
// React Native's Alert.alert doesn't work on web.
// This wrapper uses window.alert on web and Alert.alert on native.
// ============================================================

import { Alert, Platform } from 'react-native';

/**
 * Show an alert dialog that works on both web and native.
 */
export function showAlert(title: string, message?: string) {
  if (Platform.OS === 'web') {
    // Use setTimeout to ensure alert runs outside of any async/Promise context
    // that could swallow the dialog
    const text = message ? `${title}\n\n${message}` : title;
    setTimeout(() => {
      try {
        window.alert(text);
      } catch {
        console.error('[showAlert]', text);
      }
    }, 0);
  } else {
    Alert.alert(title, message);
  }
}
