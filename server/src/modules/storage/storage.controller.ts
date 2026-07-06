import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { sendResponse } from '../../shared/utils/response';
import { storageService } from './storage.service';

export const getUploadUrl = asyncHandler(async (req: Request, res: Response) => {
  const { filename, contentType, folder } = req.body;

  const result = await storageService.generateUploadUrl(
    req.organizationId!,
    filename,
    contentType,
    folder,
  );

  sendResponse(res, 200, result);
});

export const getPostPolicy = asyncHandler(async (req: Request, res: Response) => {
  const { filename, contentType, folder, maxSize } = req.body;
  const result = await storageService.generatePostPolicy(req.organizationId!, filename, contentType, folder, maxSize);
  sendResponse(res, 200, result);
});

export const initMultipart = asyncHandler(async (req: Request, res: Response) => {
  const { filename, contentType } = req.body;
  const result = await storageService.createMultipartUpload(req.organizationId!, filename, contentType);
  sendResponse(res, 200, result);
});

export const signPart = asyncHandler(async (req: Request, res: Response) => {
  const { key, uploadId, partNumber } = req.body;
  const result = await storageService.signUploadPart(key, uploadId, partNumber);
  sendResponse(res, 200, result);
});

export const completeMultipart = asyncHandler(async (req: Request, res: Response) => {
  const { key, uploadId, parts } = req.body;
  const result = await storageService.completeMultipartUpload(key, uploadId, parts);
  sendResponse(res, 200, result);
});
