import { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw, Clock, Award, BookOpen, Activity } from 'lucide-react';
import { timerAPI, goalsAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

const StudyTimer = () => {
  const { addToast } = useToast();
  
  // Timer config
  const [mode, setMode] = useState('pomodoro'); // pomodoro or stopwatch
  const [category, setCategory] = useState('DSA'); // DSA, Full Stack, Aptitude, Projects
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime] = useState(25 * 60); // 25 mins in seconds

  // Stats
  const [todayTime, setTodayTime] = useState(0);
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // References
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  const fetchStats = async () => {
    try {
      const [todayRes, recentRes] = await Promise.all([
        timerAPI.getTodayTime(),
        timerAPI.getRecentSessions(),
      ]);
      setTodayTime(todayRes.data.totalSeconds);
      setRecentSessions(recentRes.data);
    } catch (err) {
      console.error('Timer stats load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    return () => clearInterval(intervalRef.current);
  }, []);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    startTimeRef.current = new Date();
    
    intervalRef.current = setInterval(() => {
      setTime((prevTime) => {
        if (mode === 'pomodoro') {
          if (prevTime <= 1) {
            handleCompleteSession();
            return 0;
          }
          return prevTime - 1;
        } else {
          return prevTime + 1;
        }
      });
    }, 1000);
  };

  const handlePause = () => {
    setIsPaused(true);
    clearInterval(intervalRef.current);
  };

  const handleResume = () => {
    setIsPaused(false);
    intervalRef.current = setInterval(() => {
      setTime((prevTime) => {
        if (mode === 'pomodoro') {
          if (prevTime <= 1) {
            handleCompleteSession();
            return 0;
          }
          return prevTime - 1;
        } else {
          return prevTime + 1;
        }
      });
    }, 1000);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    clearInterval(intervalRef.current);
    setTime(mode === 'pomodoro' ? 25 * 60 : 0);
  };

  const handleCompleteSession = async () => {
    clearInterval(intervalRef.current);
    setIsActive(false);
    
    const endTime = new Date();
    const startTime = startTimeRef.current || new Date(endTime.getTime() - 25 * 60 * 1000);
    const duration = mode === 'pomodoro' ? 25 * 60 : time;

    try {
      await timerAPI.saveSession({
        duration,
        category,
        startTime,
        endTime,
      });
      
      // Attempt to increment the Daily Goal progress slightly
      try {
        const goalRes = await goalsAPI.getTodayGoal();
        const goalData = goalRes.data;
        
        let updates = {};
        if (category === 'DSA') {
          updates.dsaCompleted = (goalData.dsaCompleted || 0) + 1;
        } else if (category === 'Full Stack') {
          updates.fullstackCompleted = (goalData.fullstackCompleted || 0) + 1;
        } else if (category === 'Aptitude') {
          updates.aptitudeCompleted = (goalData.aptitudeCompleted || 0) + 5; // e.g. equivalent 5 Qs
        } else if (category === 'Projects') {
          updates.projectCompleted = (goalData.projectCompleted || 0) + 1;
        }
        await goalsAPI.updateProgress(updates);
      } catch (goalErr) {
        console.error('Failed to auto-update goals progress:', goalErr);
      }

      addToast(`Great job! Study session of ${formatTime(duration)} saved under ${category} 🎯`, 'success');
      setTime(mode === 'pomodoro' ? 25 * 60 : 0);
      fetchStats();
    } catch (err) {
      addToast('Failed to save study session', 'error');
    }
  };

  const toggleMode = (newMode) => {
    if (isActive) {
      if (!window.confirm('This will reset your current timer. Proceed?')) return;
    }
    setMode(newMode);
    setIsActive(false);
    setIsPaused(false);
    clearInterval(intervalRef.current);
    setTime(newMode === 'pomodoro' ? 25 * 60 : 0);
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    const pad = (num) => String(num).padStart(2, '0');
    
    if (h > 0) {
      return `${pad(h)}:${pad(m)}:${pad(s)}`;
    }
    return `${pad(m)}:${pad(s)}`;
  };

  const getPercent = () => {
    if (mode === 'stopwatch') return 100;
    const total = 25 * 60;
    return (time / total) * 100;
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Top Banner */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold mb-1 flex items-center gap-2">
          <Timer className="text-primary-400" /> Focus Timer
        </h1>
        <p className="text-dark-400">Pomodoro focus cycles and stopwatch trackers linked to your placement preparation goals.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Timer interface */}
        <div className="glass-card p-8 lg:col-span-2 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Background mesh */}
          <div className="absolute top-0 left-0 w-full h-full bg-radial-gradient from-primary-500/5 to-transparent pointer-events-none" />

          {/* Mode Switcher */}
          <div className="flex gap-1.5 p-1 rounded-lg bg-white/5 border border-white/5 mb-8 z-10">
            <button
              onClick={() => toggleMode('pomodoro')}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                mode === 'pomodoro' ? 'bg-primary-500 text-white' : 'text-dark-400 hover:text-dark-200'
              }`}
            >
              Pomodoro (25m)
            </button>
            <button
              onClick={() => toggleMode('stopwatch')}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                mode === 'stopwatch' ? 'bg-primary-500 text-white' : 'text-dark-400 hover:text-dark-200'
              }`}
            >
              Stopwatch
            </button>
          </div>

          {/* Focus Category Selector */}
          <div className="mb-8 z-10 flex items-center gap-2.5">
            <span className="text-xs text-dark-400 font-medium">Tagging Focus:</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isActive}
              className="input-base !w-auto !py-1 !px-3 text-xs bg-white/5 cursor-pointer disabled:opacity-50"
            >
              <option value="DSA">DSA Practice</option>
              <option value="Full Stack">Full Stack Development</option>
              <option value="Aptitude">Aptitude Solving</option>
              <option value="Projects">Project building</option>
            </select>
          </div>

          {/* Clock Ring Render */}
          <div className="relative w-64 h-64 mb-8">
            <svg className="w-64 h-64 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(148,163,184,0.04)" strokeWidth="4" />
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="url(#timerGrad)"
                strokeWidth="4"
                strokeDasharray={`${getPercent() * 2.764} 276.4`}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
              <defs>
                <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
              </defs>
            </svg>

            {/* Readout inside circle */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black tracking-wider tabular-nums">
                {formatTime(time)}
              </span>
              <span className="text-[10px] text-dark-500 uppercase tracking-widest mt-1">
                {isActive ? (isPaused ? 'Paused' : 'Focusing') : 'Idle'}
              </span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex gap-4 z-10">
            {!isActive ? (
              <button
                onClick={handleStart}
                className="btn btn-primary px-8 py-3 flex items-center gap-2 text-sm font-semibold rounded-xl"
              >
                <Play size={18} fill="white" /> Start Session
              </button>
            ) : (
              <>
                {isPaused ? (
                  <button
                    onClick={handleResume}
                    className="btn btn-primary px-6 py-2.5 flex items-center gap-2 text-sm"
                  >
                    <Play size={16} fill="white" /> Resume
                  </button>
                ) : (
                  <button
                    onClick={handlePause}
                    className="btn btn-secondary px-6 py-2.5 flex items-center gap-2 text-sm"
                  >
                    <Pause size={16} /> Pause
                  </button>
                )}
                
                {mode === 'stopwatch' ? (
                  <button
                    onClick={handleCompleteSession}
                    className="btn btn-primary !bg-success-600 hover:!bg-success-500 px-6 py-2.5 flex items-center gap-2 text-sm"
                  >
                    <Award size={16} /> Complete & Save
                  </button>
                ) : null}

                <button
                  onClick={handleReset}
                  className="btn btn-ghost p-2.5 hover:bg-white/5 rounded-lg text-dark-400 hover:text-dark-200"
                  title="Reset"
                >
                  <RotateCcw size={18} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right 1 Col: Statistics and Session Logs */}
        <div className="space-y-6">
          {/* Today stats summary */}
          <div className="glass-card p-5">
            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
              <Clock size={16} className="text-primary-400" />
              Focus Log Today
            </h3>
            <div className="text-3xl font-black mb-1">
              {Math.round((todayTime / 3600) * 10) / 10} hrs
            </div>
            <p className="text-xs text-dark-400">Total duration accumulated today.</p>
          </div>

          {/* Session history */}
          <div className="glass-card p-5">
            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
              <Activity size={16} className="text-accent-400" />
              Recent Sessions
            </h3>
            {loading ? (
              <div className="space-y-2 py-2">
                <div className="skeleton h-10 w-full" />
                <div className="skeleton h-10 w-full" />
              </div>
            ) : recentSessions.length === 0 ? (
              <p className="text-xs text-dark-500 text-center py-6">No study sessions recorded recently.</p>
            ) : (
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                {recentSessions.map((session) => (
                  <div
                    key={session._id}
                    className="flex justify-between items-center p-2.5 rounded bg-white/[0.01] border border-white/5"
                  >
                    <div>
                      <p className="text-xs font-semibold">{session.category}</p>
                      <p className="text-[10px] text-dark-500">
                        {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-dark-300">
                      {formatTime(session.duration)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyTimer;
