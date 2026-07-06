import { z } from 'zod';

export const getUploadUrlSchema = z.object({
  body: z.object({
    filename: z.string().min(1).max(255),
    contentType: z.string().min(1),
    folder: z.enum(['videos', 'documents', 'certificates', 'logos', 'compliance']),
  }),
});

export const getPostPolicySchema = z.object({
  body: z.object({
    filename: z.string().min(1).max(255),
    contentType: z.string().min(1),
    folder: z.enum(['documents', 'certificates', 'logos', 'compliance']),
    maxSize: z.number().int().positive().optional(),
  }),
});

export const initMultipartSchema = z.object({
  body: z.object({
    filename: z.string().min(1).max(255),
    contentType: z.string().min(1),
  }),
});

export const signPartSchema = z.object({
  body: z.object({
    key: z.string().min(1),
    uploadId: z.string().min(1),
    partNumber: z.number().int().positive(),
  }),
});

export const completeMultipartSchema = z.object({
  body: z.object({
    key: z.string().min(1),
    uploadId: z.string().min(1),
    parts: z.array(z.object({
      ETag: z.string().min(1),
      PartNumber: z.number().int().positive(),
    })).min(1),
  }),
});
