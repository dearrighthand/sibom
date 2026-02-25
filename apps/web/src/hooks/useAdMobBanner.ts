'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { AdMob, BannerAdSize, BannerAdPosition, BannerAdPluginEvents } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

interface UseAdMobBannerReturn {
  bannerHeight: number;
  hideBanner: () => void;
  resumeBanner: () => void;
}

export function useAdMobBanner(): UseAdMobBannerReturn {
  const [bannerHeight, setBannerHeight] = useState(0);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    if (!Capacitor.isNativePlatform()) return;

    let listenerHandle: { remove: () => void } | null = null;

    const init = async () => {
      try {
        // Listen for banner size changes to get actual height
        listenerHandle = await AdMob.addListener(
          BannerAdPluginEvents.SizeChanged,
          (info: { width: number; height: number }) => {
            if (isMountedRef.current && info.height > 0) {
              setBannerHeight(info.height);
            }
          },
        );

        // Remove any existing banner before showing a new one
        await AdMob.removeBanner().catch(() => {});

        if (!isMountedRef.current) return;

        const adUnitId = process.env.NEXT_PUBLIC_ADMOB_AD_UNIT_ID!;
        await AdMob.showBanner({
          adId: adUnitId,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 0,
          adSize: BannerAdSize.ADAPTIVE_BANNER,
        });
      } catch (err) {
        console.error('AdMob Banner Failed', err);
      }
    };

    init();

    return () => {
      isMountedRef.current = false;
      listenerHandle?.remove();
      AdMob.hideBanner().catch((err) => console.error('AdMob Hide Banner Failed', err));
      AdMob.removeBanner().catch((err) => console.error('AdMob Remove Banner Failed', err));
      setBannerHeight(0);
    };
  }, []);

  const hideBanner = useCallback(() => {
    if (!Capacitor.isNativePlatform()) return;
    AdMob.hideBanner().catch((err) => console.error('AdMob Hide Failed', err));
  }, []);

  const resumeBanner = useCallback(() => {
    if (!Capacitor.isNativePlatform()) return;
    AdMob.resumeBanner().catch((err) => console.error('AdMob Resume Failed', err));
  }, []);

  return { bannerHeight, hideBanner, resumeBanner };
}
