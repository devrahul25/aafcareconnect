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
    let orgId = req.params.orgId as string;
    const authUser = (req as any).user;

    if (!orgId || orgId === 'current' || orgId === 'null' || orgId === 'undefined' || orgId === 'default') {
      orgId = authUser?.organization_id || authUser?.organization?.id;
    }

    if (!orgId) {
      const firstOrg = await prisma.organization.findFirst();
      if (firstOrg) {
        orgId = firstOrg.id;
      }
    }

    if (!orgId) {
      res.status(404).json({ error: 'Organization not found' });
      return;
    }

    const [organization, users, certificates, enrolments, auditLogs] = await Promise.all([
      prisma.organization.findUnique({
        where: { id: orgId },
        include: { subscriptions: { orderBy: { created_at: 'desc' }, take: 1 } }
      }),
      prisma.user.findMany({
        where: { organization_id: orgId, status: 'ACTIVE' },
        include: { user_roles: { include: { role: true } } }
      }),
      prisma.cPDCertificate.findMany({
        where: { organization_id: orgId }
      }),
      prisma.courseEnrolment.findMany({
        where: { organization_id: orgId },
        include: { 
          user: { select: { id: true, full_name: true, email: true } },
          course: { select: { id: true, title: true, category: true } }
        },
        orderBy: { updated_at: 'desc' }
      }),
      prisma.auditLog.findMany({
        where: { organization_id: orgId },
        take: 10,
        orderBy: { created_at: 'desc' },
        include: { user: { select: { full_name: true, email: true } } }
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
    const expiryDataMap: { month: string; expiring: number; date: Date }[] = [];
    for (let i = 0; i < 4; i++) {
       const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
       expiryDataMap.push({
         month: monthNames[d.getMonth()],
         expiring: 0,
         date: d
       });
    }
    certificates.forEach(c => {
      if (c.expiry_date && c.expiry_date >= now) {
         const expDate = new Date(c.expiry_date);
         expiryDataMap.forEach(item => {
           if (expDate.getFullYear() === item.date.getFullYear() && expDate.getMonth() === item.date.getMonth()) {
             item.expiring++;
           }
         });
      }
    });
    const expiryData = expiryDataMap.map(({ month, expiring }) => ({ month, expiring }));

    // Trend Data Chart (last 6 months)
    const trendDataMap: { month: string; assigned: number; completed: number; date: Date }[] = [];
    for (let i = 5; i >= 0; i--) {
       const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
       trendDataMap.push({
         month: monthNames[d.getMonth()],
         assigned: 0,
         completed: 0,
         date: d
       });
    }
    
    enrolments.forEach(e => {
       const eDate = new Date(e.enrolled_date || e.created_at);
       const cDate = e.completed_date ? new Date(e.completed_date) : null;

       trendDataMap.forEach(item => {
         if (eDate.getFullYear() === item.date.getFullYear() && eDate.getMonth() === item.date.getMonth()) {
           item.assigned++;
         }
         if (e.status === 'COMPLETED' && cDate && cDate.getFullYear() === item.date.getFullYear() && cDate.getMonth() === item.date.getMonth()) {
           item.completed++;
         }
       });
    });
    const trendData = trendDataMap.map(({ month, assigned, completed }) => ({ month, assigned, completed }));

    // Compliance Data Chart (by Course Category)
    const categoryStats: Record<string, { total: number, completed: number }> = {};
    enrolments.forEach(e => {
       const cat = e.course?.category || 'General';
       if (!categoryStats[cat]) categoryStats[cat] = { total: 0, completed: 0 };
       categoryStats[cat].total++;
       if (e.status === 'COMPLETED') categoryStats[cat].completed++;
    });
    
    let complianceData = Object.keys(categoryStats).map(label => {
       const pct = Math.round((categoryStats[label].completed / categoryStats[label].total) * 100);
       return { label, pct };
    }).sort((a, b) => b.pct - a.pct).slice(0, 5);

    if (complianceData.length === 0) {
      const courses = await prisma.course.findMany({ select: { category: true } });
      const uniqueCats = Array.from(new Set(courses.map(c => c.category).filter(Boolean)));
      if (uniqueCats.length > 0) {
        complianceData = uniqueCats.slice(0, 4).map(cat => ({ label: cat, pct: 0 }));
      }
    }

    // Average compliance across all enrolments
    const totalEnrolments = enrolments.length;
    const completedEnrolments = enrolments.filter(e => e.status === 'COMPLETED').length;
    const avgCompliance = totalEnrolments === 0 ? 0 : Math.round((completedEnrolments / totalEnrolments) * 100);

    // Fully compliant & high risk calculation
    let fullyCompliant = 0;
    let highRisk = 0;
    const learnerUsers = users.filter(u => u.user_roles.some(ur => ur.role.name === 'learner'));
    
    learnerUsers.forEach(u => {
      const uEnrolments = enrolments.filter(e => e.user_id === u.id);
      const uCerts = certificates.filter(c => c.user_id === u.id);
      const hasExpired = uCerts.some(c => c.expiry_date && c.expiry_date < now);

      if (uEnrolments.length > 0) {
        const comp = uEnrolments.filter(e => e.status === 'COMPLETED').length;
        const pct = comp / uEnrolments.length;
        if (pct === 1 && !hasExpired) {
          fullyCompliant++;
        } else if (pct < 0.75 || hasExpired) {
          highRisk++;
        }
      } else if (hasExpired) {
        highRisk++;
      }
    });

    // Recent Activity Feed
    const activityList: any[] = [];

    enrolments.slice(0, 10).forEach(e => {
      const userName = e.user?.full_name || e.user?.email?.split('@')[0] || 'Learner';
      const courseTitle = e.course?.title || 'Course';
      if (e.status === 'COMPLETED') {
        activityList.push({
          id: `enrol-comp-${e.id}`,
          name: userName,
          action: 'completed',
          item: courseTitle,
          score: e.score !== null && e.score !== undefined ? `${e.score}%` : null,
          type: 'completed',
          created_at: e.completed_date || e.updated_at
        });
      } else if (e.status === 'IN_PROGRESS') {
        activityList.push({
          id: `enrol-prog-${e.id}`,
          name: userName,
          action: 'started',
          item: courseTitle,
          score: null,
          type: 'progress',
          created_at: e.updated_at
        });
      } else {
        activityList.push({
          id: `enrol-new-${e.id}`,
          name: userName,
          action: 'enrolled in',
          item: courseTitle,
          score: null,
          type: 'enrolled',
          created_at: e.enrolled_date || e.created_at
        });
      }
    });

    auditLogs.forEach(log => {
      const userName = log.user?.full_name || log.user?.email?.split('@')[0] || 'User';
      let action = 'performed';
      let type = 'general';
      const ev = (log.event_type || '').toLowerCase();
      if (ev.includes('login')) {
        action = 'logged in to';
        type = 'login';
      } else if (ev.includes('download') || ev.includes('certificate')) {
        action = 'downloaded';
        type = 'download';
      } else if (ev.includes('user') || ev.includes('register')) {
        action = 'added as';
        type = 'user';
      } else if (ev.includes('enrol')) {
        action = 'enrolled in';
        type = 'enrolled';
      }
      activityList.push({
        id: `audit-${log.id}`,
        name: userName,
        action: action,
        item: log.description || log.event_type || 'System Event',
        score: null,
        type: type,
        created_at: log.created_at
      });
    });

    activityList.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const recentActivity = activityList.slice(0, 10);

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
        complianceData,
        recentActivity
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
