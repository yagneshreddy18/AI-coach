import { useState, useEffect } from 'react';
import { motion as framerMotion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle2, Circle, StickyNote, ExternalLink, RefreshCcw, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { dsaAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

const DSATracker = () => {
  const { addToast } = useToast();
  const [problems, setProblems] = useState([]);
  const [topics, setTopics] = useState([]);
  const [progress, setProgress] = useState(null);
  const [nextUnsolved, setNextUnsolved] = useState([]);
  
  const [filters, setFilters] = useState({
    topic: '',
    difficulty: '',
    search: '',
    page: 1,
  });
  const [totalPages, setTotalPages] = useState(1);
  const [activeNotesId, setActiveNotesId] = useState(null);
  const [currentNotes, setCurrentNotes] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [problemsRes, topicsRes, progressRes, unsolvedRes] = await Promise.all([
        dsaAPI.getProblems(filters),
        dsaAPI.getTopics(),
        dsaAPI.getProgress(),
        dsaAPI.getNextUnsolved(3),
      ]);
      setProblems(problemsRes.data.problems);
      setTotalPages(problemsRes.data.pages);
      setTopics(topicsRes.data);
      setProgress(progressRes.data);
      setNextUnsolved(unsolvedRes.data);
    } catch (err) {
      console.error('DSA load error:', err);
      addToast('Failed to load DSA tracker data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const handleToggleComplete = async (problem) => {
    try {
      const isCompleted = problem.userProgress?.completed;
      if (isCompleted) {
        await dsaAPI.undoComplete(problem._id);
        addToast(`Undone completion for: ${problem.title}`, 'info');
      } else {
        await dsaAPI.markComplete(problem._id);
        addToast(`Completed: ${problem.title}! +1 to progress 🚀`, 'success');
      }
      // Re-fetch to update stats and lists
      fetchData();
    } catch (err) {
      addToast('Failed to update status', 'error');
    }
  };

  const handleOpenNotes = (problem) => {
    setActiveNotesId(problem._id);
    setCurrentNotes(problem.userProgress?.personalNotes || '');
  };

  const handleSaveNotes = async (problemId) => {
    try {
      await dsaAPI.updateNotes(problemId, currentNotes);
      addToast('Notes saved successfully', 'success');
      setActiveNotesId(null);
      // Update local problem state notes
      setProblems((prev) =>
        prev.map((p) =>
          p._id === problemId
            ? { ...p, userProgress: { ...p.userProgress, personalNotes: currentNotes } }
            : p
        )
      );
    } catch (err) {
      addToast('Failed to save notes', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header & Stats Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 lg:col-span-2 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-1">DSA Tracker</h1>
            <p className="text-dark-400">Master Data Structures & Algorithms. Curated list of high-frequency interview problems.</p>
          </div>
          {progress && (
            <div className="mt-6 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-dark-400">Total Solved: {progress.completed} of {progress.total} problems</span>
                <span className="font-semibold text-primary-400">{progress.percentage}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress.percentage}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Next up recommended */}
        <div className="glass-card p-5">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-1.5 text-accent-400">
            <Star size={16} className="fill-accent-400/20" />
            Recommended Next Up
          </h3>
          <div className="space-y-2">
            {nextUnsolved.map((p) => (
              <div
                key={p._id}
                onClick={() => setFilters((prev) => ({ ...prev, topic: p.topic }))}
                className="p-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-dark-400 uppercase tracking-wider">{p.topic}</p>
                  <p className="text-sm font-medium truncate">{p.title}</p>
                </div>
                <span className={`badge badge-${p.difficulty.toLowerCase()}`}>{p.difficulty}</span>
              </div>
            ))}
            {nextUnsolved.length === 0 && !loading && (
              <p className="text-xs text-dark-500 text-center py-4">All caught up! Excellent work 🎉</p>
            )}
          </div>
        </div>
      </div>

      {/* Main filter panel + problem table */}
      <div className="glass-card p-5">
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
            <input
              type="text"
              placeholder="Search problems..."
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }))}
              className="input-base pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Topic Filter */}
            <select
              value={filters.topic}
              onChange={(e) => setFilters((prev) => ({ ...prev, topic: e.target.value, page: 1 }))}
              className="input-base !w-auto text-sm"
            >
              <option value="">All Topics</option>
              {topics.map((t) => (
                <option key={t.topic} value={t.topic}>
                  {t.topic} ({t.count})
                </option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={filters.difficulty}
              onChange={(e) => setFilters((prev) => ({ ...prev, difficulty: e.target.value, page: 1 }))}
              className="input-base !w-auto text-sm"
            >
              <option value="">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            {/* Reset */}
            <button
              onClick={() => setFilters({ topic: '', difficulty: '', search: '', page: 1 })}
              className="btn btn-secondary px-3.5 py-2"
              title="Reset Filters"
            >
              <RefreshCcw size={16} />
            </button>
          </div>
        </div>

        {/* Problem List */}
        {loading ? (
          <div className="space-y-3 py-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-dark-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">Status</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4 w-40">Topic</th>
                  <th className="py-3 px-4 w-28">Difficulty</th>
                  <th className="py-3 px-4 w-28">Platform</th>
                  <th className="py-3 px-4 w-20 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {problems.map((p) => {
                  const isCompleted = p.userProgress?.completed;
                  return (
                    <tr
                      key={p._id}
                      className={`hover:bg-white/[0.01] transition-colors ${
                        isCompleted ? 'text-dark-500' : ''
                      }`}
                    >
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleComplete(p)}
                          className={`transition-colors ${
                            isCompleted ? 'text-success-400' : 'text-dark-600 hover:text-dark-400'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-sm flex items-center gap-2">
                          <span className={isCompleted ? 'line-through' : ''}>{p.title}</span>
                          {p.problemLink && (
                            <a
                              href={p.problemLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-dark-500 hover:text-primary-400"
                            >
                              <ExternalLink size={13} />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs font-medium text-dark-400">{p.topic}</td>
                      <td className="py-3 px-4">
                        <span className={`badge badge-${p.difficulty.toLowerCase()}`}>
                          {p.difficulty}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs font-medium text-dark-400">{p.platform}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenNotes(p)}
                            className={`p-1.5 rounded-lg hover:bg-white/5 transition-colors ${
                              p.userProgress?.personalNotes ? 'text-primary-400' : 'text-dark-500 hover:text-dark-300'
                            }`}
                            title="Personal Notes"
                          >
                            <StickyNote size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {problems.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-dark-400 text-sm">
                      No problems found matching these filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4">
            <span className="text-xs text-dark-400">
              Page {filters.page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={filters.page === 1}
                onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
                className="btn btn-secondary !p-1.5 disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={filters.page === totalPages}
                onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
                className="btn btn-secondary !p-1.5 disabled:opacity-30"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notes Modal/Dialog */}
      <AnimatePresence>
        {activeNotesId && (
          <framerMotion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
          >
            <framerMotion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="modal-content p-6"
            >
              <h3 className="text-lg font-bold mb-2">
                Personal Notes: {problems.find((p) => p._id === activeNotesId)?.title}
              </h3>
              <p className="text-xs text-dark-400 mb-4">
                Write down key observations, complexity, or optimal approaches.
              </p>
              <textarea
                value={currentNotes}
                onChange={(e) => setCurrentNotes(e.target.value)}
                placeholder="Optimal solution pattern, edge cases..."
                className="input-base h-40 resize-none mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveNotesId(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveNotes(activeNotesId)}
                  className="btn btn-primary"
                >
                  Save Notes
                </button>
              </div>
            </framerMotion.div>
          </framerMotion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DSATracker;
