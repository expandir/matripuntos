import { Check, CheckCheck } from 'lucide-react';
import { Message } from '../lib/chatService';

interface ChatMessageProps {
  message: Message;
  isOwnMessage: boolean;
  senderName?: string;
}

export default function ChatMessage({ message, isOwnMessage, senderName }: ChatMessageProps) {
  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
        {!isOwnMessage && senderName && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 ml-3">
            {senderName}
          </p>
        )}
        <div
          className={`rounded-2xl px-4 py-2 ${
            isOwnMessage
              ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-tr-sm'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-tl-sm'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        </div>
        <div className={`flex items-center gap-1 mt-1 ${isOwnMessage ? 'justify-end' : 'justify-start'} px-2`}>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(message.created_at).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          {isOwnMessage && (
            <span className="text-gray-400 dark:text-gray-500">
              {message.read ? (
                <CheckCheck className="w-3 h-3" />
              ) : (
                <Check className="w-3 h-3" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
