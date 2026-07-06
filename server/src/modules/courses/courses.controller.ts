import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { sendResponse } from '../../shared/utils/response';
import { coursesService } from './courses.service';

export const listCourses = asyncHandler(async (req: Request, res: Response) => {
  const courses = await coursesService.getCourses(req.organizationId!, req.query);
  sendResponse(res, 200, courses);
});

export const getCourse = asyncHandler(async (req: Request, res: Response) => {
  const course = await coursesService.getCourseById(req.organizationId!, req.params.id as string);
  sendResponse(res, 200, course);
});

export const createCourse = asyncHandler(async (req: Request, res: Response) => {
  const course = await coursesService.createCourse(req.organizationId!, req.body, req.user?.id);
  sendResponse(res, 201, course);
});

export const updateCourse = asyncHandler(async (req: Request, res: Response) => {
  const course = await coursesService.updateCourse(req.organizationId!, req.params.id as string, req.body, req.user?.id);
  sendResponse(res, 200, course);
});

export const deleteCourse = asyncHandler(async (req: Request, res: Response) => {
  await coursesService.deleteCourse(req.organizationId!, req.params.id as string);
  sendResponse(res, 204, null);
});

// Section and Content Controllers
export const addSection = asyncHandler(async (req: Request, res: Response) => {
  const section = await coursesService.addSection(req.organizationId!, req.params.courseId as string, req.body);
  sendResponse(res, 201, section);
});

export const updateSection = asyncHandler(async (req: Request, res: Response) => {
  const section = await coursesService.updateSection(req.organizationId!, req.params.courseId as string, req.params.sectionId as string, req.body);
  sendResponse(res, 200, section);
});

export const deleteSection = asyncHandler(async (req: Request, res: Response) => {
  await coursesService.deleteSection(req.organizationId!, req.params.courseId as string, req.params.sectionId as string);
  sendResponse(res, 204, null);
});

export const reorderSections = asyncHandler(async (req: Request, res: Response) => {
  await coursesService.reorderSections(req.organizationId!, req.params.courseId as string, req.body.sections);
  sendResponse(res, 200, { message: 'Sections reordered successfully' });
});

// Video Controllers
export const addVideo = asyncHandler(async (req: Request, res: Response) => {
  const video = await coursesService.addVideoToSection(req.organizationId!, req.params.courseId as string, req.params.sectionId as string, req.body);
  sendResponse(res, 201, video);
});

export const updateVideo = asyncHandler(async (req: Request, res: Response) => {
  const video = await coursesService.updateVideo(req.organizationId!, req.params.courseId as string, req.params.sectionId as string, req.params.videoId as string, req.body);
  sendResponse(res, 200, video);
});

export const deleteVideo = asyncHandler(async (req: Request, res: Response) => {
  await coursesService.deleteVideo(req.organizationId!, req.params.courseId as string, req.params.sectionId as string, req.params.videoId as string);
  sendResponse(res, 204, null);
});

// Document Controllers
export const addDocument = asyncHandler(async (req: Request, res: Response) => {
  const document = await coursesService.addDocumentToSection(req.organizationId!, req.params.courseId as string, req.params.sectionId as string, req.body);
  sendResponse(res, 201, document);
});

export const updateDocument = asyncHandler(async (req: Request, res: Response) => {
  const document = await coursesService.updateDocument(req.organizationId!, req.params.courseId as string, req.params.sectionId as string, req.params.documentId as string, req.body);
  sendResponse(res, 200, document);
});

export const deleteDocument = asyncHandler(async (req: Request, res: Response) => {
  await coursesService.deleteDocument(req.organizationId!, req.params.courseId as string, req.params.sectionId as string, req.params.documentId as string);
  sendResponse(res, 204, null);
});

// Rich Text Controllers
export const addRichText = asyncHandler(async (req: Request, res: Response) => {
  const richText = await coursesService.addRichTextToSection(req.organizationId!, req.params.courseId as string, req.params.sectionId as string, req.body);
  sendResponse(res, 201, richText);
});

export const updateRichText = asyncHandler(async (req: Request, res: Response) => {
  const richText = await coursesService.updateRichText(req.organizationId!, req.params.courseId as string, req.params.sectionId as string, req.params.richTextId as string, req.body);
  sendResponse(res, 200, richText);
});

export const deleteRichText = asyncHandler(async (req: Request, res: Response) => {
  await coursesService.deleteRichText(req.organizationId!, req.params.courseId as string, req.params.sectionId as string, req.params.richTextId as string);
  sendResponse(res, 204, null);
});

// Quiz Controllers
export const addQuiz = asyncHandler(async (req: Request, res: Response) => {
  const quiz = await coursesService.addQuizToSection(req.organizationId!, req.params.courseId as string, req.params.sectionId as string, req.body);
  sendResponse(res, 201, quiz);
});

export const updateQuiz = asyncHandler(async (req: Request, res: Response) => {
  const quiz = await coursesService.updateQuiz(req.organizationId!, req.params.courseId as string, req.params.sectionId as string, req.params.quizId as string, req.body);
  sendResponse(res, 200, quiz);
});

export const deleteQuiz = asyncHandler(async (req: Request, res: Response) => {
  await coursesService.deleteQuiz(req.organizationId!, req.params.courseId as string, req.params.sectionId as string, req.params.quizId as string);
  sendResponse(res, 204, null);
});

export const getQuiz = asyncHandler(async (req: Request, res: Response) => {
  const quiz = await coursesService.getQuizById(req.organizationId!, req.params.quizId as string);
  sendResponse(res, 200, quiz);
});

// Quiz Question Controllers
export const addQuizQuestion = asyncHandler(async (req: Request, res: Response) => {
  const question = await coursesService.addQuizQuestion(req.organizationId!, req.params.quizId as string, req.body);
  sendResponse(res, 201, question);
});

export const updateQuizQuestion = asyncHandler(async (req: Request, res: Response) => {
  const question = await coursesService.updateQuizQuestion(req.organizationId!, req.params.quizId as string, req.params.questionId as string, req.body);
  sendResponse(res, 200, question);
});

export const deleteQuizQuestion = asyncHandler(async (req: Request, res: Response) => {
  await coursesService.deleteQuizQuestion(req.organizationId!, req.params.quizId as string, req.params.questionId as string);
  sendResponse(res, 204, null);
});

// Quiz Answer Controllers
export const addQuizAnswer = asyncHandler(async (req: Request, res: Response) => {
  const answer = await coursesService.addQuizAnswer(req.organizationId!, req.params.quizId as string, req.params.questionId as string, req.body);
  sendResponse(res, 201, answer);
});

export const updateQuizAnswer = asyncHandler(async (req: Request, res: Response) => {
  const answer = await coursesService.updateQuizAnswer(req.organizationId!, req.params.quizId as string, req.params.questionId as string, req.params.answerId as string, req.body);
  sendResponse(res, 200, answer);
});

export const deleteQuizAnswer = asyncHandler(async (req: Request, res: Response) => {
  await coursesService.deleteQuizAnswer(req.organizationId!, req.params.quizId as string, req.params.questionId as string, req.params.answerId as string);
  sendResponse(res, 204, null);
});
