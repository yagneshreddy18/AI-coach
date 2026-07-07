import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getMe, updateProfile, updateSettings, changePassword } from '../controllers/auth.controller.js';

const router = Router();

router.use(protect);

router.get('/me', getMe);
router.put('/profile', updateProfile);
router.put('/settings', updateSettings);
router.put('/change-password', changePassword);

export default router;
