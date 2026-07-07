import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import UserLessonProgress from '../models/UserLessonProgress.js';
import { ApiError } from '../middleware/errorHandler.js';

export const getAllCourses = async (userId) => {
  const courses = await Course.find().sort({ orderNumber: 1 }).lean();

  // Get progress for each course
  const enriched = await Promise.all(
    courses.map(async (course) => {
      const lessons = await Lesson.find({ courseId: course._id }).lean();
      const lessonIds = lessons.map((l) => l._id);
      const completed = await UserLessonProgress.countDocuments({
        userId,
        lessonId: { $in: lessonIds },
        completed: true,
      });
      return {
        ...course,
        totalLessons: lessons.length,
        completedLessons: completed,
        progress: lessons.length > 0 ? Math.round((completed / lessons.length) * 100) : 0,
      };
    })
  );

  return enriched;
};

export const getCourseLessons = async (userId, courseId) => {
  const course = await Course.findById(courseId).lean();
  if (!course) throw new ApiError(404, 'Course not found');

  const lessons = await Lesson.find({ courseId }).sort({ orderNumber: 1 }).lean();
  const progress = await UserLessonProgress.find({
    userId,
    lessonId: { $in: lessons.map((l) => l._id) },
  }).lean();

  const progressMap = {};
  progress.forEach((p) => { progressMap[p.lessonId.toString()] = p; });

  const enrichedLessons = lessons.map((lesson) => ({
    ...lesson,
    userProgress: progressMap[lesson._id.toString()] || { completed: false, personalNotes: '' },
  }));

  const completedCount = progress.filter((p) => p.completed).length;

  return {
    course,
    lessons: enrichedLessons,
    totalLessons: lessons.length,
    completedLessons: completedCount,
    progress: lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0,
  };
};

export const toggleLesson = async (userId, lessonId) => {
  let progress = await UserLessonProgress.findOne({ userId, lessonId });
  if (!progress) {
    progress = new UserLessonProgress({ userId, lessonId, completed: true, completedDate: new Date() });
  } else {
    progress.completed = !progress.completed;
    progress.completedDate = progress.completed ? new Date() : null;
  }
  await progress.save();
  return progress;
};

export const updateLessonNotes = async (userId, lessonId, notes) => {
  let progress = await UserLessonProgress.findOne({ userId, lessonId });
  if (!progress) {
    progress = new UserLessonProgress({ userId, lessonId });
  }
  progress.personalNotes = notes;
  await progress.save();
  return progress;
};

export const getOverallProgress = async (userId) => {
  const totalLessons = await Lesson.countDocuments();
  const completedLessons = await UserLessonProgress.countDocuments({ userId, completed: true });
  return {
    total: totalLessons,
    completed: completedLessons,
    percentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
  };
};
