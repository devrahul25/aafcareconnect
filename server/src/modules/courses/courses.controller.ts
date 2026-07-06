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

export const addVideo = asyncHandler(async (req: Request, res: Response) => {
  const video = await coursesService.addVideoToSection(req.organizationId!, req.params.courseId as string, req.params.sectionId as string, req.body);
  sendResponse(res, 201, video);
});

export const addDocument = asyncHandler(async (req: Request, res: Response) => {
  const document = await coursesService.addDocumentToSection(req.organizationId!, req.params.courseId as string, req.params.sectionId as string, req.body);
  sendResponse(res, 201, document);
});

export const addRichText = asyncHandler(async (req: Request, res: Response) => {
  const richText = await coursesService.addRichTextToSection(req.organizationId!, req.params.courseId as string, req.params.sectionId as string, req.body);
  sendResponse(res, 201, richText);
});

export const addQuiz = asyncHandler(async (req: Request, res: Response) => {
  const quiz = await coursesService.addQuizToSection(req.organizationId!, req.params.courseId as string, req.params.sectionId as string, req.body);
  sendResponse(res, 201, quiz);
});
