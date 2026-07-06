import { z } from 'zod';

export const createComplianceSchema = z.object({
    body: z.object({
        type: z.enum(['ALLEGATION', 'COMPLAINT', 'SAFER_CARING', 'MISSING_FROM_CARE', 'REG_44', 'AUDIT', 'POLICY']),
        title: z.string().min(5).max(200),
        description: z.string().optional(),
        assigned_to_id: z.string().uuid().optional(),
        carer_id: z.string().uuid().optional(),
        child_name: z.string().optional(),
        incident_date: z.string().datetime().optional(),
        due_date: z.string().datetime().optional(),
        status: z.enum(['OPEN', 'UNDER_REVIEW', 'RESOLVED', 'CLOSED']).default('OPEN'),
        priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
        outcome: z.string().optional(),
        documents: z.array(z.string()).default([]),
    }),
});

export const updateComplianceSchema = z.object({
    body: z.object({
        type: z.enum(['ALLEGATION', 'COMPLAINT', 'SAFER_CARING', 'MISSING_FROM_CARE', 'REG_44', 'AUDIT', 'POLICY']).optional(),
        title: z.string().min(5).max(200).optional(),
        description: z.string().optional(),
        assigned_to_id: z.string().uuid().optional().nullable(),
        carer_id: z.string().uuid().optional().nullable(),
        child_name: z.string().optional(),
        incident_date: z.string().datetime().optional(),
        due_date: z.string().datetime().optional(),
        status: z.enum(['OPEN', 'UNDER_REVIEW', 'RESOLVED', 'CLOSED']).optional(),
        priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
        outcome: z.string().optional(),
        documents: z.array(z.string()).optional(),
    }),
});
