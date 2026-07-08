// @ts-nocheck
/**
 * AAF CareConnect™ — Shared Utility Helpers
 *
 * This file contains pure utility functions that are safe to use anywhere.
 * All live entity data must come from the API via lib/orgData.js or
 * the React Query hooks in src/hooks/ — never hardcoded here.
 */

// ─── Date Utilities ───────────────────────────────────────────────────────────

/** Returns the number of days from today until date `d`. */
export function daysUntil(d) {
  return Math.ceil((new Date(d) - new Date()) / 86400000);
}

/** Formats a date as "01 Jan 2025" (en-GB locale). */
export function fmt(d) {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

/** Returns the number of full years from date `d` until today. */
export function yearsFrom(d) {
  return Math.floor((new Date() - new Date(d)) / (365.25 * 24 * 60 * 60 * 1000));
}

// ─── Gamification Utilities ───────────────────────────────────────────────────

/**
 * Returns the professional level badge for a user based on their combined
 * compliance + skills score. Used by the Professional Passport page.
 */
export function getProfessionalLevel(user) {
  const levels = [
    { name: 'Bronze Learner',        minScore: 0,  icon: '🥉', color: 'from-amber-700 to-amber-500',  text: 'text-amber-700'  },
    { name: 'Silver Practitioner',   minScore: 50, icon: '🥈', color: 'from-slate-500 to-slate-400',  text: 'text-slate-600'  },
    { name: 'Gold Practitioner',     minScore: 70, icon: '🥇', color: 'from-amber-500 to-yellow-400', text: 'text-amber-600'  },
    { name: 'Advanced Practitioner', minScore: 85, icon: '⭐', color: 'from-blue-600 to-indigo-600',  text: 'text-blue-700'   },
    { name: 'Expert Professional',   minScore: 93, icon: '💎', color: 'from-violet-600 to-purple-700', text: 'text-violet-700' },
    { name: 'Care Champion',         minScore: 98, icon: '🏆', color: 'from-rose-600 to-pink-600',    text: 'text-rose-700'   },
  ];
  const score = Math.round(((user.complianceScore || 0) + (user.skillsScore || 0)) / 2);
  return [...levels].reverse().find((l) => score >= l.minScore) || levels[0];
}

// ─── STUBS FOR UI COMPONENTS ──────────────────────────────────────────────────
// These empty arrays and stub functions prevent crashes in components that
// haven't been fully migrated away from the static demo data yet.

export const DEMO_PLATFORM_USERS = [];
export const DEMO_ALL_CERTIFICATES = [];
export const DEMO_PLATFORM_ALERTS = [];
export const DEMO_ORGANISATION = null;
export const AUDIT_LOG = [];
export const getUserCertificates = () => [];
export const getUserAuditLog = () => [];
export const getComplianceExplainer = () => null;
export const getAgencyMetrics = () => ({
  total: 0,
  fullyCompliant: 0,
  expiring: 0,
  expired: 0,
  highRisk: 0,
  avgCompliance: 0,
  totalCpdHours: 0
});