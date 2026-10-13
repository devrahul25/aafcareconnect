import { Router } from 'express';
import * as controller from './cpd.controller';
import { requireAuth } from '../auth/auth.middleware';
import { tenantContext } from '../../middleware/tenantContext';

const router = Router();

router.use(requireAuth, tenantContext);

router.get('/', controller.listCertificates);
router.get('/:id', controller.getCertificate);
router.post('/', controller.createCertificate);
router.patch('/:id', controller.updateCertificate);
router.delete('/:id', controller.deleteCertificate);

export const cpdRoutes = router;
