// @ts-nocheck
// ─── Professional Passport static data ───────────────────────────────────────

export const PASSPORT_PROFILE = {
  id: "AAF-PAS-2026-0001",
  name: "Emma Clarke",
  role: "Senior Foster Carer",
  organisation: "Shining Stars Fostering Agency",
  startDate: "2019-03-12",
  avatar: "EC",
  avatarColor: "from-blue-600 to-indigo-700",
  email: "emma.clarke@shiningstars.org.uk",
  phone: "07700 900123",
  location: "Manchester, UK",
  languages: ["English", "British Sign Language (Basic)"],
  specialisms: [
    "Therapeutic Parenting",
    "Safeguarding",
    "Trauma Informed Care",
    "Disability Support",
    "Mental Health Support",
  ],
  bio: "Experienced foster carer with over 7 years providing therapeutic, trauma-informed care to children aged 4–16. Specialist in managing complex emotional and behavioural needs. Committed to helping children thrive.",
  cpdHours: 142,
  certificates: 12,
  complianceScore: 96,
  skillsScore: 88,
  learningStreak: 18,
  level: "Gold Practitioner",
  levelProgress: 82,
  pointsToNext: 18,
  nextLevel: "Advanced Practitioner",
};

export const LEVEL_SYSTEM = [
  { name: "Bronze Learner",       minPoints: 0,   color: "from-amber-700 to-amber-500",   textColor: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200", icon: "🥉" },
  { name: "Silver Practitioner",  minPoints: 30,  color: "from-slate-500 to-slate-400",   textColor: "text-slate-600",  bg: "bg-slate-100", border: "border-slate-200", icon: "🥈" },
  { name: "Gold Practitioner",    minPoints: 60,  color: "from-amber-500 to-yellow-400",  textColor: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-300", icon: "🥇" },
  { name: "Advanced Practitioner",minPoints: 80,  color: "from-blue-600 to-indigo-600",   textColor: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200",  icon: "⭐" },
  { name: "Expert Professional",  minPoints: 100, color: "from-violet-600 to-purple-700", textColor: "text-violet-700", bg: "bg-violet-50", border: "border-violet-200", icon: "💎" },
  { name: "Care Champion",        minPoints: 130, color: "from-rose-600 to-pink-600",     textColor: "text-rose-700",   bg: "bg-rose-50",   border: "border-rose-200",  icon: "🏆" },
];

export const PASSPORT_CERTS = [
  { id: "AAF-SG2-A4E9F1", title: "Safeguarding Children: Level 2", provider: "NSPCC", issued: "2024-06-01", expiry: "2026-06-01", hours: 6, category: "Safeguarding", status: "valid", verified: true, badge: "Safeguarding Champion" },
  { id: "AAF-TP1-C5D6E7", title: "Therapeutic Parenting in Practice", provider: "Beacon House", issued: "2024-01-10", expiry: "2026-01-10", hours: 12, category: "Therapeutic Parenting", status: "valid", verified: true, badge: "Therapeutic Parenting Practitioner" },
  { id: "AAF-FA1-B2C3D4", title: "Paediatric First Aid", provider: "St John Ambulance", issued: "2023-09-15", expiry: "2024-09-15", hours: 8, category: "Health & Safety", status: "expired", verified: true, badge: "First Aid Certified" },
  { id: "AAF-AT1-I3J4K5", title: "Attachment Theory for Carers", provider: "DDP Institute", issued: "2024-02-14", expiry: "2026-02-14", hours: 9, category: "Attachment", status: "valid", verified: true, badge: "Attachment Specialist" },
  { id: "AAF-MH1-D8E9F0", title: "Mental Health Awareness", provider: "Mind", issued: "2024-03-20", expiry: "2026-06-28", hours: 4, category: "Mental Health", status: "expiring_soon", verified: true, badge: "Mental Health Advocate" },
  { id: "AAF-ED1-E1F2G3", title: "Equality, Diversity & Inclusion", provider: "CIPD", issued: "2024-05-01", expiry: "2026-05-01", hours: 3, category: "Equality & Diversity", status: "valid", verified: true, badge: "Inclusion Champion" },
  { id: "AAF-FR1-J6K7L8", title: "Fostering Regulations 2024", provider: "CoramBAAF", issued: "2024-05-20", expiry: "2026-05-20", hours: 3, category: "Legislation", status: "valid", verified: true, badge: "Legislation Expert" },
  { id: "AAF-TI1-K8L9M0", title: "Trauma Informed Care", provider: "Trauma Foundation", issued: "2023-07-01", expiry: "2025-07-01", hours: 10, category: "Therapeutic Parenting", status: "valid", verified: true, badge: "Trauma Informed Practitioner" },
  { id: "AAF-SC1-L0M1N2", title: "Safer Caring in the Home", provider: "AAF CareConnect", issued: "2024-09-01", expiry: "2026-09-01", hours: 4, category: "Safeguarding", status: "valid", verified: true, badge: "Safe Carer" },
  { id: "AAF-CS1-M2N3O4", title: "Child Sexual Exploitation (CSE)", provider: "Barnardos", issued: "2023-11-30", expiry: "2025-11-30", hours: 5, category: "Safeguarding", status: "valid", verified: true, badge: "CSE Aware" },
  { id: "AAF-RI1-N4O5P6", title: "Resilience & Wellbeing for Carers", provider: "Fostering Network", issued: "2024-08-10", expiry: "2026-08-10", hours: 6, category: "Practice Skills", status: "valid", verified: false, badge: "Resilience Builder" },
  { id: "AAF-LR1-O6P7Q8", title: "Life Story Work", provider: "CoramBAAF", issued: "2023-03-15", expiry: "2025-03-15", hours: 8, category: "Practice Skills", status: "valid", verified: true, badge: "Life Story Practitioner" },
];

export const CPD_TRANSCRIPT = [
  { date: "2024-09-01", course: "Safer Caring in the Home",         provider: "AAF CareConnect",   hours: 4,  status: "completed" },
  { date: "2024-08-10", course: "Resilience & Wellbeing for Carers",provider: "Fostering Network", hours: 6,  status: "completed" },
  { date: "2024-06-01", course: "Safeguarding Children: Level 2",   provider: "NSPCC",             hours: 6,  status: "completed" },
  { date: "2024-05-20", course: "Fostering Regulations 2024",       provider: "CoramBAAF",         hours: 3,  status: "completed" },
  { date: "2024-05-01", course: "Equality, Diversity & Inclusion",  provider: "CIPD",              hours: 3,  status: "completed" },
  { date: "2024-03-20", course: "Mental Health Awareness",          provider: "Mind",              hours: 4,  status: "completed" },
  { date: "2024-02-14", course: "Attachment Theory for Carers",     provider: "DDP Institute",     hours: 9,  status: "completed" },
  { date: "2024-01-10", course: "Therapeutic Parenting in Practice",provider: "Beacon House",      hours: 12, status: "completed" },
  { date: "2023-11-30", course: "Child Sexual Exploitation (CSE)",  provider: "Barnardos",         hours: 5,  status: "completed" },
  { date: "2023-09-15", course: "Paediatric First Aid",             provider: "St John Ambulance", hours: 8,  status: "completed" },
  { date: "2023-07-01", course: "Trauma Informed Care",             provider: "Trauma Foundation", hours: 10, status: "completed" },
  { date: "2023-03-15", course: "Life Story Work",                  provider: "CoramBAAF",         hours: 8,  status: "completed" },
  { date: "2022-11-01", course: "Safeguarding Children: Level 1",   provider: "NSPCC",             hours: 4,  status: "completed" },
  { date: "2022-08-20", course: "Understanding Attachment",         provider: "DDP Institute",     hours: 6,  status: "completed" },
  { date: "2022-06-01", course: "Looked After Children (LAC)",      provider: "CoramBAAF",         hours: 6,  status: "completed" },
  { date: "2022-03-10", course: "Introduction to Fostering",        provider: "AAF CareConnect",   hours: 8,  status: "completed" },
  { date: "2021-10-15", course: "First Aid for Children",           provider: "St John Ambulance", hours: 8,  status: "completed" },
  { date: "2021-06-01", course: "Induction to Fostering Programme", provider: "Shining Stars",     hours: 16, status: "completed" },
];

export const SKILLS_RADAR = [
  { skill: "Safeguarding",           level: 4, maxLevel: 5 },
  { skill: "Therapeutic Parenting",  level: 4, maxLevel: 5 },
  { skill: "Communication",          level: 3, maxLevel: 5 },
  { skill: "Trauma Awareness",       level: 4, maxLevel: 5 },
  { skill: "Behaviour Management",   level: 3, maxLevel: 5 },
  { skill: "Mental Health",          level: 3, maxLevel: 5 },
  { skill: "First Aid",              level: 2, maxLevel: 5 },
  { skill: "Legislation",            level: 4, maxLevel: 5 },
];

export const SKILL_LEVEL_LABELS = ["", "Beginner", "Intermediate", "Proficient", "Advanced", "Expert"];

export const ACHIEVEMENTS = [
  { id: "cpd_100",     icon: "⚡", label: "100 CPD Hours",               desc: "Completed 100+ hours of professional development",    tier: "gold",   earned: true  },
  { id: "sg_champ",    icon: "🛡️", label: "Safeguarding Champion",        desc: "Completed 3+ safeguarding qualifications",             tier: "gold",   earned: true  },
  { id: "streak_30",   icon: "🔥", label: "Learning Streak: 30 Days",     desc: "30 consecutive days of learning activity",             tier: "silver", earned: true  },
  { id: "tp_expert",   icon: "💛", label: "Therapeutic Parenting Expert", desc: "Achieved Advanced level in Therapeutic Parenting",     tier: "gold",   earned: true  },
  { id: "compliance",  icon: "✅", label: "Compliance Excellence",         desc: "Maintained 95%+ compliance for 12 consecutive months", tier: "gold",   earned: true  },
  { id: "first_cert",  icon: "🏅", label: "First Certificate",            desc: "Uploaded first CPD certificate",                      tier: "bronze", earned: true  },
  { id: "5_certs",     icon: "🎓", label: "5 Certificates Earned",        desc: "Earned 5 professional certificates",                   tier: "silver", earned: true  },
  { id: "10_certs",    icon: "🏆", label: "10 Certificates Milestone",    desc: "Earned 10 professional certificates",                  tier: "gold",   earned: true  },
  { id: "care_champ",  icon: "❤️", label: "Care Champion",                desc: "Recognised for outstanding practice",                  tier: "platinum", earned: false },
  { id: "mentor",      icon: "🤝", label: "Peer Mentor",                  desc: "Mentored 3+ new carers through onboarding",            tier: "silver", earned: false },
  { id: "all_skills",  icon: "🌟", label: "All-Round Practitioner",       desc: "Achieved Proficient+ across all skill areas",          tier: "gold",   earned: false },
  { id: "cpd_150",     icon: "🚀", label: "150 CPD Hours",                desc: "Completed 150+ hours of professional development",     tier: "platinum", earned: false },
];

export const CAREER_TIMELINE = [
  { year: 2019, month: "Mar", title: "Joined Shining Stars Fostering Agency",      desc: "Commenced fostering assessment and induction programme",       type: "milestone", icon: "🏠" },
  { year: 2019, month: "Sep", title: "First Placement Commenced",                  desc: "Welcomed first child into care — short-term emergency placement", type: "placement", icon: "👶" },
  { year: 2021, month: "Jun", title: "Induction Programme Completed",              desc: "16-hour induction certified by Shining Stars Fostering Agency",   type: "cert",      icon: "🎓" },
  { year: 2021, month: "Oct", title: "First Aid Certified",                        desc: "Paediatric First Aid by St John Ambulance",                      type: "cert",      icon: "🩺" },
  { year: 2022, month: "Jun", title: "LAC Training Completed",                     desc: "Looked After Children qualification — CoramBAAF",                 type: "cert",      icon: "📋" },
  { year: 2022, month: "Nov", title: "Safeguarding Level 1 Achieved",              desc: "NSPCC Safeguarding Level 1 — Foundation",                        type: "cert",      icon: "🛡️" },
  { year: 2023, month: "Mar", title: "Life Story Work Certified",                  desc: "CoramBAAF — Advanced Practice Skills",                           type: "cert",      icon: "📖" },
  { year: 2023, month: "Jul", title: "Trauma Informed Care Certified",             desc: "The Trauma Foundation — 10 hours CPD",                          type: "cert",      icon: "🧠" },
  { year: 2023, month: "Sep", title: "First Aid Renewed",                          desc: "Paediatric First Aid renewal — St John Ambulance",               type: "cert",      icon: "🩺" },
  { year: 2024, month: "Jan", title: "Therapeutic Parenting in Practice",          desc: "12-hour advanced certification — Beacon House",                  type: "cert",      icon: "💛" },
  { year: 2024, month: "Jun", title: "Safeguarding Level 2 Achieved",              desc: "NSPCC Safeguarding Level 2 — Intermediate",                      type: "cert",      icon: "🛡️" },
  { year: 2024, month: "Sep", title: "Promoted to Senior Foster Carer",            desc: "Recognised for outstanding practice by Shining Stars Agency",    type: "milestone", icon: "⭐" },
  { year: 2026, month: "Jun", title: "Gold Practitioner Status Achieved",          desc: "AAF CareConnect Professional Level — Gold Practitioner",          type: "level",     icon: "🥇" },
];

export const COMPLIANCE_ITEMS = [
  { title: "Safeguarding Level 2",            status: "compliant",  expiry: "2026-06-01", mandatory: true  },
  { title: "Paediatric First Aid",            status: "expired",    expiry: "2024-09-15", mandatory: true  },
  { title: "Therapeutic Parenting",           status: "compliant",  expiry: "2026-01-10", mandatory: false },
  { title: "DBS Enhanced Check",             status: "compliant",  expiry: "2027-03-01", mandatory: true  },
  { title: "Annual Review",                  status: "compliant",  expiry: "2026-09-12", mandatory: true  },
  { title: "Mental Health Awareness",        status: "action",     expiry: "2026-06-28", mandatory: false },
  { title: "Safer Caring Plan",              status: "compliant",  expiry: "2025-12-01", mandatory: true  },
  { title: "Medical Check",                  status: "compliant",  expiry: "2026-03-12", mandatory: true  },
  { title: "References Review",             status: "action",     expiry: "2026-07-15", mandatory: false },
  { title: "Equality & Diversity Training", status: "compliant",  expiry: "2026-05-01", mandatory: false },
];

export const AI_COACH_RECS = [
  { priority: "urgent", icon: "🎯", title: "Renew Paediatric First Aid", detail: "Your First Aid certificate expired in September 2024. This is a mandatory requirement for Ofsted compliance. Renewal required immediately to maintain your placement.", action: "Find Course" },
  { priority: "high",   icon: "⭐", title: "Complete Advanced Safeguarding to reach Advanced Practitioner", detail: "You need 18 points to reach Advanced Practitioner status. Completing an Advanced Safeguarding module would award 12 points and close a critical skills gap.", action: "Start Course" },
  { priority: "medium", icon: "🧠", title: "Sensory Processing & Regulation", detail: "Your Behaviour Management skill is at Proficient level. This course would advance it to Advanced and unlock the Behaviour Specialist achievement badge.", action: "Explore" },
  { priority: "medium", icon: "💬", title: "DDP Dyadic Developmental Psychotherapy", detail: "Your Attachment skills are strong. DDP Level 1 would position you for Expert Professional status and is highly valued by fostering agencies.", action: "Explore" },
];

export function daysUntil(d) { return Math.ceil((new Date(d) - new Date()) / 86400000); }
export function fmt(d) { return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }); }
export function yearsFrom(d) { return Math.floor((new Date() - new Date(d)) / (365.25 * 24 * 60 * 60 * 1000)); }