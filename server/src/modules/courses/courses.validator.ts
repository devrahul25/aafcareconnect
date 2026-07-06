import { z } from 'zod';

// Courses
export const createCourseSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(200),
    description: z.string().optional(),
    category: z.string().min(2),
    level: z.enum(['FOUNDATION', 'INTERMEDIATE', 'ADVANCED']).default('FOUNDATION'),
    duration_minutes: z.number().int().positive().optional(),
    pass_mark: z.number().int().min(0).max(100).optional(),
    certificate_enabled: z.boolean().default(true),
    mandatory: z.boolean().default(false),
    target_roles: z.array(z.string()).default([]),
    sort_order: z.number().int().default(0),
  }),
});

export const updateCourseSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(200).optional(),
    description: z.string().optional(),
    category: z.string().min(2).optional(),
    level: z.enum(['FOUNDATION', 'INTERMEDIATE', 'ADVANCED']).optional(),
    duration_minutes: z.number().int().positive().optional(),
    thumbnail_url: z.string().url().optional(),
    pass_mark: z.number().int().min(0).max(100).optional(),
    certificate_enabled: z.boolean().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    mandatory: z.boolean().optional(),
    target_roles: z.array(z.string()).optional(),
    sort_order: z.number().int().optional(),
  }),
});

// Sections
export const createSectionSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(200),
    type: z.enum(['VIDEO', 'DOCUMENT', 'RICH_TEXT', 'QUIZ']),
    sort_order: z.number().int().default(0),
  }),
});

// Videos
export const createVideoSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(200),
    s3_key: z.string(),
    cloudfront_url: z.string().url().optional(),
    duration_secs: z.number().int().positive().optional(),
    thumbnail_url: z.string().url().optional(),
    transcript: z.string().optional(),
    sort_order: z.number().int().default(0),
  }),
});

// Documents
export const createDocumentSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(200),
    s3_key: z.string(),
    file_type: z.string(),
    file_size: z.number().int().positive().optional(),
    sort_order: z.number().int().default(0),
  }),
});

// Rich Text
export const createRichTextSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(200),
    content: z.any(), // JSON content
    sort_order: z.number().int().default(0),
  }),
});

// Quizzes
export const createQuizSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(200),
    pass_mark: z.number().int().min(0).max(100).default(80),
    time_limit: z.number().int().positive().optional(),
    sort_order: z.number().int().default(0),
  }),
});
