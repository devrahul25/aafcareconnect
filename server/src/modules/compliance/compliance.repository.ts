import { prisma } from '../../config/database';
import { Prisma } from '@prisma/client';

export class ComplianceRepository {
    async findAll(organizationId: string, filter?: { type?: string; status?: string; priority?: string; carerId?: string }) {
        const where: Prisma.ComplianceRecordWhereInput = { organization_id: organizationId };

        if (filter?.type) where.type = filter.type as any;
        if (filter?.status) where.status = filter.status as any;
        if (filter?.priority) where.priority = filter.priority as any;
        if (filter?.carerId) where.carer_id = filter.carerId;

        return prisma.complianceRecord.findMany({
            where,
            include: {
                assigned_to: {
                    select: { id: true, full_name: true, email: true },
                },
                carer: {
                    select: { id: true, full_name: true, email: true },
                },
            },
            orderBy: [{ priority: 'desc' }, { created_at: 'desc' }],
        });
    }

    async findById(organizationId: string, id: string) {
        return prisma.complianceRecord.findFirst({
            where: { id, organization_id: organizationId },
            include: {
                assigned_to: {
                    select: { id: true, full_name: true, email: true, avatar_url: true },
                },
                carer: {
                    select: { id: true, full_name: true, email: true, avatar_url: true },
                },
            },
        });
    }

    async create(organizationId: string, data: any) {
        return prisma.complianceRecord.create({
            data: {
                ...data,
                organization_id: organizationId,
            },
            include: {
                assigned_to: {
                    select: { id: true, full_name: true, email: true },
                },
                carer: {
                    select: { id: true, full_name: true, email: true },
                },
            },
        });
    }

    async update(organizationId: string, id: string, data: any) {
        return prisma.complianceRecord.update({
            where: { id, organization_id: organizationId },
            data,
            include: {
                assigned_to: {
                    select: { id: true, full_name: true, email: true },
                },
                carer: {
                    select: { id: true, full_name: true, email: true },
                },
            },
        });
    }

    async delete(organizationId: string, id: string) {
        return prisma.complianceRecord.delete({
            where: { id, organization_id: organizationId },
        });
    }

    async getStats(organizationId: string) {
        const [total, open, underReview, resolved, closed, critical, high] = await Promise.all([
            prisma.complianceRecord.count({ where: { organization_id: organizationId } }),
            prisma.complianceRecord.count({ where: { organization_id: organizationId, status: 'OPEN' } }),
            prisma.complianceRecord.count({ where: { organization_id: organizationId, status: 'UNDER_REVIEW' } }),
            prisma.complianceRecord.count({ where: { organization_id: organizationId, status: 'RESOLVED' } }),
            prisma.complianceRecord.count({ where: { organization_id: organizationId, status: 'CLOSED' } }),
            prisma.complianceRecord.count({ where: { organization_id: organizationId, priority: 'CRITICAL' } }),
            prisma.complianceRecord.count({ where: { organization_id: organizationId, priority: 'HIGH' } }),
        ]);

        return { total, open, under_review: underReview, resolved, closed, critical, high };
    }
}

export const complianceRepository = new ComplianceRepository();
