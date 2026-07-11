import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { LearnersController } from './learners.controller';

const router = Router();

// Only org_admin or super_admin can create learners
router.post('/', authenticate, authorize('org_admin', 'super_admin'), LearnersController.createLearner);

export default router;
