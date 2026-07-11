import { Request, Response } from 'express';
import { LearnersService } from './learners.service';
import { prisma } from '../../config/database';

export class LearnersController {
  static async createLearner(req: Request, res: Response) {
    try {
      const orgId = req.user?.organization_id;
      if (!orgId) {
        return res.status(401).json({ success: false, error: 'Unauthorized: No organization found.' });
      }

      const org = await prisma.organization.findUnique({ where: { id: orgId } });
      const organization_name = org?.name;

      const data = {
        ...req.body,
        organization_id: orgId,
        organization_name
      };

      if (!data.first_name || !data.last_name || !data.email) {
        return res.status(400).json({ success: false, error: 'Missing required fields: first_name, last_name, email' });
      }

      const result = await LearnersService.createLearner(data);

      res.status(201).json({
        success: true,
        data: {
          user_id: result.user.id,
          learner_id: result.learnerId,
          temp_password: result.tempPassword
        }
      });
    } catch (error: any) {
      console.error('Error creating learner:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to create learner'
      });
    }
  }
}
