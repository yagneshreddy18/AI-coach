import StudySession from '../models/StudySession.js';
import { getDayBounds, getWeekStart, getMonthStart } from '../utils/helpers.js';

export const saveSession = async (userId, { duration, category, startTime, endTime }) => {
  return StudySession.create({ userId, duration, category, startTime, endTime, date: new Date() });
};

export const getTodayTime = async (userId) => {
  const { start, end } = getDayBounds();
  const sessions = await StudySession.find({ userId, date: { $gte: start, $lte: end } });
  const total = sessions.reduce((sum, s) => sum + s.duration, 0);
  return { totalSeconds: total, sessions: sessions.length };
};

export const getWeeklyTime = async (userId) => {
  const weekStart = getWeekStart();
  const sessions = await StudySession.find({ userId, date: { $gte: weekStart } }).sort({ date: 1 });
  const total = sessions.reduce((sum, s) => sum + s.duration, 0);

  // Group by day
  const daily = {};
  sessions.forEach((s) => {
    const day = s.date.toISOString().split('T')[0];
    if (!daily[day]) daily[day] = 0;
    daily[day] += s.duration;
  });

  return {
    totalSeconds: total,
    daily: Object.entries(daily).map(([date, seconds]) => ({ date, hours: Math.round((seconds / 3600) * 10) / 10 })),
  };
};

export const getMonthlyTime = async (userId) => {
  const monthStart = getMonthStart();
  const sessions = await StudySession.find({ userId, date: { $gte: monthStart } });
  const total = sessions.reduce((sum, s) => sum + s.duration, 0);
  return { totalSeconds: total };
};

export const getRecentSessions = async (userId, limit = 10) => {
  return StudySession.find({ userId }).sort({ date: -1 }).limit(limit).lean();
};
