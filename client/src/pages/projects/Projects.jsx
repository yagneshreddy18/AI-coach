import { useState, useEffect } from 'react';
import { FolderKanban, Plus, Calendar, Trash2, CheckSquare, Square, AlertCircle, Play, CheckCircle } from 'lucide-react';
import { projectAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

const Projects = () => {
  const { addToast } = useToast();
  const [projects, setProjects] = useState([]);
  const [selectedProj, setSelectedProj] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);

  // New Project Form
  const [showProjModal, setShowProjModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('planning');
  const [color, setColor] = useState('#6366f1');

  // New Task Form
  const [taskName, setTaskName] = useState('');
  const [taskPriority, setTaskPriority] = useState('medium');

  const fetchProjects = async (selectFirst = false) => {
    try {
      if (!selectFirst) setLoading(true);
      const res = await projectAPI.getProjects();
      setProjects(res.data);
      if (res.data.length > 0 && (selectFirst || !selectedProj)) {
        handleSelectProject(res.data[0]);
      }
    } catch (err) {
      addToast('Failed to load projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(true);
  }, []);

  const handleSelectProject = async (project) => {
    setSelectedProj(project);
    try {
      setTasksLoading(true);
      const res = await projectAPI.getTasks(project._id);
      setTasks(res.data);
    } catch (err) {
      addToast('Failed to load tasks', 'error');
    } finally {
      setTasksLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      addToast('Project title is required', 'error');
      return;
    }
    try {
      const res = await projectAPI.createProject({
        title,
        description,
        deadline: deadline || null,
        status,
        color,
      });
      addToast('Project created successfully! 🚀', 'success');
      setShowProjModal(false);
      // Reset fields
      setTitle('');
      setDescription('');
      setDeadline('');
      setStatus('planning');
      setColor('#6366f1');
      // Reload projects and select newly created project
      const updatedList = await projectAPI.getProjects();
      setProjects(updatedList.data);
      const newProj = updatedList.data.find(p => p.title === title) || updatedList.data[0];
      if (newProj) handleSelectProject(newProj);
    } catch (err) {
      addToast('Failed to create project', 'error');
    }
  };

  const handleDeleteProject = async (projId) => {
    if (!window.confirm('Are you sure you want to delete this project and all its tasks?')) return;
    try {
      await projectAPI.deleteProject(projId);
      addToast('Project deleted successfully', 'info');
      setSelectedProj(null);
      setTasks([]);
      fetchProjects(true);
    } catch (err) {
      addToast('Failed to delete project', 'error');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskName.trim()) {
      addToast('Task name is required', 'error');
      return;
    }
    try {
      await projectAPI.createTask(selectedProj._id, {
        taskName: taskName.trim(),
        priority: taskPriority,
      });
      setTaskName('');
      setTaskPriority('medium');
      addToast('Task added!', 'success');
      // Refresh tasks
      const res = await projectAPI.getTasks(selectedProj._id);
      setTasks(res.data);
      // Update progress in sidebar
      fetchProjects(false);
    } catch (err) {
      addToast('Failed to add task', 'error');
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      await projectAPI.toggleTask(taskId);
      // Refresh tasks list
      const res = await projectAPI.getTasks(selectedProj._id);
      setTasks(res.data);
      // Update progress in sidebar
      fetchProjects(false);
    } catch (err) {
      addToast('Failed to toggle task state', 'error');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await projectAPI.deleteTask(taskId);
      addToast('Task deleted', 'info');
      // Refresh tasks list
      const res = await projectAPI.getTasks(selectedProj._id);
      setTasks(res.data);
      // Update progress in sidebar
      fetchProjects(false);
    } catch (err) {
      addToast('Failed to delete task', 'error');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-danger-400 bg-danger-500/10';
      case 'medium': return 'text-warning-400 bg-warning-500/10';
      case 'low': return 'text-success-400 bg-success-500/10';
      default: return 'text-dark-400 bg-white/5';
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold mb-1 flex items-center gap-2">
            <FolderKanban className="text-amber-400" /> Projects & Tasks
          </h1>
          <p className="text-dark-400">Manage development projects, breakdown milestones, and track tasks.</p>
        </div>
        <button
          onClick={() => setShowProjModal(true)}
          className="btn btn-primary flex items-center gap-2 self-start sm:self-center"
        >
          <Plus size={18} /> New Project
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="skeleton h-[450px] rounded-xl" />
          <div className="skeleton h-[450px] lg:col-span-2 rounded-xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column: Projects List */}
          <div className="glass-card p-5 space-y-4">
            <h3 className="font-semibold text-sm text-dark-300">My Projects</h3>
            {projects.length === 0 ? (
              <p className="text-sm text-dark-500 text-center py-8">No projects created yet. Click "New Project" to start!</p>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {projects.map((proj) => {
                  const isSelected = selectedProj?._id === proj._id;
                  return (
                    <div
                      key={proj._id}
                      onClick={() => handleSelectProject(proj)}
                      className={`p-3.5 rounded-lg cursor-pointer transition-all border ${
                        isSelected
                          ? 'bg-primary-500/10 border-primary-500/30'
                          : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: proj.color || '#6366f1' }} />
                        <span className="font-semibold text-sm truncate flex-1">{proj.title}</span>
                      </div>
                      <p className="text-xs text-dark-400 truncate mb-3">{proj.description || 'No description'}</p>
                      
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[10px] text-dark-400">
                          <span>{proj.completedTasks}/{proj.totalTasks} Tasks</span>
                          <span>{proj.progress}%</span>
                        </div>
                        <div className="progress-bar !h-1">
                          <div className="progress-fill" style={{ width: `${proj.progress}%`, backgroundColor: proj.color }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Tasks Detail Pane */}
          <div className="glass-card p-6 lg:col-span-2 space-y-6">
            {selectedProj ? (
              <>
                {/* Project Header Info */}
                <div className="flex justify-between items-start gap-4 pb-5 border-b border-white/5">
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold flex items-center gap-2.5">
                      <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: selectedProj.color }} />
                      {selectedProj.title}
                    </h2>
                    <p className="text-sm text-dark-400">{selectedProj.description}</p>
                    <div className="flex items-center gap-4 pt-1.5 text-xs text-dark-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} /> Deadline:{' '}
                        {selectedProj.deadline
                          ? new Date(selectedProj.deadline).toLocaleDateString()
                          : 'None'}
                      </span>
                      <span className="capitalize px-1.5 py-0.5 rounded bg-white/5">
                        Status: {selectedProj.status}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteProject(selectedProj._id)}
                    className="p-2 rounded-lg text-danger-400 hover:bg-danger-500/10 transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Task Creation Form */}
                <form onSubmit={handleCreateTask} className="flex gap-2 items-center bg-white/[0.02] p-3 rounded-lg border border-white/5">
                  <input
                    type="text"
                    placeholder="Add a new project task..."
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    className="input-base border-none bg-transparent !p-1.5 focus:shadow-none flex-1 text-sm"
                  />
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                    className="input-base !w-auto !py-1 !px-2.5 text-xs"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <button type="submit" className="btn btn-primary !py-1.5 !px-4 text-xs">
                    Add
                  </button>
                </form>

                {/* Tasks Checklist */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-dark-300">Project Tasks</h3>
                  {tasksLoading ? (
                    <div className="space-y-2 py-4">
                      <div className="skeleton h-10 rounded-lg" />
                      <div className="skeleton h-10 rounded-lg" />
                    </div>
                  ) : tasks.length === 0 ? (
                    <div className="text-center py-8 text-dark-500 text-sm">
                      No tasks added to this project yet. Add one above!
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {tasks.map((task) => (
                        <div
                          key={task._id}
                          className={`p-3.5 rounded-lg flex items-center justify-between gap-4 bg-white/[0.01] border border-white/5 hover:bg-white/[0.02] transition-colors ${
                            task.completed ? 'opacity-60' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <button
                              onClick={() => handleToggleTask(task._id)}
                              className={`transition-colors flex-shrink-0 ${
                                task.completed ? 'text-success-400' : 'text-dark-500 hover:text-dark-300'
                              }`}
                            >
                              {task.completed ? <CheckSquare size={18} /> : <Square size={18} />}
                            </button>
                            <span className={`text-sm font-medium truncate ${task.completed ? 'line-through text-dark-500' : ''}`}>
                              {task.taskName}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`badge uppercase text-[9px] tracking-wider px-1.5 ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                            <button
                              onClick={() => handleDeleteTask(task._id)}
                              className="p-1 rounded text-dark-500 hover:text-danger-400 transition-colors"
                              title="Delete Task"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-dark-400 text-center">
                <FolderKanban size={48} className="opacity-20 mb-3" />
                <h4 className="font-bold">No Project Selected</h4>
                <p className="text-sm mt-1">Please select a project from the left or create a new one.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* New Project Modal */}
      {showProjModal && (
        <div className="modal-overlay">
          <div className="modal-content p-6">
            <h3 className="text-lg font-bold mb-1">Create New Project</h3>
            <p className="text-xs text-dark-400 mb-5">Define your project parameters to log daily task targets.</p>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Project Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Portfolio Website"
                  className="input-base"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Personal showcase website built with Next.js and Tailwind..."
                  className="input-base h-20 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Deadline</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="input-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Project Color</label>
                  <div className="flex items-center gap-2 mt-1">
                    {['#6366f1', '#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#ec4899'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={`w-7 h-7 rounded-full transition-transform ${
                          color === c ? 'scale-110 ring-2 ring-white/50' : 'opacity-70 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Initial Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="input-base"
                >
                  <option value="planning">Planning</option>
                  <option value="in-progress">In Progress</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowProjModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
