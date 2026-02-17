import { TrendingUp, Info } from 'lucide-react';
import type { FairnessResult, User, MemberWorkConfig } from '../types';

interface Props {
  fairness: FairnessResult;
  user: User;
  partner: User | null;
  workConfigs: MemberWorkConfig[];
  hasConfig: boolean;
}

export default function CalendarFairness({
  fairness,
  user,
  partner,
  workConfigs,
  hasConfig,
}: Props) {
  const myConfig = workConfigs.find((c) => c.user_id === user.id);
  const partnerConfig = partner ? workConfigs.find((c) => c.user_id === partner.id) : null;

  if (!hasConfig) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Equilibrio
        </h3>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 text-center">
          <Info className="w-10 h-10 text-gray-300 dark:text-gray-500 mx-auto mb-3" />
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            Configura los ingresos y horas de trabajo desde el icono de ajustes para ver el analisis
            de equilibrio.
          </p>
        </div>
      </div>
    );
  }

  const getStyle = (score: number) => {
    if (score >= 85)
      return {
        text: 'text-emerald-600 dark:text-emerald-400',
        bar: 'bg-emerald-500',
        label: 'Bien equilibrado',
      };
    if (score >= 60)
      return {
        text: 'text-amber-600 dark:text-amber-400',
        bar: 'bg-amber-500',
        label: 'Mejorable',
      };
    return {
      text: 'text-red-600 dark:text-red-400',
      bar: 'bg-red-500',
      label: 'Desequilibrado',
    };
  };

  const s = getStyle(fairness.score);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg space-y-6">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
        <TrendingUp className="w-5 h-5" />
        Equilibrio del Hogar
      </h3>

      <div className="text-center">
        <div className={`text-5xl font-bold ${s.text}`}>{fairness.score}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.label}</div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-4">
          <div
            className={`h-2.5 rounded-full transition-all duration-700 ease-out ${s.bar}`}
            style={{ width: `${fairness.score}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        <MemberBar
          name={user.name}
          dotColor="bg-sky-500"
          barColor="bg-sky-500"
          barBg="bg-sky-500/30 border-sky-500"
          totalPoints={fairness.member1TotalPoints}
          expectedShare={fairness.member1ExpectedShare}
          actualShare={fairness.member1ActualShare}
        />
        {partner && (
          <MemberBar
            name={partner.name}
            dotColor="bg-amber-500"
            barColor="bg-amber-500"
            barBg="bg-amber-500/30 border-amber-500"
            totalPoints={fairness.member2TotalPoints}
            expectedShare={fairness.member2ExpectedShare}
            actualShare={fairness.member2ActualShare}
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-sky-50 dark:bg-sky-900/10 rounded-xl p-3">
          <p className="text-xs text-sky-600 dark:text-sky-400 font-medium">{user.name}</p>
          <p className="text-sm text-gray-700 dark:text-gray-200 mt-0.5">
            {myConfig
              ? `${Number(myConfig.monthly_income).toLocaleString('es-ES')} EUR · ${Number(myConfig.weekly_work_hours)}h/sem`
              : 'Sin configurar'}
          </p>
        </div>
        {partner && (
          <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl p-3">
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
              {partner.name}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-200 mt-0.5">
              {partnerConfig
                ? `${Number(partnerConfig.monthly_income).toLocaleString('es-ES')} EUR · ${Number(partnerConfig.weekly_work_hours)}h/sem`
                : 'Sin configurar'}
            </p>
          </div>
        )}
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          {fairness.suggestion}
        </p>
      </div>
    </div>
  );
}

function MemberBar({
  name,
  dotColor,
  barColor,
  barBg,
  totalPoints,
  expectedShare,
  actualShare,
}: {
  name: string;
  dotColor: string;
  barColor: string;
  barBg: string;
  totalPoints: number;
  expectedShare: number;
  actualShare: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-200">
          <div className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
          {name}
        </span>
        <span className="text-sm font-semibold text-gray-800 dark:text-white">
          {totalPoints} pts/sem
        </span>
      </div>
      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-5 relative overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 ${barBg} rounded-full border-r-2 border-dashed`}
          style={{ width: `${Math.max(expectedShare * 100, 2)}%` }}
        />
        <div
          className={`absolute inset-y-0 left-0 ${barColor} rounded-full flex items-center justify-end pr-2 transition-all duration-500`}
          style={{ width: `${Math.max(actualShare * 100, 2)}%` }}
        >
          {actualShare > 0.15 && (
            <span className="text-[10px] font-bold text-white">
              {Math.round(actualShare * 100)}%
            </span>
          )}
        </div>
      </div>
      <div className="text-[10px] text-gray-400 mt-0.5">
        Esperado: {Math.round(expectedShare * 100)}%
      </div>
    </div>
  );
}
