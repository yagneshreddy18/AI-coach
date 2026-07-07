import AptitudeCategory from '../models/AptitudeCategory.js';
import AptitudeProgress from '../models/AptitudeProgress.js';
import { getDayBounds, getWeekStart } from '../utils/helpers.js';

export const getCategories = async () => {
  return AptitudeCategory.find().lean();
};

export const logPractice = async (userId, { categoryId, totalQuestions, correct, wrong }) => {
  const session = await AptitudeProgress.create({
    userId,
    categoryId,
    totalQuestions,
    correct,
    wrong,
    date: new Date(),
  });
  return session;
};

export const getProgress = async (userId) => {
  const categories = await AptitudeCategory.find().lean();

  const stats = await Promise.all(
    categories.map(async (cat) => {
      const sessions = await AptitudeProgress.find({ userId, categoryId: cat._id });
      const totalQuestions = sessions.reduce((sum, s) => sum + s.totalQuestions, 0);
      const totalCorrect = sessions.reduce((sum, s) => sum + s.correct, 0);
      const totalWrong = sessions.reduce((sum, s) => sum + s.wrong, 0);
      return {
        ...cat,
        totalQuestions,
        correct: totalCorrect,
        wrong: totalWrong,
        accuracy: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
        sessions: sessions.length,
      };
    })
  );

  const overall = {
    totalQuestions: stats.reduce((sum, s) => sum + s.totalQuestions, 0),
    correct: stats.reduce((sum, s) => sum + s.correct, 0),
    wrong: stats.reduce((sum, s) => sum + s.wrong, 0),
  };
  overall.accuracy = overall.totalQuestions > 0 ? Math.round((overall.correct / overall.totalQuestions) * 100) : 0;

  // Find weakest and strongest
  const withData = stats.filter((s) => s.totalQuestions > 0);
  const weakest = withData.length > 0 ? withData.reduce((min, s) => (s.accuracy < min.accuracy ? s : min)) : null;
  const strongest = withData.length > 0 ? withData.reduce((max, s) => (s.accuracy > max.accuracy ? s : max)) : null;

  return { categories: stats, overall, weakest: weakest?.name || 'N/A', strongest: strongest?.name || 'N/A' };
};

export const getWeeklyAccuracy = async (userId) => {
  const weekStart = getWeekStart();
  const sessions = await AptitudeProgress.find({
    userId,
    date: { $gte: weekStart },
  }).sort({ date: 1 });

  // Group by day
  const daily = {};
  sessions.forEach((s) => {
    const day = s.date.toISOString().split('T')[0];
    if (!daily[day]) daily[day] = { total: 0, correct: 0 };
    daily[day].total += s.totalQuestions;
    daily[day].correct += s.correct;
  });

  return Object.entries(daily).map(([date, data]) => ({
    date,
    accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
    total: data.total,
  }));
};

export const getTodayCount = async (userId) => {
  const { start, end } = getDayBounds();
  const sessions = await AptitudeProgress.find({ userId, date: { $gte: start, $lte: end } });
  return sessions.reduce((sum, s) => sum + s.totalQuestions, 0);
};
