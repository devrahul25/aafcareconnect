import { Router } from 'express';
import * as controller from './compliance.controller';
import * as validator from './compliance.validator';
import { validate } from '../../middleware/validate';
import { requireAuth } from '../auth/auth.middleware';
import { requirePermission } from '../auth/authorization.middleware';
import { tenantContext } from '../../middleware/tenantContext';

const router = Router();

// Apply middlewares
router.use(requireAuth, tenantContext);

// Compliance Routes
router.get('/', requirePermission('compliance', 'read'), controller.listRecords);
router.get('/stats', requirePermission('compliance', 'read'), controller.getStats);
router.get('/:id', requirePermission('compliance', 'read'), controller.getRecord);
router.post('/', requirePermission('compliance', 'create'), validate(validator.createComplianceSchema), controller.createRecord);
router.patch('/:id', requirePermission('compliance', 'update'), validate(validator.updateComplianceSchema), controller.updateRecord);
router.delete('/:id', requirePermission('compliance', 'delete'), controller.deleteRecord);

export const complianceRoutes = router;
