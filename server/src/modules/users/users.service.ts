import { UserStatus } from '@prisma/client';
import { UsersRepository } from './users.repository';
import { prisma } from '../../config/database';
import bcrypt from 'bcrypt';
import { FirebaseAdminService } from '../../shared/providers/identity/firebase-admin.service';
import { EmailService } from '../../shared/providers/email/email.service';

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

    /**
     * Invite a new staff user
     */
    static async inviteUser(data: {
        full_name: string;
        email: string;
        phone?: string;
        role_id: string;
        organization_id: string;
        employee_id?: string;
        job_title?: string;
        department?: string;
        employment_type?: string;
        start_date?: Date;
        responsibility_scope?: any;
    }) {
        const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        const role = await prisma.role.findUnique({ where: { id: data.role_id } });
        if (!role) {
            throw new Error('Role not found');
        }
        if (role.name === 'org_admin') {
            throw new Error('You cannot assign the Organisation Admin role. Only a Super Admin can do this.');
        }

        const tempPassword = Math.random().toString(36).slice(-6) + Math.random().toString(36).slice(-4).toUpperCase() + '!';
        const passwordHash = await bcrypt.hash(tempPassword, 10);

        const identityProvider = new FirebaseAdminService();
        let firebaseUid = '';
        try {
            firebaseUid = await identityProvider.createUser(data.email, tempPassword);
        } catch (error: any) {
            if (error.code === 'auth/email-already-exists') {
                await identityProvider.deleteUserByEmail(data.email);
                firebaseUid = await identityProvider.createUser(data.email, tempPassword);
            } else {
                throw error;
            }
        }

        const user = await prisma.user.create({
            data: {
                email: data.email,
                full_name: data.full_name,
                password_hash: passwordHash,
                firebase_uid: firebaseUid,
                organization_id: data.organization_id,
                status: 'ACTIVE',
                email_verified: false,
                phone: data.phone,
                user_roles: {
                    create: {
                        role_id: data.role_id
                    }
                },
                staff_profile: {
                    create: {
                        organization_id: data.organization_id,
                        employee_id: data.employee_id,
                        job_title: data.job_title,
                        department: data.department,
                        employment_type: data.employment_type,
                        start_date: data.start_date ? new Date(data.start_date) : undefined,
                        responsibility_scope: data.responsibility_scope || {}
                    }
                }
            },
            include: {
                user_roles: {
                    include: {
                        role: true
                    }
                }
            }
        });

        // Send Welcome Email
        const org = await prisma.organization.findUnique({ where: { id: data.organization_id } });
        if (org) {
            const emailService = new EmailService();
            await emailService.sendStaffWelcomeEmail(data.email, {
                name: data.full_name.split(' ')[0],
                organization: org.name,
                role: role.name,
                temp_password: tempPassword
            }).catch(err => console.error('Failed to send staff welcome email:', err));
        }

        return {
            user,
            tempPassword
        };
    }

    /**
     * Get full user profile
     */
    static async getUserProfile(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                staff_profile: true,
                user_roles: {
                    include: {
                        role: {
                            include: {
                                permissions: {
                                    include: {
                                        permission: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!user) throw new Error('User not found');
        return user;
    }

    /**
     * Update user responsibilities
     */
    static async updateUserResponsibilities(userId: string, responsibility_scope: any) {
        const profile = await prisma.staffProfile.findUnique({
            where: { user_id: userId }
        });

        if (!profile) {
            throw new Error('Staff profile not found for this user');
        }

        return prisma.staffProfile.update({
            where: { user_id: userId },
            data: { responsibility_scope }
        });
    }

    /**
     * Get assigned learners
     */
    static async getAssignedLearners(staffId: string, organizationId: string) {
        const assignments = await prisma.staffLearnerAssignment.findMany({
            where: {
                staff_id: staffId,
                organization_id: organizationId
            },
            include: {
                learner: {
                    select: {
                        id: true,
                        full_name: true,
                        email: true,
                        status: true,
                        avatar_url: true,
                    }
                }
            },
            orderBy: {
                assigned_at: 'desc'
            }
        });

        return assignments.map(a => ({
            assignment_id: a.id,
            assigned_at: a.assigned_at,
            ...a.learner
        }));
    }

    /**
     * Assign learner to staff
     */
    static async assignLearner(staffId: string, learnerId: string, assignedById: string, organizationId: string) {
        // Verify learner exists and belongs to org
        const learner = await prisma.user.findFirst({
            where: { id: learnerId, organization_id: organizationId }
        });
        if (!learner) throw new Error('Learner not found in this organization');

        // Check if already assigned
        const existing = await prisma.staffLearnerAssignment.findUnique({
            where: {
                staff_id_learner_id: {
                    staff_id: staffId,
                    learner_id: learnerId
                }
            }
        });

        if (existing) throw new Error('Learner is already assigned to this staff member');

        return prisma.staffLearnerAssignment.create({
            data: {
                staff_id: staffId,
                learner_id: learnerId,
                assigned_by_id: assignedById,
                organization_id: organizationId
            }
        });
    }

    /**
     * Unassign learner from staff
     */
    static async unassignLearner(staffId: string, learnerId: string, organizationId: string) {
        return prisma.staffLearnerAssignment.deleteMany({
            where: {
                staff_id: staffId,
                learner_id: learnerId,
                organization_id: organizationId
            }
        });
    }

    /**
     * Get user activity logs
     */
    static async getUserActivityLogs(userId: string, organizationId: string) {
        return prisma.auditLog.findMany({
            where: {
                user_id: userId,
                organization_id: organizationId
            },
            orderBy: {
                created_at: 'desc'
            },
            take: 50
        });
    }
}
