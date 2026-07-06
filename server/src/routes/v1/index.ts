import { Router } from 'express';
import { healthRoutes } from '../../modules/health/health.routes';
import { authRoutes } from '../../modules/auth/auth.routes';
import { coursesRoutes } from '../../modules/courses/courses.routes';
import { enrolmentsRoutes } from '../../modules/courses/enrolments.routes';
import { complianceRoutes } from '../../modules/compliance/compliance.routes';
import { storageRoutes } from '../../modules/storage/storage.routes';
import usersRoutes from '../../modules/users/users.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/courses', coursesRoutes);
router.use('/course-enrolments', enrolmentsRoutes);
router.use('/compliance-records', complianceRoutes);
router.use('/storage', storageRoutes);

export const v1Routes = router;
