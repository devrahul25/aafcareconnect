import { Router } from 'express';
import { getSuperAdminDashboard, getOrganizationDashboard } from './dashboard.controller';
import { requireAuth } from '../auth/auth.middleware';

const router = Router();

// Dashboard for Super Admin
router.get('/superadmin', requireAuth, getSuperAdminDashboard);

// Dashboard for Organization Workspace
router.get('/organization/:orgId', requireAuth, getOrganizationDashboard);

export const dashboardRoutes = router;
