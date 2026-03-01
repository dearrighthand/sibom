'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { AdMob } from '@capacitor-community/admob';
import { initPushNotifications } from '@/lib/pushNotifications';
import { SafeArea } from 'capacitor-plugin-safe-area';

export function AppInitializer() {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      initPushNotifications();
      AdMob.initialize({
        initializeForTesting: false,
      });

      // Get native safe area insets and inject as CSS custom properties
      SafeArea.getSafeAreaInsets().then(({ insets }) => {
        const root = document.documentElement;
        root.style.setProperty('--safe-area-inset-top', `${insets.top}px`);
        root.style.setProperty('--safe-area-inset-bottom', `${insets.bottom}px`);
        root.style.setProperty('--safe-area-inset-left', `${insets.left}px`);
        root.style.setProperty('--safe-area-inset-right', `${insets.right}px`);
      }).catch((err) => {
        console.error('Failed to get safe area insets:', err);
      });

      // Also get status bar height as a separate variable
      SafeArea.getStatusBarHeight().then(({ statusBarHeight }) => {
        document.documentElement.style.setProperty('--status-bar-height', `${statusBarHeight}px`);
      }).catch((err) => {
        console.error('Failed to get status bar height:', err);
      });
    }
  }, []);

  return null;
}
