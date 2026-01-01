import { supabase } from './supabase';

const VAPID_PUBLIC_KEY = 'BNrw8LnVrSLPm8P7QYTZlcMQJPqE8YqYJYqYJqE8YqYJYqYJYqE8YqYJYqYJYqE8YqYJYqYJYqE8YqYJYqYJYqE';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function isPushNotificationSupported(): Promise<boolean> {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

export async function getNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }
  return await Notification.requestPermission();
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    return null;
  }

  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });
    return registration;
  } catch {
    return null;
  }
}

export async function subscribeToPushNotifications(
  userId: string
): Promise<PushSubscription | null> {
  try {
    const permission = await getNotificationPermission();
    if (permission !== 'granted') {
      const newPermission = await requestNotificationPermission();
      if (newPermission !== 'granted') {
        console.log('Notification permission denied');
        return null;
      }
    }

    let registration = await navigator.serviceWorker.ready;
    if (!registration) {
      registration = await registerServiceWorker();
      if (!registration) {
        console.error('Failed to register service worker');
        return null;
      }
    }

    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
      console.log('Already subscribed:', existingSubscription);
      return existingSubscription;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    console.log('New push subscription:', subscription);

    await savePushSubscription(userId, subscription);

    return subscription;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    return null;
  }
}

async function savePushSubscription(
  userId: string,
  subscription: PushSubscription
): Promise<void> {
  try {
    const subscriptionJSON = subscription.toJSON();
    const { error } = await supabase.from('push_subscriptions').upsert(
      {
        user_id: userId,
        endpoint: subscription.endpoint,
        p256dh_key: subscriptionJSON.keys?.p256dh || '',
        auth_key: subscriptionJSON.keys?.auth || '',
        user_agent: navigator.userAgent,
      },
      {
        onConflict: 'endpoint',
      }
    );

    if (error) {
      console.error('Error saving push subscription:', error);
      throw error;
    }

    console.log('Push subscription saved');
  } catch (error) {
    console.error('Error saving subscription to database:', error);
    throw error;
  }
}

export async function unsubscribeFromPushNotifications(): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      console.log('No subscription found');
      return true;
    }

    const endpoint = subscription.endpoint;
    const unsubscribed = await subscription.unsubscribe();

    if (unsubscribed) {
      await supabase
        .from('push_subscriptions')
        .delete()
        .eq('endpoint', endpoint);

      console.log('Unsubscribed from push notifications');
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error);
    return false;
  }
}

export async function checkPushSubscriptionStatus(): Promise<boolean> {
  try {
    if (!('serviceWorker' in navigator)) {
      return false;
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    return subscription !== null;
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return false;
  }
}

export async function sendTestNotification(): Promise<void> {
  const permission = await getNotificationPermission();
  if (permission !== 'granted') {
    console.log('Notification permission not granted');
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  await registration.showNotification('Notificación de Prueba', {
    body: 'Las notificaciones están funcionando correctamente',
    icon: '/icon-192.png',
    badge: '/icon-96.png',
    vibrate: [200, 100, 200],
  });
}
