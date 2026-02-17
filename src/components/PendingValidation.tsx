import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Clock, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { PendingPoints, User as UserType } from '../types';
import toast from 'react-hot-toast';

interface PendingValidationProps {
  coupleId: string;
  currentUserId: string;
  onPointsValidated?: () => void;
}

interface PendingPointsWithUser extends PendingPoints {
  user?: UserType;
}

export default function PendingValidation({ coupleId, currentUserId, onPointsValidated }: PendingValidationProps) {
  const [pendingPoints, setPendingPoints] = useState<PendingPointsWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingPoints();

    const subscription = supabase
      .channel('pending-points-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pending_points',
          filter: `couple_id=eq.${coupleId}`,
        },
        () => {
          loadPendingPoints();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [coupleId]);

  const loadPendingPoints = async () => {
    try {
      const { data: pointsData, error } = await supabase
        .from('pending_points')
        .select('*')
        .eq('couple_id', coupleId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (pointsData && pointsData.length > 0) {
        const userIds = [...new Set(pointsData.map(p => p.user_id))];
        const { data: usersData } = await supabase
          .from('users')
          .select('*')
          .in('id', userIds);

        const pointsWithUsers = pointsData.map(point => ({
          ...point,
          user: usersData?.find(u => u.id === point.user_id),
        }));

        setPendingPoints(pointsWithUsers);
      } else {
        setPendingPoints([]);
      }
    } catch (error) {
      console.error('Error loading pending points:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (pointId: string, approve: boolean) => {
    try {
      const point = pendingPoints.find(p => p.id === pointId);
      if (!point) return;

      const { error: updateError } = await supabase
        .from('pending_points')
        .update({
          status: approve ? 'approved' : 'rejected',
          reviewed_by: currentUserId,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', pointId);

      if (updateError) throw updateError;

      if (approve) {
        const { error: pointsError } = await supabase.rpc('add_points', {
          p_couple_id: coupleId,
          p_amount: point.points,
        });

        if (pointsError) throw pointsError;

        const { error: historyError } = await supabase.from('history').insert({
          couple_id: coupleId,
          user_id: point.user_id,
          points: point.points,
          type: 'gain',
          description: point.description,
        });

        if (historyError) throw historyError;

        if (point.catalog_item_id) {
          await supabase.from('catalog_completions').insert({
            couple_id: coupleId,
            user_id: point.user_id,
            catalog_item_id: point.catalog_item_id,
          });
        }

        toast.success('Puntos aprobados');
      } else {
        toast.success('Puntos rechazados');
      }

      if (onPointsValidated) {
        onPointsValidated();
      }

      loadPendingPoints();
    } catch (error: any) {
      console.error('Error validating points:', error);
      const msg = error?.message || error?.details || 'Error desconocido';
      toast.error(`Error al validar: ${msg}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const myPendingPoints = pendingPoints.filter(p => p.user_id === currentUserId);
  const partnerPendingPoints = pendingPoints.filter(p => p.user_id !== currentUserId);
  const partnerName = partnerPendingPoints[0]?.user?.name
    || myPendingPoints[0]?.user?.name
      ? 'tu pareja'
      : 'tu pareja';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-orange-500" />
          Validar puntos de tu pareja
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 ml-7">
          Aprueba o rechaza los puntos que tu pareja ha registrado
        </p>

        {partnerPendingPoints.length > 0 ? (
          <div className="space-y-3">
            {partnerPendingPoints.map((point) => (
              <div
                key={point.id}
                className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {point.user?.name}
                      </p>
                    </div>
                    <p className="text-gray-800 dark:text-white font-medium">
                      {point.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(point.created_at).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    +{point.points}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleValidate(point.id, true)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Aprobar
                  </button>
                  <button
                    onClick={() => handleValidate(point.id, false)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
                  >
                    <XCircle className="w-4 h-4" />
                    Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
            <Clock className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tu pareja no tiene puntos pendientes de tu aprobacion
            </p>
          </div>
        )}
      </div>

      {myPendingPoints.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            Tus puntos esperando aprobacion
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 ml-7">
            Estos puntos seran sumados cuando tu pareja los apruebe
          </p>
          <div className="space-y-3">
            {myPendingPoints.map((point) => (
              <div
                key={point.id}
                className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-gray-800 dark:text-white font-medium">
                      {point.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(point.created_at).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    +{point.points}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pendingPoints.length === 0 && (
        <div className="text-center py-6 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
          <Clock className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No hay puntos pendientes de validacion
          </p>
        </div>
      )}
    </div>
  );
}
