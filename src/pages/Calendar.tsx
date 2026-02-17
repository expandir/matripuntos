import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Settings,
  CalendarDays,
  ListTodo,
  Scale,
  CalendarCheck,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import CalendarSetup from '../components/CalendarSetup';
import CalendarWeekView from '../components/CalendarWeekView';
import CalendarTaskPanel from '../components/CalendarTaskPanel';
import CalendarFairness from '../components/CalendarFairness';
import * as svc from '../lib/calendarService';
import type {
  CalendarTask,
  TaskOwnership,
  MemberWorkConfig,
  CalendarEntry,
  Couple,
  User,
  TaskFrequency,
  FairnessResult,
} from '../types';
import toast from 'react-hot-toast';

type Tab = 'calendar' | 'tasks' | 'balance';

export default function Calendar() {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [couple, setCouple] = useState<Couple | null>(null);
  const [partner, setPartner] = useState<User | null>(null);
  const [tasks, setTasks] = useState<CalendarTask[]>([]);
  const [ownerships, setOwnerships] = useState<TaskOwnership[]>([]);
  const [workConfigs, setWorkConfigs] = useState<MemberWorkConfig[]>([]);
  const [entries, setEntries] = useState<CalendarEntry[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('calendar');
  const [showSetup, setShowSetup] = useState(false);
  const [weekStart, setWeekStart] = useState(() => svc.getWeekStart(new Date()));

  const coupleId = userProfile?.couple_id;
  const enabled = !!couple?.calendar_enabled;

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (!coupleId) { navigate('/link'); return; }
    loadInitial();
  }, [user, userProfile]);

  const loadInitial = async () => {
    if (!coupleId || !user) return;
    try {
      const [coupleRes, partnerRes, taskData] = await Promise.all([
        supabase.from('couples').select('*').eq('id', coupleId).maybeSingle(),
        supabase.from('users').select('*').eq('couple_id', coupleId).neq('id', user.id).maybeSingle(),
        svc.getAllTasks(),
      ]);
      if (coupleRes.data) setCouple(coupleRes.data as Couple);
      if (partnerRes.data) setPartner(partnerRes.data as User);
      setTasks(taskData);
      if (coupleRes.data?.calendar_enabled) await loadCalendar();
    } catch (err) {
      console.error('Calendar load error:', err);
      toast.error('Error al cargar el calendario');
    } finally {
      setLoading(false);
    }
  };

  const loadCalendar = useCallback(async () => {
    if (!coupleId) return;
    try {
      const end = new Date(weekStart);
      end.setDate(end.getDate() + 6);
      const [own, cfg, ent] = await Promise.all([
        svc.getTaskOwnerships(coupleId),
        svc.getMemberWorkConfigs(coupleId),
        svc.getCalendarEntries(coupleId, svc.formatDateKey(weekStart), svc.formatDateKey(end)),
      ]);
      setOwnerships(own);
      setWorkConfigs(cfg);
      setEntries(ent);
    } catch (err) {
      console.error('Calendar data error:', err);
    }
  }, [coupleId, weekStart]);

  useEffect(() => {
    if (enabled) loadCalendar();
  }, [enabled, loadCalendar]);

  const handleEnable = async () => {
    if (!coupleId) return;
    try {
      await svc.toggleCalendar(coupleId, true);
      setCouple((p) => (p ? { ...p, calendar_enabled: true } : null));
      toast.success('Calendario activado');
      loadCalendar();
    } catch {
      toast.error('Error al activar el calendario');
    }
  };

  const handleAssign = async (taskId: string, ownerId: string, freq: TaskFrequency, day?: number) => {
    if (!coupleId) return;
    try {
      await svc.assignTask(coupleId, taskId, ownerId, freq, day);
      await loadCalendar();
    } catch {
      toast.error('Error al asignar tarea');
    }
  };

  const handleUnassign = async (taskId: string) => {
    if (!coupleId) return;
    try {
      await svc.unassignTask(coupleId, taskId);
      await loadCalendar();
    } catch {
      toast.error('Error al desasignar tarea');
    }
  };

  const handleFrequency = async (id: string, freq: TaskFrequency, day?: number) => {
    try {
      await svc.updateTaskFrequency(id, freq, day);
      await loadCalendar();
    } catch {
      toast.error('Error al actualizar frecuencia');
    }
  };

  const handleComplete = async (taskId: string, name: string, date: string, pts: number) => {
    if (!coupleId || !user) return;
    try {
      await svc.completeCalendarTask(coupleId, taskId, user.id, name, date, pts);
      await loadCalendar();
      toast.success(`+${pts} puntos`);
    } catch {
      toast.error('Error al completar tarea');
    }
  };

  const handleUncomplete = async (entryId: string, pts: number) => {
    if (!coupleId) return;
    try {
      await svc.uncompleteEntry(entryId, coupleId, pts);
      await loadCalendar();
    } catch {
      toast.error('Error al deshacer');
    }
  };

  const handleSaveConfig = async (income: number, hours: number) => {
    if (!coupleId || !user) return;
    try {
      await svc.upsertMemberWorkConfig(coupleId, user.id, income, hours);
      await loadCalendar();
      toast.success('Configuracion guardada');
    } catch {
      toast.error('Error al guardar');
    }
  };

  const navigateWeek = (dir: number) => {
    setWeekStart((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() + dir * 7);
      return next;
    });
  };

  const fairness: FairnessResult =
    partner && user
      ? svc.calculateFairness(workConfigs, ownerships, tasks, user.id, partner.id)
      : {
          score: 0,
          member1ExpectedShare: 0.5,
          member2ExpectedShare: 0.5,
          member1ActualShare: 0.5,
          member2ActualShare: 0.5,
          member1TotalPoints: 0,
          member2TotalPoints: 0,
          suggestion: 'Vincula con tu pareja para ver el equilibrio.',
        };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500" />
      </div>
    );
  }

  if (!enabled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-20 md:pb-4">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-sky-500 to-teal-500 rounded-2xl mb-6 shadow-lg">
              <CalendarCheck className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">
              Calendario de Tareas
            </h1>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg mx-auto">
              Organiza las responsabilidades del hogar con tu pareja. Asigna quien se encarga de
              cada tarea de principio a fin, incluyendo la planificacion y gestion completa.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: ListTodo, color: 'text-sky-500', title: 'Asigna tareas', desc: 'Decide quien se encarga de cada area del hogar' },
                { icon: CalendarDays, color: 'text-teal-500', title: 'Calendario semanal', desc: 'Visualiza y completa tareas en el calendario' },
                { icon: Scale, color: 'text-emerald-500', title: 'Equilibrio justo', desc: 'Ajusta segun ingresos y horas de trabajo' },
              ].map(({ icon: I, color, title, desc }) => (
                <div key={title} className="text-center p-4">
                  <I className={`w-8 h-8 ${color} mx-auto mb-2`} />
                  <h3 className="font-semibold text-gray-800 dark:text-white text-sm mb-1">
                    {title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
            <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
              <strong>Opcional:</strong> Este sistema complementa el de puntos. Activalo solo si
              quereis organizar la distribucion de tareas del hogar.
            </p>
          </div>

          <button
            onClick={handleEnable}
            className="w-full py-4 bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white font-bold text-lg rounded-xl transition-all transform hover:scale-[1.01] shadow-lg"
          >
            Activar Calendario de Tareas
          </button>
        </main>
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'calendar', label: 'Semana', icon: CalendarDays },
    { key: 'tasks', label: 'Tareas', icon: ListTodo },
    { key: 'balance', label: 'Equilibrio', icon: Scale },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-20 md:pb-4">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-white/70 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Calendario de Tareas
            </h1>
          </div>
          <button
            onClick={() => setShowSetup(true)}
            className="p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700"
          >
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <div className="flex gap-1 bg-white dark:bg-gray-800 p-1 rounded-xl shadow-sm">
          {tabs.map(({ key, label, icon: TabIcon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === key
                  ? 'bg-gradient-to-r from-sky-500 to-teal-500 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <TabIcon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'calendar' && (
          <CalendarWeekView
            weekStart={weekStart}
            ownerships={ownerships}
            entries={entries}
            user={userProfile!}
            partner={partner}
            onNavigateWeek={navigateWeek}
            onComplete={handleComplete}
            onUncomplete={handleUncomplete}
          />
        )}

        {activeTab === 'tasks' && (
          <CalendarTaskPanel
            tasks={tasks}
            ownerships={ownerships}
            user={userProfile!}
            partner={partner}
            onAssign={handleAssign}
            onUnassign={handleUnassign}
            onUpdateFrequency={handleFrequency}
            hasChildren={!!couple?.has_children}
          />
        )}

        {activeTab === 'balance' && (
          <CalendarFairness
            fairness={fairness}
            user={userProfile!}
            partner={partner}
            workConfigs={workConfigs}
            hasConfig={workConfigs.length > 0}
          />
        )}
      </main>

      {showSetup && (
        <CalendarSetup
          user={userProfile!}
          partner={partner}
          workConfigs={workConfigs}
          onSave={handleSaveConfig}
          onClose={() => setShowSetup(false)}
        />
      )}
    </div>
  );
}
