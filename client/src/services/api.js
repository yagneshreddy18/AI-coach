import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pp_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('pp_token');
      localStorage.removeItem('pp_user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

// ============= Auth =============
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  updateSettings: (data) => api.put('/auth/settings', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// ============= DSA =============
export const dsaAPI = {
  getProblems: (params) => api.get('/dsa/problems', { params }),
  getTopics: () => api.get('/dsa/topics'),
  getProgress: () => api.get('/dsa/progress'),
  markComplete: (problemId) => api.put(`/dsa/problems/${problemId}/complete`),
  undoComplete: (problemId) => api.put(`/dsa/problems/${problemId}/undo`),
  updateNotes: (problemId, notes) => api.put(`/dsa/problems/${problemId}/notes`, { notes }),
  getNextUnsolved: (count) => api.get('/dsa/next-unsolved', { params: { count } }),
};

// ============= Full Stack =============
export const fullstackAPI = {
  getCourses: () => api.get('/fullstack/courses'),
  getCourseLessons: (courseId) => api.get(`/fullstack/courses/${courseId}/lessons`),
  toggleLesson: (lessonId) => api.put(`/fullstack/lessons/${lessonId}/toggle`),
  updateNotes: (lessonId, notes) => api.put(`/fullstack/lessons/${lessonId}/notes`, { notes }),
  getProgress: () => api.get('/fullstack/progress'),
};

// ============= Aptitude =============
export const aptitudeAPI = {
  getCategories: () => api.get('/aptitude/categories'),
  logPractice: (data) => api.post('/aptitude/practice', data),
  getProgress: () => api.get('/aptitude/progress'),
  getWeeklyAccuracy: () => api.get('/aptitude/weekly-accuracy'),
};

// ============= Projects =============
export const projectAPI = {
  getProjects: () => api.get('/projects'),
  createProject: (data) => api.post('/projects', data),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  getTasks: (projectId) => api.get(`/projects/${projectId}/tasks`),
  createTask: (projectId, data) => api.post(`/projects/${projectId}/tasks`, data),
  toggleTask: (taskId) => api.put(`/projects/tasks/${taskId}/toggle`),
  deleteTask: (taskId) => api.delete(`/projects/tasks/${taskId}`),
};

// ============= Timer =============
export const timerAPI = {
  saveSession: (data) => api.post('/timer/sessions', data),
  getTodayTime: () => api.get('/timer/today'),
  getWeeklyTime: () => api.get('/timer/weekly'),
  getMonthlyTime: () => api.get('/timer/monthly'),
  getRecentSessions: () => api.get('/timer/recent'),
};

// ============= Goals =============
export const goalsAPI = {
  getTodayGoal: () => api.get('/goals/today'),
  updateProgress: (data) => api.put('/goals/progress', data),
  getHistory: (days) => api.get('/goals/history', { params: { days } }),
  updateTargets: (data) => api.put('/goals/targets', data),
};

// ============= Analytics =============
export const analyticsAPI = {
  getDashboardStats: () => api.get('/analytics/dashboard'),
  getStudyAnalytics: () => api.get('/analytics/study'),
  getPlacementReadiness: () => api.get('/analytics/readiness'),
};

// ============= Calendar =============
export const calendarAPI = {
  getCalendarData: (month, year) => api.get('/calendar', { params: { month, year } }),
};

// ============= Search =============
export const searchAPI = {
  globalSearch: (q) => api.get('/search', { params: { q } }),
};

// ============= Notifications =============
export const notificationAPI = {
  getNotifications: (params) => api.get('/notifications', { params }),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
};

// ============= Revisions =============
export const revisionAPI = {
  getTodayRevisions: () => api.get('/revisions/today'),
  getUpcoming: (days) => api.get('/revisions/upcoming', { params: { days } }),
  markComplete: (id) => api.put(`/revisions/${id}/complete`),
  getAll: () => api.get('/revisions'),
};

export default api;
