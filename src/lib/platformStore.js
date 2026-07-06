// @ts-nocheck
/**
 * AAF CareConnect™ — DEMO DATA STORE
 *
 * ⚠️  This file contains DEMO / PREVIEW data only.
 * ⚠️  It is NOT used in live multi-tenant mode.
 *
 * For real data, use the scoped functions in lib/orgData.js.
 * All live entity queries must go through those functions so that
 * organisation_id filtering is enforced on every call.
 */

// ─── Utility helpers (shared — safe to use anywhere) ─────────────────────────
export function daysUntil(d) { return Math.ceil((new Date(d) - new Date()) / 86400000); }
export function fmt(d) { return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }); }
export function yearsFrom(d) { return Math.floor((new Date() - new Date(d)) / (365.25 * 24 * 60 * 60 * 1000)); }

export function getProfessionalLevel(user) {
  const levels = [
    { name: "Bronze Learner",        minScore: 0,  icon: "🥉", color: "from-amber-700 to-amber-500",  text: "text-amber-700"  },
    { name: "Silver Practitioner",   minScore: 50, icon: "🥈", color: "from-slate-500 to-slate-400",  text: "text-slate-600"  },
    { name: "Gold Practitioner",     minScore: 70, icon: "🥇", color: "from-amber-500 to-yellow-400", text: "text-amber-600"  },
    { name: "Advanced Practitioner", minScore: 85, icon: "⭐", color: "from-blue-600 to-indigo-600",  text: "text-blue-700"   },
    { name: "Expert Professional",   minScore: 93, icon: "💎", color: "from-violet-600 to-purple-700",text: "text-violet-700" },
    { name: "Care Champion",         minScore: 98, icon: "🏆", color: "from-rose-600 to-pink-600",    text: "text-rose-700"   },
  ];
  const score = Math.round(((user.complianceScore || 0) + (user.skillsScore || 0)) / 2);
  return [...levels].reverse().find(l => score >= l.minScore) || levels[0];
}

export const SYNC_BADGE = "🔄 Auto Updated";
export const LIVE_BADGE = "⚡ Live Data";

// ─── DEMO ORGANISATION ────────────────────────────────────────────────────────
export const DEMO_ORGANISATION = {
  id: "demo-org-001",
  name: "Shining Stars Fostering Agency",
  shortName: "Shining Stars",
  type: "Independent Fostering Agency",
  ofstedNumber: "SC012345",
  email: "info@shiningstars.org.uk",
  phone: "01234 567890",
  website: "www.shiningstars.org.uk",
  address: "12 Victoria Street, Manchester, M1 1AA",
  status: "active",
};

// Legacy alias — kept so components that still import ORGANISATION don't break
// while pages are progressively migrated to useAuth() + orgData.js.
export const ORGANISATION = DEMO_ORGANISATION;

// ─── DEMO USERS ───────────────────────────────────────────────────────────────
export const DEMO_PLATFORM_USERS = [
  { id: "u01", name: "Emma Clarke",    email: "e.clarke@shiningstars.org.uk",   avatar: "EC", avatarColor: "bg-emerald-600", role: "Foster Carer",       orgRole: "learner",       status: "active",   joinDate: "2019-03-12", cpdHours: 142, certificates: 12, complianceScore: 96,  skillsScore: 88,  riskLevel: "low",    mandatoryPct: 100, renewalsDue: 1,  lastActivity: "10 min ago",  passportId: "AAF-PAS-2026-0001", professionalLevel: "Gold Practitioner"      },
  { id: "u02", name: "James Okafor",   email: "j.okafor@shiningstars.org.uk",   avatar: "JO", avatarColor: "bg-amber-500",   role: "Foster Carer",       orgRole: "learner",       status: "active",   joinDate: "2020-06-10", cpdHours: 58,  certificates: 5,  complianceScore: 62,  skillsScore: 55,  riskLevel: "high",   mandatoryPct: 75,  renewalsDue: 2,  lastActivity: "2 min ago",   passportId: "AAF-PAS-2026-0002", professionalLevel: "Bronze Learner"         },
  { id: "u03", name: "Priya Sharma",   email: "p.sharma@shiningstars.org.uk",   avatar: "PS", avatarColor: "bg-blue-600",    role: "Senior Trainer",     orgRole: "trainer",       status: "active",   joinDate: "2018-09-01", cpdHours: 95,  certificates: 8,  complianceScore: 98,  skillsScore: 92,  riskLevel: "low",    mandatoryPct: 100, renewalsDue: 0,  lastActivity: "1 hour ago",  passportId: "AAF-PAS-2026-0003", professionalLevel: "Advanced Practitioner"  },
  { id: "u04", name: "Mark Thompson",  email: "m.thompson@shiningstars.org.uk", avatar: "MT", avatarColor: "bg-rose-600",    role: "Registered Manager", orgRole: "manager",       status: "active",   joinDate: "2017-01-15", cpdHours: 112, certificates: 10, complianceScore: 88,  skillsScore: 85,  riskLevel: "medium", mandatoryPct: 90,  renewalsDue: 1,  lastActivity: "Yesterday",   passportId: "AAF-PAS-2026-0004", professionalLevel: "Gold Practitioner"      },
  { id: "u05", name: "Sarah Mitchell", email: "s.mitchell@shiningstars.org.uk", avatar: "SM", avatarColor: "bg-violet-600",  role: "Social Worker",      orgRole: "administrator", status: "active",   joinDate: "2021-04-20", cpdHours: 78,  certificates: 7,  complianceScore: 100, skillsScore: 94,  riskLevel: "low",    mandatoryPct: 100, renewalsDue: 0,  lastActivity: "Now",         passportId: "AAF-PAS-2026-0005", professionalLevel: "Silver Practitioner"    },
  { id: "u06", name: "Daniel Rees",    email: "d.rees@shiningstars.org.uk",     avatar: "DR", avatarColor: "bg-indigo-600",  role: "Foster Carer",       orgRole: "learner",       status: "active",   joinDate: "2022-02-28", cpdHours: 66,  certificates: 6,  complianceScore: 97,  skillsScore: 78,  riskLevel: "low",    mandatoryPct: 100, renewalsDue: 0,  lastActivity: "Yesterday",   passportId: "AAF-PAS-2026-0006", professionalLevel: "Silver Practitioner"    },
  { id: "u07", name: "Claire Nguyen",  email: "c.nguyen@shiningstars.org.uk",   avatar: "CN", avatarColor: "bg-red-600",     role: "Foster Carer",       orgRole: "learner",       status: "inactive", joinDate: "2021-11-05", cpdHours: 34,  certificates: 4,  complianceScore: 51,  skillsScore: 42,  riskLevel: "high",   mandatoryPct: 60,  renewalsDue: 2,  lastActivity: "2 weeks ago", passportId: "AAF-PAS-2026-0007", professionalLevel: "Bronze Learner"         },
  { id: "u08", name: "Ahmed Hassan",   email: "a.hassan@shiningstars.org.uk",   avatar: "AH", avatarColor: "bg-teal-600",    role: "Social Worker",      orgRole: "learner",       status: "active",   joinDate: "2020-08-15", cpdHours: 88,  certificates: 9,  complianceScore: 95,  skillsScore: 82,  riskLevel: "low",    mandatoryPct: 100, renewalsDue: 1,  lastActivity: "3 hours ago", passportId: "AAF-PAS-2026-0008", professionalLevel: "Silver Practitioner"    },
  { id: "u09", name: "Lucy Pearson",   email: "l.pearson@shiningstars.org.uk",  avatar: "LP", avatarColor: "bg-pink-600",    role: "Support Worker",     orgRole: "learner",       status: "active",   joinDate: "2023-05-10", cpdHours: 28,  certificates: 3,  complianceScore: 74,  skillsScore: 60,  riskLevel: "medium", mandatoryPct: 80,  renewalsDue: 1,  lastActivity: "4 hours ago", passportId: "AAF-PAS-2026-0009", professionalLevel: "Bronze Learner"         },
  { id: "u10", name: "Tom Bradley",    email: "t.bradley@shiningstars.org.uk",  avatar: "TB", avatarColor: "bg-cyan-600",    role: "Foster Carer",       orgRole: "learner",       status: "active",   joinDate: "2022-09-01", cpdHours: 55,  certificates: 5,  complianceScore: 93,  skillsScore: 72,  riskLevel: "low",    mandatoryPct: 100, renewalsDue: 0,  lastActivity: "1 day ago",   passportId: "AAF-PAS-2026-0010", professionalLevel: "Silver Practitioner"    },
];

// Legacy alias
export const PLATFORM_USERS = DEMO_PLATFORM_USERS;

// ─── DEMO CERTIFICATES ────────────────────────────────────────────────────────
export const DEMO_ALL_CERTIFICATES = [
  { id: "cert-001", userId: "u01", courseId: "c01", certNo: "AAF-SG2-A4E9F1", title: "Safeguarding Children: Level 2",    provider: "NSPCC",             issued: "2024-06-01", expiry: "2026-06-01", hours: 6,  category: "Safeguarding",          status: "valid",         verified: true,  mandatory: true  },
  { id: "cert-002", userId: "u01", courseId: "c02", certNo: "AAF-TP1-C5D6E7", title: "Therapeutic Parenting in Practice", provider: "Beacon House",      issued: "2024-01-10", expiry: "2026-01-10", hours: 12, category: "Therapeutic Parenting", status: "valid",         verified: true,  mandatory: false },
  { id: "cert-003", userId: "u01", courseId: "c06", certNo: "AAF-MH1-D8E9F0", title: "Mental Health Awareness",           provider: "Mind",              issued: "2024-03-20", expiry: "2026-06-28", hours: 4,  category: "Mental Health",         status: "expiring_soon", verified: true,  mandatory: false },
  { id: "cert-004", userId: "u01", courseId: "c04", certNo: "AAF-AT1-I3J4K5", title: "Attachment Theory for Carers",      provider: "DDP Institute",     issued: "2024-02-14", expiry: "2026-02-14", hours: 9,  category: "Attachment",            status: "valid",         verified: true,  mandatory: false },
  { id: "cert-005", userId: "u01", courseId: "c05", certNo: "AAF-ED1-E1F2G3", title: "Equality, Diversity & Inclusion",   provider: "CIPD",              issued: "2024-05-01", expiry: "2026-05-01", hours: 3,  category: "Equality & Diversity",  status: "valid",         verified: true,  mandatory: true  },
  { id: "cert-006", userId: "u01", courseId: "c07", certNo: "AAF-FR1-J6K7L8", title: "Fostering Regulations 2024",        provider: "CoramBAAF",         issued: "2024-05-20", expiry: "2026-05-20", hours: 3,  category: "Legislation",           status: "valid",         verified: true,  mandatory: true  },
  { id: "cert-007", userId: "u02", courseId: "c03", certNo: "AAF-FA1-B2C3D4", title: "Paediatric First Aid",              provider: "St John Ambulance", issued: "2023-09-15", expiry: "2024-09-15", hours: 8,  category: "Health & Safety",       status: "expired",       verified: true,  mandatory: true  },
  { id: "cert-008", userId: "u02", courseId: "c09", certNo: "AAF-CS1-F4G5H6", title: "Child Sexual Exploitation (CSE)",   provider: "Barnardos",         issued: "2023-11-30", expiry: "2026-07-20", hours: 5,  category: "Safeguarding",          status: "expiring_soon", verified: false, mandatory: true  },
  { id: "cert-009", userId: "u04", courseId: "c06", certNo: "AAF-MH4-K1L2M3", title: "Mental Health Awareness",           provider: "Mind",              issued: "2024-03-20", expiry: "2026-06-28", hours: 4,  category: "Mental Health",         status: "expiring_soon", verified: true,  mandatory: false },
  { id: "cert-010", userId: "u07", courseId: "c08", certNo: "AAF-LA7-H0I1J2", title: "Looked After Children (LAC)",       provider: "CoramBAAF",         issued: "2022-06-01", expiry: "2023-06-01", hours: 6,  category: "Legislation",           status: "expired",       verified: true,  mandatory: true  },
  { id: "cert-011", userId: "u07", courseId: "c01", certNo: "AAF-SG7-M4N5O6", title: "Safeguarding Level 2",              provider: "NSPCC",             issued: "2022-01-01", expiry: "2024-01-01", hours: 6,  category: "Safeguarding",          status: "expired",       verified: true,  mandatory: true  },
];

// Legacy alias
export const ALL_CERTIFICATES = DEMO_ALL_CERTIFICATES;

// ─── DEMO AUDIT LOG ───────────────────────────────────────────────────────────
export const DEMO_AUDIT_LOG = [
  { id: "a001", timestamp: "2026-06-27T09:12:00", userId: "u01", userName: "Emma Clarke",    action: "course_completed",   detail: "Completed: Safeguarding Children Level 2 — Score 94%",          module: "Learning Hub",         icon: "✅" },
  { id: "a002", timestamp: "2026-06-27T09:12:05", userId: "u01", userName: "Emma Clarke",    action: "certificate_issued", detail: "Certificate issued: AAF-SG2-A4E9F1 — Safeguarding Level 2",     module: "CPD Hub",               icon: "🏅" },
  { id: "a003", timestamp: "2026-06-27T09:12:06", userId: "u01", userName: "Emma Clarke",    action: "compliance_updated", detail: "Compliance score updated to 96%",                                module: "Compliance Hub",        icon: "🛡️" },
  { id: "a004", timestamp: "2026-06-27T09:12:07", userId: "u01", userName: "Emma Clarke",    action: "passport_updated",   detail: "Professional Passport updated: CPD hours +6, certificates +1",   module: "Professional Passport", icon: "📋" },
  { id: "a005", timestamp: "2026-06-26T14:30:00", userId: "u04", userName: "Mark Thompson",  action: "reminder_sent",      detail: "Renewal reminder sent for: Mental Health Awareness",             module: "Compliance Hub",        icon: "🔔" },
  { id: "a006", timestamp: "2026-06-26T11:00:00", userId: "u02", userName: "James Okafor",   action: "certificate_expired",detail: "Certificate expired: Paediatric First Aid (AAF-FA1-B2C3D4)",    module: "Compliance Hub",        icon: "⚠️" },
  { id: "a007", timestamp: "2026-06-26T11:00:01", userId: "u02", userName: "James Okafor",   action: "risk_elevated",      detail: "Risk level elevated to HIGH — expired mandatory certificate",    module: "Compliance Hub",        icon: "🚨" },
  { id: "a008", timestamp: "2026-06-25T09:00:00", userId: "u05", userName: "Sarah Mitchell", action: "course_assigned",    detail: "Course assigned: Fostering Regulations 2024 to James Okafor",  module: "Learning Hub",          icon: "📚" },
  { id: "a009", timestamp: "2026-06-24T16:20:00", userId: "u03", userName: "Priya Sharma",   action: "course_completed",   detail: "Completed: Attachment Theory for Carers — Score 91%",           module: "Learning Hub",          icon: "✅" },
  { id: "a010", timestamp: "2026-06-24T10:00:00", userId: "u04", userName: "Mark Thompson",  action: "report_downloaded",  detail: "Executive Compliance Report downloaded",                         module: "Compliance Hub",        icon: "📊" },
  { id: "a011", timestamp: "2026-06-23T14:15:00", userId: "u07", userName: "Claire Nguyen",  action: "certificate_expired",detail: "Certificate expired: LAC (AAF-LA7-H0I1J2) — 755 days ago",     module: "Compliance Hub",        icon: "🚨" },
  { id: "a012", timestamp: "2026-06-22T09:30:00", userId: "u06", userName: "Daniel Rees",    action: "course_completed",   detail: "Completed: Therapeutic Parenting in Practice — Score 88%",      module: "Learning Hub",          icon: "✅" },
];

// Legacy alias
export const AUDIT_LOG = DEMO_AUDIT_LOG;

// ─── DEMO ALERTS ──────────────────────────────────────────────────────────────
export const DEMO_PLATFORM_ALERTS = [
  { id: "al01", type: "critical", userId: "u02", userName: "James Okafor",  icon: "🚨", title: "First Aid Certificate Expired",        body: "Paediatric First Aid expired 9+ months ago — immediate renewal required.", time: "2 hours ago",  read: false, modules: ["compliance", "admin", "dashboard"] },
  { id: "al02", type: "critical", userId: "u07", userName: "Claire Nguyen", icon: "🚨", title: "High Risk: 2 Certificates Expired",     body: "Claire Nguyen's compliance score has fallen to 51% — high risk.",          time: "1 day ago",    read: false, modules: ["compliance", "admin", "dashboard"] },
  { id: "al03", type: "warning",  userId: "u04", userName: "Mark Thompson", icon: "⚠️", title: "Mental Health Awareness Expiring",      body: "Mark Thompson's certificate expires in 1 day. Reminder sent.",             time: "Today 09:00",  read: true,  modules: ["compliance", "admin", "cpd"]       },
  { id: "al04", type: "warning",  userId: null,  userName: null,            icon: "⚠️", title: "5 Staff: Equality & Diversity Overdue", body: "5 staff members have overdue mandatory Equality & Diversity training.",     time: "2 days ago",   read: true,  modules: ["compliance", "admin"]              },
  { id: "al05", type: "info",     userId: null,  userName: null,            icon: "ℹ️", title: "Compliance Score Improved to 91%",      body: "Agency compliance score improved by 3% this month.",                       time: "3 days ago",   read: true,  modules: ["compliance", "dashboard"]          },
];

// Legacy alias
export const PLATFORM_ALERTS = DEMO_PLATFORM_ALERTS;

// ─── DEMO COURSES ─────────────────────────────────────────────────────────────
export const DEMO_COURSES = [
  { id: "c01", title: "Safeguarding Children: Level 2",  category: "Safeguarding",          level: "Intermediate", cpdHours: 6,  mandatory: true,  status: "published" },
  { id: "c02", title: "Therapeutic Parenting in Practice",category: "Therapeutic Parenting",level: "Intermediate", cpdHours: 12, mandatory: false, status: "published" },
  { id: "c03", title: "Paediatric First Aid",             category: "Health & Safety",       level: "Foundation",   cpdHours: 8,  mandatory: true,  status: "published" },
  { id: "c04", title: "Attachment Theory for Carers",     category: "Attachment",            level: "Intermediate", cpdHours: 9,  mandatory: false, status: "published" },
  { id: "c05", title: "Equality, Diversity & Inclusion",  category: "Equality & Diversity",  level: "Foundation",   cpdHours: 3,  mandatory: true,  status: "published" },
  { id: "c06", title: "Mental Health Awareness",          category: "Mental Health",         level: "Foundation",   cpdHours: 4,  mandatory: false, status: "published" },
  { id: "c07", title: "Fostering Regulations 2024",       category: "Legislation",           level: "Foundation",   cpdHours: 3,  mandatory: true,  status: "published" },
  { id: "c08", title: "Trauma Informed Care",             category: "Therapeutic Parenting", level: "Advanced",     cpdHours: 10, mandatory: false, status: "published" },
  { id: "c09", title: "Child Sexual Exploitation (CSE)",  category: "Safeguarding",          level: "Foundation",   cpdHours: 5,  mandatory: true,  status: "published" },
  { id: "c10", title: "GDPR & Data Protection in Care",   category: "Legislation",           level: "Foundation",   cpdHours: 2,  mandatory: true,  status: "published" },
  { id: "c11", title: "Safe Caring in the Home",          category: "Safeguarding",          level: "Foundation",   cpdHours: 4,  mandatory: true,  status: "published" },
  { id: "c12", title: "Life Story Work",                  category: "Practice Skills",       level: "Advanced",     cpdHours: 8,  mandatory: false, status: "published" },
];

// Legacy alias
export const COURSES = DEMO_COURSES;

// ─── DEMO derived metrics ─────────────────────────────────────────────────────
export function getAgencyMetrics() {
  const total = DEMO_PLATFORM_USERS.length;
  const fullyCompliant = DEMO_PLATFORM_USERS.filter(u => u.complianceScore >= 90).length;
  const highRisk = DEMO_PLATFORM_USERS.filter(u => u.riskLevel === "high").length;
  const expiring = DEMO_ALL_CERTIFICATES.filter(c => c.status === "expiring_soon").length;
  const expired = DEMO_ALL_CERTIFICATES.filter(c => c.status === "expired").length;
  const totalCpdHours = DEMO_PLATFORM_USERS.reduce((s, u) => s + u.cpdHours, 0);
  const avgCompliance = Math.round(DEMO_PLATFORM_USERS.reduce((s, u) => s + u.complianceScore, 0) / total);
  const unreadAlerts = DEMO_PLATFORM_ALERTS.filter(a => !a.read).length;
  return { total, fullyCompliant, highRisk, expiring, expired, totalCpdHours, avgCompliance, unreadAlerts };
}

export function getUserCertificates(userId) { return DEMO_ALL_CERTIFICATES.filter(c => c.userId === userId); }
export function getUserAlerts(userId) { return DEMO_PLATFORM_ALERTS.filter(a => !a.userId || a.userId === userId); }
export function getUserAuditLog(userId) { return DEMO_AUDIT_LOG.filter(a => a.userId === userId); }

export function getComplianceExplainer(user) {
  const reasons = [];
  if (user.riskLevel === "high") {
    const exp = DEMO_ALL_CERTIFICATES.filter(c => c.userId === user.id && c.status === "expired" && c.mandatory);
    exp.forEach(c => reasons.push(`❌ ${c.title} has expired (mandatory)`));
  }
  if (user.mandatoryPct < 100) reasons.push(`⚠️ ${100 - user.mandatoryPct}% of mandatory training is incomplete`);
  if (user.renewalsDue > 0) reasons.push(`🔔 ${user.renewalsDue} certificate renewal${user.renewalsDue > 1 ? "s" : ""} due soon`);
  if (reasons.length === 0 && user.complianceScore >= 90) reasons.push("✅ All mandatory requirements are current");
  return reasons;
}