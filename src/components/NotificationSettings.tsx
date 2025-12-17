import { useState, useEffect } from 'react';
import { Bell, BellOff, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import {
  isPushNotificationSupported,
  getNotificationPermission,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  checkPushSubscriptionStatus,
  sendTestNotification,
} from '../lib/pushNotificationService';
import toast from 'react-hot-toast';

interface NotificationSettingsProps {
  userId: string;
}

export default function NotificationSettings({ userId }: NotificationSettingsProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkSupport();
  }, []);

  const checkSupport = async () => {
    setChecking(true);
    const supported = await isPushNotificationSupported();
    setIsSupported(supported);

    if (supported) {
      const perm = await getNotificationPermission();
      setPermission(perm);

      const subscribed = await checkPushSubscriptionStatus();
      setIsSubscribed(subscribed);
    }
    setChecking(false);
  };

  const handleEnableNotifications = async () => {
    setLoading(true);
    try {
      const subscription = await subscribeToPushNotifications(userId);
      if (subscription) {
        setIsSubscribed(true);
        setPermission('granted');
        toast.success('Notificaciones activadas');
      } else {
        toast.error('No se pudieron activar las notificaciones');
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
      toast.error('Error al activar notificaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleDisableNotifications = async () => {
    setLoading(true);
    try {
      const success = await unsubscribeFromPushNotifications();
      if (success) {
        setIsSubscribed(false);
        toast.success('Notificaciones desactivadas');
      } else {
        toast.error('No se pudieron desactivar las notificaciones');
      }
    } catch (error) {
      console.error('Error disabling notifications:', error);
      toast.error('Error al desactivar notificaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleTestNotification = async () => {
    try {
      await sendTestNotification();
      toast.success('Notificación de prueba enviada');
    } catch (error) {
      console.error('Error sending test notification:', error);
      toast.error('Error al enviar notificación de prueba');
    }
  };

  if (checking) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <XCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
              Notificaciones no disponibles
            </h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              Tu navegador no soporta notificaciones push. Intenta usar Chrome, Firefox o Edge.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {isSubscribed ? (
            <Bell className="w-6 h-6 text-green-500" />
          ) : (
            <BellOff className="w-6 h-6 text-gray-400" />
          )}
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white">
              Notificaciones Push
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isSubscribed ? 'Activadas' : 'Desactivadas'}
            </p>
          </div>
        </div>
        {isSubscribed && (
          <CheckCircle className="w-5 h-5 text-green-500" />
        )}
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Recibe notificaciones cuando tengas nuevos mensajes, puntos o logros.
      </p>

      <div className="space-y-3">
        {!isSubscribed ? (
          <button
            onClick={handleEnableNotifications}
            disabled={loading || permission === 'denied'}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Activando...</span>
              </>
            ) : (
              <>
                <Bell className="w-5 h-5" />
                <span>Activar Notificaciones</span>
              </>
            )}
          </button>
        ) : (
          <>
            <button
              onClick={handleTestNotification}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200"
            >
              <Bell className="w-5 h-5" />
              <span>Enviar Prueba</span>
            </button>
            <button
              onClick={handleDisableNotifications}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Desactivando...</span>
                </>
              ) : (
                <>
                  <BellOff className="w-5 h-5" />
                  <span>Desactivar Notificaciones</span>
                </>
              )}
            </button>
          </>
        )}
      </div>

      {permission === 'denied' && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">
            Has bloqueado las notificaciones. Para activarlas, debes cambiar la configuración en tu navegador.
          </p>
        </div>
      )}
    </div>
  );
}
