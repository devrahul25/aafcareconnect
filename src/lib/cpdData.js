// @ts-nocheck
// ─── Shared CPD data used across all Professional Development Centre components ─

export const CERTS = [
  { id: 1,  certId: "AAF-SG2-A4E9F1", person: "Emma Clarke",    avatar:"EC", color:"bg-emerald-600", title: "Safeguarding Children: Level 2",     provider: "NSPCC",             issued: "2024-06-01", expiry: "2026-06-01", hours: 6,  category: "Safeguarding",          status: "valid",         verified: true  },
  { id: 2,  certId: "AAF-FA1-B2C3D4", person: "James Okafor",   avatar:"JO", color:"bg-amber-500",   title: "Paediatric First Aid",               provider: "St John Ambulance", issued: "2023-09-15", expiry: "2024-09-15", hours: 8,  category: "Health & Safety",       status: "expired",       verified: true  },
  { id: 3,  certId: "AAF-TP1-C5D6E7", person: "Priya Sharma",   avatar:"PS", color:"bg-blue-600",    title: "Therapeutic Parenting in Practice",  provider: "Beacon House",      issued: "2024-01-10", expiry: "2026-01-10", hours: 12, category: "Therapeutic Parenting", status: "valid",         verified: false },
  { id: 4,  certId: "AAF-MH1-D8E9F0", person: "Mark Thompson",  avatar:"MT", color:"bg-rose-600",    title: "Mental Health Awareness",            provider: "Mind",              issued: "2024-03-20", expiry: "2026-06-28", hours: 4,  category: "Mental Health",         status: "expiring_soon", verified: true  },
  { id: 5,  certId: "AAF-ED1-E1F2G3", person: "Sarah Mitchell", avatar:"SM", color:"bg-violet-600",  title: "Equality, Diversity & Inclusion",    provider: "CIPD",              issued: "2024-05-01", expiry: "2026-05-01", hours: 3,  category: "Equality & Diversity",  status: "valid",         verified: true  },
  { id: 6,  certId: "AAF-CS1-F4G5H6", person: "James Okafor",   avatar:"JO", color:"bg-amber-500",   title: "Child Sexual Exploitation (CSE)",    provider: "Barnardos",         issued: "2023-11-30", expiry: "2026-07-20", hours: 5,  category: "Safeguarding",          status: "expiring_soon", verified: false },
  { id: 7,  certId: "AAF-MI1-G7H8I9", person: "Daniel Rees",    avatar:"DR", color:"bg-indigo-600",  title: "Motivational Interviewing",          provider: "BASW",              issued: "2024-04-12", expiry: "2026-04-12", hours: 7,  category: "Practice Skills",       status: "valid",         verified: true  },
  { id: 8,  certId: "AAF-LA1-H0I1J2", person: "Claire Nguyen",  avatar:"CN", color:"bg-red-600",     title: "Looked After Children (LAC)",        provider: "CoramBAAF",         issued: "2022-06-01", expiry: "2023-06-01", hours: 6,  category: "Legislation",           status: "expired",       verified: true  },
  { id: 9,  certId: "AAF-AT1-I3J4K5", person: "Emma Clarke",    avatar:"EC", color:"bg-emerald-600", title: "Attachment Theory for Carers",       provider: "DDP Institute",     issued: "2024-02-14", expiry: "2026-02-14", hours: 9,  category: "Attachment",            status: "valid",         verified: false },
  { id: 10, certId: "AAF-FR1-J6K7L8", person: "Sarah Mitchell", avatar:"SM", color:"bg-violet-600",  title: "Fostering Regulations 2024",         provider: "CoramBAAF",         issued: "2024-05-20", expiry: "2026-05-20", hours: 3,  category: "Legislation",           status: "valid",         verified: true  },
];

export const PEOPLE = [...new Set(CERTS.map(c => c.person))];
export const CATS = ["All","Safeguarding","Therapeutic Parenting","Health & Safety","Mental Health","Legislation","Equality & Diversity","Practice Skills","Attachment"];

export function daysUntil(d) { return Math.ceil((new Date(d) - new Date()) / 86400000); }
export function fmt(d) { return new Date(d).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" }); }
export function fmtShort(d) { return new Date(d).toLocaleDateString("en-GB", { month:"short", year:"numeric" }); }

// CPD timeline events for the learner journey
export const CPD_TIMELINE = [
  { date: "2022-06-01", title: "Looked After Children (LAC)", provider: "CoramBAAF", hours: 6, category: "Legislation", icon: "📋" },
  { date: "2023-09-15", title: "Paediatric First Aid", provider: "St John Ambulance", hours: 8, category: "Health & Safety", icon: "🩺" },
  { date: "2023-11-30", title: "Child Sexual Exploitation (CSE)", provider: "Barnardos", hours: 5, category: "Safeguarding", icon: "🛡️" },
  { date: "2024-01-10", title: "Therapeutic Parenting in Practice", provider: "Beacon House", hours: 12, category: "Therapeutic Parenting", icon: "💛" },
  { date: "2024-02-14", title: "Attachment Theory for Carers", provider: "DDP Institute", hours: 9, category: "Attachment", icon: "🤝" },
  { date: "2024-03-20", title: "Mental Health Awareness", provider: "Mind", hours: 4, category: "Mental Health", icon: "🧠" },
  { date: "2024-04-12", title: "Motivational Interviewing", provider: "BASW", hours: 7, category: "Practice Skills", icon: "💬" },
  { date: "2024-05-01", title: "Equality, Diversity & Inclusion", provider: "CIPD", hours: 3, category: "Equality & Diversity", icon: "🌈" },
  { date: "2024-05-20", title: "Fostering Regulations 2024", provider: "CoramBAAF", hours: 3, category: "Legislation", icon: "⚖️" },
  { date: "2024-06-01", title: "Safeguarding Children: Level 2", provider: "NSPCC", hours: 6, category: "Safeguarding", icon: "🛡️" },
];

// Skills Matrix competency data
export const SKILLS_MATRIX = [
  {
    category: "Safeguarding",
    color: "bg-blue-600",
    lightColor: "bg-blue-50",
    textColor: "text-blue-700",
    skills: [
      { name: "Recognising Abuse & Neglect", level: 4, maxLevel: 5 },
      { name: "CSE & Online Safety", level: 3, maxLevel: 5 },
      { name: "Safer Caring Planning", level: 4, maxLevel: 5 },
      { name: "Allegations Management", level: 2, maxLevel: 5 },
    ]
  },
  {
    category: "Therapeutic Parenting",
    color: "bg-violet-600",
    lightColor: "bg-violet-50",
    textColor: "text-violet-700",
    skills: [
      { name: "Attachment Theory", level: 4, maxLevel: 5 },
      { name: "Trauma-Informed Care", level: 3, maxLevel: 5 },
      { name: "Therapeutic Communication", level: 3, maxLevel: 5 },
      { name: "DDP Principles", level: 2, maxLevel: 5 },
    ]
  },
  {
    category: "Legislation",
    color: "bg-indigo-600",
    lightColor: "bg-indigo-50",
    textColor: "text-indigo-700",
    skills: [
      { name: "Children Act 1989/2004", level: 4, maxLevel: 5 },
      { name: "Fostering Regulations 2011", level: 5, maxLevel: 5 },
      { name: "NMS for Fostering 2022", level: 4, maxLevel: 5 },
      { name: "GDPR & Information Sharing", level: 3, maxLevel: 5 },
    ]
  },
  {
    category: "Health & Safety",
    color: "bg-emerald-600",
    lightColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    skills: [
      { name: "Paediatric First Aid", level: 3, maxLevel: 5 },
      { name: "Risk Assessment", level: 4, maxLevel: 5 },
      { name: "Medication Management", level: 3, maxLevel: 5 },
      { name: "Fire Safety", level: 4, maxLevel: 5 },
    ]
  },
  {
    category: "Equality & Diversity",
    color: "bg-pink-600",
    lightColor: "bg-pink-50",
    textColor: "text-pink-700",
    skills: [
      { name: "Cultural Identity", level: 4, maxLevel: 5 },
      { name: "Anti-Discriminatory Practice", level: 3, maxLevel: 5 },
      { name: "Language & Communication", level: 4, maxLevel: 5 },
      { name: "LGBTQ+ Inclusive Care", level: 2, maxLevel: 5 },
    ]
  },
  {
    category: "Trauma & Attachment",
    color: "bg-amber-600",
    lightColor: "bg-amber-50",
    textColor: "text-amber-700",
    skills: [
      { name: "ACEs & Adverse Experiences", level: 4, maxLevel: 5 },
      { name: "Grief & Loss", level: 3, maxLevel: 5 },
      { name: "Sensory Processing", level: 2, maxLevel: 5 },
      { name: "Emotional Regulation", level: 3, maxLevel: 5 },
    ]
  },
];

export const LEVEL_LABELS = ["", "Awareness", "Foundation", "Proficient", "Advanced", "Expert"];

// Learner achievements / badges
export const CPD_ACHIEVEMENTS = [
  { id: "first_cert",    icon: "🏅", label: "First Certificate",    desc: "Uploaded your first CPD certificate",         earned: true  },
  { id: "safeguarding",  icon: "🛡️", label: "Safeguarding Champion", desc: "Completed 3+ safeguarding courses",           earned: true  },
  { id: "marathon",      icon: "⚡", label: "CPD Marathon",          desc: "Earned 50+ CPD hours",                        earned: true  },
  { id: "streak",        icon: "🔥", label: "Learning Streak",       desc: "3 consecutive months of CPD activity",        earned: true  },
  { id: "all_areas",     icon: "🌟", label: "Well Rounded",          desc: "Completed training in 5+ skill categories",   earned: false },
  { id: "legislation",   icon: "⚖️", label: "Legislation Expert",    desc: "Expert level in Legislation category",        earned: false },
  { id: "full_passport", icon: "🎓", label: "Professional Passport", desc: "Completed Professional Passport",             earned: false },
  { id: "mentor",        icon: "🤝", label: "Peer Mentor",           desc: "Supported 3+ new carers through onboarding",  earned: false },
];

// AI Coach recommendations
export const AI_RECOMMENDATIONS = [
  {
    id: 1,
    title: "Trauma-Informed Care: Advanced Practitioner",
    provider: "The Trauma Foundation",
    reason: "Your Trauma & Attachment skill gap is at level 2 for Sensory Processing — this course targets that directly.",
    priority: "high",
    hours: 8,
    category: "Therapeutic Parenting",
    dueContext: "Recommended before next annual review",
  },
  {
    id: 2,
    title: "Paediatric First Aid Renewal",
    provider: "St John Ambulance",
    reason: "James Okafor's First Aid certificate expired in September. Renewal required for placement compliance.",
    priority: "urgent",
    hours: 8,
    category: "Health & Safety",
    dueContext: "Overdue — expired 9 months ago",
  },
  {
    id: 3,
    title: "LADO Referral & Allegation Management",
    provider: "BASW",
    reason: "Allegations Management is at level 2 across the team. This is a statutory requirement for IFAs.",
    priority: "medium",
    hours: 4,
    category: "Safeguarding",
    dueContext: "Recommended within 60 days",
  },
  {
    id: 4,
    title: "Digital Parenting & Online Safety",
    provider: "Internet Watch Foundation",
    reason: "Online safety competency is unaddressed in your skills matrix — newly mandatory for Ofsted inspection.",
    priority: "medium",
    hours: 3,
    category: "Safeguarding",
    dueContext: "Recommended before next inspection",
  },
];

// Renewal reminders schedule
export const RENEWAL_REMINDERS = [
  { certId: 4,  person: "Mark Thompson",  title: "Mental Health Awareness",         expiry: "2026-06-28", daysLeft: 2,   trigger: "7 days",  sent: true  },
  { certId: 6,  person: "James Okafor",   title: "Child Sexual Exploitation (CSE)", expiry: "2026-07-20", daysLeft: 24,  trigger: "30 days", sent: true  },
  { certId: 2,  person: "James Okafor",   title: "Paediatric First Aid",            expiry: "2024-09-15", daysLeft: -283, trigger: "expired", sent: true  },
  { certId: 8,  person: "Claire Nguyen",  title: "Looked After Children (LAC)",     expiry: "2023-06-01", daysLeft: -755, trigger: "expired", sent: false },
];

// Agency compliance data for manager analytics
export const AGENCY_COMPLIANCE = [
  { month: "Jan", compliant: 78, atRisk: 14, expired: 8 },
  { month: "Feb", compliant: 80, atRisk: 12, expired: 8 },
  { month: "Mar", compliant: 82, atRisk: 11, expired: 7 },
  { month: "Apr", compliant: 79, atRisk: 13, expired: 8 },
  { month: "May", compliant: 85, atRisk: 9,  expired: 6 },
  { month: "Jun", compliant: 83, atRisk: 10, expired: 7 },
];

export const LEARNER_COMPLIANCE = [
  { name: "Emma Clarke",    role: "Foster Carer",  certs: 2, valid: 2, expiring: 0, expired: 0, hours: 15, compliant: true  },
  { name: "James Okafor",  role: "Foster Carer",  certs: 2, valid: 0, expiring: 1, expired: 1, hours: 13, compliant: false },
  { name: "Priya Sharma",  role: "Trainer",        certs: 1, valid: 1, expiring: 0, expired: 0, hours: 12, compliant: true  },
  { name: "Mark Thompson", role: "Manager",        certs: 1, valid: 0, expiring: 1, expired: 0, hours: 4,  compliant: false },
  { name: "Sarah Mitchell",role: "Social Worker",  certs: 2, valid: 2, expiring: 0, expired: 0, hours: 6,  compliant: true  },
  { name: "Daniel Rees",   role: "Foster Carer",  certs: 1, valid: 1, expiring: 0, expired: 0, hours: 7,  compliant: true  },
  { name: "Claire Nguyen", role: "Foster Carer",  certs: 1, valid: 0, expiring: 0, expired: 1, hours: 6,  compliant: false },
];