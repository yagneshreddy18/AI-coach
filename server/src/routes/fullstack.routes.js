import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import * as fsCtrl from '../controllers/fullstack.controller.js';

const router = Router();
router.use(protect);

router.get('/courses', fsCtrl.getAllCourses);
router.get('/courses/:courseId/lessons', fsCtrl.getCourseLessons);
router.get('/progress', fsCtrl.getOverallProgress);
router.put('/lessons/:lessonId/toggle', fsCtrl.toggleLesson);
router.put('/lessons/:lessonId/notes', fsCtrl.updateLessonNotes);

export default router;
