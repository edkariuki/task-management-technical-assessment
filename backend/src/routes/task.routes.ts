import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/task.controller';

const router = Router();

router.use(requireAuth); // Protect all routes below

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
