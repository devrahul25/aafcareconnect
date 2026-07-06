import { Response } from 'express';
import { AuthenticatedRequest } from '../auth/auth.middleware';
import { UsersService } from './users.service';
import { UserStatus } from '@prisma/client';

export class UsersController {

    /**
     * Get all users with filters
     */
    static async getUsers(req: AuthenticatedRequest, res: Response) {
        try {
            const { status, search, page, limit } = req.query;
            const organisation_id = req.user?.organization_id;

            const result = await UsersService.getUsers({
                organisation_id,
                status: status as UserStatus,
                search: search as string,
                page: page ? parseInt(page as string) : undefined,
                limit: limit ? parseInt(limit as string) : undefined
            });

            res.json({
                success: true,
                data: result.users,
                pagination: result.pagination
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * Get pending approvals
     */
    static async getPendingApprovals(req: AuthenticatedRequest, res: Response) {
        try {
            const organisation_id = req.user?.organization_id;
            const users = await UsersService.getPendingApprovals(organisation_id);

            res.json({
                success: true,
                data: users
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * Approve a user
     */
    static async approveUser(req: AuthenticatedRequest, res: Response) {
        try {
            const { userId } = req.params;
            const { role_id } = req.body;
            const approvedBy = req.user!.id;

            const user = await UsersService.approveUser(userId, approvedBy, role_id);

            res.json({
                success: true,
                data: user,
                message: 'User approved successfully'
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * Reject a user
     */
    static async rejectUser(req: AuthenticatedRequest, res: Response) {
        try {
            const { userId } = req.params;
            const { reason } = req.body;
            const rejectedBy = req.user!.id;

            const user = await UsersService.rejectUser(userId, rejectedBy, reason);

            res.json({
                success: true,
                data: user,
                message: 'User registration rejected'
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * Update user role
     */
    static async updateUserRole(req: AuthenticatedRequest, res: Response) {
        try {
            const { userId } = req.params;
            const { role_id } = req.body;
            const requesterId = req.user!.id;

            if (!role_id) {
                return res.status(400).json({
                    success: false,
                    error: 'role_id is required'
                });
            }

            const user = await UsersService.updateUserRole(userId, role_id, requesterId);

            res.json({
                success: true,
                data: user,
                message: 'User role updated successfully'
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * Get user by ID
     */
    static async getUser(req: AuthenticatedRequest, res: Response) {
        try {
            const { userId } = req.params;
            const user = await UsersService.getUserById(userId);

            res.json({
                success: true,
                data: user
            });
        } catch (error: any) {
            res.status(404).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * Update user status (suspend/activate)
     */
    static async updateUserStatus(req: AuthenticatedRequest, res: Response) {
        try {
            const { userId } = req.params;
            const { status } = req.body;
            const requesterId = req.user!.id;

            if (!status || !Object.values(UserStatus).includes(status)) {
                return res.status(400).json({
                    success: false,
                    error: 'Valid status is required'
                });
            }

            const user = await UsersService.updateUserStatus(userId, status, requesterId);

            res.json({
                success: true,
                data: user,
                message: 'User status updated successfully'
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
}
