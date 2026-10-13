import { Router } from 'express';
import * as controller from './compliance.controller';
import * as validator from './compliance.validator';
import { validate } from '../../middleware/validate';
import { requireAuth } from '../auth/auth.middleware';
import { tenantContext } from '../../middleware/tenantContext';

const router = Router();

// Apply middlewares
router.use(requireAuth, tenantContext);

// Real-Time Compliance Intelligence endpoints
router.get('/summary', controller.getSummary);
router.get('/staff-matrix', controller.getStaffMatrix);
router.get('/expiring-certs', controller.getExpiringCerts);
router.get('/mandatory-training', controller.getMandatoryTraining);
router.get('/alerts', controller.getAlerts);

// Real-Time Compliance Actions
router.post('/remind', controller.sendReminder);
router.post('/renew', controller.renewCertificate);
router.post('/assign', controller.assignTraining);

// Standard Compliance Records
router.get('/', controller.listRecords);
router.get('/stats', controller.getStats);
router.get('/:id', controller.getRecord);
router.post('/', validate(validator.createComplianceSchema), controller.createRecord);
router.patch('/:id', validate(validator.updateComplianceSchema), controller.updateRecord);
router.delete('/:id', controller.deleteRecord);

export const complianceRoutes = router;
