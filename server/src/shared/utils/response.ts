import { Response } from 'express';

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  data: T,
  meta?: Record<string, any>,
) => {
  res.status(statusCode).json({
    success: true,
    data,
    meta,
  });
};
