'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { initPushNotifications } from '@/lib/pushNotifications';

export function AppInitializer() {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      initPushNotifications();
    }
  }, []);

  return null;
}
