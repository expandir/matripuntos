import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { getMessages, Message } from '../lib/chatService';
import Header from '../components/Header';
import ChatBox from '../components/ChatBox';
import toast from 'react-hot-toast';

export default function Chat() {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [partnerName, setPartnerName] = useState('Tu pareja');
  const [partnerId, setPartnerId] = useState<string>('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!userProfile?.couple_id) {
      navigate('/link');
      return;
    }

    loadMessages();
    loadPartnerInfo();
  }, [user, userProfile, navigate]);

  const loadMessages = async () => {
    if (!userProfile?.couple_id) return;

    try {
      const data = await getMessages(userProfile.couple_id);
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Error al cargar mensajes');
    } finally {
      setLoading(false);
    }
  };

  const loadPartnerInfo = async () => {
    if (!userProfile?.couple_id) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name')
        .eq('couple_id', userProfile.couple_id)
        .neq('id', user!.id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setPartnerName(data.name);
        setPartnerId(data.id);
      }
    } catch (error) {
      console.error('Error loading partner info:', error);
    }
  };

  const handleNewMessage = (newMessage: Message) => {
    setMessages((prev) => {
      const exists = prev.some((msg) => msg.id === newMessage.id);
      if (exists) return prev;
      return [...prev, newMessage];
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      <Header />

      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 flex flex-col">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-4 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col overflow-hidden flex-1">
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Chat</h1>
                <p className="text-sm text-white/90">{partnerName}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            {userProfile && partnerId && (
              <ChatBox
                messages={messages}
                coupleId={userProfile.couple_id!}
                userId={user!.id}
                partnerId={partnerId}
                partnerName={partnerName}
                onNewMessage={handleNewMessage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
