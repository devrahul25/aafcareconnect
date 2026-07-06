import { Router } from 'express';
import * as controller from './courses.controller';
import * as validator from './courses.validator';
import { validate } from '../../middleware/validate';
import { authenticate } from '../../middleware/authenticate';
import { tenantContext } from '../../middleware/tenantContext';
import { authorize } from '../../middleware/authorize';

const router = Router();

// Apply common middlewares to all course routes
router.use(authenticate, tenantContext);

// --- Course Routes ---
router.get('/', authorize('courses', 'read'), controller.listCourses);
router.get('/:id', authorize('courses', 'read'), controller.getCourse);
router.post('/', authorize('courses', 'create'), validate(validator.createCourseSchema), controller.createCourse);
router.patch('/:id', authorize('courses', 'update'), validate(validator.updateCourseSchema), controller.updateCourse);
router.delete('/:id', authorize('courses', 'delete'), controller.deleteCourse);

// --- Section Routes ---
router.post('/:courseId/sections', authorize('courses', 'create'), validate(validator.createSectionSchema), controller.addSection);

// --- Content Routes ---
router.post('/:courseId/sections/:sectionId/videos', authorize('courses', 'create'), validate(validator.createVideoSchema), controller.addVideo);
router.post('/:courseId/sections/:sectionId/documents', authorize('courses', 'create'), validate(validator.createDocumentSchema), controller.addDocument);
router.post('/:courseId/sections/:sectionId/rich-text', authorize('courses', 'create'), validate(validator.createRichTextSchema), controller.addRichText);
router.post('/:courseId/sections/:sectionId/quizzes', authorize('courses', 'create'), validate(validator.createQuizSchema), controller.addQuiz);

export const coursesRoutes = router;
