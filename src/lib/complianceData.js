// @ts-nocheck
// ─── Compliance Hub data ───────────────────────────────────────────────────

export function daysUntil(d) { return Math.ceil((new Date(d) - new Date()) / 86400000); }
export function fmt(d) { return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }); }

// Overall agency score
export const AGENCY_SCORE = 91;
export const SCORE_TREND = +3; // +3% vs last month

export const SCORE_HISTORY = [
  { period: "90d ago", score: 84 },
  { period: "60d ago", score: 87 },
  { period: "30d ago", score: 88 },
  { period: "Today",   score: 91 },
];

// Department breakdown
export const DEPT_COMPLIANCE = [
  { name: "Managers",          score: 100, staff: 3,  color: "bg-emerald-600", textColor: "text-emerald-700", bg: "bg-emerald-50" },
  { name: "Social Workers",    score: 97,  staff: 6,  color: "bg-emerald-500", textColor: "text-emerald-700", bg: "bg-emerald-50" },
  { name: "Foster Carers",     score: 94,  staff: 18, color: "bg-blue-500",    textColor: "text-blue-700",    bg: "bg-blue-50"    },
  { name: "Residential Staff", score: 91,  staff: 9,  color: "bg-blue-400",    textColor: "text-blue-700",    bg: "bg-blue-50"    },
  { name: "Support Staff",     score: 89,  staff: 7,  color: "bg-amber-500",   textColor: "text-amber-700",   bg: "bg-amber-50"   },
];

// Staff compliance table
export const STAFF_COMPLIANCE = [
  { id: 1,  name: "Emma Clarke",    avatar: "EC", avatarColor: "bg-emerald-600", role: "Foster Carer",       certs: 12, validCerts: 11, expiring: 1, expired: 0, cpdHours: 142, mandatoryPct: 100, renewalsDue: 1, riskLevel: "low",    score: 96 },
  { id: 2,  name: "James Okafor",   avatar: "JO", avatarColor: "bg-amber-500",   role: "Foster Carer",       certs: 5,  validCerts: 3,  expiring: 1, expired: 1, cpdHours: 58,  mandatoryPct: 75,  renewalsDue: 2, riskLevel: "high",   score: 62 },
  { id: 3,  name: "Priya Sharma",   avatar: "PS", avatarColor: "bg-blue-600",    role: "Senior Trainer",     certs: 8,  validCerts: 8,  expiring: 0, expired: 0, cpdHours: 95,  mandatoryPct: 100, renewalsDue: 0, riskLevel: "low",    score: 98 },
  { id: 4,  name: "Mark Thompson",  avatar: "MT", avatarColor: "bg-rose-600",    role: "Registered Manager", certs: 10, validCerts: 9,  expiring: 1, expired: 0, cpdHours: 112, mandatoryPct: 90,  renewalsDue: 1, riskLevel: "medium", score: 88 },
  { id: 5,  name: "Sarah Mitchell", avatar: "SM", avatarColor: "bg-violet-600",  role: "Social Worker",      certs: 7,  validCerts: 7,  expiring: 0, expired: 0, cpdHours: 78,  mandatoryPct: 100, renewalsDue: 0, riskLevel: "low",    score: 100 },
  { id: 6,  name: "Daniel Rees",    avatar: "DR", avatarColor: "bg-indigo-600",  role: "Foster Carer",       certs: 6,  validCerts: 6,  expiring: 0, expired: 0, cpdHours: 66,  mandatoryPct: 100, renewalsDue: 0, riskLevel: "low",    score: 97 },
  { id: 7,  name: "Claire Nguyen",  avatar: "CN", avatarColor: "bg-red-600",     role: "Foster Carer",       certs: 4,  validCerts: 2,  expiring: 0, expired: 2, cpdHours: 34,  mandatoryPct: 60,  renewalsDue: 2, riskLevel: "high",   score: 51 },
  { id: 8,  name: "Ahmed Hassan",   avatar: "AH", avatarColor: "bg-teal-600",    role: "Social Worker",      certs: 9,  validCerts: 9,  expiring: 0, expired: 0, cpdHours: 88,  mandatoryPct: 100, renewalsDue: 1, riskLevel: "low",    score: 95 },
  { id: 9,  name: "Lucy Pearson",   avatar: "LP", avatarColor: "bg-pink-600",    role: "Support Worker",     certs: 3,  validCerts: 2,  expiring: 1, expired: 0, cpdHours: 28,  mandatoryPct: 80,  renewalsDue: 1, riskLevel: "medium", score: 74 },
  { id: 10, name: "Tom Bradley",    avatar: "TB", avatarColor: "bg-cyan-600",    role: "Foster Carer",       certs: 5,  validCerts: 5,  expiring: 0, expired: 0, cpdHours: 55,  mandatoryPct: 100, renewalsDue: 0, riskLevel: "low",    score: 93 },
];

// Expiring certificates
export const EXPIRING_CERTS = [
  { id: 1,  person: "Mark Thompson",  avatar: "MT", avatarColor: "bg-rose-600",   title: "Mental Health Awareness",         provider: "Mind",              expiry: "2026-06-28", category: "Mental Health",         reminderSent: true  },
  { id: 2,  person: "James Okafor",   avatar: "JO", avatarColor: "bg-amber-500",  title: "Child Sexual Exploitation (CSE)", provider: "Barnardos",         expiry: "2026-07-20", category: "Safeguarding",          reminderSent: true  },
  { id: 3,  person: "Emma Clarke",    avatar: "EC", avatarColor: "bg-emerald-600",title: "Mental Health Awareness",         provider: "Mind",              expiry: "2026-07-30", category: "Mental Health",         reminderSent: false },
  { id: 4,  person: "Lucy Pearson",   avatar: "LP", avatarColor: "bg-pink-600",   title: "Paediatric First Aid",            provider: "St John Ambulance", expiry: "2026-08-10", category: "Health & Safety",       reminderSent: false },
  { id: 5,  person: "James Okafor",   avatar: "JO", avatarColor: "bg-amber-500",  title: "Safeguarding Level 1",            provider: "NSPCC",             expiry: "2026-08-25", category: "Safeguarding",          reminderSent: false },
  { id: 6,  person: "Tom Bradley",    avatar: "TB", avatarColor: "bg-cyan-600",   title: "DBS Enhanced Check",              provider: "DBS Service",       expiry: "2026-09-01", category: "Compliance",            reminderSent: false },
  { id: 7,  person: "Ahmed Hassan",   avatar: "AH", avatarColor: "bg-teal-600",   title: "Equality & Diversity Training",   provider: "CIPD",              expiry: "2026-09-15", category: "Equality & Diversity",  reminderSent: false },
];

// Expired certificates
export const EXPIRED_CERTS = [
  { id: 8,  person: "James Okafor",  avatar: "JO", avatarColor: "bg-amber-500", title: "Paediatric First Aid",        provider: "St John Ambulance", expiry: "2024-09-15", category: "Health & Safety" },
  { id: 9,  person: "Claire Nguyen", avatar: "CN", avatarColor: "bg-red-600",   title: "Looked After Children (LAC)", provider: "CoramBAAF",         expiry: "2023-06-01", category: "Legislation"    },
  { id: 10, person: "Claire Nguyen", avatar: "CN", avatarColor: "bg-red-600",   title: "Safeguarding Level 2",       provider: "NSPCC",             expiry: "2024-01-01", category: "Safeguarding"   },
];

// Mandatory training
export const MANDATORY_TRAINING = [
  { area: "Safeguarding",             required: 43, completed: 41, overdue: 2,  icon: "🛡️" },
  { area: "First Aid",                required: 43, completed: 40, overdue: 3,  icon: "🩺" },
  { area: "GDPR & Data Protection",   required: 43, completed: 43, overdue: 0,  icon: "🔒" },
  { area: "Equality & Diversity",     required: 43, completed: 38, overdue: 5,  icon: "🌈" },
  { area: "Therapeutic Parenting",    required: 27, completed: 25, overdue: 2,  icon: "💛" },
  { area: "Health & Safety",          required: 43, completed: 42, overdue: 1,  icon: "⚠️" },
  { area: "Mental Health Awareness",  required: 43, completed: 39, overdue: 4,  icon: "🧠" },
  { area: "Fire Safety",              required: 43, completed: 43, overdue: 0,  icon: "🔥" },
];

// Ofsted readiness
export const OFSTED_READINESS = [
  { area: "Training Compliance",    score: 94, required: true,  icon: "📚", status: "green"  },
  { area: "Certificate Compliance", score: 88, required: true,  icon: "🏅", status: "amber"  },
  { area: "Staff Compliance",       score: 91, required: true,  icon: "👥", status: "green"  },
  { area: "Policy & Procedures",    score: 96, required: true,  icon: "📋", status: "green"  },
  { area: "Risk Assessments",       score: 89, required: true,  icon: "⚠️", status: "amber"  },
  { area: "Safer Caring Plans",     score: 100, required: true, icon: "🏠", status: "green"  },
  { area: "DBS Checks",             score: 98, required: true,  icon: "🔍", status: "green"  },
  { area: "Annual Reviews",         score: 93, required: true,  icon: "📅", status: "green"  },
];

export const OFSTED_SCORE = Math.round(OFSTED_READINESS.reduce((s,i) => s + i.score, 0) / OFSTED_READINESS.length);

export const OFSTED_ACTIONS = [
  { severity: "red",   text: "James Okafor: First Aid expired — must renew immediately for placement compliance" },
  { severity: "red",   text: "Claire Nguyen: 2 certificates expired — at risk of failing statutory compliance check" },
  { severity: "amber", text: "Mark Thompson: Mental Health Awareness expiring in 1 day — reminder sent" },
  { severity: "amber", text: "5 staff members have overdue Equality & Diversity training" },
  { severity: "green", text: "All DBS checks are current and valid — Ofsted compliant" },
  { severity: "green", text: "Safer Caring Plans: 100% complete across all placements" },
];

// Risk data
export const RISK_ITEMS = [
  { level: "critical", person: "James Okafor",   area: "Safeguarding",   issue: "Paediatric First Aid expired 9+ months ago",       days: -283 },
  { level: "critical", person: "Claire Nguyen",  area: "Legislation",    issue: "LAC certificate expired 2+ years ago",              days: -756 },
  { level: "high",     person: "Claire Nguyen",  area: "Safeguarding",   issue: "Safeguarding Level 2 expired",                      days: -543 },
  { level: "high",     person: "Mark Thompson",  area: "Mental Health",  issue: "Mental Health Awareness expiring in 1 day",         days: 1    },
  { level: "medium",   person: "James Okafor",   area: "Safeguarding",   issue: "CSE certificate expiring in 24 days",               days: 24   },
  { level: "medium",   person: "Emma Clarke",    area: "Mental Health",  issue: "Mental Health Awareness expiring in 34 days",       days: 34   },
  { level: "medium",   person: "Lucy Pearson",   area: "Health & Safety","issue": "First Aid expiring in 44 days",                  days: 44   },
  { level: "low",      person: "Tom Bradley",    area: "Compliance",     issue: "DBS renewal due in 67 days",                        days: 67   },
  { level: "low",      person: "Ahmed Hassan",   area: "Diversity",      issue: "Equality & Diversity renewal due in 80 days",       days: 80   },
];

// Compliance trend chart data
export const COMPLIANCE_TREND = [
  { month: "Jan", score: 84, target: 90 },
  { month: "Feb", score: 85, target: 90 },
  { month: "Mar", score: 87, target: 90 },
  { month: "Apr", score: 86, target: 90 },
  { month: "May", score: 89, target: 90 },
  { month: "Jun", score: 91, target: 90 },
];

// Alert log
export const ALERTS = [
  { id: 1, type: "critical", icon: "🚨", title: "First Aid Certificate Expired",          body: "James Okafor's Paediatric First Aid expired — immediate action required.",                       time: "2 hours ago",  read: false },
  { id: 2, type: "critical", icon: "🚨", title: "Compliance Score Drop — Claire Nguyen",  body: "Claire Nguyen's compliance score has fallen to 51% — high risk status triggered.",               time: "1 day ago",    read: false },
  { id: 3, type: "warning",  icon: "⚠️",  title: "Mental Health Awareness Expiring",      body: "Mark Thompson's Mental Health Awareness certificate expires in 1 day. Reminder sent.",           time: "Today 09:00",  read: true  },
  { id: 4, type: "warning",  icon: "⚠️",  title: "5 Staff: Equality & Diversity Overdue", body: "5 staff members have overdue mandatory Equality & Diversity training. Assign refresher now.",    time: "2 days ago",   read: true  },
  { id: 5, type: "info",     icon: "ℹ️",  title: "Compliance Score Improved to 91%",      body: "Agency compliance score improved by 3% this month. Well done!",                                  time: "3 days ago",   read: true  },
  { id: 6, type: "info",     icon: "ℹ️",  title: "GDPR Training: 100% Complete",          body: "All 43 staff have completed mandatory GDPR & Data Protection training.",                          time: "5 days ago",   read: true  },
];