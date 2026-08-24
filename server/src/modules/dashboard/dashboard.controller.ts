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

    const [organization, users, certificates, enrolments] = await Promise.all([
      prisma.organization.findUnique({
        where: { id: orgId as string },
        include: { subscriptions: { orderBy: { created_at: 'desc' }, take: 1 } }
      }),
      prisma.user.findMany({ where: { organization_id: orgId, status: 'ACTIVE' }, include: { user_roles: { include: { role: true } } } }),
      prisma.cPDCertificate.findMany({ where: { organization_id: orgId } }),
      prisma.courseEnrolment.findMany({
        where: { organization_id: orgId },
        include: { course: { select: { category: true } } }
      })
    ]);

    if (!organization) {
      res.status(404).json({ error: 'Organization not found' });
      return;
    }

    const activeLearners = users.filter(u => u.user_roles.some(ur => ur.role.name === 'learner')).length;
    const activeStaff = users.filter(u => u.user_roles.some(ur => ['org_admin', 'manager', 'trainer'].includes(ur.role.name))).length;
    const total = users.length;

    let totalCpdHours = 0;
    const now = new Date();
    let expiring = 0;
    let expired = 0;

    certificates.forEach(c => {
      totalCpdHours += (c.cpd_hours || 0);
      if (c.expiry_date) {
        if (c.expiry_date < now || c.status === 'EXPIRED') {
           expired++;
        } else {
           const daysToExpiry = (c.expiry_date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
           if (daysToExpiry <= 90 || c.status === 'EXPIRING_SOON') expiring++;
        }
      }
    });

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Expiry Data Chart (next 4 months)
    const expiryDataMap: Record<string, number> = {};
    for (let i = 0; i < 4; i++) {
       const m = new Date(now.getFullYear(), now.getMonth() + i, 1);
       expiryDataMap[monthNames[m.getMonth()]] = 0;
    }
    certificates.forEach(c => {
      if (c.expiry_date && c.expiry_date > now) {
         const mName = monthNames[c.expiry_date.getMonth()];
         if (expiryDataMap[mName] !== undefined) {
             expiryDataMap[mName]++;
         }
      }
    });
    const expiryData = Object.keys(expiryDataMap).map(month => ({ month, expiring: expiryDataMap[month] }));

    // Trend Data Chart (last 6 months)
    const trendDataMap: Record<string, { assigned: number, completed: number }> = {};
    for (let i = 5; i >= 0; i--) {
       const m = new Date(now.getFullYear(), now.getMonth() - i, 1);
       trendDataMap[monthNames[m.getMonth()]] = { assigned: 0, completed: 0 };
    }
    
    enrolments.forEach(e => {
       const enrolledMonth = monthNames[e.enrolled_date.getMonth()];
       if (trendDataMap[enrolledMonth] !== undefined) {
          trendDataMap[enrolledMonth].assigned++;
       }
       if (e.status === 'COMPLETED' && e.completed_date) {
          const completedMonth = monthNames[e.completed_date.getMonth()];
          if (trendDataMap[completedMonth] !== undefined) {
             trendDataMap[completedMonth].completed++;
          }
       }
    });
    const trendData = Object.keys(trendDataMap).map(month => ({ month, ...trendDataMap[month] }));

    // Compliance Data Chart (by Course Category)
    const categoryStats: Record<string, { total: number, completed: number }> = {};
    enrolments.forEach(e => {
       const cat = e.course?.category || 'General';
       if (!categoryStats[cat]) categoryStats[cat] = { total: 0, completed: 0 };
       categoryStats[cat].total++;
       if (e.status === 'COMPLETED') categoryStats[cat].completed++;
    });
    
    const complianceData = Object.keys(categoryStats).map(label => {
       const pct = Math.round((categoryStats[label].completed / categoryStats[label].total) * 100);
       return { label, pct };
    }).sort((a, b) => b.pct - a.pct).slice(0, 5);

    // Average compliance across all enrolments
    const totalEnrolments = enrolments.length;
    const completedEnrolments = enrolments.filter(e => e.status === 'COMPLETED').length;
    const avgCompliance = totalEnrolments === 0 ? 0 : Math.round((completedEnrolments / totalEnrolments) * 100);

    const fullyCompliant = 0; // Mocked for now
    const highRisk = 0; // Mocked for now

    res.status(200).json({
      success: true,
      data: {
        organization,
        activeLearners,
        activeStaff,
        total,
        fullyCompliant,
        expiring,
        expired,
        highRisk,
        avgCompliance,
        totalCpdHours,
        trendData,
        expiryData,
        complianceData
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
