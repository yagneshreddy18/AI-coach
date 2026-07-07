import DsaProblem from '../models/DsaProblem.js';
import UserDsaProgress from '../models/UserDsaProgress.js';
import Revision from '../models/Revision.js';
import { ApiError } from '../middleware/errorHandler.js';
import { getDayBounds } from '../utils/helpers.js';

export const getAllProblems = async (userId, { topic, difficulty, search, page = 1, limit = 50 }) => {
  const query = {};
  if (topic) query.topic = topic;
  if (difficulty) query.difficulty = difficulty;
  if (search) query.title = { $regex: search, $options: 'i' };

  const skip = (page - 1) * limit;
  const [problems, total] = await Promise.all([
    DsaProblem.find(query).sort({ orderNumber: 1 }).skip(skip).limit(limit).lean(),
    DsaProblem.countDocuments(query),
  ]);

  // Get user progress for these problems
  const problemIds = problems.map((p) => p._id);
  const progress = await UserDsaProgress.find({
    userId,
    problemId: { $in: problemIds },
  }).lean();

  const progressMap = {};
  progress.forEach((p) => {
    progressMap[p.problemId.toString()] = p;
  });

  const enriched = problems.map((problem) => ({
    ...problem,
    userProgress: progressMap[problem._id.toString()] || { completed: false, personalNotes: '', revisionDates: [] },
  }));

  return { problems: enriched, total, page: Number(page), pages: Math.ceil(total / limit) };
};

export const getTopics = async () => {
  const topics = await DsaProblem.distinct('topic');
  const topicStats = await DsaProblem.aggregate([
    { $group: { _id: '$topic', count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
  return topicStats.map((t) => ({ topic: t._id, count: t.count }));
};

export const getProgress = async (userId) => {
  const total = await DsaProblem.countDocuments();
  const completed = await UserDsaProgress.countDocuments({ userId, completed: true });
  const topicProgress = await DsaProblem.aggregate([
    {
      $lookup: {
        from: 'userdsaprogresses',
        let: { problemId: '$_id' },
        pipeline: [
          { $match: { $expr: { $and: [{ $eq: ['$problemId', '$$problemId'] }, { $eq: ['$userId', userId] }, { $eq: ['$completed', true] }] } } },
        ],
        as: 'progress',
      },
    },
    {
      $group: {
        _id: '$topic',
        total: { $sum: 1 },
        completed: { $sum: { $cond: [{ $gt: [{ $size: '$progress' }, 0] }, 1, 0] } },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0, topicProgress };
};

export const markComplete = async (userId, problemId) => {
  let progress = await UserDsaProgress.findOne({ userId, problemId });
  if (!progress) {
    progress = new UserDsaProgress({ userId, problemId });
  }

  progress.completed = true;
  progress.completedDate = new Date();
  await progress.save();

  // Schedule revisions (+1 day, +7 days, +30 days)
  const now = new Date();
  const revisionDays = [1, 7, 30];
  const revisions = revisionDays.map((days, index) => ({
    userId,
    problemId,
    scheduledDate: new Date(now.getTime() + days * 24 * 60 * 60 * 1000),
    revisionNumber: index + 1,
  }));

  // Remove existing incomplete revisions for this problem
  await Revision.deleteMany({ userId, problemId, completed: false });
  await Revision.insertMany(revisions);

  return progress;
};

export const undoComplete = async (userId, problemId) => {
  const progress = await UserDsaProgress.findOne({ userId, problemId });
  if (!progress) throw new ApiError(404, 'Progress not found');

  progress.completed = false;
  progress.completedDate = null;
  await progress.save();

  // Remove scheduled revisions
  await Revision.deleteMany({ userId, problemId, completed: false });

  return progress;
};

export const updateNotes = async (userId, problemId, notes) => {
  let progress = await UserDsaProgress.findOne({ userId, problemId });
  if (!progress) {
    progress = new UserDsaProgress({ userId, problemId });
  }
  progress.personalNotes = notes;
  await progress.save();
  return progress;
};

export const getNextUnsolved = async (userId, count = 5) => {
  const completedIds = await UserDsaProgress.find({ userId, completed: true }).distinct('problemId');
  const unsolved = await DsaProblem.find({ _id: { $nin: completedIds } })
    .sort({ orderNumber: 1 })
    .limit(count)
    .lean();
  return unsolved;
};
