import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import * as dsaCtrl from '../controllers/dsa.controller.js';

const router = Router();
router.use(protect);

router.get('/problems', dsaCtrl.getAllProblems);
router.get('/topics', dsaCtrl.getTopics);
router.get('/progress', dsaCtrl.getProgress);
router.get('/next-unsolved', dsaCtrl.getNextUnsolved);
router.put('/problems/:problemId/complete', dsaCtrl.markComplete);
router.put('/problems/:problemId/undo', dsaCtrl.undoComplete);
router.put('/problems/:problemId/notes', dsaCtrl.updateNotes);

export default router;
