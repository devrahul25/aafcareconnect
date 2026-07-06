import { Router } from 'express';
import * as controller from './storage.controller';
import * as validator from './storage.validator';
import { validate } from '../../middleware/validate';
import { requireAuth } from '../auth/auth.middleware';
import { requirePermission } from '../auth/authorization.middleware';
import { tenantContext } from '../../middleware/tenantContext';

const router = Router();

// Apply middlewares
router.use(requireAuth, tenantContext);

// Endpoint to generate pre-signed upload URL for direct S3 upload
router.post(
  '/upload-url',
  requirePermission('storage', 'upload'),
  validate(validator.getUploadUrlSchema),
  controller.getUploadUrl,
);

// Enforces max size constraints, mostly for documents
router.post(
  '/upload-post-policy',
  requirePermission('storage', 'upload'),
  validate(validator.getPostPolicySchema),
  controller.getPostPolicy,
);

// --- MULTIPART UPLOAD FOR LARGE VIDEOS ---

router.post(
  '/multipart/init',
  requirePermission('storage', 'upload'),
  validate(validator.initMultipartSchema),
  controller.initMultipart,
);

router.post(
  '/multipart/sign',
  requirePermission('storage', 'upload'),
  validate(validator.signPartSchema),
  controller.signPart,
);

router.post(
  '/multipart/complete',
  requirePermission('storage', 'upload'),
  validate(validator.completeMultipartSchema),
  controller.completeMultipart,
);

export const storageRoutes = router;
