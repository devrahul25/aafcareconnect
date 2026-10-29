// @ts-nocheck
// ─── Professional Passport Data & Dynamic Calculation Utilities ───────────────

export const LEVEL_SYSTEM = [
  { name: "Bronze Learner",       minPoints: 0,   color: "from-amber-700 to-amber-500",   textColor: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200", icon: "🥉" },
  { name: "Silver Practitioner",  minPoints: 30,  color: "from-slate-500 to-slate-400",   textColor: "text-slate-600",  bg: "bg-slate-100", border: "border-slate-200", icon: "🥈" },
  { name: "Gold Practitioner",    minPoints: 60,  color: "from-amber-500 to-yellow-400",  textColor: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-300", icon: "🥇" },
  { name: "Advanced Practitioner",minPoints: 80,  color: "from-blue-600 to-indigo-600",   textColor: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200",  icon: "⭐" },
  { name: "Expert Professional",  minPoints: 100, color: "from-violet-600 to-purple-700", textColor: "text-violet-700", bg: "bg-violet-50", border: "border-violet-200", icon: "💎" },
  { name: "Care Champion",        minPoints: 130, color: "from-rose-600 to-pink-600",     textColor: "text-rose-700",   bg: "bg-rose-50",   border: "border-rose-200",  icon: "🏆" },
];

export const SKILL_LEVEL_LABELS = ["", "Beginner", "Intermediate", "Proficient", "Advanced", "Expert"];

export function daysUntil(d) {
  if (!d) return 0;
  return Math.ceil((new Date(d).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export function fmt(d) {
  if (!d) return "—";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function yearsFrom(d) {
  if (!d) return 0;
  const date = new Date(d);
  if (isNaN(date.getTime())) return 0;
  const yrs = Math.floor((Date.now() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  return Math.max(0, yrs);
}

/**
 * Calculates current level, level progress percentage, and points to next level.
 */
export function calculateLevel(points = 0) {
  let idx = 0;
  for (let i = LEVEL_SYSTEM.length - 1; i >= 0; i--) {
    if (points >= LEVEL_SYSTEM[i].minPoints) {
      idx = i;
      break;
    }
  }
  const current = LEVEL_SYSTEM[idx];
  const next = LEVEL_SYSTEM[idx + 1] || null;

  let levelProgress = 100;
  let pointsToNext = 0;
  let nextLevel = "Mastery Achieved";

  if (next) {
    const range = next.minPoints - current.minPoints;
    const earnedInRange = points - current.minPoints;
    levelProgress = Math.min(100, Math.max(0, Math.round((earnedInRange / range) * 100)));
    pointsToNext = Math.max(0, next.minPoints - points);
    nextLevel = next.name;
  }

  return {
    level: current.name,
    levelProgress,
    pointsToNext,
    nextLevel,
    levelCfg: current,
  };
}

/**
 * Normalizes certificate record for consistent rendering.
 */
export function normalizeCertificate(cert) {
  const expiry = cert.expiry_date || cert.expiry;
  const issued = cert.issue_date || cert.issued || cert.created_at;
  const days = daysUntil(expiry);

  let status = "valid";
  if (expiry) {
    if (days <= 0 || cert.status === "EXPIRED" || cert.status === "expired") {
      status = "expired";
    } else if (days <= 90 || cert.status === "EXPIRING_SOON" || cert.status === "expiring_soon") {
      status = "expiring_soon";
    }
  }

  return {
    id: cert.id || `CERT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    title: cert.title || "Accredited Training Course",
    provider: cert.provider || "Accredited Provider",
    category: cert.category || "General Care",
    issued: issued ? new Date(issued).toISOString() : new Date().toISOString(),
    expiry: expiry ? new Date(expiry).toISOString() : null,
    hours: Number(cert.cpd_hours ?? cert.hours ?? 0),
    status,
    verified: Boolean(cert.verified ?? (status !== "expired")),
    badge: cert.badge || `${cert.category || "Care"} Qualified`,
    certificate_url: cert.certificate_url || cert.url || null,
  };
}

/**
 * Dynamically computes Skills Radar from actual completed courses and certificates.
 */
export function buildDynamicSkills({ certificates = [], enrolments = [] }) {
  const DOMAINS = [
    { skill: "Safeguarding", keywords: ["safeguarding", "child protection", "safe care", "cse", "prevent"] },
    { skill: "Therapeutic Care", keywords: ["therapeutic", "trauma", "attachment", "fostering", "parenting", "nurture"] },
    { skill: "Health & Safety", keywords: ["first aid", "health", "safety", "fire", "infection", "medical", "medication"] },
    { skill: "Mental Health", keywords: ["mental health", "wellbeing", "emotional", "resilience", "psychology", "mind"] },
    { skill: "Communication", keywords: ["communication", "listening", "advocacy", "de-escalation", "conflict"] },
    { skill: "Equality & Diversity", keywords: ["equality", "diversity", "inclusion", "edi", "cultural", "identity"] },
    { skill: "Legislation & Standards", keywords: ["regulation", "legislation", "law", "standards", "ofsted", "policy"] },
    { skill: "Practice Skills", keywords: ["practice", "life story", "record keeping", "recording", "placement", "skills"] },
  ];

  // Extract all text tokens from completed or enrolled items
  const completedEnrolments = enrolments.filter(e => e.status === "COMPLETED");
  const allTraining = [
    ...certificates.map(c => `${c.title || ""} ${c.category || ""} ${c.provider || ""}`.toLowerCase()),
    ...completedEnrolments.map(e => `${e.course?.title || ""} ${e.course?.category || ""}`.toLowerCase()),
  ];

  return DOMAINS.map(d => {
    let matches = 0;
    allTraining.forEach(text => {
      if (d.keywords.some(kw => text.includes(kw))) {
        matches += 1;
      }
    });

    // Level calculation: 1 (Beginner) to 5 (Expert)
    let level = 1;
    if (matches >= 4) level = 5;
    else if (matches === 3) level = 4;
    else if (matches === 2) level = 3;
    else if (matches === 1) level = 2;

    return {
      skill: d.skill,
      level,
      maxLevel: 5,
      matches,
    };
  });
}

/**
 * Dynamically computes achievements based on real user performance.
 */
export function buildDynamicAchievements({ profile, certificates = [], enrolments = [] }) {
  const completedEnrolments = enrolments.filter(e => e.status === "COMPLETED");
  const cpdHours = profile?.cpdHours || 0;
  const certCount = certificates.length;
  const compCount = completedEnrolments.length;
  const complianceScore = profile?.complianceScore ?? 100;

  const hasSafeguarding = certificates.some(c => (c.title || "").toLowerCase().includes("safeguard")) ||
    completedEnrolments.some(e => (e.course?.title || "").toLowerCase().includes("safeguard"));

  const hasTherapeutic = certificates.some(c => (c.title || "").toLowerCase().includes("therapeutic") || (c.title || "").toLowerCase().includes("trauma")) ||
    completedEnrolments.some(e => (e.course?.title || "").toLowerCase().includes("therapeutic"));

  const list = [
    {
      id: "passport_active",
      icon: "🌟",
      label: "Passport Activated",
      desc: "Registered and active on AAF CareConnect Professional Passport",
      tier: "bronze",
      earned: true,
    },
    {
      id: "first_enrolment",
      icon: "📚",
      label: "First Course Enrolled",
      desc: "Enrolled in first professional training course",
      tier: "bronze",
      earned: enrolments.length >= 1,
    },
    {
      id: "first_cert",
      icon: "🏅",
      label: "First Certificate",
      desc: "Earned or uploaded first CPD certificate",
      tier: "bronze",
      earned: certCount >= 1,
    },
    {
      id: "cpd_10",
      icon: "⏱️",
      label: "10 CPD Hours",
      desc: "Accumulated 10+ hours of continuous professional development",
      tier: "bronze",
      earned: cpdHours >= 10,
    },
    {
      id: "active_learner",
      icon: "🔥",
      label: "Course Graduate",
      desc: "Successfully completed an accredited learning course",
      tier: "silver",
      earned: compCount >= 1,
    },
    {
      id: "5_certs",
      icon: "🎓",
      label: "5 Certificates Milestone",
      desc: "Earned 5 professional CPD certificates",
      tier: "silver",
      earned: certCount >= 5,
    },
    {
      id: "cpd_50",
      icon: "⚡",
      label: "50 CPD Hours",
      desc: "Completed 50+ hours of professional development",
      tier: "silver",
      earned: cpdHours >= 50,
    },
    {
      id: "course_master",
      icon: "📖",
      label: "Course Master",
      desc: "Successfully completed 3 or more courses",
      tier: "silver",
      earned: compCount >= 3,
    },
    {
      id: "sg_champ",
      icon: "🛡️",
      label: "Safeguarding Champion",
      desc: "Completed accredited safeguarding qualification",
      tier: "gold",
      earned: hasSafeguarding,
    },
    {
      id: "tp_expert",
      icon: "💛",
      label: "Therapeutic Practitioner",
      desc: "Certified in Therapeutic Parenting or Trauma-Informed Care",
      tier: "gold",
      earned: hasTherapeutic,
    },
    {
      id: "compliance",
      icon: "✅",
      label: "Compliance Excellence",
      desc: "Maintained 90%+ compliance rating",
      tier: "gold",
      earned: complianceScore >= 90,
    },
    {
      id: "100_cpd",
      icon: "🚀",
      label: "100 CPD Hours",
      desc: "Completed 100+ hours of accredited professional training",
      tier: "gold",
      earned: cpdHours >= 100,
    },
    {
      id: "care_champ",
      icon: "❤️",
      label: "Care Champion",
      desc: "Achieved 50+ CPD hours and 95%+ overall compliance score",
      tier: "platinum",
      earned: cpdHours >= 50 && complianceScore >= 95,
    },
    {
      id: "expert_prof",
      icon: "💎",
      label: "Expert Professional",
      desc: "Reached Expert or Master level in CareConnect progression",
      tier: "platinum",
      earned: cpdHours >= 100 && certCount >= 10,
    },
  ];

  return list;
}

/**
 * Dynamically builds career journey timeline from real account creation, course enrolments, and certificates.
 */
export function buildDynamicTimeline({ user, certificates = [], enrolments = [], level = "Bronze Learner" }) {
  const events = [];

  // Account creation / Joined Agency
  if (user?.created_at || user?.startDate) {
    const d = new Date(user.created_at || user.startDate);
    events.push({
      year: d.getFullYear(),
      month: d.toLocaleString("en-GB", { month: "short" }),
      date: d.getTime(),
      title: `Joined ${user.organisation || user.organization?.name || "AAF CareConnect"}`,
      desc: `Registered professional profile as ${user.role || "Practitioner"}`,
      type: "milestone",
      icon: "🏠",
    });
  }

  // Course enrolments & completions
  enrolments.forEach(e => {
    if (e.status === "COMPLETED" && (e.completed_at || e.updated_at)) {
      const d = new Date(e.completed_at || e.updated_at);
      events.push({
        year: d.getFullYear(),
        month: d.toLocaleString("en-GB", { month: "short" }),
        date: d.getTime(),
        title: `Completed ${e.course?.title || "Training Course"}`,
        desc: `Passed accredited course (${Math.round((e.course?.duration_minutes || 60) / 60)} hrs CPD)`,
        type: "cert",
        icon: "🎓",
      });
    } else if (e.created_at || e.enrolled_at) {
      const d = new Date(e.created_at || e.enrolled_at);
      events.push({
        year: d.getFullYear(),
        month: d.toLocaleString("en-GB", { month: "short" }),
        date: d.getTime(),
        title: `Enrolled in ${e.course?.title || "Course"}`,
        desc: `Progress: ${e.progress_percent || 0}% complete`,
        type: "milestone",
        icon: "📖",
      });
    }
  });

  // CPD Certificates
  certificates.forEach(c => {
    const issued = c.issue_date || c.issued || c.created_at;
    if (issued) {
      const d = new Date(issued);
      events.push({
        year: d.getFullYear(),
        month: d.toLocaleString("en-GB", { month: "short" }),
        date: d.getTime(),
        title: c.title || "CPD Certificate Awarded",
        desc: `${c.provider || "Accredited Training"} · ${c.cpd_hours || c.hours || 0} hrs CPD`,
        type: "cert",
        icon: "🏅",
      });
    }
  });

  // Current Level milestone
  if (level && level !== "Bronze Learner") {
    const d = new Date();
    events.push({
      year: d.getFullYear(),
      month: d.toLocaleString("en-GB", { month: "short" }),
      date: d.getTime(),
      title: `${level} Achieved`,
      desc: `Attained ${level} status on AAF CareConnect Professional Passport`,
      type: "level",
      icon: "🥇",
    });
  }

  // Fallback if no events
  if (events.length === 0) {
    const d = new Date();
    events.push({
      year: d.getFullYear(),
      month: d.toLocaleString("en-GB", { month: "short" }),
      date: d.getTime(),
      title: "Passport Initialised",
      desc: "Welcome to AAF CareConnect Professional Passport. Complete courses to build your career journey.",
      type: "milestone",
      icon: "🏠",
    });
  }

  // Sort newest first
  return events.sort((a, b) => (b.date || 0) - (a.date || 0));
}

/**
 * Dynamically builds compliance items from real certificates and enrolments.
 */
export function buildDynamicCompliance({ certificates = [], enrolments = [] }) {
  const items = [];

  // Core mandatory standards mapping
  const CORE_MANDATORY = [
    { title: "Safeguarding Children: Level 2", key: "safeguard", mandatory: true },
    { title: "Paediatric First Aid", key: "first aid", mandatory: true },
    { title: "Health & Safety in Care", key: "health", mandatory: true },
    { title: "Equality, Diversity & Inclusion", key: "equality", mandatory: false },
    { title: "Data Protection & GDPR", key: "gdpr", mandatory: true },
  ];

  // Map user certificates
  certificates.forEach(c => {
    const norm = normalizeCertificate(c);
    let status = "compliant";
    if (norm.status === "expired") status = "expired";
    else if (norm.status === "expiring_soon") status = "action";

    items.push({
      title: norm.title,
      status,
      expiry: norm.expiry,
      mandatory: (norm.category || "").toLowerCase().includes("safeguard") || norm.title.toLowerCase().includes("first aid"),
      provider: norm.provider,
    });
  });

  // For any core mandatory standard not covered by a certificate, check enrolments
  CORE_MANDATORY.forEach(req => {
    const existing = items.find(i => i.title.toLowerCase().includes(req.key));
    if (!existing) {
      const matchEnrolment = enrolments.find(e => (e.course?.title || "").toLowerCase().includes(req.key));
      if (matchEnrolment) {
        const isComp = matchEnrolment.status === "COMPLETED";
        items.push({
          title: matchEnrolment.course?.title || req.title,
          status: isComp ? "compliant" : "action",
          expiry: null,
          mandatory: req.mandatory,
          provider: "AAF CareConnect",
        });
      } else {
        // Required standard pending training
        items.push({
          title: req.title,
          status: req.mandatory ? "action" : "compliant",
          expiry: null,
          mandatory: req.mandatory,
          provider: "Required Standard",
        });
      }
    }
  });

  return items;
}

/**
 * Dynamically generates AI Coach recommendations based on actual user data.
 */
export function buildDynamicRecommendations({ profile, certificates = [], enrolments = [], courses = [] }) {
  const recs = [];

  // 1. Check for expired certificates
  const expiredCerts = certificates.filter(c => {
    const days = daysUntil(c.expiry_date || c.expiry);
    return days <= 0 || c.status === "EXPIRED" || c.status === "expired";
  });

  if (expiredCerts.length > 0) {
    const c = expiredCerts[0];
    recs.push({
      priority: "urgent",
      icon: "🎯",
      title: `Renew ${c.title}`,
      detail: `Your certificate for ${c.title} has expired. This is an essential requirement for Ofsted compliance. Renewal required to maintain valid status.`,
      action: "Renew in CPD Hub",
      link: "/cpd-certificates",
    });
  }

  // 2. Check for expiring soon certificates
  const expiringCerts = certificates.filter(c => {
    const days = daysUntil(c.expiry_date || c.expiry);
    return days > 0 && days <= 90;
  });

  if (expiringCerts.length > 0) {
    const c = expiringCerts[0];
    const days = daysUntil(c.expiry_date || c.expiry);
    recs.push({
      priority: "high",
      icon: "⚠️",
      title: `Upcoming Renewal: ${c.title}`,
      detail: `Your certification expires in ${days} days. Completing refresher training now will prevent any compliance gap.`,
      action: "View Certificate",
      link: "/cpd-certificates",
    });
  }

  // 3. In-progress courses
  const inProgress = enrolments.find(e => e.status === "IN_PROGRESS" || (e.status === "ENROLLED" && (e.progress_percent || 0) > 0));
  if (inProgress) {
    recs.push({
      priority: "high",
      icon: "📚",
      title: `Resume ${inProgress.course?.title || "Course"}`,
      detail: `You have completed ${inProgress.progress_percent || 0}% of this module. Finishing it will award accredited CPD hours towards your next professional milestone.`,
      action: "Continue Learning",
      link: inProgress.course_id ? `/learning-hub/course/${inProgress.course_id}` : "/learning-hub",
    });
  }

  // 4. Level progression advice
  if (profile?.pointsToNext > 0 && profile?.nextLevel) {
    recs.push({
      priority: "medium",
      icon: "⭐",
      title: `Advance to ${profile.nextLevel}`,
      detail: `You need ${profile.pointsToNext} more points to achieve ${profile.nextLevel} status. Completing training courses or earning verified CPD certificates directly contributes points.`,
      action: "Explore Courses",
      link: "/learning-hub",
    });
  }

  // 5. Default encouraging guidance if all clean
  if (recs.length === 0) {
    recs.push({
      priority: "medium",
      icon: "🌟",
      title: "Maintain Professional Growth",
      detail: "Your compliance and certificates are up to date! Continue expanding your specialisms with advanced practice courses in the Learning Hub.",
      action: "Browse Hub",
      link: "/learning-hub",
    });
  }

  return recs;
}

// Fallback profile object for graceful component loading
export const PASSPORT_PROFILE = {
  id: "AAF-PAS-2026-LIVE",
  name: "Practitioner",
  role: "Social Care Practitioner",
  organisation: "AAF CareConnect",
  startDate: new Date().toISOString(),
  avatar: "PP",
  avatarColor: "from-blue-600 to-indigo-700",
  email: "",
  phone: "—",
  location: "United Kingdom",
  languages: ["English"],
  specialisms: ["Safeguarding", "Therapeutic Care", "Care Planning"],
  bio: "Dedicated social care and fostering practitioner committed to quality care and continuous professional development.",
  cpdHours: 0,
  certificates: 0,
  complianceScore: 100,
  skillsScore: 0,
  learningStreak: 1,
  level: "Bronze Learner",
  levelProgress: 0,
  pointsToNext: 30,
  nextLevel: "Silver Practitioner",
};