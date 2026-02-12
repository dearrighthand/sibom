'use client';

import { useEffect, useState } from 'react';
import { AdMob, BannerAdSize, BannerAdPosition, BannerAdPluginEvents } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

export function AdMobBanner() {
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
  }, []);

  useEffect(() => {
    if (!isNative) return;

    const showBanner = async () => {
      try {
        await AdMob.showBanner({
          adId: 'ca-app-pub-3940256099942544/6300978111', // Test Ad ID. Replace with production ID later.
          adSize: BannerAdSize.BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 0,
        });
      } catch (e) {
        console.error('Failed to show banner', e);
      }
    };

    const hideBanner = async () => {
      try {
        await AdMob.hideBanner();
      } catch (e) {
        console.error('Failed to hide banner', e);
      }
    };

    showBanner();

    // Clean up when component unmounts
    return () => {
      hideBanner();
    };
  }, [isNative]);

  if (!isNative) {
    return (
      <div className="w-full h-[50px] bg-gray-100 flex items-center justify-center text-xs text-gray-400 mt-4 rounded-lg border border-gray-200 border-dashed">
        광고 영역 (모바일 앱에서만 표시됨)
      </div>
    );
  }

  // Native banner is rendered over the webview, so we just need a spacer
  return <div className="w-full h-[50px]" />;
}
