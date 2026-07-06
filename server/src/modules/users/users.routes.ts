import { Router } from 'express';
import { UsersController } from './users.controller';
import { requireAuth } from '../auth/auth.middleware';
import { authorize } from '../../middleware/authorize';
import { asyncHandler } from '../../shared/utils/asyncHandler';

const router = Router();

// All routes require authentication
router.use(requireAuth);

// Get all users (admin/org_manager only)
router.get(
    '/',
    authorize(['admin', 'org_manager']),
    asyncHandler(UsersController.getUsers)
);

// Get pending approvals
router.get(
    '/pending-approvals',
    authorize(['admin', 'org_manager']),
    asyncHandler(UsersController.getPendingApprovals)
);

// Get user by ID
router.get(
    '/:userId',
    authorize(['admin', 'org_manager']),
    asyncHandler(UsersController.getUser)
);

// Approve user
router.post(
    '/:userId/approve',
    authorize(['admin', 'org_manager']),
    asyncHandler(UsersController.approveUser)
);

// Reject user
router.post(
    '/:userId/reject',
    authorize(['admin', 'org_manager']),
    asyncHandler(UsersController.rejectUser)
);

// Update user role
router.patch(
    '/:userId/role',
    authorize(['admin', 'org_manager']),
    asyncHandler(UsersController.updateUserRole)
);

// Update user status (suspend/activate)
router.patch(
    '/:userId/status',
    authorize(['admin', 'org_manager']),
    asyncHandler(UsersController.updateUserStatus)
);

export default router;
