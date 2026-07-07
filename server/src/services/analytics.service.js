import UserDsaProgress from '../models/UserDsaProgress.js';
import UserLessonProgress from '../models/UserLessonProgress.js';
import AptitudeProgress from '../models/AptitudeProgress.js';
import StudySession from '../models/StudySession.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import DsaProblem from '../models/DsaProblem.js';
import Lesson from '../models/Lesson.js';
import DailyGoal from '../models/DailyGoal.js';
import { getWeekStart } from '../utils/helpers.js';

export const getDashboardStats = async (userId) => {
  const [dsaTotal, dsaCompleted, lessonTotal, lessonCompleted] = await Promise.all([
    DsaProblem.countDocuments(),
    UserDsaProgress.countDocuments({ userId, completed: true }),
    Lesson.countDocuments(),
    UserLessonProgress.countDocuments({ userId, completed: true }),
  ]);

  const aptSessions = await AptitudeProgress.find({ userId });
  const aptTotal = aptSessions.reduce((sum, s) => sum + s.totalQuestions, 0);
  const aptCorrect = aptSessions.reduce((sum, s) => sum + s.correct, 0);

  const projects = await Project.find({ userId }).lean();
  const projectIds = projects.map((p) => p._id);
  const [taskTotal, taskCompleted] = await Promise.all([
    Task.countDocuments({ projectId: { $in: projectIds } }),
    Task.countDocuments({ projectId: { $in: projectIds }, completed: true }),
  ]);

  // Overall completion
  const totalItems = dsaTotal + lessonTotal + taskTotal;
  const completedItems = dsaCompleted + lessonCompleted + taskCompleted;
  const overallCompletion = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return {
    dsa: { total: dsaTotal, completed: dsaCompleted, percentage: dsaTotal > 0 ? Math.round((dsaCompleted / dsaTotal) * 100) : 0 },
    fullstack: { total: lessonTotal, completed: lessonCompleted, percentage: lessonTotal > 0 ? Math.round((lessonCompleted / lessonTotal) * 100) : 0 },
    aptitude: { totalQuestions: aptTotal, correct: aptCorrect, accuracy: aptTotal > 0 ? Math.round((aptCorrect / aptTotal) * 100) : 0 },
    projects: { total: projects.length, tasks: taskTotal, completedTasks: taskCompleted, percentage: taskTotal > 0 ? Math.round((taskCompleted / taskTotal) * 100) : 0 },
    overallCompletion,
  };
};

export const getStudyAnalytics = async (userId) => {
  const weekStart = getWeekStart();
  const sessions = await StudySession.find({ userId, date: { $gte: weekStart } }).sort({ date: 1 });

  // Daily study hours for the week
  const dailyHours = {};
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  days.forEach((d) => (dailyHours[d] = 0));

  sessions.forEach((s) => {
    const dayIndex = s.date.getDay();
    const dayName = days[(dayIndex + 6) % 7]; // Adjust for Mon start
    dailyHours[dayName] += s.duration / 3600;
  });

  const weeklyData = days.map((day) => ({ day, hours: Math.round(dailyHours[day] * 10) / 10 }));

  // Category breakdown
  const categoryBreakdown = {};
  sessions.forEach((s) => {
    if (!categoryBreakdown[s.category]) categoryBreakdown[s.category] = 0;
    categoryBreakdown[s.category] += s.duration;
  });

  return { weeklyData, categoryBreakdown };
};

export const getPlacementReadiness = async (userId) => {
  const stats = await getDashboardStats(userId);
  const dsaScore = stats.dsa.percentage;
  const fsScore = stats.fullstack.percentage;
  const aptScore = stats.aptitude.accuracy;
  const projScore = stats.projects.percentage;

  // Weighted average: DSA 35%, FullStack 25%, Aptitude 25%, Projects 15%
  const readiness = Math.round(dsaScore * 0.35 + fsScore * 0.25 + aptScore * 0.25 + projScore * 0.15);

  return { readiness, breakdown: { dsa: dsaScore, fullstack: fsScore, aptitude: aptScore, projects: projScore } };
};
