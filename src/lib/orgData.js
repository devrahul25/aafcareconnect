/**
 * AAF CareConnect™ — Multi-Tenant Scoped Data Layer
 *
 * All functions here accept an `organisationId` and filter every
 * entity query to that org. Nothing is ever returned without it.
 *
 * Usage (in any page/component):
 *   const { organisationId } = useAuth();
 *   const members = await getWorkforceMembers(organisationId);
 */

import { base44 } from "@/api/base44Client";

// ─── Guard ────────────────────────────────────────────────────────────────────
function requireOrg(organisationId) {
  if (!organisationId) throw new Error("organisationId is required for all data queries");
}

// ─── Workforce Members ────────────────────────────────────────────────────────
export async function getWorkforceMembers(organisationId) {
  requireOrg(organisationId);
  return base44.entities.WorkforceMember.filter({ organisation_id: organisationId });
}

export async function getWorkforceMember(organisationId, id) {
  requireOrg(organisationId);
  const record = await base44.entities.WorkforceMember.get(id);
  if (record?.organisation_id !== organisationId) throw new Error("Access denied");
  return record;
}

export async function createWorkforceMember(organisationId, data) {
  requireOrg(organisationId);
  return base44.entities.WorkforceMember.create({ ...data, organisation_id: organisationId });
}

export async function updateWorkforceMember(organisationId, id, data) {
  requireOrg(organisationId);
  const record = await base44.entities.WorkforceMember.get(id);
  if (record?.organisation_id !== organisationId) throw new Error("Access denied");
  return base44.entities.WorkforceMember.update(id, data);
}

// ─── CPD Certificates ─────────────────────────────────────────────────────────
export async function getCPDCertificates(organisationId) {
  requireOrg(organisationId);
  return base44.entities.CPDCertificate.filter({ organisation_id: organisationId });
}

export async function getCPDCertificatesForUser(organisationId, userId) {
  requireOrg(organisationId);
  return base44.entities.CPDCertificate.filter({ organisation_id: organisationId, user_id: userId });
}

export async function createCPDCertificate(organisationId, data) {
  requireOrg(organisationId);
  return base44.entities.CPDCertificate.create({ ...data, organisation_id: organisationId });
}

export async function updateCPDCertificate(organisationId, id, data) {
  requireOrg(organisationId);
  const record = await base44.entities.CPDCertificate.get(id);
  if (record?.organisation_id !== organisationId) throw new Error("Access denied");
  return base44.entities.CPDCertificate.update(id, data);
}

export async function deleteCPDCertificate(organisationId, id) {
  requireOrg(organisationId);
  const record = await base44.entities.CPDCertificate.get(id);
  if (record?.organisation_id !== organisationId) throw new Error("Access denied");
  return base44.entities.CPDCertificate.delete(id);
}

// ─── Courses ──────────────────────────────────────────────────────────────────
export async function getCourses(organisationId) {
  requireOrg(organisationId);
  return base44.entities.Course.filter({ organisation_id: organisationId });
}

export async function createCourse(organisationId, data) {
  requireOrg(organisationId);
  return base44.entities.Course.create({ ...data, organisation_id: organisationId });
}

export async function updateCourse(organisationId, id, data) {
  requireOrg(organisationId);
  const record = await base44.entities.Course.get(id);
  if (record?.organisation_id !== organisationId) throw new Error("Access denied");
  return base44.entities.Course.update(id, data);
}

// ─── Course Enrolments ────────────────────────────────────────────────────────
export async function getCourseEnrolments(organisationId) {
  requireOrg(organisationId);
  return base44.entities.CourseEnrolment.filter({ organisation_id: organisationId });
}

export async function getCourseEnrolmentsForUser(organisationId, userId) {
  requireOrg(organisationId);
  return base44.entities.CourseEnrolment.filter({ organisation_id: organisationId, user_id: userId });
}

export async function createCourseEnrolment(organisationId, data) {
  requireOrg(organisationId);
  return base44.entities.CourseEnrolment.create({ ...data, organisation_id: organisationId });
}

export async function updateCourseEnrolment(organisationId, id, data) {
  requireOrg(organisationId);
  const record = await base44.entities.CourseEnrolment.get(id);
  if (record?.organisation_id !== organisationId) throw new Error("Access denied");
  return base44.entities.CourseEnrolment.update(id, data);
}

// ─── Compliance Records ───────────────────────────────────────────────────────
export async function getComplianceRecords(organisationId) {
  requireOrg(organisationId);
  return base44.entities.ComplianceRecord.filter({ organisation_id: organisationId });
}

export async function createComplianceRecord(organisationId, data) {
  requireOrg(organisationId);
  return base44.entities.ComplianceRecord.create({ ...data, organisation_id: organisationId });
}

export async function updateComplianceRecord(organisationId, id, data) {
  requireOrg(organisationId);
  const record = await base44.entities.ComplianceRecord.get(id);
  if (record?.organisation_id !== organisationId) throw new Error("Access denied");
  return base44.entities.ComplianceRecord.update(id, data);
}

// ─── Foster Carers ────────────────────────────────────────────────────────────
export async function getFosterCarers(organisationId) {
  requireOrg(organisationId);
  return base44.entities.FosterCarer.filter({ organisation_id: organisationId });
}

export async function createFosterCarer(organisationId, data) {
  requireOrg(organisationId);
  return base44.entities.FosterCarer.create({ ...data, organisation_id: organisationId });
}

export async function updateFosterCarer(organisationId, id, data) {
  requireOrg(organisationId);
  const record = await base44.entities.FosterCarer.get(id);
  if (record?.organisation_id !== organisationId) throw new Error("Access denied");
  return base44.entities.FosterCarer.update(id, data);
}

// ─── Placements ───────────────────────────────────────────────────────────────
export async function getPlacements(organisationId) {
  requireOrg(organisationId);
  return base44.entities.Placement.filter({ organisation_id: organisationId });
}

export async function createPlacement(organisationId, data) {
  requireOrg(organisationId);
  return base44.entities.Placement.create({ ...data, organisation_id: organisationId });
}

export async function updatePlacement(organisationId, id, data) {
  requireOrg(organisationId);
  const record = await base44.entities.Placement.get(id);
  if (record?.organisation_id !== organisationId) throw new Error("Access denied");
  return base44.entities.Placement.update(id, data);
}

// ─── Recruitment Leads ────────────────────────────────────────────────────────
export async function getRecruitmentLeads(organisationId) {
  requireOrg(organisationId);
  return base44.entities.RecruitmentLead.filter({ organisation_id: organisationId });
}

export async function createRecruitmentLead(organisationId, data) {
  requireOrg(organisationId);
  return base44.entities.RecruitmentLead.create({ ...data, organisation_id: organisationId });
}

// ─── Organisation ─────────────────────────────────────────────────────────────
export async function getOrganisation(organisationId) {
  requireOrg(organisationId);
  return base44.entities.Organisation.get(organisationId);
}

export async function updateOrganisation(organisationId, data) {
  requireOrg(organisationId);
  return base44.entities.Organisation.update(organisationId, data);
}

// ─── Derived / Aggregate Metrics ─────────────────────────────────────────────
export async function getAgencyMetrics(organisationId) {
  requireOrg(organisationId);
  const [members, certs, alerts] = await Promise.all([
    getWorkforceMembers(organisationId),
    getCPDCertificates(organisationId),
    // Alerts don't have their own entity yet — return empty until one is created
    Promise.resolve([]),
  ]);
  const total = members.length;
  const fullyCompliant = 0; // Derive from ComplianceRecord when wired
  const highRisk = 0;
  const expiring = certs.filter(c => c.status === "expiring_soon").length;
  const expired = certs.filter(c => c.status === "expired").length;
  const totalCpdHours = certs.reduce((s, c) => s + (c.cpd_hours || 0), 0);
  const avgCompliance = 0;
  const unreadAlerts = 0;
  return { total, fullyCompliant, highRisk, expiring, expired, totalCpdHours, avgCompliance, unreadAlerts };
}