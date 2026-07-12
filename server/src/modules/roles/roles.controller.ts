import { Request, Response } from 'express';
import { RolesService } from './roles.service';

export class RolesController {
  static async getRoles(req: Request, res: Response) {
    try {
      const organization_id = req.user.organization_id;
      const roles = await RolesService.getRoles(organization_id);
      res.status(200).json({ success: true, data: roles });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getRole(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const organization_id = req.user.organization_id;
      const role = await RolesService.getRole(id, organization_id);
      res.status(200).json({ success: true, data: role });
    } catch (error: any) {
      res.status(404).json({ success: false, error: error.message });
    }
  }

  static async createRole(req: Request, res: Response) {
    try {
      const { name, description, permission_ids } = req.body;
      const organization_id = req.user.organization_id;
      const newRole = await RolesService.createRole(organization_id, name, description, permission_ids || []);
      res.status(201).json({ success: true, data: newRole });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async updateRole(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { name, description, permission_ids } = req.body;
      const organization_id = req.user.organization_id;
      const updatedRole = await RolesService.updateRole(id, organization_id, name, description, permission_ids);
      res.status(200).json({ success: true, data: updatedRole });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async deleteRole(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const organization_id = req.user.organization_id;
      await RolesService.deleteRole(id, organization_id);
      res.status(200).json({ success: true, message: 'Role deleted' });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async duplicateRole(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { name } = req.body;
      const organization_id = req.user.organization_id;
      const duplicatedRole = await RolesService.duplicateRole(id, organization_id, name);
      res.status(201).json({ success: true, data: duplicatedRole });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}
