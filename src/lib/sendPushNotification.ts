import { supabase } from './supabase';

interface SendNotificationParams {
  userId: string;
  title: string;
  body: string;
  url?: string;
  icon?: string;
  tag?: string;
}

export async function sendPushNotification({
  userId,
  title,
  body,
  url,
  icon,
  tag,
}: SendNotificationParams): Promise<boolean> {
  try {
    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-push-notification`;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('No active session');
      return false;
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        title,
        body,
        url,
        icon,
        tag,
      }),
    });

    if (!response.ok) {
      console.error('Failed to send push notification:', response.status);
      return false;
    }

    const result = await response.json();
    console.log('Push notification result:', result);
    return true;
  } catch (error) {
    console.error('Error sending push notification:', error);
    return false;
  }
}

export async function sendChatMessageNotification(
  recipientUserId: string,
  senderName: string,
  messageContent: string
): Promise<boolean> {
  return sendPushNotification({
    userId: recipientUserId,
    title: `Nuevo mensaje de ${senderName}`,
    body: messageContent.length > 100 ? messageContent.substring(0, 100) + '...' : messageContent,
    url: '/chat',
    tag: 'chat-message',
  });
}

export async function sendPointsAddedNotification(
  userId: string,
  points: number,
  description: string
): Promise<boolean> {
  return sendPushNotification({
    userId,
    title: `¡+${points} puntos!`,
    body: description,
    url: '/dashboard',
    tag: 'points-added',
  });
}

export async function sendAchievementUnlockedNotification(
  userId: string,
  achievementTitle: string
): Promise<boolean> {
  return sendPushNotification({
    userId,
    title: '¡Logro Desbloqueado!',
    body: achievementTitle,
    url: '/achievements',
    tag: 'achievement-unlocked',
  });
}

export async function sendRewardRedeemedNotification(
  userId: string,
  rewardTitle: string
): Promise<boolean> {
  return sendPushNotification({
    userId,
    title: '¡Recompensa Canjeada!',
    body: rewardTitle,
    url: '/rewards',
    tag: 'reward-redeemed',
  });
}
