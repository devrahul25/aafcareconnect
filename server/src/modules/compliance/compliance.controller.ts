import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { sendResponse } from '../../shared/utils/response';
import { complianceService } from './compliance.service';

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
