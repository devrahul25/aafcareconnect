import { complianceRepository } from './compliance.repository';
import { AppError } from '../../shared/errors/AppError';

export class ComplianceService {
    // ─── Real-Time Compliance Intelligence ────────────────────────────────────

    async getSummary(organizationId: string) {
        return complianceRepository.getSummary(organizationId);
    }

    async getStaffMatrix(organizationId: string) {
        return complianceRepository.getStaffMatrix(organizationId);
    }

    async getExpiringCerts(organizationId: string) {
        return complianceRepository.getExpiringCerts(organizationId);
    }

    async getMandatoryTraining(organizationId: string) {
        return complianceRepository.getMandatoryTraining(organizationId);
    }

    async getAlerts(organizationId: string) {
        return complianceRepository.getAlerts(organizationId);
    }

    async sendReminder(organizationId: string, data: any) {
        return complianceRepository.sendReminder(organizationId, data);
    }

    async renewCertificate(organizationId: string, data: any) {
        const certificateId = data.certificateId || data.certId || data.id;
        if (!certificateId) {
            throw new AppError('certificateId is required for certificate renewal', 400, 'BAD_REQUEST');
        }
        return complianceRepository.renewCertificate(organizationId, { ...data, certificateId });
    }

    async assignTraining(organizationId: string, data: any) {
        if (!data.userId) {
            throw new AppError('userId is required to assign training', 400, 'BAD_REQUEST');
        }
        return complianceRepository.assignTraining(organizationId, data);
    }

    // ─── Standard Compliance Records ──────────────────────────────────────────

    async getRecords(organizationId: string, query?: any) {
        return complianceRepository.findAll(organizationId, query);
    }

    async getRecordById(organizationId: string, id: string) {
        const record = await complianceRepository.findById(organizationId, id);
        if (!record) {
            throw new AppError('Compliance record not found', 404, 'NOT_FOUND');
        }
        return record;
    }

    async createRecord(organizationId: string, data: any) {
        return complianceRepository.create(organizationId, data);
    }

    async updateRecord(organizationId: string, id: string, data: any) {
        await this.getRecordById(organizationId, id);
        return complianceRepository.update(organizationId, id, data);
    }

    async deleteRecord(organizationId: string, id: string) {
        await this.getRecordById(organizationId, id);
        return complianceRepository.delete(organizationId, id);
    }

    async getStats(organizationId: string) {
        return complianceRepository.getStats(organizationId);
    }
}

export const complianceService = new ComplianceService();
