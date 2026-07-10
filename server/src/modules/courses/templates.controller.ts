import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { sendResponse } from '../../shared/utils/response';
import { coursesService } from './courses.service';
import { AppError } from '../../shared/errors/AppError';
import { prisma } from '../../config/database';

// For templates, we pass `null` as the organizationId to the existing coursesService, 
// which has been typed to accept `string | null`.

export const listTemplates = asyncHandler(async (req: Request, res: Response) => {
  const courses = await coursesService.getCourses(null, req.query);
  sendResponse(res, 200, courses);
});

export const getTemplate = asyncHandler(async (req: Request, res: Response) => {
  const course = await coursesService.getCourseById(null, req.params.id as string);
  if (!course) {
    throw new AppError('Template not found', 404, 'NOT_FOUND');
  }
  sendResponse(res, 200, course);
});

export const createTemplate = asyncHandler(async (req: Request, res: Response) => {
  const data = { ...req.body, is_template: true };
  const course = await coursesService.createCourse(null, data, req.user?.id);
  sendResponse(res, 201, course);
});

export const updateTemplate = asyncHandler(async (req: Request, res: Response) => {
  const course = await coursesService.updateCourse(null, req.params.id as string, req.body, req.user?.id);
  sendResponse(res, 200, course);
});

export const deleteTemplate = asyncHandler(async (req: Request, res: Response) => {
  await coursesService.deleteCourse(null, req.params.id as string);
  sendResponse(res, 204, null);
});

export const duplicateTemplate = asyncHandler(async (req: Request, res: Response) => {
  const course = await coursesService.duplicateCourse(null, req.params.id as string, req.user?.id);
  sendResponse(res, 201, course);
});

export const publishTemplate = asyncHandler(async (req: Request, res: Response) => {
  const course = await coursesService.getCourseById(null, req.params.id as string);
  
  if (!course) {
    throw new AppError('Template not found', 404, 'NOT_FOUND');
  }

  // Basic Validation Rule for publishing
  if (!course.title || !course.category || !course.sections || course.sections.length === 0) {
    throw new AppError('Template must have a title, category, and at least one module before publishing', 400, 'VALIDATION_ERROR');
  }

  const updated = await coursesService.updateCourse(null, req.params.id as string, { status: 'PUBLISHED' }, req.user?.id);
  sendResponse(res, 200, updated);
});

// Section and Content Controllers
export const addSection = asyncHandler(async (req: Request, res: Response) => {
  const section = await coursesService.addSection(null, req.params.courseId as string, req.body);
  sendResponse(res, 201, section);
});

export const updateSection = asyncHandler(async (req: Request, res: Response) => {
  const section = await coursesService.updateSection(null, req.params.courseId as string, req.params.sectionId as string, req.body);
  sendResponse(res, 200, section);
});

export const deleteSection = asyncHandler(async (req: Request, res: Response) => {
  await coursesService.deleteSection(null, req.params.courseId as string, req.params.sectionId as string);
  sendResponse(res, 204, null);
});

export const reorderSections = asyncHandler(async (req: Request, res: Response) => {
  await coursesService.reorderSections(null, req.params.courseId as string, req.body.sections);
  sendResponse(res, 200, { message: 'Sections reordered successfully' });
});

// Video Controllers
export const addVideo = asyncHandler(async (req: Request, res: Response) => {
  const video = await coursesService.addVideoToSection(null, req.params.courseId as string, req.params.sectionId as string, req.body);
  sendResponse(res, 201, video);
});

export const updateVideo = asyncHandler(async (req: Request, res: Response) => {
  const video = await coursesService.updateVideo(null, req.params.courseId as string, req.params.sectionId as string, req.params.videoId as string, req.body);
  sendResponse(res, 200, video);
});

export const deleteVideo = asyncHandler(async (req: Request, res: Response) => {
  await coursesService.deleteVideo(null, req.params.courseId as string, req.params.sectionId as string, req.params.videoId as string);
  sendResponse(res, 204, null);
});

// Document Controllers
export const addDocument = asyncHandler(async (req: Request, res: Response) => {
  const document = await coursesService.addDocumentToSection(null, req.params.courseId as string, req.params.sectionId as string, req.body);
  sendResponse(res, 201, document);
});

export const updateDocument = asyncHandler(async (req: Request, res: Response) => {
  const document = await coursesService.updateDocument(null, req.params.courseId as string, req.params.sectionId as string, req.params.documentId as string, req.body);
  sendResponse(res, 200, document);
});

export const deleteDocument = asyncHandler(async (req: Request, res: Response) => {
  await coursesService.deleteDocument(null, req.params.courseId as string, req.params.sectionId as string, req.params.documentId as string);
  sendResponse(res, 204, null);
});

// Category Controllers
export const getCourseCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await prisma.courseCategoryOption.findMany({
    orderBy: { name: 'asc' }
  });
  sendResponse(res, 200, categories);
});

export const addCourseCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) {
    throw new AppError('Category name is required', 400, 'VALIDATION_ERROR');
  }

  const existing = await prisma.courseCategoryOption.findUnique({ where: { name } });
  if (existing) {
    throw new AppError('Category already exists', 400, 'VALIDATION_ERROR');
  }

  const category = await prisma.courseCategoryOption.create({
    data: { name }
  });
  sendResponse(res, 201, category);
});

export const deleteCourseCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.courseCategoryOption.delete({ where: { id: id as string } });
  sendResponse(res, 204, null);
});

// Rich Text Controllers
export const addRichText = asyncHandler(async (req: Request, res: Response) => {
  const richText = await coursesService.addRichTextToSection(null, req.params.courseId as string, req.params.sectionId as string, req.body);
  sendResponse(res, 201, richText);
});

export const updateRichText = asyncHandler(async (req: Request, res: Response) => {
  const richText = await coursesService.updateRichText(null, req.params.courseId as string, req.params.sectionId as string, req.params.richTextId as string, req.body);
  sendResponse(res, 200, richText);
});

export const deleteRichText = asyncHandler(async (req: Request, res: Response) => {
  await coursesService.deleteRichText(null, req.params.courseId as string, req.params.sectionId as string, req.params.richTextId as string);
  sendResponse(res, 204, null);
});

// Quiz Controllers
export const addQuiz = asyncHandler(async (req: Request, res: Response) => {
  const quiz = await coursesService.addQuizToSection(null, req.params.courseId as string, req.params.sectionId as string, req.body);
  sendResponse(res, 201, quiz);
});

export const updateQuiz = asyncHandler(async (req: Request, res: Response) => {
  const quiz = await coursesService.updateQuiz(null, req.params.courseId as string, req.params.sectionId as string, req.params.quizId as string, req.body);
  sendResponse(res, 200, quiz);
});

export const deleteQuiz = asyncHandler(async (req: Request, res: Response) => {
  await coursesService.deleteQuiz(null, req.params.courseId as string, req.params.sectionId as string, req.params.quizId as string);
  sendResponse(res, 204, null);
});

export const getQuiz = asyncHandler(async (req: Request, res: Response) => {
  const quiz = await coursesService.getQuizById(null, req.params.quizId as string);
  sendResponse(res, 200, quiz);
});

// Quiz Questions
export const addQuizQuestion = asyncHandler(async (req: Request, res: Response) => {
  const question = await coursesService.addQuizQuestion(null, req.params.quizId as string, req.body);
  sendResponse(res, 201, question);
});

export const updateQuizQuestion = asyncHandler(async (req: Request, res: Response) => {
  const question = await coursesService.updateQuizQuestion(null, req.params.quizId as string, req.params.questionId as string, req.body);
  sendResponse(res, 200, question);
});

export const deleteQuizQuestion = asyncHandler(async (req: Request, res: Response) => {
  await coursesService.deleteQuizQuestion(null, req.params.quizId as string, req.params.questionId as string);
  sendResponse(res, 204, null);
});

// Quiz Answers
export const addQuizAnswer = asyncHandler(async (req: Request, res: Response) => {
  const answer = await coursesService.addQuizAnswer(null, req.params.quizId as string, req.params.questionId as string, req.body);
  sendResponse(res, 201, answer);
});

export const updateQuizAnswer = asyncHandler(async (req: Request, res: Response) => {
  const answer = await coursesService.updateQuizAnswer(null, req.params.quizId as string, req.params.questionId as string, req.params.answerId as string, req.body);
  sendResponse(res, 200, answer);
});

export const deleteQuizAnswer = asyncHandler(async (req: Request, res: Response) => {
  await coursesService.deleteQuizAnswer(null, req.params.quizId as string, req.params.questionId as string, req.params.answerId as string);
  sendResponse(res, 204, null);
});
