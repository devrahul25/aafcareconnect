import { Router } from 'express';
import * as controller from './storage.controller';
import * as validator from './storage.validator';
import { validate } from '../../middleware/validate';
import { authenticate } from '../../middleware/authenticate';
import { tenantContext } from '../../middleware/tenantContext';
import { authorize } from '../../middleware/authorize';

const router = Router();

// Apply common middlewares
router.use(authenticate, tenantContext);

// Endpoint to generate pre-signed upload URL for direct S3 upload
router.post(
  '/upload-url',
  authorize('storage', 'upload'),
  validate(validator.getUploadUrlSchema),
  controller.getUploadUrl,
);

// Enforces max size constraints, mostly for documents
router.post(
  '/upload-post-policy',
  authorize('storage', 'upload'),
  validate(validator.getPostPolicySchema),
  controller.getPostPolicy,
);

// --- MULTIPART UPLOAD FOR LARGE VIDEOS ---

router.post(
  '/multipart/init',
  authorize('storage', 'upload'),
  validate(validator.initMultipartSchema),
  controller.initMultipart,
);

router.post(
  '/multipart/sign',
  authorize('storage', 'upload'),
  validate(validator.signPartSchema),
  controller.signPart,
);

router.post(
  '/multipart/complete',
  authorize('storage', 'upload'),
  validate(validator.completeMultipartSchema),
  controller.completeMultipart,
);

export const storageRoutes = router;
