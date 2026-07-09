import { Router } from 'express';
import { createOrganization, listOrganizations, updateOrganization, deleteOrganization } from './organizations.controller';
import { requireAuth } from '../auth/auth.middleware';

const router = Router();

// Endpoint to create an organisation (Super Admin only in real app)
router.post('/', requireAuth, createOrganization);

// Endpoint to list organisations
router.get('/', requireAuth, listOrganizations);

// Endpoint to update an organisation
router.put('/:id', requireAuth, updateOrganization);

// Endpoint to delete an organisation
router.delete('/:id', requireAuth, deleteOrganization);

export const organizationsRoutes = router;
