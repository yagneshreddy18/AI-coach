import { useState, useEffect } from 'react';
import { Target, CheckCircle2, ChevronRight, Settings, Plus, Minus, History, Award } from 'lucide-react';
import { goalsAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

const DailyGoals = () => {
  const { addToast } = useToast();
  const [goal, setGoal] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Completed inputs
  const [dsaComp, setDsaComp] = useState(0);
  const [fsComp, setFsComp] = useState(0);
  const [aptComp, setAptComp] = useState(0);
  const [projComp, setProjComp] = useState(0);

  // Targets configuration inputs
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [dsaTargetInput, setDsaTargetInput] = useState('');
  const [fsTargetInput, setFsTargetInput] = useState('');
  const [aptTargetInput, setAptTargetInput] = useState('');
  const [projTargetInput, setProjTargetInput] = useState('');
  
  const [savingProgress, setSavingProgress] = useState(false);
  const [savingTargets, setSavingTargets] = useState(false);

  const fetchGoalsData = async () => {
    try {
      setLoading(true);
      const [goalRes, historyRes] = await Promise.all([
        goalsAPI.getTodayGoal(),
        goalsAPI.getHistory(15),
      ]);
      const g = goalRes.data;
      setGoal(g);
      setDsaComp(g.dsaCompleted || 0);
      setFsComp(g.fullstackCompleted || 0);
      setAptComp(g.aptitudeCompleted || 0);
      setProjComp(g.projectCompleted || 0);
      
      setHistory(historyRes.data);
    } catch (err) {
      console.error('Goals load error:', err);
      addToast('Failed to load daily goal progress', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoalsData();
  }, []);

  const handleUpdateProgress = async () => {
    try {
      setSavingProgress(true);
      await goalsAPI.updateProgress({
        dsaCompleted: dsaComp,
        fullstackCompleted: fsComp,
        aptitudeCompleted: aptComp,
        projectCompleted: projComp,
      });
      addToast('Daily progress saved!', 'success');
      fetchGoalsData();
    } catch (err) {
      addToast('Failed to save daily progress', 'error');
    } finally {
      setSavingProgress(false);
    }
  };

  const handleOpenTargetsModal = () => {
    if (!goal) return;
    setDsaTargetInput(String(goal.dsaTarget));
    setFsTargetInput(String(goal.fullstackTarget));
    setAptTargetInput(String(goal.aptitudeTarget));
    setProjTargetInput(String(goal.projectTarget));
    setShowTargetModal(true);
  };

  const handleUpdateTargets = async (e) => {
    e.preventDefault();
    const dsaT = parseInt(dsaTargetInput, 10);
    const fsT = parseInt(fsTargetInput, 10);
    const aptT = parseInt(aptTargetInput, 10);
    const projT = parseInt(projTargetInput, 10);

    if (isNaN(dsaT) || isNaN(fsT) || isNaN(aptT) || isNaN(projT) || dsaT < 0 || fsT < 0 || aptT < 0 || projT < 0) {
      addToast('Please enter valid positive targets', 'error');
      return;
    }

    try {
      setSavingTargets(true);
      await goalsAPI.updateTargets({
        dailyDsaGoal: dsaT,
        dailyFullstackGoal: fsT,
        dailyAptitudeGoal: aptT,
        dailyProjectGoal: projT,
      });
      addToast('Daily targets updated successfully!', 'success');
      setShowTargetModal(false);
      fetchGoalsData();
    } catch (err) {
      addToast('Failed to update targets', 'error');
    } finally {
      setSavingTargets(false);
    }
  };

  const getOverallProgressPct = () => {
    if (!goal) return 0;
    const totalTargets = goal.dsaTarget + goal.fullstackTarget + goal.aptitudeTarget + goal.projectTarget;
    if (totalTargets === 0) return 0;

    const completed =
      Math.min(goal.dsaCompleted, goal.dsaTarget) +
      Math.min(goal.fullstackCompleted, goal.fullstackTarget) +
      Math.min(goal.aptitudeCompleted, goal.aptitudeTarget) +
      Math.min(goal.projectCompleted, goal.projectTarget);

    return Math.round((completed / totalTargets) * 100);
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold mb-1 flex items-center gap-2">
            <Target className="text-success-400" /> Daily Targets
          </h1>
          <p className="text-dark-400">Configure and track your everyday execution goals to maintain consistent streaks.</p>
        </div>
        <button
          onClick={handleOpenTargetsModal}
          className="btn btn-secondary flex items-center gap-2 self-start sm:self-center"
        >
          <Settings size={16} /> Configure Targets
        </button>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="skeleton h-80 rounded-xl" />
            <div className="skeleton h-80 lg:col-span-2 rounded-xl" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column: Progress Ring and Category Controls */}
          <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
            <h3 className="font-bold text-sm text-dark-300 self-start mb-6">Today's Goal Progress</h3>

            <div className="relative w-40 h-40 mb-6">
              <svg className="w-40 h-40 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(148,163,184,0.05)" strokeWidth="6" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke={goal?.isCompleted ? '#22c55e' : '#6366f1'}
                  strokeWidth="6"
                  strokeDasharray={`${getOverallProgressPct() * 2.6389} 263.89`}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black">{getOverallProgressPct()}%</span>
                <span className="text-[9px] text-dark-500 font-bold uppercase tracking-wider mt-0.5">
                  {goal?.isCompleted ? 'Goal Met! 🎉' : 'In Progress'}
                </span>
              </div>
            </div>

            {/* Quick manual log triggers */}
            <div className="w-full space-y-4 text-left pt-4 border-t border-white/5">
              {/* DSA */}
              <div className="flex justify-between items-center text-xs">
                <div>
                  <p className="font-semibold">DSA Solved</p>
                  <p className="text-[10px] text-dark-500">Target: {goal?.dsaTarget}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setDsaComp(Math.max(0, dsaComp - 1))} className="p-1 rounded bg-white/5 hover:bg-white/10 text-dark-400">
                    <Minus size={13} />
                  </button>
                  <span className="font-bold w-6 text-center">{dsaComp}</span>
                  <button onClick={() => setDsaComp(dsaComp + 1)} className="p-1 rounded bg-white/5 hover:bg-white/10 text-dark-400">
                    <Plus size={13} />
                  </button>
                </div>
              </div>

              {/* Fullstack */}
              <div className="flex justify-between items-center text-xs">
                <div>
                  <p className="font-semibold">Lessons Finished</p>
                  <p className="text-[10px] text-dark-500">Target: {goal?.fullstackTarget}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setFsComp(Math.max(0, fsComp - 1))} className="p-1 rounded bg-white/5 hover:bg-white/10 text-dark-400">
                    <Minus size={13} />
                  </button>
                  <span className="font-bold w-6 text-center">{fsComp}</span>
                  <button onClick={() => setFsComp(fsComp + 1)} className="p-1 rounded bg-white/5 hover:bg-white/10 text-dark-400">
                    <Plus size={13} />
                  </button>
                </div>
              </div>

              {/* Aptitude */}
              <div className="flex justify-between items-center text-xs">
                <div>
                  <p className="font-semibold">Aptitude Practice</p>
                  <p className="text-[10px] text-dark-500">Target: {goal?.aptitudeTarget}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setAptComp(Math.max(0, aptComp - 5))} className="p-1 rounded bg-white/5 hover:bg-white/10 text-dark-400">
                    <Minus size={13} />
                  </button>
                  <span className="font-bold w-6 text-center">{aptComp}</span>
                  <button onClick={() => setAptComp(aptComp + 5)} className="p-1 rounded bg-white/5 hover:bg-white/10 text-dark-400">
                    <Plus size={13} />
                  </button>
                </div>
              </div>

              {/* Projects */}
              <div className="flex justify-between items-center text-xs">
                <div>
                  <p className="font-semibold">Project Tasks</p>
                  <p className="text-[10px] text-dark-500">Target: {goal?.projectTarget}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setProjComp(Math.max(0, projComp - 1))} className="p-1 rounded bg-white/5 hover:bg-white/10 text-dark-400">
                    <Minus size={13} />
                  </button>
                  <span className="font-bold w-6 text-center">{projComp}</span>
                  <button onClick={() => setProjComp(projComp + 1)} className="p-1 rounded bg-white/5 hover:bg-white/10 text-dark-400">
                    <Plus size={13} />
                  </button>
                </div>
              </div>

              <button
                onClick={handleUpdateProgress}
                disabled={savingProgress}
                className="btn btn-primary w-full py-2.5 mt-2 text-xs font-semibold"
              >
                {savingProgress ? 'Saving...' : 'Save Progress'}
              </button>
            </div>
          </div>

          {/* Right Column: Goal History timeline */}
          <div className="glass-card p-6 lg:col-span-2 space-y-4">
            <h3 className="font-bold text-sm text-dark-300 flex items-center gap-1.5 mb-2">
              <History size={16} className="text-accent-400" />
              Goal History (Last 15 Days)
            </h3>
            
            {history.length === 0 ? (
              <p className="text-xs text-dark-500 py-12 text-center">No goal history data logged yet.</p>
            ) : (
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1 text-xs">
                {history.map((day) => (
                  <div
                    key={day._id}
                    className={`p-3.5 rounded-lg flex items-center justify-between gap-4 border bg-white/[0.01] ${
                      day.isCompleted ? 'border-success-500/20 bg-success-500/[0.02]' : 'border-white/5'
                    }`}
                  >
                    <div>
                      <p className="font-bold">
                        {new Date(day.date).toLocaleDateString(undefined, {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[10px] text-dark-400">
                        <span>DSA: {day.dsaCompleted}/{day.dsaTarget}</span>
                        <span>Lessons: {day.fullstackCompleted}/{day.fullstackTarget}</span>
                        <span>Aptitude: {day.aptitudeCompleted}/{day.aptitudeTarget}</span>
                        <span>Projects: {day.projectCompleted}/{day.projectTarget}</span>
                      </div>
                    </div>

                    <span
                      className={`badge text-[9px] uppercase tracking-wider ${
                        day.isCompleted ? 'badge-easy' : 'badge-hard'
                      }`}
                    >
                      {day.isCompleted ? 'Goal Met ✅' : 'Incomplete'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Target Configuration Modal */}
      {showTargetModal && (
        <div className="modal-overlay">
          <div className="modal-content p-6">
            <h3 className="text-lg font-bold mb-1">Configure Daily Targets</h3>
            <p className="text-xs text-dark-400 mb-5">Set your default daily parameters. Goal streaks auto-calculate when these are met.</p>
            <form onSubmit={handleUpdateTargets} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">DSA Problems Target</label>
                  <input
                    type="number"
                    min="0"
                    value={dsaTargetInput}
                    onChange={(e) => setDsaTargetInput(e.target.value)}
                    className="input-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Full Stack Lessons Target</label>
                  <input
                    type="number"
                    min="0"
                    value={fsTargetInput}
                    onChange={(e) => setFsTargetInput(e.target.value)}
                    className="input-base"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Aptitude Questions Target</label>
                  <input
                    type="number"
                    min="0"
                    value={aptTargetInput}
                    onChange={(e) => setAptTargetInput(e.target.value)}
                    className="input-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Project Tasks Target</label>
                  <input
                    type="number"
                    min="0"
                    value={projTargetInput}
                    onChange={(e) => setProjTargetInput(e.target.value)}
                    className="input-base"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowTargetModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingTargets}
                  className="btn btn-primary"
                >
                  {savingTargets ? 'Saving...' : 'Save Targets'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyGoals;
