import { enrolmentsRepository } from './enrolments.repository';
import { AppError } from '../../shared/errors/AppError';

export class EnrolmentsService {
    async getEnrolments(organizationId: string, query?: any) {
        return enrolmentsRepository.findAll(organizationId, query);
    }

    async getEnrolmentById(organizationId: string, id: string) {
        const enrolment = await enrolmentsRepository.findById(organizationId, id);
        if (!enrolment) {
            throw new AppError('Enrolment not found', 404, 'NOT_FOUND');
        }
        return enrolment;
    }

    async createEnrolment(organizationId: string, data: any) {
        // Check if already enrolled
        const existing = await enrolmentsRepository.findByUserAndCourse(
            organizationId,
            data.user_id,
            data.course_id
        );

        if (existing) {
            throw new AppError('User is already enrolled in this course', 409, 'ALREADY_ENROLLED');
        }

        return enrolmentsRepository.create(organizationId, data);
    }

    async updateEnrolment(organizationId: string, id: string, data: any) {
        await this.getEnrolmentById(organizationId, id);
        return enrolmentsRepository.update(organizationId, id, data);
    }

    async deleteEnrolment(organizationId: string, id: string) {
        await this.getEnrolmentById(organizationId, id);
        return enrolmentsRepository.delete(organizationId, id);
    }

    async getEnrolmentStats(organizationId: string, userId?: string) {
        return enrolmentsRepository.getEnrolmentStats(organizationId, userId);
    }

    async updateProgress(organizationId: string, id: string, progressPercent: number) {
        const enrolment = await this.getEnrolmentById(organizationId, id);

        const updateData: any = { progress_percent: progressPercent };

        // Auto-update status based on progress
        if (progressPercent > 0 && enrolment.status === 'ENROLLED') {
            updateData.status = 'IN_PROGRESS';
        }

        return enrolmentsRepository.update(organizationId, id, updateData);
    }

    async completeEnrolment(organizationId: string, id: string, score: number) {
        const enrolment = await this.getEnrolmentById(organizationId, id);

        const updateData: any = {
            progress_percent: 100,
            score,
            completed_date: new Date(),
            status: score >= ((enrolment.course as any)?.pass_mark || 80) ? 'COMPLETED' : 'FAILED',
        };

        return enrolmentsRepository.update(organizationId, id, updateData);
    }

    async getLearnerCourse(organizationId: string, userId: string, courseId: string) {
        const enrolment = await enrolmentsRepository.getLearnerCourse(organizationId, userId, courseId);
        if (!enrolment) {
            throw new AppError('Forbidden: You do not have an active enrolment for this course', 403, 'AUTH_FORBIDDEN');
        }
        
        // Ensure status is active/enrolled, not revoked
        if (enrolment.status === 'FAILED') {
             throw new AppError('Forbidden: Your enrolment for this course is inactive or failed', 403, 'AUTH_FORBIDDEN');
        }
        return enrolment;
    }

    async updateLessonProgress(organizationId: string, userId: string, courseId: string, data: { lesson_id: string, lesson_type: string, status: string, time_spent?: number, quiz_score?: number }) {
        // First get the enrolment
        const enrolment = await enrolmentsRepository.findByUserAndCourse(organizationId, userId, courseId);
        if (!enrolment) {
            throw new AppError('Forbidden: Enrolment not found', 403, 'AUTH_FORBIDDEN');
        }

        // We use Prisma directly here because it's a specific sub-model update
        const { prisma } = require('../../config/database');
        
        // Upsert the lesson progress
        const lessonProgress = await prisma.lessonProgress.upsert({
            where: {
                enrolment_id_lesson_id_lesson_type: {
                    enrolment_id: enrolment.id,
                    lesson_id: data.lesson_id,
                    lesson_type: data.lesson_type
                }
            },
            update: {
                status: data.status,
                time_spent: data.time_spent ? { increment: data.time_spent } : undefined,
                quiz_score: data.quiz_score ?? null,
                last_viewed_at: new Date(),
                completed_at: data.status === 'COMPLETED' ? new Date() : undefined,
            },
            create: {
                enrolment_id: enrolment.id,
                lesson_id: data.lesson_id,
                lesson_type: data.lesson_type,
                status: data.status,
                time_spent: data.time_spent || 0,
                quiz_score: data.quiz_score ?? null,
                last_viewed_at: new Date(),
                completed_at: data.status === 'COMPLETED' ? new Date() : undefined,
            }
        });

        if (enrolment.status === 'ENROLLED') {
            await enrolmentsRepository.update(organizationId, enrolment.id, { status: 'IN_PROGRESS' });
        }

        return lessonProgress;
    }
}

export const enrolmentsService = new EnrolmentsService();
