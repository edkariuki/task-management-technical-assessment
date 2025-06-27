import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/task.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(requireAuth); // Protect all routes below

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', asyncHandler(deleteTask) );

export default router;
