import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import * as goalsCtrl from '../controllers/goals.controller.js';

const router = Router();
router.use(protect);

router.get('/today', goalsCtrl.getTodayGoal);
router.put('/progress', goalsCtrl.updateGoalProgress);
router.get('/history', goalsCtrl.getGoalHistory);
router.put('/targets', goalsCtrl.updateTargets);

export default router;
