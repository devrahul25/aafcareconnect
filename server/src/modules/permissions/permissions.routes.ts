import { Router } from 'express';
import { PermissionsController } from './permissions.controller';
import { requirePermission } from '../auth/authorization.middleware';
import { requireAuth } from '../auth/auth.middleware';

const router = Router();

router.use(requireAuth);
// Only Org Admins and Super Admins can fetch all permissions to manage roles
router.use(requirePermission('permissions', 'read'));

router.get('/', PermissionsController.getPermissions);

export default router;
