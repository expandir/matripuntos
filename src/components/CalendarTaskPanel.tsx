import { useState } from 'react';
import { Clock, Star, ChevronDown } from 'lucide-react';
import TaskIcon from './TaskIcon';
import { CATEGORY_CONFIG, DAY_NAMES_FULL } from '../lib/calendarService';
import type {
  CalendarTask,
  TaskOwnership,
  CalendarTaskCategory,
  TaskFrequency,
  User,
} from '../types';

interface Props {
  tasks: CalendarTask[];
  ownerships: TaskOwnership[];
  user: User;
  partner: User | null;
  onAssign: (taskId: string, ownerId: string, frequency: TaskFrequency, preferredDay?: number) => void;
  onUnassign: (taskId: string) => void;
  onUpdateFrequency: (ownershipId: string, frequency: TaskFrequency, preferredDay?: number) => void;
  hasChildren: boolean;
}

const FREQ_LABELS: Record<TaskFrequency, string> = {
  daily: 'Diaria',
  weekly: 'Semanal',
  biweekly: 'Quincenal',
  monthly: 'Mensual',
  flexible: 'Flexible',
};

const ALL_CATS: CalendarTaskCategory[] = ['hogar', 'hijos', 'gestion', 'social', 'bienestar'];

export default function CalendarTaskPanel({
  tasks,
  ownerships,
  user,
  partner,
  onAssign,
  onUnassign,
  onUpdateFrequency,
  hasChildren,
}: Props) {
  const [activeCat, setActiveCat] = useState<CalendarTaskCategory>('hogar');

  const visibleCats = hasChildren ? ALL_CATS : ALL_CATS.filter((c) => c !== 'hijos');
  const ownerMap = new Map(ownerships.map((o) => [o.task_id, o]));
  const filtered = tasks.filter((t) => t.category === activeCat);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">Gestionar Tareas</h3>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {visibleCats.map((cat) => {
            const cfg = CATEGORY_CONFIG[cat];
            const active = activeCat === cat;
            const assigned = ownerships.filter((o) => tasks.find((t) => t.id === o.task_id)?.category === cat).length;
            const total = tasks.filter((t) => t.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`flex-shrink-0 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? `${cfg.bgColor} ${cfg.color} border ${cfg.borderColor}`
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {cfg.label}
                <span className="ml-1.5 text-xs opacity-70">
                  {assigned}/{total}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="divide-y divide-gray-50 dark:divide-gray-700/50 max-h-[60vh] overflow-y-auto">
        {filtered.map((task) => {
          const own = ownerMap.get(task.id);
          const isAssigned = !!own;
          const cfg = CATEGORY_CONFIG[task.category as CalendarTaskCategory];

          return (
            <div key={task.id} className="p-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl ${cfg.bgColor} flex-shrink-0`}>
                  <TaskIcon name={task.icon} className={`w-5 h-5 ${cfg.color}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-semibold text-gray-800 dark:text-white text-sm">
                      {task.name}
                    </h4>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Star className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                        {task.base_points} pts
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                    {task.description}
                  </p>

                  <span className="flex items-center gap-1 text-[11px] text-gray-400 mt-1">
                    <Clock className="w-3 h-3" />
                    {task.estimated_minutes} min
                  </span>

                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <MiniSelect
                      value={own?.owner_id || ''}
                      onChange={(v) => {
                        if (!v) {
                          onUnassign(task.id);
                        } else {
                          onAssign(task.id, v, own?.frequency || 'weekly', own?.preferred_day ?? undefined);
                        }
                      }}
                      accent={
                        isAssigned
                          ? own?.owner_id === user.id
                            ? 'sky'
                            : 'amber'
                          : 'gray'
                      }
                    >
                      <option value="">Sin asignar</option>
                      <option value={user.id}>{user.name}</option>
                      {partner && <option value={partner.id}>{partner.name}</option>}
                    </MiniSelect>

                    {isAssigned && own && (
                      <>
                        <MiniSelect
                          value={own.frequency}
                          onChange={(v) => onUpdateFrequency(own.id, v as TaskFrequency, own.preferred_day ?? undefined)}
                        >
                          {Object.entries(FREQ_LABELS).map(([k, l]) => (
                            <option key={k} value={k}>{l}</option>
                          ))}
                        </MiniSelect>

                        {(own.frequency === 'weekly' || own.frequency === 'biweekly') && (
                          <MiniSelect
                            value={String(own.preferred_day ?? 0)}
                            onChange={(v) => onUpdateFrequency(own.id, own.frequency, Number(v))}
                          >
                            {DAY_NAMES_FULL.map((name, i) => (
                              <option key={i} value={i}>{name}</option>
                            ))}
                          </MiniSelect>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            {ownerships.length} de {tasks.length} tareas asignadas
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-sky-500" />
              <span className="text-xs text-gray-500">
                {user.name}: {ownerships.filter((o) => o.owner_id === user.id).length}
              </span>
            </span>
            {partner && (
              <span className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-xs text-gray-500">
                  {partner.name}: {ownerships.filter((o) => o.owner_id === partner.id).length}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const ACCENT_CLASSES: Record<string, string> = {
  sky: 'bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300',
  amber: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300',
  gray: 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400',
};

function MiniSelect({
  value,
  onChange,
  accent = 'gray',
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  accent?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none text-xs font-medium pl-3 pr-7 py-1.5 rounded-lg border transition-colors cursor-pointer ${ACCENT_CLASSES[accent] || ACCENT_CLASSES.gray}`}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none text-gray-400" />
    </div>
  );
}
