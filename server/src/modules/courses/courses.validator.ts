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
    allow_retake: z.boolean().default(true),
    mandatory: z.boolean().default(false),
    target_roles: z.array(z.string()).default([]),
    sort_order: z.number().int().default(0),
  }),
});

export const updateCourseSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(200).optional().or(z.literal('')),
    description: z.string().optional().or(z.literal('')),
    category: z.string().min(2).optional().or(z.literal('')),
    level: z.enum(['FOUNDATION', 'INTERMEDIATE', 'ADVANCED']).optional(),
    duration_minutes: z.number().int().positive().optional(),
    thumbnail_url: z.string().url().optional().or(z.literal('')),
    pass_mark: z.number().int().min(0).max(100).optional(),
    certificate_enabled: z.boolean().optional(),
    certificate_title: z.string().max(200).optional().or(z.literal('')),
    cpd_hours: z.number().min(0).optional(),
    expiry_months: z.number().int().min(0).optional(),
    auto_issue: z.boolean().optional(),
    allow_retake: z.boolean().optional(),
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

export const updateSectionSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(200).optional(),
    type: z.enum(['VIDEO', 'DOCUMENT', 'RICH_TEXT', 'QUIZ']).optional(),
    sort_order: z.number().int().optional(),
  }),
});

export const reorderSectionsSchema = z.object({
  body: z.object({
    sections: z.array(z.object({
      id: z.string().uuid(),
      sort_order: z.number().int(),
    })),
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

export const updateVideoSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(200).optional(),
    s3_key: z.string().optional(),
    cloudfront_url: z.string().url().optional(),
    duration_secs: z.number().int().positive().optional(),
    thumbnail_url: z.string().url().optional(),
    transcript: z.string().optional(),
    sort_order: z.number().int().optional(),
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

export const updateDocumentSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(200).optional(),
    s3_key: z.string().optional(),
    file_type: z.string().optional(),
    file_size: z.number().int().positive().optional(),
    sort_order: z.number().int().optional(),
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

export const updateRichTextSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(200).optional(),
    content: z.any().optional(),
    sort_order: z.number().int().optional(),
  }),
});

// Quizzes
export const createQuizSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200),
    pass_mark: z.number().int().min(0).max(100).default(80),
    time_limit: z.number().int().positive().optional(),
    sort_order: z.number().int().default(0),
  }),
});

export const updateQuizSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    pass_mark: z.number().int().min(0).max(100).optional(),
    time_limit: z.number().int().positive().optional(),
    sort_order: z.number().int().optional(),
  }),
});

// Quiz Questions
export const createQuizQuestionSchema = z.object({
  body: z.object({
    question: z.string().min(1).max(1000),
    explanation: z.string().optional(),
    sort_order: z.number().int().default(0),
  }),
});

export const updateQuizQuestionSchema = z.object({
  body: z.object({
    question: z.string().min(1).max(1000).optional(),
    explanation: z.string().optional(),
    sort_order: z.number().int().optional(),
  }),
});

// Quiz Answers
export const createQuizAnswerSchema = z.object({
  body: z.object({
    text: z.string().min(1).max(500),
    is_correct: z.boolean().default(false),
    sort_order: z.number().int().default(0),
  }),
});

export const updateQuizAnswerSchema = z.object({
  body: z.object({
    text: z.string().min(1).max(500).optional(),
    is_correct: z.boolean().optional(),
    sort_order: z.number().int().optional(),
  }),
});

// ─── Categories ────────────────────────────────────────────────────────────────

export const renameCategorySchema = z.object({
  body: z.object({
    old_name: z.string().min(1).max(100),
    new_name: z.string().min(1).max(100),
  }),
});
