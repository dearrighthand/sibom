'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { AdMob } from '@capacitor-community/admob';
import { initPushNotifications } from '@/lib/pushNotifications';

export function AppInitializer() {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      initPushNotifications();
      AdMob.initialize({
        initializeForTesting: false,
      });
    }
  }, []);

  return null;
}
