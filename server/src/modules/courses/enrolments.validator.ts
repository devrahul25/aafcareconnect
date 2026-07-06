import { z } from 'zod';

export const createEnrolmentSchema = z.object({
    body: z.object({
        course_id: z.string().uuid(),
        user_id: z.string().uuid(),
        status: z.enum(['ENROLLED', 'IN_PROGRESS', 'COMPLETED', 'FAILED']).default('ENROLLED'),
    }),
});

export const updateEnrolmentSchema = z.object({
    body: z.object({
        status: z.enum(['ENROLLED', 'IN_PROGRESS', 'COMPLETED', 'FAILED']).optional(),
        progress_percent: z.number().int().min(0).max(100).optional(),
        score: z.number().int().min(0).max(100).optional(),
        certificate_url: z.string().url().optional(),
    }),
});

export const updateProgressSchema = z.object({
    body: z.object({
        progress_percent: z.number().int().min(0).max(100),
    }),
});

export const completeEnrolmentSchema = z.object({
    body: z.object({
        score: z.number().int().min(0).max(100),
    }),
});
