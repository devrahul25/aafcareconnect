import { Router } from 'express';
import * as controller from './templates.controller';
import * as validator from './courses.validator';
import { validate } from '../../middleware/validate';
import { requireAuth } from '../auth/auth.middleware';
import { requirePermission } from '../auth/authorization.middleware';

const router = Router();

// All template routes require authentication and SUPER_ADMIN global access to manage templates
router.use(requireAuth, requirePermission('courses', 'manage'));

// --- Category Routes ---
router.get('/categories', controller.getCourseCategories);
router.post('/categories', controller.addCourseCategory);
router.delete('/categories/:id', controller.deleteCourseCategory);

// --- Template Routes ---
router.get('/', controller.listTemplates);
router.get('/:id', controller.getTemplate);
router.post('/', validate(validator.createCourseSchema), controller.createTemplate);
router.patch('/:id', validate(validator.updateCourseSchema), controller.updateTemplate);
router.delete('/:id', controller.deleteTemplate);
router.post('/:id/duplicate', controller.duplicateTemplate);
router.post('/:id/publish', controller.publishTemplate);

// --- Section Routes ---
router.post('/:courseId/sections', validate(validator.createSectionSchema), controller.addSection);
router.patch('/:courseId/sections/:sectionId', validate(validator.updateSectionSchema), controller.updateSection);
router.delete('/:courseId/sections/:sectionId', controller.deleteSection);
router.post('/:courseId/sections/reorder', validate(validator.reorderSectionsSchema), controller.reorderSections);

// --- Content Routes ---
router.post('/:courseId/sections/:sectionId/videos', validate(validator.createVideoSchema), controller.addVideo);
router.patch('/:courseId/sections/:sectionId/videos/:videoId', validate(validator.updateVideoSchema), controller.updateVideo);
router.delete('/:courseId/sections/:sectionId/videos/:videoId', controller.deleteVideo);

router.post('/:courseId/sections/:sectionId/documents', validate(validator.createDocumentSchema), controller.addDocument);
router.patch('/:courseId/sections/:sectionId/documents/:documentId', validate(validator.updateDocumentSchema), controller.updateDocument);
router.delete('/:courseId/sections/:sectionId/documents/:documentId', controller.deleteDocument);

router.post('/:courseId/sections/:sectionId/rich-text', validate(validator.createRichTextSchema), controller.addRichText);
router.patch('/:courseId/sections/:sectionId/rich-text/:richTextId', validate(validator.updateRichTextSchema), controller.updateRichText);
router.delete('/:courseId/sections/:sectionId/rich-text/:richTextId', controller.deleteRichText);

// --- Quiz Routes ---
router.post('/:courseId/sections/:sectionId/quizzes', validate(validator.createQuizSchema), controller.addQuiz);
router.get('/quizzes/:quizId', controller.getQuiz);
router.patch('/:courseId/sections/:sectionId/quizzes/:quizId', validate(validator.updateQuizSchema), controller.updateQuiz);
router.delete('/:courseId/sections/:sectionId/quizzes/:quizId', controller.deleteQuiz);

router.post('/quizzes/:quizId/questions', validate(validator.createQuizQuestionSchema), controller.addQuizQuestion);
router.patch('/quizzes/:quizId/questions/:questionId', validate(validator.updateQuizQuestionSchema), controller.updateQuizQuestion);
router.delete('/quizzes/:quizId/questions/:questionId', controller.deleteQuizQuestion);

router.post('/quizzes/:quizId/questions/:questionId/answers', validate(validator.createQuizAnswerSchema), controller.addQuizAnswer);
router.patch('/quizzes/:quizId/questions/:questionId/answers/:answerId', validate(validator.updateQuizAnswerSchema), controller.updateQuizAnswer);
router.delete('/quizzes/:quizId/questions/:questionId/answers/:answerId', controller.deleteQuizAnswer);

export const templatesRoutes = router;
