import Project from '../models/Project.js';
import Task from '../models/Task.js';
import { ApiError } from '../middleware/errorHandler.js';

export const getProjects = async (userId) => {
  const projects = await Project.find({ userId }).sort({ createdAt: -1 }).lean();
  const enriched = await Promise.all(
    projects.map(async (project) => {
      const tasks = await Task.find({ projectId: project._id }).lean();
      const completedTasks = tasks.filter((t) => t.completed).length;
      return {
        ...project,
        totalTasks: tasks.length,
        completedTasks,
        progress: tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0,
      };
    })
  );
  return enriched;
};

export const createProject = async (userId, data) => {
  return Project.create({ ...data, userId });
};

export const updateProject = async (userId, projectId, data) => {
  const project = await Project.findOneAndUpdate({ _id: projectId, userId }, data, { new: true });
  if (!project) throw new ApiError(404, 'Project not found');
  return project;
};

export const deleteProject = async (userId, projectId) => {
  const project = await Project.findOneAndDelete({ _id: projectId, userId });
  if (!project) throw new ApiError(404, 'Project not found');
  await Task.deleteMany({ projectId });
  return { message: 'Project deleted' };
};

export const getTasks = async (projectId) => {
  return Task.find({ projectId }).sort({ priority: -1, createdAt: -1 }).lean();
};

export const createTask = async (projectId, data) => {
  return Task.create({ ...data, projectId });
};

export const toggleTask = async (taskId) => {
  const task = await Task.findById(taskId);
  if (!task) throw new ApiError(404, 'Task not found');
  task.completed = !task.completed;
  task.completedDate = task.completed ? new Date() : null;
  await task.save();
  return task;
};

export const deleteTask = async (taskId) => {
  const task = await Task.findByIdAndDelete(taskId);
  if (!task) throw new ApiError(404, 'Task not found');
  return { message: 'Task deleted' };
};

export const getCompletedToday = async (userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const projects = await Project.find({ userId }).lean();
  const projectIds = projects.map((p) => p._id);
  const count = await Task.countDocuments({
    projectId: { $in: projectIds },
    completed: true,
    completedDate: { $gte: today, $lt: tomorrow },
  });
  return count;
};
