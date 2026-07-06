import { Router } from 'express';
import { healthRoutes } from '../../modules/health/health.routes';
import { authRoutes } from '../../modules/auth/auth.routes';
import { coursesRoutes } from '../../modules/courses/courses.routes';
import { storageRoutes } from '../../modules/storage/storage.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/courses', coursesRoutes);
router.use('/storage', storageRoutes);

export const v1Routes = router;
