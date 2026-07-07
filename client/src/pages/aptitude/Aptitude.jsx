import { useState, useEffect } from 'react';
import { Brain, Plus, Target, CheckCircle2, AlertTriangle, HelpCircle, BarChart3, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { aptitudeAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

const Aptitude = () => {
  const { addToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [progress, setProgress] = useState(null);
  const [weeklyTrend, setWeeklyTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedCatId, setSelectedCatId] = useState('');
  const [totalQuestions, setTotalQuestions] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catRes, progressRes, trendRes] = await Promise.all([
        aptitudeAPI.getCategories(),
        aptitudeAPI.getProgress(),
        aptitudeAPI.getWeeklyAccuracy(),
      ]);
      setCategories(catRes.data);
      setProgress(progressRes.data);
      setWeeklyTrend(trendRes.data);
    } catch (err) {
      console.error('Aptitude load error:', err);
      addToast('Failed to load aptitude progress data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogPractice = async (e) => {
    e.preventDefault();
    const total = parseInt(totalQuestions, 10);
    const correct = parseInt(correctAnswers, 10);

    if (isNaN(total) || isNaN(correct) || total <= 0 || correct < 0) {
      addToast('Please enter valid positive numbers', 'error');
      return;
    }
    if (correct > total) {
      addToast('Correct answers cannot exceed total questions', 'error');
      return;
    }
    if (!selectedCatId) {
      addToast('Please select a category', 'error');
      return;
    }

    try {
      setSubmitting(true);
      await aptitudeAPI.logPractice({
        categoryId: selectedCatId,
        totalQuestions: total,
        correct: correct,
        wrong: total - correct,
      });
      addToast('Practice session logged successfully! 🎯', 'success');
      setShowLogModal(false);
      // Reset form
      setSelectedCatId('');
      setTotalQuestions('');
      setCorrectAnswers('');
      // Reload stats
      fetchData();
    } catch (err) {
      addToast('Failed to log practice session', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Top Banner and Quick Add */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold mb-1 flex items-center gap-2">
            <Brain className="text-violet-400" /> Aptitude & Reasoning
          </h1>
          <p className="text-dark-400">Track and optimize quantitative, logical, and verbal practice performance.</p>
        </div>
        <button
          onClick={() => setShowLogModal(true)}
          className="btn btn-primary flex items-center gap-2 self-start sm:self-center"
        >
          <Plus size={18} /> Log Practice Session
        </button>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-24 rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="skeleton h-72 rounded-xl" />
            <div className="skeleton h-72 rounded-xl" />
          </div>
        </div>
      ) : (
        <>
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-violet-500/15 flex items-center justify-center text-violet-400">
                <Target size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold">{progress?.overall?.accuracy || 0}%</p>
                <p className="text-xs text-dark-400">Overall Accuracy</p>
              </div>
            </div>

            <div className="glass-card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success-500/15 flex items-center justify-center text-success-400">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold truncate max-w-[200px]">{progress?.strongest || 'N/A'}</p>
                <p className="text-xs text-dark-400">Strongest Domain</p>
              </div>
            </div>

            <div className="glass-card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-danger-500/15 flex items-center justify-center text-danger-400">
                <AlertTriangle size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold truncate max-w-[200px]">{progress?.weakest || 'N/A'}</p>
                <p className="text-xs text-dark-400">Needs Focus</p>
              </div>
            </div>
          </div>

          {/* Double Column: Chart and Category Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly trend line chart */}
            <div className="glass-card p-5">
              <h3 className="font-semibold text-sm mb-4 flex items-center gap-2 text-primary-400">
                <BarChart3 size={16} /> Accuracy Trend
              </h3>
              <div className="h-[280px]">
                {weeklyTrend.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-dark-400">
                    <HelpCircle size={40} className="mb-2 opacity-30" />
                    <p className="text-sm">No practice data recorded this week</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.05)" />
                      <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ background: '#1e293b', border: '1px solid rgba(148,163,184,0.1)', borderRadius: 8 }}
                        labelStyle={{ color: '#e2e8f0' }}
                      />
                      <Line type="monotone" dataKey="accuracy" name="Accuracy %" stroke="#8b5cf6" strokeWidth={2.5} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Domains Breakdown List */}
            <div className="glass-card p-5">
              <h3 className="font-semibold text-sm mb-4 text-violet-400">Topic Performance Breakdown</h3>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {progress?.categories?.map((cat) => (
                  <div key={cat._id} className="p-3.5 rounded-lg bg-white/[0.02] border border-white/5">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="text-sm font-semibold">{cat.name}</p>
                        <p className="text-xs text-dark-500 mt-0.5">{cat.totalQuestions || 0} Solved</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-violet-400">{cat.accuracy || 0}% Accuracy</span>
                        <p className="text-xs text-dark-500 mt-0.5">{cat.correct || 0} Correct • {cat.wrong || 0} Wrong</p>
                      </div>
                    </div>
                    <div className="progress-bar mt-2">
                      <div
                        className="progress-fill !bg-gradient-to-r !from-violet-500 !to-fuchsia-500"
                        style={{ width: `${cat.accuracy}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Log Session Modal */}
      {showLogModal && (
        <div className="modal-overlay">
          <div className="modal-content p-6">
            <h3 className="text-lg font-bold mb-1">Log Practice Session</h3>
            <p className="text-xs text-dark-400 mb-5">Enter details of the aptitude questions you completed today.</p>
            <form onSubmit={handleLogPractice} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Category Topic</label>
                <select
                  value={selectedCatId}
                  onChange={(e) => setSelectedCatId(e.target.value)}
                  className="input-base"
                  required
                >
                  <option value="">Select Topic...</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Total Attempted</label>
                  <input
                    type="number"
                    min="1"
                    value={totalQuestions}
                    onChange={(e) => setTotalQuestions(e.target.value)}
                    placeholder="e.g. 15"
                    className="input-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Correct Answers</label>
                  <input
                    type="number"
                    min="0"
                    value={correctAnswers}
                    onChange={(e) => setCorrectAnswers(e.target.value)}
                    placeholder="e.g. 11"
                    className="input-base"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                >
                  {submitting ? 'Logging...' : 'Save Log'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Aptitude;
