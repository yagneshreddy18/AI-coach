import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import * as calendarCtrl from '../controllers/calendar.controller.js';

const router = Router();
router.use(protect);
router.get('/', calendarCtrl.getCalendarData);

export default router;
