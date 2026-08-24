import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const orgId = '233bdbbc-413b-44f4-b6f4-72394de4e22a';
  const [users, certificates, enrolments] = await Promise.all([
    prisma.user.findMany({ where: { organization_id: orgId, status: 'ACTIVE' } }),
    prisma.cPDCertificate.findMany({ where: { organization_id: orgId } }),
    prisma.courseEnrolment.findMany({
      where: { organization_id: orgId },
      include: { course: { select: { category: true } } }
    })
  ]);

  const total = users.length;
  let totalCpdHours = 0;
  
  const now = new Date();
  let expiring = 0;
  let expired = 0;

  certificates.forEach(c => {
    totalCpdHours += (c.cpd_hours || 0);
    if (c.expiry_date) {
      if (c.expiry_date < now) {
         expired++;
      } else {
         const daysToExpiry = (c.expiry_date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
         if (daysToExpiry <= 90) expiring++;
      }
    }
  });

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
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

  const totalEnrolments = enrolments.length;
  const completedEnrolments = enrolments.filter(e => e.status === 'COMPLETED').length;
  const avgCompliance = totalEnrolments === 0 ? 0 : Math.round((completedEnrolments / totalEnrolments) * 100);

  const fullyCompliant = 0;
  const highRisk = 0;

  console.log(JSON.stringify({
    total, fullyCompliant, expiring, expired, highRisk, avgCompliance, totalCpdHours,
    trendData, expiryData, complianceData
  }, null, 2));
}

main().finally(() => prisma.$disconnect());
