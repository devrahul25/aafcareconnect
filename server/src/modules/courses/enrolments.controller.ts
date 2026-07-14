import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { sendResponse } from '../../shared/utils/response';
import { enrolmentsService } from './enrolments.service';

export const listEnrolments = asyncHandler(async (req: Request, res: Response) => {
    const enrolments = await enrolmentsService.getEnrolments(req.organizationId!, req.query);
    sendResponse(res, 200, enrolments);
});

export const getEnrolment = asyncHandler(async (req: Request, res: Response) => {
    const enrolment = await enrolmentsService.getEnrolmentById(req.organizationId!, req.params.id as string);
    sendResponse(res, 200, enrolment);
});

export const createEnrolment = asyncHandler(async (req: Request, res: Response) => {
    const enrolment = await enrolmentsService.createEnrolment(req.organizationId!, req.body);
    sendResponse(res, 201, enrolment);
});

export const updateEnrolment = asyncHandler(async (req: Request, res: Response) => {
    const enrolment = await enrolmentsService.updateEnrolment(req.organizationId!, req.params.id as string, req.body);
    sendResponse(res, 200, enrolment);
});

export const deleteEnrolment = asyncHandler(async (req: Request, res: Response) => {
    await enrolmentsService.deleteEnrolment(req.organizationId!, req.params.id as string);
    sendResponse(res, 204, null);
});

export const getStats = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.query.user_id as string | undefined;
    const stats = await enrolmentsService.getEnrolmentStats(req.organizationId!, userId);
    sendResponse(res, 200, stats);
});

export const updateProgress = asyncHandler(async (req: Request, res: Response) => {
    const enrolment = await enrolmentsService.updateProgress(
        req.organizationId!,
        req.params.id as string,
        req.body.progress_percent
    );
    sendResponse(res, 200, enrolment);
});

export const completeEnrolment = asyncHandler(async (req: Request, res: Response) => {
    const enrolment = await enrolmentsService.completeEnrolment(
        req.organizationId!,
        req.params.id as string,
        req.body.score
    );
    sendResponse(res, 200, enrolment);
});

export const getLearnerCourse = asyncHandler(async (req: Request, res: Response) => {
    const enrolment = await enrolmentsService.getLearnerCourse(
        req.organizationId!, 
        req.user!.id, 
        req.params.courseId as string
    );
    sendResponse(res, 200, enrolment);
});

export const updateLessonProgress = asyncHandler(async (req: Request, res: Response) => {
    const progress = await enrolmentsService.updateLessonProgress(
        req.organizationId!,
        req.user!.id,
        req.params.courseId as string,
        req.body
    );
    sendResponse(res, 200, progress);
});
