import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import * as searchCtrl from '../controllers/search.controller.js';

const router = Router();
router.use(protect);
router.get('/', searchCtrl.globalSearch);

export default router;
