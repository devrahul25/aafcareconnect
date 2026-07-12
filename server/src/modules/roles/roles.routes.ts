import { Router } from 'express';
import { RolesController } from './roles.controller';
import { requirePermission } from '../auth/authorization.middleware';
import { requireAuth } from '../auth/auth.middleware';

const router = Router();

router.use(requireAuth);
// Only Org Admins and Super Admins can manage roles
router.use(requirePermission('roles', 'manage'));

router.get('/', requirePermission('roles', 'read'), RolesController.getRoles);
router.post('/', requirePermission('roles', 'create'), RolesController.createRole);
router.get('/:id', requirePermission('roles', 'read'), RolesController.getRole);
router.put('/:id', requirePermission('roles', 'update'), RolesController.updateRole);
router.delete('/:id', requirePermission('roles', 'delete'), RolesController.deleteRole);
router.post('/:id/duplicate', requirePermission('roles', 'create'), RolesController.duplicateRole);

export default router;
