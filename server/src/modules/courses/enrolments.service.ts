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
            status: score >= (enrolment.course.pass_mark || 80) ? 'COMPLETED' : 'FAILED',
        };

        return enrolmentsRepository.update(organizationId, id, updateData);
    }
}

export const enrolmentsService = new EnrolmentsService();
