import { prisma } from '../../config/database';
import { Prisma } from '@prisma/client';

export class EnrolmentsRepository {
    async findAll(organizationId: string, filter?: { userId?: string; courseId?: string; status?: string }) {
        const where: Prisma.CourseEnrolmentWhereInput = { organization_id: organizationId };

        if (filter?.userId) where.user_id = filter.userId;
        if (filter?.courseId) where.course_id = filter.courseId;
        if (filter?.status) where.status = filter.status as any;

        return prisma.courseEnrolment.findMany({
            where,
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                        category: true,
                        level: true,
                        duration_minutes: true,
                        thumbnail_url: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        full_name: true,
                        email: true,
                        avatar_url: true,
                    },
                },
            },
            orderBy: { created_at: 'desc' },
        });
    }

    async findById(organizationId: string, id: string) {
        return prisma.courseEnrolment.findFirst({
            where: { id, organization_id: organizationId },
            include: {
                course: true,
                user: {
                    select: {
                        id: true,
                        full_name: true,
                        email: true,
                        avatar_url: true,
                    },
                },
            },
        });
    }

    async findByUserAndCourse(organizationId: string, userId: string, courseId: string) {
        return prisma.courseEnrolment.findFirst({
            where: {
                organization_id: organizationId,
                user_id: userId,
                course_id: courseId,
            },
        });
    }

    async create(organizationId: string, data: any) {
        return prisma.courseEnrolment.create({
            data: {
                ...data,
                organization_id: organizationId,
            },
            include: {
                course: true,
                user: {
                    select: {
                        id: true,
                        full_name: true,
                        email: true,
                    },
                },
            },
        });
    }

    async update(organizationId: string, id: string, data: any) {
        return prisma.courseEnrolment.update({
            where: { id, organization_id: organizationId },
            data,
            include: {
                course: true,
                user: {
                    select: {
                        id: true,
                        full_name: true,
                        email: true,
                    },
                },
            },
        });
    }

    async delete(organizationId: string, id: string) {
        return prisma.courseEnrolment.delete({
            where: { id, organization_id: organizationId },
        });
    }

    async getEnrolmentStats(organizationId: string, userId?: string) {
        const where: Prisma.CourseEnrolmentWhereInput = { organization_id: organizationId };
        if (userId) where.user_id = userId;

        const [total, enrolled, inProgress, completed, failed] = await Promise.all([
            prisma.courseEnrolment.count({ where }),
            prisma.courseEnrolment.count({ where: { ...where, status: 'ENROLLED' } }),
            prisma.courseEnrolment.count({ where: { ...where, status: 'IN_PROGRESS' } }),
            prisma.courseEnrolment.count({ where: { ...where, status: 'COMPLETED' } }),
            prisma.courseEnrolment.count({ where: { ...where, status: 'FAILED' } }),
        ]);

        return { total, enrolled, in_progress: inProgress, completed, failed };
    }
}

export const enrolmentsRepository = new EnrolmentsRepository();
