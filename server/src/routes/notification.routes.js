import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import * as notifCtrl from '../controllers/notification.controller.js';

const router = Router();
router.use(protect);

router.get('/', notifCtrl.getNotifications);
router.get('/unread-count', notifCtrl.getUnreadCount);
router.put('/:id/read', notifCtrl.markRead);
router.put('/read-all', notifCtrl.markAllRead);

export default router;
