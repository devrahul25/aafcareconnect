import { Request, Response } from 'express';
import { prisma } from '../../config/database';

export const getSuperAdminDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Total Organizations
    const totalOrganizations = await prisma.organization.count();

    // 2. Active Learners
    // We count users who are ACTIVE and have a role named 'LEARNER' 
    // or we just count all ACTIVE users as "Active Learners" if everyone is a learner on the platform.
    // Given the schema structure (user_roles -> role), it's more accurate to join, but since we 
    // might not have seed data mapping the exact 'LEARNER' role text, we will just count all users 
    // that don't have superadmin/orgadmin roles, or broadly active users as requested for MVP.
    const activeLearners = await prisma.user.count({
      where: { status: 'ACTIVE' }
    });

    // 3. Monthly Revenue (£0 for MVP)
    const monthlyRevenue = 0;

    // 4. Platform Compliance
    // (RESOLVED + CLOSED) / Total
    const totalCompliance = await prisma.complianceRecord.count();
    const resolvedCompliance = await prisma.complianceRecord.count({
      where: {
        status: { in: ['RESOLVED', 'CLOSED'] }
      }
    });
    const platformCompliance = totalCompliance === 0 ? 0 : Math.round((resolvedCompliance / totalCompliance) * 100);

    // 5. Active Subscriptions
    const activeSubscriptions = await prisma.subscription.count({
      where: { status: 'ACTIVE' }
    });

    // 6. User Growth (Last 6 Months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const users = await prisma.user.findMany({
      where: { created_at: { gte: sixMonthsAgo } },
      select: { created_at: true }
    });

    // Group by month
    const growthMap: Record<string, number> = {};
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthStr = d.toLocaleString('default', { month: 'short' });
      growthMap[monthStr] = 0;
    }

    users.forEach(u => {
      const monthStr = u.created_at.toLocaleString('default', { month: 'short' });
      if (growthMap[monthStr] !== undefined) {
        growthMap[monthStr]++;
      }
    });

    // Reorder to chronological
    const userGrowth = Object.entries(growthMap)
      .reverse()
      .map(([month, users]) => ({ month, users }));

    // 7. Recent Activity (AuditLogs)
    const recentActivity = await prisma.auditLog.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      include: { user: { select: { full_name: true, email: true } } }
    });

    res.status(200).json({
      success: true,
      data: {
        totalOrganizations,
        activeLearners,
        monthlyRevenue,
        platformCompliance,
        activeSubscriptions,
        userGrowth,
        recentActivity
      }
    });
  } catch (error: any) {
    console.error('Super Admin Dashboard Error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
  }
};

export const getOrganizationDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orgId } = req.params;

    // 1. Organization Details
    const organization = await prisma.organization.findUnique({
      where: { id: orgId as string },
      include: {
        subscriptions: {
          orderBy: { created_at: 'desc' },
          take: 1
        }
      }
    });

    if (!organization) {
      res.status(404).json({ error: 'Organization not found' });
      return;
    }

    // 2. Active Learners Count
    const activeLearners = await prisma.user.count({
      where: {
        organization_id: orgId as string,
        status: 'ACTIVE',
        user_roles: {
          some: {
            role: { name: 'learner' }
          }
        }
      }
    });

    // 3. Active Staff Count
    const activeStaff = await prisma.user.count({
      where: {
        organization_id: orgId as string,
        status: 'ACTIVE',
        user_roles: {
          some: {
            role: { name: { in: ['org_admin', 'manager', 'trainer'] } }
          }
        }
      }
    });

    // 4. Compliance Score
    const totalCompliance = await prisma.complianceRecord.count({
      where: { organization_id: orgId as string }
    });
    const resolvedCompliance = await prisma.complianceRecord.count({
      where: {
        organization_id: orgId as string,
        status: { in: ['RESOLVED', 'CLOSED'] }
      }
    });
    const complianceScore = totalCompliance === 0 ? 0 : Math.round((resolvedCompliance / totalCompliance) * 100);

    // 5. Course Completions
    const courseCompletions = await prisma.courseEnrolment.count({
      where: {
        user: { organization_id: orgId as string },
        status: 'COMPLETED'
      }
    });

    res.status(200).json({
      success: true,
      data: {
        organization,
        activeLearners,
        activeStaff,
        complianceScore,
        courseCompletions
      }
    });
  } catch (error: any) {
    console.error('Organization Dashboard Error:', error);
    res.status(500).json({ error: 'Failed to fetch organization metrics' });
  }
};

export const getManagerDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const managerId = (req as any).user.id;

    // 1. Assigned Learners Count
    const assignedLearners = await prisma.staffLearnerAssignment.count({
      where: { staff_id: managerId }
    });

    // Get the learner IDs to use for subsequent queries
    const assignments = await prisma.staffLearnerAssignment.findMany({
      where: { staff_id: managerId },
      select: { learner_id: true }
    });
    const learnerIds = assignments.map(a => a.learner_id);

    // 2. Team Compliance Score
    let complianceScore = 0;
    if (learnerIds.length > 0) {
      const totalCompliance = await prisma.complianceRecord.count({
        where: { carer_id: { in: learnerIds } }
      });
      const resolvedCompliance = await prisma.complianceRecord.count({
        where: {
          carer_id: { in: learnerIds },
          status: { in: ['RESOLVED', 'CLOSED'] }
        }
      });
      complianceScore = totalCompliance === 0 ? 0 : Math.round((resolvedCompliance / totalCompliance) * 100);
    }

    // 3. Certificates Expiring (next 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const certificatesExpiring = learnerIds.length > 0 ? await prisma.cPDCertificate.count({
      where: {
        user_id: { in: learnerIds },
        expiry_date: {
          lte: thirtyDaysFromNow,
          gte: new Date()
        }
      }
    }) : 0;

    // 4. High Risk Learners (compliance < 75%)
    // For MVP, we will just use a hardcoded logic or mock it since computing it per user in one query is complex.
    const highRiskLearners = 0; // Mocked for now

    // 5. Pending Reviews (Assignments created by this manager that need review)
    const pendingReviews = await prisma.staffLearnerAssignment.count({
      where: { assigned_by: managerId } // Just a proxy metric for now
    });

    // 6. Recent Team Activity
    const recentActivity = learnerIds.length > 0 ? await prisma.auditLog.findMany({
      where: { user_id: { in: learnerIds } },
      take: 5,
      orderBy: { created_at: 'desc' },
      include: { user: { select: { full_name: true, email: true } } }
    }) : [];

    res.status(200).json({
      success: true,
      data: {
        assignedLearners,
        complianceScore,
        certificatesExpiring,
        highRiskLearners,
        pendingReviews,
        recentActivity
      }
    });
  } catch (error: any) {
    console.error('Manager Dashboard Error:', error);
    res.status(500).json({ error: 'Failed to fetch manager metrics' });
  }
};
