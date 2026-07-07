import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Award, BookOpen, Clock, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { analyticsAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

const COLORS = {
  'DSA': '#6366f1',
  'Full Stack': '#0ea5e9',
  'Aptitude': '#a855f7',
  'Projects': '#f59e0b',
  'Other': '#64748b'
};

const Analytics = () => {
  const { addToast } = useToast();
  const [stats, setStats] = useState(null);
  const [studyData, setStudyData] = useState(null);
  const [readiness, setReadiness] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [statsRes, studyRes, readinessRes] = await Promise.all([
        analyticsAPI.getDashboardStats(),
        analyticsAPI.getStudyAnalytics(),
        analyticsAPI.getPlacementReadiness(),
      ]);
      setStats(statsRes.data);
      setStudyData(studyRes.data);
      setReadiness(readinessRes.data);
    } catch (err) {
      console.error('Analytics load error:', err);
      addToast('Failed to load study analytics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const getPieData = () => {
    if (!studyData?.categoryBreakdown) return [];
    const breakdown = studyData.categoryBreakdown;
    
    return Object.entries(breakdown).map(([category, seconds]) => ({
      name: category,
      value: Math.round((seconds / 3600) * 10) / 10, // convert to hours
    })).filter(item => item.value > 0);
  };

  const getReadinessColor = (score) => {
    if (score >= 75) return 'text-success-400';
    if (score >= 50) return 'text-warning-400';
    return 'text-danger-400';
  };

  const pieData = getPieData();

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Top Banner */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold mb-1 flex items-center gap-2">
          <BarChart3 className="text-accent-400" /> Analytics Hub
        </h1>
        <p className="text-dark-400">Deep-dive into your placement preparation progress, weak spots, and readiness insights.</p>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="skeleton h-80 rounded-xl" />
            <div className="skeleton h-80 lg:col-span-2 rounded-xl" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="skeleton h-72 rounded-xl" />
            <div className="skeleton h-72 rounded-xl" />
          </div>
        </div>
      ) : (
        <>
          {/* Top Row: Readiness Dial & Domain Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Readiness Gauge */}
            <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
              <h3 className="font-bold text-sm text-dark-300 self-start mb-6">Placement Readiness</h3>
              
              <div className="relative w-44 h-44 mb-4">
                <svg className="w-44 h-44 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(148,163,184,0.05)" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="url(#readinessGrad)"
                    strokeWidth="8"
                    strokeDasharray={`${(readiness?.readiness || 0) * 2.6389} 263.89`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="readinessGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-4xl font-black ${getReadinessColor(readiness?.readiness)}`}>
                    {readiness?.readiness || 0}%
                  </span>
                  <span className="text-[9px] text-dark-500 font-bold uppercase tracking-wider mt-1">Readiness Score</span>
                </div>
              </div>
              <p className="text-xs text-dark-400 leading-relaxed px-4">
                Weighted index score based on DSA completions, aptitude accuracy, full-stack blocks, and project checklist accomplishments.
              </p>
            </div>

            {/* Domain Progress List */}
            <div className="glass-card p-6 lg:col-span-2 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm text-dark-300 mb-5">Preparations Status Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {/* DSA */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-dark-300">DSA Tracker</span>
                      <span className="text-primary-400 font-bold">{stats?.dsa?.percentage || 0}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill !bg-indigo-500" style={{ width: `${stats?.dsa?.percentage || 0}%` }} />
                    </div>
                    <p className="text-[10px] text-dark-500">{stats?.dsa?.completed || 0} of {stats?.dsa?.total || 0} problems solved</p>
                  </div>

                  {/* Full Stack */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-dark-300">Full Stack Path</span>
                      <span className="text-cyan-400 font-bold">{stats?.fullstack?.percentage || 0}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill !bg-cyan-500" style={{ width: `${stats?.fullstack?.percentage || 0}%` }} />
                    </div>
                    <p className="text-[10px] text-dark-500">{stats?.fullstack?.completed || 0} of {stats?.fullstack?.total || 0} lessons completed</p>
                  </div>

                  {/* Aptitude */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-dark-300">Aptitude Accuracy</span>
                      <span className="text-purple-400 font-bold">{stats?.aptitude?.accuracy || 0}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill !bg-purple-500" style={{ width: `${stats?.aptitude?.accuracy || 0}%` }} />
                    </div>
                    <p className="text-[10px] text-dark-500">{stats?.aptitude?.totalQuestions || 0} practice questions logged</p>
                  </div>

                  {/* Projects */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-dark-300">Projects milestones</span>
                      <span className="text-amber-400 font-bold">{stats?.projects?.percentage || 0}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill !bg-amber-500" style={{ width: `${stats?.projects?.percentage || 0}%` }} />
                    </div>
                    <p className="text-[10px] text-dark-500">{stats?.projects?.completedTasks || 0} of {stats?.projects?.tasks || 0} checklist tasks checked</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-white/5 mt-4 text-xs text-dark-400">
                <Award size={14} className="text-primary-400" />
                <span>Overall placement preparedness average completed: {stats?.overallCompletion || 0}%</span>
              </div>
            </div>
          </div>

          {/* Bottom Row: Hours Bar Chart and Focus Pie Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Study Hours */}
            <div className="glass-card p-5">
              <h3 className="font-bold text-sm mb-4 text-primary-400 flex items-center gap-1.5">
                <Clock size={16} /> Study Duration (Hours / Day)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={studyData?.weeklyData || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.05)" />
                    <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: '#1e293b', border: '1px solid rgba(148,163,184,0.1)', borderRadius: 8 }}
                      labelStyle={{ color: '#e2e8f0' }}
                    />
                    <Bar dataKey="hours" name="Study Hours" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Focus Distribution Donut Chart */}
            <div className="glass-card p-5">
              <h3 className="font-bold text-sm mb-4 text-accent-400 flex items-center gap-1.5">
                <Activity size={16} /> Focus Domain Distribution
              </h3>
              <div className="h-64 flex flex-col md:flex-row items-center justify-center">
                {pieData.length === 0 ? (
                  <p className="text-xs text-dark-500 py-20">No study time sessions logged this week.</p>
                ) : (
                  <>
                    <div className="w-full md:w-1/2 h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={75}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[entry.name] || COLORS['Other']} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{ background: '#1e293b', border: '1px solid rgba(148,163,184,0.1)', borderRadius: 8 }}
                            labelStyle={{ color: '#e2e8f0' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    {/* Manual Custom Legend */}
                    <div className="w-full md:w-1/2 space-y-2 mt-4 md:mt-0 px-4">
                      {pieData.map((entry, index) => (
                        <div key={entry.name} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[entry.name] || COLORS['Other'] }} />
                            <span className="text-dark-300 font-medium">{entry.name}</span>
                          </div>
                          <span className="font-bold text-dark-400">{entry.value} hrs</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
