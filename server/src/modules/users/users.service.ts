import { UserStatus } from '@prisma/client';
import { UsersRepository } from './users.repository';

export class UsersService {

    /**
     * Get all users with filters
     */
    static async getUsers(filters: {
        organisation_id?: string;
        status?: UserStatus;
        search?: string;
        role?: string;
        page?: number;
        limit?: number;
    }) {
        const { page = 1, limit = 50, ...restFilters } = filters;
        const skip = (page - 1) * limit;

        const result = await UsersRepository.findAll({
            ...restFilters,
            skip,
            take: limit
        });

        const usersWithMetrics = result.users.map((u: any) => {
            const assignedCourses = u.course_enrolments?.length || 0;
            const completedCourses = u.course_enrolments?.filter((e: any) => e.status === 'COMPLETED').length || 0;
            const cpdHours = u.cpd_certificates?.reduce((sum: number, c: any) => sum + (c.cpd_hours || 0), 0) || 0;
            const complianceScore = assignedCourses > 0 ? Math.round((completedCourses / assignedCourses) * 100) : 100;
            const certificates = u.cpd_certificates?.length || 0;

            const userCopy = { ...u };
            delete userCopy.course_enrolments;
            delete userCopy.cpd_certificates;

            return {
                ...userCopy,
                metrics: {
                    assignedCourses,
                    completedCourses,
                    cpdHours,
                    complianceScore,
                    certificates
                }
            };
        });

        return {
            users: usersWithMetrics,
            pagination: {
                total: result.total,
                page,
                limit,
                totalPages: Math.ceil(result.total / limit)
            }
        };
    }

    /**
     * Get pending approval users
     */
    static async getPendingApprovals(organisation_id?: string) {
        return UsersRepository.findPendingApprovals(organisation_id);
    }

    /**
     * Approve a user and assign role
     */
    static async approveUser(userId: string, approvedBy: string, roleId?: string) {
        const user = await UsersRepository.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        if (user.status !== UserStatus.PENDING_APPROVAL) {
            throw new Error('User is not pending approval');
        }

        return UsersRepository.approveUser(userId, approvedBy, roleId);
    }

    /**
     * Reject a user registration
     */
    static async rejectUser(userId: string, rejectedBy: string, reason?: string) {
        const user = await UsersRepository.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        if (user.status !== UserStatus.PENDING_APPROVAL) {
            throw new Error('User is not pending approval');
        }

        return UsersRepository.rejectUser(userId, rejectedBy, reason);
    }

    /**
     * Update user role
     */
    static async updateUserRole(userId: string, roleId: string, requesterId: string) {
        const user = await UsersRepository.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        if (user.status !== UserStatus.ACTIVE) {
            throw new Error('Can only update roles for active users');
        }

        return UsersRepository.updateUserRole(userId, roleId);
    }

    /**
     * Get user by ID
     */
    static async getUserById(userId: string) {
        const user = await UsersRepository.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    /**
     * Suspend/Activate user
     */
    static async updateUserStatus(userId: string, status: UserStatus, requesterId: string) {
        const user = await UsersRepository.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        if (status === UserStatus.PENDING_APPROVAL) {
            throw new Error('Cannot set status to PENDING_APPROVAL manually');
        }

        return UsersRepository.updateStatus(userId, status);
    }
}
