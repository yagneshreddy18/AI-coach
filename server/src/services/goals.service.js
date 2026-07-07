import DailyGoal from '../models/DailyGoal.js';
import User from '../models/User.js';
import { getDayBounds } from '../utils/helpers.js';

const getTodayStr = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export const getTodayGoal = async (userId) => {
  const today = getTodayStr();
  let goal = await DailyGoal.findOne({ userId, date: today });
  if (!goal) {
    const user = await User.findById(userId);
    goal = await DailyGoal.create({
      userId,
      date: today,
      dsaTarget: user.settings.dailyDsaGoal,
      fullstackTarget: user.settings.dailyFullstackGoal,
      aptitudeTarget: user.settings.dailyAptitudeGoal,
      projectTarget: user.settings.dailyProjectGoal,
    });
  }
  return goal;
};

export const updateGoalProgress = async (userId, updates) => {
  const today = getTodayStr();
  let goal = await DailyGoal.findOne({ userId, date: today });
  if (!goal) {
    goal = await DailyGoal.create({ userId, date: today, ...updates });
  } else {
    Object.assign(goal, updates);
  }

  // Check if all goals are met
  goal.isCompleted =
    goal.dsaCompleted >= goal.dsaTarget &&
    goal.fullstackCompleted >= goal.fullstackTarget &&
    goal.aptitudeCompleted >= goal.aptitudeTarget &&
    goal.projectCompleted >= goal.projectTarget;

  await goal.save();

  // Update streak if completed
  if (goal.isCompleted) {
    await updateStreak(userId);
  }

  return goal;
};

const updateStreak = async (userId) => {
  const user = await User.findById(userId);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActive = user.streak.lastActiveDate ? new Date(user.streak.lastActiveDate) : null;

  if (lastActive) {
    lastActive.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((today - lastActive) / (24 * 60 * 60 * 1000));

    if (diffDays === 0) {
      // Already updated today
      return;
    } else if (diffDays === 1) {
      // Consecutive day
      user.streak.current += 1;
    } else {
      // Streak broken
      user.streak.current = 1;
    }
  } else {
    user.streak.current = 1;
  }

  user.streak.lastActiveDate = today;
  if (user.streak.current > user.streak.longest) {
    user.streak.longest = user.streak.current;
  }

  await user.save();
};

export const getGoalHistory = async (userId, days = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  return DailyGoal.find({ userId, date: { $gte: startDate } }).sort({ date: -1 }).lean();
};

export const updateTargets = async (userId, targets) => {
  const user = await User.findById(userId);
  if (targets.dailyDsaGoal !== undefined) user.settings.dailyDsaGoal = targets.dailyDsaGoal;
  if (targets.dailyFullstackGoal !== undefined) user.settings.dailyFullstackGoal = targets.dailyFullstackGoal;
  if (targets.dailyAptitudeGoal !== undefined) user.settings.dailyAptitudeGoal = targets.dailyAptitudeGoal;
  if (targets.dailyProjectGoal !== undefined) user.settings.dailyProjectGoal = targets.dailyProjectGoal;
  await user.save();
  return user.settings;
};
