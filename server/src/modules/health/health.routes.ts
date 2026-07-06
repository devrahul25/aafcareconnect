import { Router } from 'express';
import * as healthController from './health.controller';

const router = Router();

router.get('/', healthController.checkHealth);

export const healthRoutes = router;
