import { ChevronLeft, ChevronRight, Check, Circle } from 'lucide-react';
import TaskIcon from './TaskIcon';
import {
  getWeekDates,
  formatDateKey,
  getTasksForDay,
  getFlexibleTasks,
  DAY_NAMES,
  CATEGORY_CONFIG,
} from '../lib/calendarService';
import type { TaskOwnership, CalendarEntry, User, CalendarTaskCategory } from '../types';

interface Props {
  weekStart: Date;
  ownerships: TaskOwnership[];
  entries: CalendarEntry[];
  user: User;
  partner: User | null;
  onNavigateWeek: (direction: number) => void;
  onComplete: (taskId: string, taskName: string, date: string, points: number) => void;
  onUncomplete: (entryId: string, points: number) => void;
}

export default function CalendarWeekView({
  weekStart,
  ownerships,
  entries,
  user,
  partner,
  onNavigateWeek,
  onComplete,
  onUncomplete,
}: Props) {
  const dates = getWeekDates(weekStart);
  const today = formatDateKey(new Date());
  const flexibleTasks = getFlexibleTasks(ownerships);

  const getEntry = (taskId: string, dateKey: string) =>
    entries.find((e) => e.task_id === taskId && e.scheduled_date === dateKey && e.completed);

  const toggleCompletion = (ownership: TaskOwnership, dateKey: string) => {
    const entry = getEntry(ownership.task_id, dateKey);
    if (entry) {
      onUncomplete(entry.id, entry.points_earned);
    } else {
      const task = ownership.task;
      if (!task) return;
      onComplete(task.id, task.name, dateKey, task.base_points);
    }
  };

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const weekTitle = `${weekStart.getDate()} ${weekStart.toLocaleDateString('es-ES', { month: 'short' })} - ${weekEnd.getDate()} ${weekEnd.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}`;

  const getOwnerColor = (ownerId: string) =>
    ownerId === user.id ? 'bg-sky-500' : 'bg-amber-500';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
        <button
          onClick={() => onNavigateWeek(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <h3 className="font-semibold text-gray-800 dark:text-white capitalize">{weekTitle}</h3>
        <button
          onClick={() => onNavigateWeek(1)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {ownerships.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No hay tareas asignadas. Ve a la pestana "Tareas" para empezar a distribuir
            responsabilidades.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-7 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-700">
            {dates.map((date, dayIndex) => {
              const dateKey = formatDateKey(date);
              const isToday = dateKey === today;
              const dayTasks = getTasksForDay(dayIndex, ownerships);

              return (
                <div
                  key={dayIndex}
                  className={`min-h-[100px] md:min-h-[140px] ${isToday ? 'bg-sky-50/50 dark:bg-sky-900/10' : ''}`}
                >
                  <div
                    className={`p-2 text-center border-b border-gray-50 dark:border-gray-700/50 ${
                      isToday
                        ? 'bg-sky-100 dark:bg-sky-900/30'
                        : 'bg-gray-50 dark:bg-gray-800'
                    }`}
                  >
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {DAY_NAMES[dayIndex]}
                    </div>
                    <div
                      className={`text-lg font-bold ${
                        isToday
                          ? 'text-sky-600 dark:text-sky-400'
                          : 'text-gray-800 dark:text-white'
                      }`}
                    >
                      {date.getDate()}
                    </div>
                  </div>

                  <div className="p-1.5 space-y-1">
                    {dayTasks.length === 0 ? (
                      <p className="text-[10px] text-gray-400 text-center py-3 hidden md:block">
                        --
                      </p>
                    ) : (
                      dayTasks.map((ownership) => {
                        const task = ownership.task;
                        if (!task) return null;
                        const completed = !!getEntry(ownership.task_id, dateKey);
                        const catConfig =
                          CATEGORY_CONFIG[task.category as CalendarTaskCategory];

                        return (
                          <button
                            key={ownership.id}
                            onClick={() => toggleCompletion(ownership, dateKey)}
                            className={`w-full text-left p-1.5 rounded-lg transition-all duration-150 group ${
                              completed
                                ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
                                : `${catConfig.bgColor} border ${catConfig.borderColor} hover:shadow-sm`
                            }`}
                          >
                            <div className="flex items-start gap-1.5">
                              <div className="mt-0.5 flex-shrink-0">
                                {completed ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                ) : (
                                  <Circle className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div
                                  className={`text-[11px] font-medium leading-tight truncate ${
                                    completed
                                      ? 'text-emerald-700 dark:text-emerald-300 line-through'
                                      : 'text-gray-700 dark:text-gray-200'
                                  }`}
                                >
                                  {task.name}
                                </div>
                                <div className="flex items-center gap-1 mt-0.5">
                                  <div
                                    className={`w-1.5 h-1.5 rounded-full ${getOwnerColor(ownership.owner_id)}`}
                                  />
                                  <span className="text-[9px] text-gray-500 dark:text-gray-400">
                                    {task.base_points}pts
                                  </span>
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {flexibleTasks.length > 0 && (
            <div className="p-4 border-t border-gray-100 dark:border-gray-700">
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Tareas flexibles / mensuales
              </h4>
              <div className="flex flex-wrap gap-2">
                {flexibleTasks.map((ownership) => {
                  const task = ownership.task;
                  if (!task) return null;
                  return (
                    <div
                      key={ownership.id}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-xs"
                    >
                      <TaskIcon
                        name={task.icon}
                        className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400"
                      />
                      <span className="text-gray-700 dark:text-gray-300">{task.name}</span>
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${getOwnerColor(ownership.owner_id)}`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {ownerships.length > 0 && (
        <div className="p-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-sky-500" />
            {user.name}
          </span>
          {partner && (
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              {partner.name}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
