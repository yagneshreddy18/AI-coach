import { asyncHandler } from '../utils/helpers.js';
import * as fsService from '../services/fullstack.service.js';

export const getAllCourses = asyncHandler(async (req, res) => {
  const data = await fsService.getAllCourses(req.user._id);
  res.json({ success: true, data });
});

export const getCourseLessons = asyncHandler(async (req, res) => {
  const data = await fsService.getCourseLessons(req.user._id, req.params.courseId);
  res.json({ success: true, data });
});

export const toggleLesson = asyncHandler(async (req, res) => {
  const data = await fsService.toggleLesson(req.user._id, req.params.lessonId);
  res.json({ success: true, data });
});

export const updateLessonNotes = asyncHandler(async (req, res) => {
  const data = await fsService.updateLessonNotes(req.user._id, req.params.lessonId, req.body.notes);
  res.json({ success: true, data });
});

export const getOverallProgress = asyncHandler(async (req, res) => {
  const data = await fsService.getOverallProgress(req.user._id);
  res.json({ success: true, data });
});
