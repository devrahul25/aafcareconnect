import { Router } from 'express';
import { UsersController } from './users.controller';
import { requireAuth } from '../auth/auth.middleware';
import { requirePermission } from '../auth/authorization.middleware';
import { asyncHandler } from '../../shared/utils/asyncHandler';

const router = Router();

// All routes require authentication
router.use(requireAuth);

// Get all users (admin/org_manager only)
router.get(
    '/',
    requirePermission('users', 'manage'),
    asyncHandler(UsersController.getUsers)
);

// Get pending approvals
router.get(
    '/pending-approvals',
    requirePermission('users', 'manage'),
    asyncHandler(UsersController.getPendingApprovals)
);

// Get user by ID
router.get(
    '/:userId',
    requirePermission('users', 'manage'),
    asyncHandler(UsersController.getUser)
);

// Approve user
router.post(
    '/:userId/approve',
    requirePermission('users', 'manage'),
    asyncHandler(UsersController.approveUser)
);

// Reject user
router.post(
    '/:userId/reject',
    requirePermission('users', 'manage'),
    asyncHandler(UsersController.rejectUser)
);

// Update user role
router.patch(
    '/:userId/role',
    requirePermission('users', 'manage'),
    asyncHandler(UsersController.updateUserRole)
);

// Update user status (suspend/activate)
router.patch(
    '/:userId/status',
    requirePermission('users', 'manage'),
    asyncHandler(UsersController.updateUserStatus)
);

export default router;
