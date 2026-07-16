import { PrismaClient, UserStatus } from '@prisma/client';
import { prisma as db } from '../../config/database';

export class UsersRepository {

    /**
     * Get all users with optional filters
     */
    static async findAll(filters: {
        organisation_id?: string;
        status?: UserStatus;
        search?: string;
        role?: string;
        skip?: number;
        take?: number;
    } = {}) {
        const { organisation_id, status, search, role, skip = 0, take = 50 } = filters;

        const where: any = { deleted_at: null };
        if (organisation_id) where.organization_id = organisation_id;
        if (status) where.status = status;
        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { full_name: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (role) {
            const roles = role.split(',').map(r => r.trim());
            where.user_roles = {
                some: {
                    role: {
                        name: { in: roles }
                    }
                }
            };
        }

        const [users, total] = await Promise.all([
            db.user.findMany({
                where,
                include: {
                    user_roles: {
                        include: {
                            role: true
                        }
                    },
                    organization: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    course_enrolments: true,
                    cpd_certificates: true,
                    _count: {
                        select: {
                            assigned_learners: true
                        }
                    }
                },
                skip,
                take,
                orderBy: { created_at: 'desc' }
            }),
            db.user.count({ where })
        ]);

        return { users, total };
    }

    /**
     * Get pending approval users
     */
    static async findPendingApprovals(organisation_id?: string) {
        const where: any = { status: UserStatus.PENDING_APPROVAL };
        if (organisation_id) where.organization_id = organisation_id;

        return db.user.findMany({
            where,
            include: {
                organization: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: { created_at: 'asc' }
        });
    }

    /**
     * Approve a user
     */
    static async approveUser(userId: string, approvedBy: string, roleId?: string) {
        return db.$transaction(async (tx: any) => {
            // Update user status
            const user = await tx.user.update({
                where: { id: userId },
                data: {
                    status: UserStatus.ACTIVE,
                    approved_by: approvedBy,
                    approved_at: new Date()
                }
            });

            // Assign role if provided
            if (roleId) {
                await tx.userRole.create({
                    data: {
                        user_id: userId,
                        role_id: roleId
                    }
                });
            }

            return user;
        });
    }

    /**
     * Reject a user
     */
    static async rejectUser(userId: string, rejectedBy: string, reason?: string) {
        return db.user.update({
            where: { id: userId },
            data: {
                status: UserStatus.INACTIVE,
                approved_by: rejectedBy,
                rejection_reason: reason,
                approved_at: new Date()
            }
        });
    }

    /**
     * Update user role
     */
    static async updateUserRole(userId: string, roleId: string) {
        return db.$transaction(async (tx: any) => {
            // Remove existing roles
            await tx.userRole.deleteMany({
                where: { user_id: userId }
            });

            // Assign new role
            await tx.userRole.create({
                data: {
                    user_id: userId,
                    role_id: roleId
                }
            });

            return tx.user.findUnique({
                where: { id: userId },
                include: {
                    user_roles: {
                        include: {
                            role: true
                        }
                    }
                }
            });
        });
    }

    /**
     * Get user by ID with full details
     */
    static async findById(userId: string) {
        return db.user.findUnique({
            where: { id: userId },
            include: {
                user_roles: {
                    include: {
                        role: true
                    }
                },
                organization: true,
                approver: {
                    select: {
                        id: true,
                        email: true,
                        full_name: true
                    }
                }
            }
        });
    }

    /**
     * Update user status
     */
    static async updateStatus(userId: string, status: UserStatus) {
        return db.user.update({
            where: { id: userId },
            data: { status }
        });
    }
}
