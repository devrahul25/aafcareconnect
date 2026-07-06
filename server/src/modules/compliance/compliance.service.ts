import { complianceRepository } from './compliance.repository';
import { AppError } from '../../shared/errors/AppError';

export class ComplianceService {
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
