import { Router } from 'express';
import { requireAuth } from '../auth/auth.middleware';
import { requirePermission } from '../auth/authorization.middleware';
import { LearnersController } from './learners.controller';

const router = Router();

// Only users with 'users:manage' permission can create learners
router.post('/', requireAuth, requirePermission('users', 'manage'), LearnersController.createLearner);

export default router;
