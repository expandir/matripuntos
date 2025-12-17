import { useState, useEffect, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Message, sendMessage, subscribeToMessages, markMessagesAsRead } from '../lib/chatService';
import { sendChatMessageNotification } from '../lib/sendPushNotification';
import ChatMessage from './ChatMessage';
import toast from 'react-hot-toast';

interface ChatBoxProps {
  messages: Message[];
  coupleId: string;
  userId: string;
  partnerId: string;
  partnerName: string;
  onNewMessage: (message: Message) => void;
}

export default function ChatBox({ messages, coupleId, userId, partnerId, partnerName, onNewMessage }: ChatBoxProps) {
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    markMessagesAsRead(coupleId, userId);

    const subscription = subscribeToMessages(coupleId, (newMessage) => {
      onNewMessage(newMessage);
      if (newMessage.sender_id !== userId) {
        markMessagesAsRead(coupleId, userId);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [coupleId, userId, onNewMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!inputValue.trim() || sending) return;

    setSending(true);
    const content = inputValue.trim();
    setInputValue('');

    try {
      const newMessage = await sendMessage(coupleId, userId, content);
      if (newMessage) {
        onNewMessage(newMessage);

        sendChatMessageNotification(partnerId, partnerName, content).catch(err => {
          console.error('Error sending push notification:', err);
        });
      } else {
        toast.error('Error al enviar mensaje');
        setInputValue(content);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error al enviar mensaje');
      setInputValue(content);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-400 text-center">
              No hay mensajes aún.
              <br />
              ¡Envía el primero!
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isOwnMessage={message.sender_id === userId}
                senderName={message.sender_id === userId ? undefined : partnerName}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe un mensaje..."
            rows={1}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            style={{ maxHeight: '120px' }}
            disabled={sending}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || sending}
            className="p-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Presiona Enter para enviar, Shift + Enter para nueva línea
        </p>
      </div>
    </div>
  );
}
