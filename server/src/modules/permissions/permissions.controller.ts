import { Request, Response } from 'express';
import { prisma } from '../../config/database';

export class PermissionsController {
  static async getPermissions(req: Request, res: Response) {
    try {
      const permissions = await prisma.permission.findMany({
        orderBy: [
          { resource: 'asc' },
          { action: 'asc' }
        ]
      });
      res.status(200).json({ success: true, data: permissions });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
