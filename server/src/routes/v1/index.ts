import { Router } from 'express';
import { healthRoutes } from '../../modules/health/health.routes';
import { authRoutes } from '../../modules/auth/auth.routes';
import { coursesRoutes } from '../../modules/courses/courses.routes';
import { templatesRoutes } from '../../modules/courses/templates.routes';
import { enrolmentsRoutes } from '../../modules/courses/enrolments.routes';
import { complianceRoutes } from '../../modules/compliance/compliance.routes';
import { storageRoutes } from '../../modules/storage/storage.routes';
import usersRoutes from '../../modules/users/users.routes';
import { organizationsRoutes } from '../../modules/organizations/organizations.routes';
import { dashboardRoutes } from '../../modules/dashboard/dashboard.routes';
import learnersRoutes from '../../modules/learners/learners.routes';
import rolesRoutes from '../../modules/roles/roles.routes';
import permissionsRoutes from '../../modules/permissions/permissions.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/learners', learnersRoutes);
router.use('/templates', templatesRoutes);
router.use('/courses', coursesRoutes);
router.use('/course-enrolments', enrolmentsRoutes);
router.use('/compliance-records', complianceRoutes);
router.use('/storage', storageRoutes);
router.use('/organizations', organizationsRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/roles', rolesRoutes);
router.use('/permissions', permissionsRoutes);

export const v1Routes = router;
