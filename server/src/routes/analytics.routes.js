import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import * as analyticsCtrl from '../controllers/analytics.controller.js';

const router = Router();
router.use(protect);

router.get('/dashboard', analyticsCtrl.getDashboardStats);
router.get('/study', analyticsCtrl.getStudyAnalytics);
router.get('/readiness', analyticsCtrl.getPlacementReadiness);

export default router;
