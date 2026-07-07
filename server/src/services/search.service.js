import DsaProblem from '../models/DsaProblem.js';
import Lesson from '../models/Lesson.js';
import Project from '../models/Project.js';
import UserDsaProgress from '../models/UserDsaProgress.js';

export const globalSearch = async (userId, query) => {
  if (!query || query.length < 2) return { problems: [], lessons: [], projects: [] };

  const regex = { $regex: query, $options: 'i' };

  const [problems, lessons, projects] = await Promise.all([
    DsaProblem.find({ title: regex }).limit(10).lean(),
    Lesson.find({ title: regex }).populate('courseId', 'title').limit(10).lean(),
    Project.find({ userId, title: regex }).limit(10).lean(),
  ]);

  // Check notes for matching DSA progress
  const noteResults = await UserDsaProgress.find({
    userId,
    personalNotes: regex,
  })
    .populate('problemId', 'title topic')
    .limit(5)
    .lean();

  return { problems, lessons, projects, notes: noteResults };
};
