import { Router } from 'express';
import * as controller from './enrolments.controller';
import * as validator from './enrolments.validator';
import { validate } from '../../middleware/validate';
import { requireAuth } from '../auth/auth.middleware';
import { requirePermission } from '../auth/authorization.middleware';
import { tenantContext } from '../../middleware/tenantContext';

const router = Router();

// Apply common middlewares
router.use(requireAuth, tenantContext);

// Enrolment Routes
router.get('/', requirePermission('courses', 'read'), controller.listEnrolments);
router.get('/stats', requirePermission('courses', 'read'), controller.getStats);
router.get('/:id', requirePermission('courses', 'read'), controller.getEnrolment);
router.post('/', requirePermission('courses', 'create'), validate(validator.createEnrolmentSchema), controller.createEnrolment);
router.patch('/:id', requirePermission('courses', 'update'), validate(validator.updateEnrolmentSchema), controller.updateEnrolment);
router.delete('/:id', requirePermission('courses', 'delete'), controller.deleteEnrolment);

// Progress Tracking
router.post('/:id/progress', requirePermission('courses', 'update'), validate(validator.updateProgressSchema), controller.updateProgress);
router.post('/:id/complete', requirePermission('courses', 'update'), validate(validator.completeEnrolmentSchema), controller.completeEnrolment);

// Learner specific endpoints (Requires only a valid JWT auth and matching enrolment, handled in service)
router.get('/course/:courseId/learner-view', controller.getLearnerCourse);
router.post('/course/:courseId/lesson-progress', controller.updateLessonProgress);

export const enrolmentsRoutes = router;
