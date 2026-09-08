import { Router } from 'express';
import * as controller from './courses.controller';
import * as validator from './courses.validator';
import { validate } from '../../middleware/validate';
import { requireAuth } from '../auth/auth.middleware';
import { requirePermission } from '../auth/authorization.middleware';
import { tenantContext } from '../../middleware/tenantContext';

const router = Router();

// Apply common middlewares to all course routes
router.use(requireAuth, tenantContext);

// --- Category Routes (MUST be before /:id to avoid collision) ---
router.get('/categories', requirePermission('courses', 'read'), controller.listCategories);
router.patch('/categories/rename', requirePermission('courses', 'update'), validate(validator.renameCategorySchema), controller.renameCategoryHandler);
router.delete('/categories/:name', requirePermission('courses', 'delete'), controller.deleteCategoryHandler);

// --- Course Routes ---
router.get('/', requirePermission('courses', 'read'), controller.listCourses);
router.get('/:id', requirePermission('courses', 'read'), controller.getCourse);
router.post('/', requirePermission('courses', 'create'), validate(validator.createCourseSchema), controller.createCourse);
router.patch('/:id', requirePermission('courses', 'update'), validate(validator.updateCourseSchema), controller.updateCourse);
router.put('/:id', requirePermission('courses', 'update'), validate(validator.updateCourseSchema), controller.updateCourse);
router.delete('/:id', requirePermission('courses', 'delete'), controller.deleteCourse);

// --- Section Routes ---
router.post('/:courseId/sections', requirePermission('courses', 'create'), validate(validator.createSectionSchema), controller.addSection);
router.patch('/:courseId/sections/:sectionId', requirePermission('courses', 'update'), validate(validator.updateSectionSchema), controller.updateSection);
router.put('/:courseId/sections/:sectionId', requirePermission('courses', 'update'), validate(validator.updateSectionSchema), controller.updateSection);
router.delete('/:courseId/sections/:sectionId', requirePermission('courses', 'delete'), controller.deleteSection);
router.post('/:courseId/sections/reorder', requirePermission('courses', 'update'), validate(validator.reorderSectionsSchema), controller.reorderSections);

// --- Video Routes ---
router.post('/:courseId/sections/:sectionId/videos', requirePermission('courses', 'create'), validate(validator.createVideoSchema), controller.addVideo);
router.patch('/:courseId/sections/:sectionId/videos/:videoId', requirePermission('courses', 'update'), validate(validator.updateVideoSchema), controller.updateVideo);
router.put('/:courseId/sections/:sectionId/videos/:videoId', requirePermission('courses', 'update'), validate(validator.updateVideoSchema), controller.updateVideo);
router.delete('/:courseId/sections/:sectionId/videos/:videoId', requirePermission('courses', 'delete'), controller.deleteVideo);

// --- Document Routes ---
router.post('/:courseId/sections/:sectionId/documents', requirePermission('courses', 'create'), validate(validator.createDocumentSchema), controller.addDocument);
router.patch('/:courseId/sections/:sectionId/documents/:documentId', requirePermission('courses', 'update'), validate(validator.updateDocumentSchema), controller.updateDocument);
router.put('/:courseId/sections/:sectionId/documents/:documentId', requirePermission('courses', 'update'), validate(validator.updateDocumentSchema), controller.updateDocument);
router.delete('/:courseId/sections/:sectionId/documents/:documentId', requirePermission('courses', 'delete'), controller.deleteDocument);

// --- Rich Text Routes ---
router.post('/:courseId/sections/:sectionId/rich-text', requirePermission('courses', 'create'), validate(validator.createRichTextSchema), controller.addRichText);
router.patch('/:courseId/sections/:sectionId/rich-text/:richTextId', requirePermission('courses', 'update'), validate(validator.updateRichTextSchema), controller.updateRichText);
router.put('/:courseId/sections/:sectionId/rich-text/:richTextId', requirePermission('courses', 'update'), validate(validator.updateRichTextSchema), controller.updateRichText);
router.delete('/:courseId/sections/:sectionId/rich-text/:richTextId', requirePermission('courses', 'delete'), controller.deleteRichText);

// --- Quiz Routes ---
router.post('/:courseId/sections/:sectionId/quizzes', requirePermission('courses', 'create'), validate(validator.createQuizSchema), controller.addQuiz);
router.get('/quizzes/:quizId', requirePermission('courses', 'read'), controller.getQuiz);
router.patch('/:courseId/sections/:sectionId/quizzes/:quizId', requirePermission('courses', 'update'), validate(validator.updateQuizSchema), controller.updateQuiz);
router.put('/:courseId/sections/:sectionId/quizzes/:quizId', requirePermission('courses', 'update'), validate(validator.updateQuizSchema), controller.updateQuiz);
router.delete('/:courseId/sections/:sectionId/quizzes/:quizId', requirePermission('courses', 'delete'), controller.deleteQuiz);

// --- Quiz Question Routes ---
router.post('/quizzes/:quizId/questions', requirePermission('courses', 'create'), validate(validator.createQuizQuestionSchema), controller.addQuizQuestion);
router.patch('/quizzes/:quizId/questions/:questionId', requirePermission('courses', 'update'), validate(validator.updateQuizQuestionSchema), controller.updateQuizQuestion);
router.put('/quizzes/:quizId/questions/:questionId', requirePermission('courses', 'update'), validate(validator.updateQuizQuestionSchema), controller.updateQuizQuestion);
router.delete('/quizzes/:quizId/questions/:questionId', requirePermission('courses', 'delete'), controller.deleteQuizQuestion);

// --- Quiz Answer Routes ---
router.post('/quizzes/:quizId/questions/:questionId/answers', requirePermission('courses', 'create'), validate(validator.createQuizAnswerSchema), controller.addQuizAnswer);
router.patch('/quizzes/:quizId/questions/:questionId/answers/:answerId', requirePermission('courses', 'update'), validate(validator.updateQuizAnswerSchema), controller.updateQuizAnswer);
router.put('/quizzes/:quizId/questions/:questionId/answers/:answerId', requirePermission('courses', 'update'), validate(validator.updateQuizAnswerSchema), controller.updateQuizAnswer);
router.delete('/quizzes/:quizId/questions/:questionId/answers/:answerId', requirePermission('courses', 'delete'), controller.deleteQuizAnswer);

export const coursesRoutes = router;
