import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { sendResponse } from '../../shared/utils/response';
import { complianceService } from './compliance.service';

// ─── Real-Time Compliance Intelligence ────────────────────────────────────────

export const getSummary = asyncHandler(async (req: Request, res: Response) => {
    const summary = await complianceService.getSummary(req.organizationId!);
    sendResponse(res, 200, summary);
});

export const getStaffMatrix = asyncHandler(async (req: Request, res: Response) => {
    const matrix = await complianceService.getStaffMatrix(req.organizationId!);
    sendResponse(res, 200, matrix);
});

export const getExpiringCerts = asyncHandler(async (req: Request, res: Response) => {
    const certs = await complianceService.getExpiringCerts(req.organizationId!);
    sendResponse(res, 200, certs);
});

export const getMandatoryTraining = asyncHandler(async (req: Request, res: Response) => {
    const training = await complianceService.getMandatoryTraining(req.organizationId!);
    sendResponse(res, 200, training);
});

export const getAlerts = asyncHandler(async (req: Request, res: Response) => {
    const alerts = await complianceService.getAlerts(req.organizationId!);
    sendResponse(res, 200, alerts);
});

export const sendReminder = asyncHandler(async (req: Request, res: Response) => {
    const result = await complianceService.sendReminder(req.organizationId!, req.body);
    sendResponse(res, 200, result);
});

export const renewCertificate = asyncHandler(async (req: Request, res: Response) => {
    const result = await complianceService.renewCertificate(req.organizationId!, req.body);
    sendResponse(res, 200, result);
});

export const assignTraining = asyncHandler(async (req: Request, res: Response) => {
    const result = await complianceService.assignTraining(req.organizationId!, req.body);
    sendResponse(res, 201, result);
});

// ─── Standard Compliance Records ──────────────────────────────────────────────

export const listRecords = asyncHandler(async (req: Request, res: Response) => {
    const records = await complianceService.getRecords(req.organizationId!, req.query);
    sendResponse(res, 200, records);
});

export const getRecord = asyncHandler(async (req: Request, res: Response) => {
    const record = await complianceService.getRecordById(req.organizationId!, req.params.id as string);
    sendResponse(res, 200, record);
});

export const createRecord = asyncHandler(async (req: Request, res: Response) => {
    const record = await complianceService.createRecord(req.organizationId!, req.body);
    sendResponse(res, 201, record);
});

export const updateRecord = asyncHandler(async (req: Request, res: Response) => {
    const record = await complianceService.updateRecord(req.organizationId!, req.params.id as string, req.body);
    sendResponse(res, 200, record);
});

export const deleteRecord = asyncHandler(async (req: Request, res: Response) => {
    await complianceService.deleteRecord(req.organizationId!, req.params.id as string);
    sendResponse(res, 204, null);
});

export const getStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await complianceService.getStats(req.organizationId!);
    sendResponse(res, 200, stats);
});
