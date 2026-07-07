import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import * as projCtrl from '../controllers/project.controller.js';

const router = Router();
router.use(protect);

router.get('/', projCtrl.getProjects);
router.post('/', projCtrl.createProject);
router.put('/:id', projCtrl.updateProject);
router.delete('/:id', projCtrl.deleteProject);
router.get('/:projectId/tasks', projCtrl.getTasks);
router.post('/:projectId/tasks', projCtrl.createTask);
router.put('/tasks/:taskId/toggle', projCtrl.toggleTask);
router.delete('/tasks/:taskId', projCtrl.deleteTask);

export default router;
