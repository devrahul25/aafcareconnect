import { Router } from 'express';
import { 
  createOrganization, listOrganizations, updateOrganization, deleteOrganization,
  getOrganizationTypes, addOrganizationType, deleteOrganizationType, getOrganization
} from './organizations.controller';
import { requireAuth } from '../auth/auth.middleware';

const router = Router();

// --- Organization Type Options ---
router.get('/types', requireAuth, getOrganizationTypes);
router.post('/types', requireAuth, addOrganizationType);
router.delete('/types/:id', requireAuth, deleteOrganizationType);

// Endpoint to create an organisation (Super Admin only in real app)
router.post('/', requireAuth, createOrganization);

// Endpoint to list organisations
router.get('/', requireAuth, listOrganizations);

// Endpoint to get a specific organisation
router.get('/:id', requireAuth, getOrganization);

// Endpoint to update an organisation
router.put('/:id', requireAuth, updateOrganization);

// Endpoint to delete an organisation
router.delete('/:id', requireAuth, deleteOrganization);

export const organizationsRoutes = router;
