import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Award, Target, Trophy } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useAuth } from '../hooks/useAuth';
import {
  getOverallStats,
  getPointsOverTime,
  getCategoryStats,
  getRewardStats,
  type OverallStats,
  type PointsOverTime,
  type CategoryStats,
  type RewardStats
} from '../lib/statisticsService';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Statistics() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [overallStats, setOverallStats] = useState<OverallStats | null>(null);
  const [pointsOverTime, setPointsOverTime] = useState<PointsOverTime[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [rewardStats, setRewardStats] = useState<RewardStats[]>([]);
  const [timePeriod, setTimePeriod] = useState(30);

  useEffect(() => {
    loadStatistics();
  }, [user, timePeriod]);

  const loadStatistics = async () => {
    if (!user?.couple_id) return;

    try {
      setLoading(true);
      const [overall, pointsData, categoryData, rewardData] = await Promise.all([
        getOverallStats(user.couple_id),
        getPointsOverTime(user.couple_id, timePeriod),
        getCategoryStats(user.couple_id),
        getRewardStats(user.couple_id)
      ]);

      setOverallStats(overall);
      setPointsOverTime(pointsData);
      setCategoryStats(categoryData);
      setRewardStats(rewardData);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  const comparisonData = overallStats ? [
    { name: 'Ganados', value: overallStats.totalPointsGained, color: '#10b981' },
    { name: 'Gastados', value: overallStats.totalPointsSpent, color: '#ef4444' }
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Estadísticas</h1>
        </div>

        {overallStats && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-200">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <span className="text-sm text-gray-600">Puntos Ganados</span>
              </div>
              <p className="text-3xl font-bold text-green-600">{overallStats.totalPointsGained}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-red-200">
              <div className="flex items-center gap-3 mb-2">
                <TrendingDown className="w-6 h-6 text-red-600" />
                <span className="text-sm text-gray-600">Puntos Gastados</span>
              </div>
              <p className="text-3xl font-bold text-red-600">{overallStats.totalPointsSpent}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-6 h-6 text-blue-600" />
                <span className="text-sm text-gray-600">Recompensas</span>
              </div>
              <p className="text-3xl font-bold text-blue-600">{overallStats.totalRewards}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-200">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-6 h-6 text-purple-600" />
                <span className="text-sm text-gray-600">Desafíos</span>
              </div>
              <p className="text-3xl font-bold text-purple-600">{overallStats.completedChallenges}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-yellow-200">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-6 h-6 text-yellow-600" />
                <span className="text-sm text-gray-600">Logros</span>
              </div>
              <p className="text-3xl font-bold text-yellow-600">{overallStats.totalAchievements}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-indigo-200">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
                <span className="text-sm text-gray-600">Saldo Actual</span>
              </div>
              <p className="text-3xl font-bold text-indigo-600">{overallStats.currentPoints}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Evolución de Puntos</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setTimePeriod(7)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timePeriod === 7
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                7 días
              </button>
              <button
                onClick={() => setTimePeriod(30)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timePeriod === 30
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                30 días
              </button>
              <button
                onClick={() => setTimePeriod(90)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timePeriod === 90
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                90 días
              </button>
            </div>
          </div>

          {pointsOverTime.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={pointsOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="gained"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Ganados"
                  dot={{ fill: '#10b981', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="spent"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Gastados"
                  dot={{ fill: '#ef4444', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No hay datos suficientes para mostrar
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Puntos por Categoría</h2>
            {categoryStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="points"
                  >
                    {categoryStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No hay datos de categorías
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Ganados vs Gastados</h2>
            {comparisonData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="value" name="Puntos">
                    {comparisonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No hay datos para comparar
              </div>
            )}
          </div>
        </div>

        {rewardStats.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Recompensas Más Canjeadas</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={rewardStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={150}
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="timesRedeemed" fill="#3b82f6" name="Veces canjeada" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
