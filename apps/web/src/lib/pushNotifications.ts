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
    // Send token to backend
    try {
      await api.post('/users/device-token', { token: token.value, platform: 'android' });
    } catch (e) {
      console.error('Failed to save device token', e);
    }
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
