import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import * as revCtrl from '../controllers/revision.controller.js';

const router = Router();
router.use(protect);

router.get('/today', revCtrl.getTodayRevisions);
router.get('/upcoming', revCtrl.getUpcomingRevisions);
router.get('/', revCtrl.getAllRevisions);
router.put('/:id/complete', revCtrl.markRevisionComplete);

export default router;
