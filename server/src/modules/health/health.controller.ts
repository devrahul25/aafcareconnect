import { Request, Response } from 'express';
import { sendResponse } from '../../shared/utils/response';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { prisma } from '../../config/database';

export const checkHealth = asyncHandler(async (req: Request, res: Response) => {
  // Check DB connection
  await prisma.$queryRaw`SELECT 1`;

  sendResponse(res, 200, {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
