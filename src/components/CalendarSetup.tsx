import { useState } from 'react';
import { X, Wallet, Briefcase } from 'lucide-react';
import type { MemberWorkConfig, User } from '../types';

interface Props {
  user: User;
  partner: User | null;
  workConfigs: MemberWorkConfig[];
  onSave: (income: number, hours: number) => Promise<void>;
  onClose: () => void;
}

export default function CalendarSetup({ user, partner, workConfigs, onSave, onClose }: Props) {
  const myConfig = workConfigs.find((c) => c.user_id === user.id);
  const partnerConfig = partner ? workConfigs.find((c) => c.user_id === partner.id) : null;

  const [income, setIncome] = useState(myConfig ? Number(myConfig.monthly_income) : 0);
  const [hours, setHours] = useState(myConfig ? Number(myConfig.weekly_work_hours) : 40);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(income, hours);
      onClose();
    } catch {
      /* handled by parent */
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Configurar Equilibrio
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Valores pactados entre la pareja
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-sky-500" />
              {user.name} (tu)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                  <Wallet className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                  Ingresos/mes
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={income || ''}
                    onChange={(e) => setIncome(Math.max(0, Number(e.target.value)))}
                    placeholder="0"
                    className="w-full px-3 py-2.5 pr-10 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 dark:text-white"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    EUR
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                  <Briefcase className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                  Horas/semana
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={hours || ''}
                    onChange={(e) => setHours(Math.min(80, Math.max(0, Number(e.target.value))))}
                    placeholder="40"
                    className="w-full px-3 py-2.5 pr-6 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 dark:text-white"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    h
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700" />

          {partner && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                {partner.name}
              </h3>
              {partnerConfig ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Ingresos/mes</p>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">
                      {Number(partnerConfig.monthly_income).toLocaleString('es-ES')} EUR
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Horas/semana</p>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">
                      {Number(partnerConfig.weekly_work_hours)} h
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    {partner.name} aun no ha configurado sus datos. Pidele que entre al calendario
                    para configurar sus valores.
                  </p>
                </div>
              )}
            </div>
          )}

          <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
            Estos valores se usan para calcular una distribucion justa de tareas. No se comparten
            fuera de la pareja. Los ingresos y horas son valores pactados, no tienen que ser exactos.
          </p>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 disabled:opacity-50 text-white font-semibold rounded-xl transition-all"
          >
            {saving ? 'Guardando...' : 'Guardar mis datos'}
          </button>
        </div>
      </div>
    </div>
  );
}
