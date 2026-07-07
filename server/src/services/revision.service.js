import Revision from '../models/Revision.js';
import { getDayBounds } from '../utils/helpers.js';

export const getTodayRevisions = async (userId) => {
  const { start, end } = getDayBounds();
  return Revision.find({
    userId,
    scheduledDate: { $gte: start, $lte: end },
    completed: false,
  })
    .populate('problemId', 'title topic difficulty platform problemLink')
    .sort({ revisionNumber: 1 })
    .lean();
};

export const getUpcomingRevisions = async (userId, days = 7) => {
  const now = new Date();
  const future = new Date();
  future.setDate(future.getDate() + days);

  return Revision.find({
    userId,
    scheduledDate: { $gte: now, $lte: future },
    completed: false,
  })
    .populate('problemId', 'title topic difficulty')
    .sort({ scheduledDate: 1 })
    .lean();
};

export const markRevisionComplete = async (userId, revisionId) => {
  const revision = await Revision.findOneAndUpdate(
    { _id: revisionId, userId },
    { completed: true, completedDate: new Date() },
    { new: true }
  );
  return revision;
};

export const getAllRevisions = async (userId) => {
  return Revision.find({ userId })
    .populate('problemId', 'title topic')
    .sort({ scheduledDate: -1 })
    .lean();
};
