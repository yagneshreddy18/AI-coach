import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import * as timerCtrl from '../controllers/timer.controller.js';

const router = Router();
router.use(protect);

router.post('/sessions', timerCtrl.saveSession);
router.get('/today', timerCtrl.getTodayTime);
router.get('/weekly', timerCtrl.getWeeklyTime);
router.get('/monthly', timerCtrl.getMonthlyTime);
router.get('/recent', timerCtrl.getRecentSessions);

export default router;
