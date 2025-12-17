import { supabase } from './supabase';

export interface Message {
  id: string;
  couple_id: string;
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

export async function getMessages(coupleId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('couple_id', coupleId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }

  return data || [];
}

export async function sendMessage(
  coupleId: string,
  senderId: string,
  content: string
): Promise<Message | null> {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      couple_id: coupleId,
      sender_id: senderId,
      content: content.trim(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error sending message:', error);
    return null;
  }

  return data;
}

export async function markMessagesAsRead(
  coupleId: string,
  userId: string
): Promise<void> {
  const { error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('couple_id', coupleId)
    .neq('sender_id', userId)
    .eq('read', false);

  if (error) {
    console.error('Error marking messages as read:', error);
  }
}

export async function getUnreadCount(
  coupleId: string,
  userId: string
): Promise<number> {
  const { data, error } = await supabase
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .eq('couple_id', coupleId)
    .neq('sender_id', userId)
    .eq('read', false);

  if (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }

  return data?.length || 0;
}

export function subscribeToMessages(
  coupleId: string,
  onMessage: (message: Message) => void
) {
  return supabase
    .channel(`messages:${coupleId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `couple_id=eq.${coupleId}`,
      },
      (payload) => {
        onMessage(payload.new as Message);
      }
    )
    .subscribe();
}
