'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';
import { Toast } from '@capacitor/toast';
import { AdMob } from '@capacitor-community/admob';
import { initPushNotifications } from '@/lib/pushNotifications';
import { SafeArea } from 'capacitor-plugin-safe-area';

export function AppInitializer() {
  const router = useRouter();
  const pathname = usePathname();
  
  const pathRef = useRef(pathname);
  const routerRef = useRef(router);
  const backPressTimeRef = useRef(0);

  useEffect(() => {
    pathRef.current = pathname;
    routerRef.current = router;
  }, [pathname, router]);

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

      // Hardware Back Button Registration
      const mainTabs = ['/main', '/match', '/likes', '/chat', '/mypage'];
      
      const backListener = CapacitorApp.addListener('backButton', () => {
        const currentPath = pathRef.current;
        
        // Disable default back behavior if on auth or start page, just minimal protection, 
        // mainly focus on main tabs exit and sub tabs history back.
        if (mainTabs.includes(currentPath) || currentPath === '/') {
            const currentTime = new Date().getTime();
            
            if (currentTime - backPressTimeRef.current < 2000) {
                CapacitorApp.exitApp();
            } else {
                backPressTimeRef.current = currentTime;
                Toast.show({
                    text: '한번 더 누르시면 앱이 종료됩니다.',
                    duration: 'short',
                    position: 'bottom'
                });
            }
        } else {
            // For any other page, go back in history
            routerRef.current.back();
        }
      });

      return () => {
         backListener.then(listener => listener.remove());
      };
    }
  }, []);

  return null;
}
