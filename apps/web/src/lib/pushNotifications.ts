import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { api } from '@/lib/api';

export const initPushNotifications = async () => {
  if (!Capacitor.isPluginAvailable('PushNotifications')) {
    console.log('PushNotifications plugin not available');
    return;
  }

  // 1. Request permission
  const result = await PushNotifications.requestPermissions();
  if (result.receive === 'granted') {
    // 2. Register with FCM
    await PushNotifications.register();
  } else {
    console.error('Push notification permission denied');
  }

  // 3. Listeners
  PushNotifications.addListener('registration', async (token) => {
    console.log('Push Registration Token:', token.value);
    
    // Always save token to local storage first
    localStorage.setItem('fcm_device_token', token.value);

    // Try to sync if logged in
    await syncDeviceToken();
  });

  PushNotifications.addListener('registrationError', (error) => {
    console.error('Push Registration Error:', error);
  });

  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('Push Notification Received:', notification);
    // You can handle foreground notifications here (e.g. show toast)
  });

  PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
    console.log('Push Notification Action Performed:', notification);
    // Handle notification tap (e.g. navigate to specific screen)
    const data = notification.notification.data;
    if (data?.url) {
        window.location.href = data.url;
    }
  });
};

export const syncDeviceToken = async () => {
    const token = localStorage.getItem('fcm_device_token');
    const accessToken = localStorage.getItem('accessToken');

    if (token && accessToken) {
        try {
            await api.post('/users/device-token', { token, platform: 'android' });
            console.log('Device token synced successfully');
        } catch (e) {
            console.error('Failed to sync device token', e);
        }
    }
};
