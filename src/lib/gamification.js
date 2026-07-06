// Gamification data + helpers for AAF CareConnect™ Learning Hub
export const LEVELS = [
  { level: 1, minXp: 0,    title: "Newly Registered" },
  { level: 2, minXp: 250,  title: "Carer in Training" },
  { level: 3, minXp: 600,  title: "Practised Carer" },
  { level: 4, minXp: 1200, title: "Skilled Carer" },
  { level: 5, minXp: 2000, title: "Expert Carer" },
  { level: 6, minXp: 3000, title: "Fostering Champion" },
];

export const BADGES = [
  { id: "first_steps",   name: "First Steps",            icon: "Footprints",     color: "emerald", desc: "Complete your first lesson",        tier: "bronze" },
  { id: "first_course",  name: "First Course",           icon: "Award",          color: "blue",    desc: "Complete your first course",        tier: "bronze" },
  { id: "streak_7",      name: "Week of Dedication",     icon: "Flame",           color: "orange",  desc: "Maintain a 7-day streak",            tier: "silver" },
  { id: "streak_30",     name: "Unstoppable",            icon: "Flame",           color: "red",     desc: "30-day learning streak",            tier: "gold" },
  { id: "xp_500",        name: "Knowledge Builder",      icon: "BookOpen",        color: "violet",  desc: "Earn 500 XP",                       tier: "silver" },
  { id: "xp_1500",       name: "Scholar",                 icon: "GraduationCap",   color: "indigo",  desc: "Earn 1500 XP",                      tier: "gold" },
  { id: "safeguarding",  name: "Safeguarding Certified", icon: "ShieldCheck",     color: "blue",    desc: "Pass a Safeguarding course",        tier: "gold" },
  { id: "early_bird",    name: "Early Bird",             icon: "Sunrise",         color: "amber",   desc: "Complete a lesson before 9am",      tier: "bronze" },
  { id: "five_courses",  name: "Five Complete",          icon: "Trophy",          color: "violet",  desc: "Finish 5 courses",                  tier: "gold" },
  { id: "perfect_score", name: "Perfectionist",          icon: "Star",            color: "amber",   desc: "Score 100% on an assessment",       tier: "gold" },
];

export const MILESTONES = [
  { id: "m1", label: "Complete your first course",  target: 1,    type: "courses", reward: 100 },
  { id: "m2", label: "Complete 3 courses",         target: 3,    type: "courses", reward: 200 },
  { id: "m3", label: "Earn 1,000 XP",              target: 1000, type: "xp",      reward: 0 },
  { id: "m4", label: "Maintain a 7-day streak",     target: 7,    type: "streak",  reward: 150 },
  { id: "m5", label: "Earn 5 achievement badges",  target: 5,    type: "badges",  reward: 100 },
  { id: "m6", label: "Complete 5 courses",         target: 5,    type: "courses", reward: 300 },
];

export function computeLevel(xp) {
  let level = 1, title = LEVELS[0].title, minXp = 0, next = null;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].minXp) {
      level = LEVELS[i].level;
      title = LEVELS[i].title;
      minXp = LEVELS[i].minXp;
      next = LEVELS[i + 1] || null;
    }
  }
  const span = next ? next.minXp - minXp : 1;
  const progressPct = next ? Math.min(100, Math.round(((xp - minXp) / span) * 100)) : 100;
  return { level, title, minXp, nextXp: next ? next.minXp : minXp, progressPct, isMax: !next };
}

// Per-learner gamification profiles (demo data, keyed by LEARNERS id in LearningHub)
export const LEARNER_GAMIFICATION = {
  1: { xp: 1540, streakDays: 18, coursesCompleted: 4, earnedBadges: ["first_steps","first_course","streak_7","xp_500","xp_1500","safeguarding","early_bird","five_courses"], weekActivity: [true,true,true,true,true,true,false] },
  2: { xp: 720,  streakDays: 5,  coursesCompleted: 3, earnedBadges: ["first_steps","first_course","xp_500","safeguarding"], weekActivity: [true,false,true,true,false,true,false] },
  3: { xp: 680,  streakDays: 9,  coursesCompleted: 2, earnedBadges: ["first_steps","first_course","streak_7","early_bird"], weekActivity: [true,true,false,true,true,true,false] },
  4: { xp: 890,  streakDays: 3,  coursesCompleted: 4, earnedBadges: ["first_steps","first_course","xp_500","five_courses"], weekActivity: [true,false,false,true,false,true,false] },
  5: { xp: 1310, streakDays: 22, coursesCompleted: 3, earnedBadges: ["first_steps","first_course","streak_7","xp_500","xp_1500","safeguarding","early_bird"], weekActivity: [true,true,true,true,true,true,true] },
  6: { xp: 1660, streakDays: 14, coursesCompleted: 5, earnedBadges: ["first_steps","first_course","streak_7","xp_500","xp_1500","safeguarding","five_courses","perfect_score"], weekActivity: [true,true,true,false,true,true,true] },
  7: { xp: 210,  streakDays: 0,  coursesCompleted: 1, earnedBadges: ["first_steps"], weekActivity: [false,false,true,false,false,false,false] },
};

// The logged-in learner's own progress (My Progress tab)
export const CURRENT_PROGRESS = {
  xp: 1240,
  streakDays: 12,
  coursesCompleted: 3,
  earnedBadges: ["first_steps","first_course","streak_7","xp_500","safeguarding","early_bird"],
  weekActivity: [true, true, true, false, true, true, false],
  joinedDate: "2025-09-01",
  recentCompletion: {
    course: "Safeguarding Children — Level 2",
    date: "2026-06-23",
    xpEarned: 300,
    newBadges: ["safeguarding"],
  },
};