import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Flame, Clock, BarChart3, Target, Code2, Layers, Brain,
  FolderKanban, ChevronRight, TrendingUp, BookOpen, Zap,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import { analyticsAPI, goalsAPI, revisionAPI, timerAPI } from '../../services/api';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [studyData, setStudyData] = useState(null);
  const [todayGoal, setTodayGoal] = useState(null);
  const [revisions, setRevisions] = useState([]);
  const [todayTime, setTodayTime] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, studyRes, goalRes, revRes, timeRes] = await Promise.all([
          analyticsAPI.getDashboardStats(),
          analyticsAPI.getStudyAnalytics(),
          goalsAPI.getTodayGoal(),
          revisionAPI.getTodayRevisions(),
          timerAPI.getTodayTime(),
        ]);
        setStats(statsRes.data);
        setStudyData(studyRes.data);
        setTodayGoal(goalRes.data);
        setRevisions(revRes.data);
        setTodayTime(timeRes.data.totalSeconds);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-24 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton h-28 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="skeleton h-64 rounded-xl" />
          <div className="skeleton h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  const moduleCards = [
    { icon: Code2, label: 'DSA Tracker', path: '/dsa', color: 'from-indigo-500 to-purple-600', stat: `${stats?.dsa?.completed || 0}/${stats?.dsa?.total || 0}`, pct: stats?.dsa?.percentage || 0 },
    { icon: Layers, label: 'Full Stack', path: '/fullstack', color: 'from-cyan-500 to-blue-600', stat: `${stats?.fullstack?.completed || 0}/${stats?.fullstack?.total || 0}`, pct: stats?.fullstack?.percentage || 0 },
    { icon: Brain, label: 'Aptitude', path: '/aptitude', color: 'from-violet-500 to-pink-600', stat: `${stats?.aptitude?.accuracy || 0}%`, pct: stats?.aptitude?.accuracy || 0 },
    { icon: FolderKanban, label: 'Projects', path: '/projects', color: 'from-amber-500 to-orange-600', stat: `${stats?.projects?.completedTasks || 0}/${stats?.projects?.tasks || 0}`, pct: stats?.projects?.percentage || 0 },
  ];

  const goalPct = todayGoal
    ? Math.round(
        ((Math.min(todayGoal.dsaCompleted, todayGoal.dsaTarget) +
          Math.min(todayGoal.fullstackCompleted, todayGoal.fullstackTarget) +
          Math.min(todayGoal.aptitudeCompleted, todayGoal.aptitudeTarget) +
          Math.min(todayGoal.projectCompleted, todayGoal.projectTarget)) /
          (todayGoal.dsaTarget + todayGoal.fullstackTarget + todayGoal.aptitudeTarget + todayGoal.projectTarget)) *
          100
      )
    : 0;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-[1400px]">
      {/* Welcome Banner */}
      <motion.div variants={item} className="glass-card p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <h1 className="text-2xl lg:text-3xl font-bold mb-1">
            {getGreeting()}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-dark-400">Let's make today count. Your placement journey continues!</p>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-orange-500/15 flex items-center justify-center">
            <Flame size={22} className="text-orange-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{user?.streak?.current || 0}</p>
            <p className="text-xs text-dark-400">Day Streak 🔥</p>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-cyan-500/15 flex items-center justify-center">
            <Clock size={22} className="text-cyan-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{formatTime(todayTime)}</p>
            <p className="text-xs text-dark-400">Study Today</p>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-green-500/15 flex items-center justify-center">
            <Target size={22} className="text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{goalPct}%</p>
            <p className="text-xs text-dark-400">Today's Goals</p>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-purple-500/15 flex items-center justify-center">
            <TrendingUp size={22} className="text-purple-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats?.overallCompletion || 0}%</p>
            <p className="text-xs text-dark-400">Overall Progress</p>
          </div>
        </div>
      </motion.div>

      {/* Module Cards */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {moduleCards.map((card) => (
          <Link key={card.path} to={card.path}>
            <div className="glass-card p-5 group cursor-pointer">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${card.color} flex items-center justify-center mb-3`}>
                <card.icon size={20} className="text-white" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">{card.label}</h3>
                <ChevronRight size={16} className="text-dark-500 group-hover:text-primary-400 transition-colors" />
              </div>
              <p className="text-lg font-bold mb-2">{card.stat}</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${card.pct}%` }} />
              </div>
              <p className="text-xs text-dark-400 mt-1">{card.pct}% complete</p>
            </div>
          </Link>
        ))}
      </motion.div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Study Chart */}
        <motion.div variants={item} className="glass-card p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <BarChart3 size={18} className="text-primary-400" />
            Weekly Study Hours
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={studyData?.weeklyData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
              <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid rgba(148,163,184,0.1)', borderRadius: 8 }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Bar dataKey="hours" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Today's Revisions */}
        <motion.div variants={item} className="glass-card p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <BookOpen size={18} className="text-amber-400" />
            Today's Revisions
          </h3>
          {revisions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[220px] text-dark-400">
              <Zap size={40} className="mb-2 opacity-30" />
              <p className="text-sm">No revisions scheduled for today</p>
              <p className="text-xs mt-1">Complete DSA problems to get revision reminders!</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[220px] overflow-y-auto">
              {revisions.map((rev) => (
                <div key={rev._id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.05] transition-colors">
                  <div>
                    <p className="text-sm font-medium">{rev.problemId?.title || 'Problem'}</p>
                    <p className="text-xs text-dark-400">Revision #{rev.revisionNumber}</p>
                  </div>
                  <span className={`badge badge-${rev.problemId?.difficulty?.toLowerCase() || 'medium'}`}>
                    {rev.problemId?.difficulty}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Today's Goals Detail */}
      {todayGoal && (
        <motion.div variants={item} className="glass-card p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Target size={18} className="text-green-400" />
            Today's Goals
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'DSA Problems', completed: todayGoal.dsaCompleted, target: todayGoal.dsaTarget, color: '#6366f1' },
              { label: 'Lessons', completed: todayGoal.fullstackCompleted, target: todayGoal.fullstackTarget, color: '#0ea5e9' },
              { label: 'Aptitude Qs', completed: todayGoal.aptitudeCompleted, target: todayGoal.aptitudeTarget, color: '#8b5cf6' },
              { label: 'Tasks', completed: todayGoal.projectCompleted, target: todayGoal.projectTarget, color: '#f59e0b' },
            ].map((g) => (
              <div key={g.label} className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-2">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(148,163,184,0.1)" strokeWidth="6" />
                    <circle
                      cx="40" cy="40" r="34" fill="none" stroke={g.color} strokeWidth="6"
                      strokeDasharray={`${(Math.min(g.completed, g.target) / g.target) * 213.6} 213.6`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold">{g.completed}/{g.target}</span>
                  </div>
                </div>
                <p className="text-xs text-dark-400">{g.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Dashboard;
