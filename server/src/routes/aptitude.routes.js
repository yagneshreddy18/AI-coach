import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import * as aptCtrl from '../controllers/aptitude.controller.js';

const router = Router();
router.use(protect);

router.get('/categories', aptCtrl.getCategories);
router.post('/practice', aptCtrl.logPractice);
router.get('/progress', aptCtrl.getProgress);
router.get('/weekly-accuracy', aptCtrl.getWeeklyAccuracy);

export default router;
