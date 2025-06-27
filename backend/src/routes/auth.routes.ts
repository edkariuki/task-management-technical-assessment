import { Router } from 'express';
import { getProfile, loginUser, registerUser } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', async (req, res, next) => {
  try {
    await registerUser(req, res);
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    await loginUser(req, res);
  } catch (err) {
    next(err);
  }
});

router.get('/profile', requireAuth, async (req, res, next) => {
  try {
    await getProfile(req, res);
  } catch (err) {
    next(err);
  }
});

export default router;
