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

import { apiClient } from "@/api/apiClient";

// ─── Guard ────────────────────────────────────────────────────────────────────
function requireOrg(organisationId) {
  if (!organisationId) throw new Error("organisationId is required for all data queries");
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const data = (res) => res.data?.data ?? res.data;

// ─── Workforce Members ────────────────────────────────────────────────────────
export async function getWorkforceMembers(organisationId) {
  requireOrg(organisationId);
  return data(await apiClient.get(`/workforce-members`, { params: { organisation_id: organisationId } }));
}

export async function getWorkforceMember(organisationId, id) {
  requireOrg(organisationId);
  const record = data(await apiClient.get(`/workforce-members/${id}`));
  if (record?.organisation_id !== organisationId) throw new Error("Access denied");
  return record;
}

export async function createWorkforceMember(organisationId, memberData) {
  requireOrg(organisationId);
  return data(await apiClient.post(`/workforce-members`, { ...memberData, organisation_id: organisationId }));
}

export async function updateWorkforceMember(organisationId, id, memberData) {
  requireOrg(organisationId);
  const record = data(await apiClient.get(`/workforce-members/${id}`));
  if (record?.organisation_id !== organisationId) throw new Error("Access denied");
  return data(await apiClient.patch(`/workforce-members/${id}`, memberData));
}

// ─── CPD Certificates ─────────────────────────────────────────────────────────
export async function getCPDCertificates(organisationId) {
  requireOrg(organisationId);
  return data(await apiClient.get(`/cpd-certificates`, { params: { organisation_id: organisationId } }));
}

export async function getCPDCertificatesForUser(organisationId, userId) {
  requireOrg(organisationId);
  return data(await apiClient.get(`/cpd-certificates`, { params: { organisation_id: organisationId, user_id: userId } }));
}

export async function createCPDCertificate(organisationId, certData) {
  requireOrg(organisationId);
  return data(await apiClient.post(`/cpd-certificates`, { ...certData, organisation_id: organisationId }));
}

export async function updateCPDCertificate(organisationId, id, certData) {
  requireOrg(organisationId);
  const record = data(await apiClient.get(`/cpd-certificates/${id}`));
  if (record?.organisation_id !== organisationId) throw new Error("Access denied");
  return data(await apiClient.patch(`/cpd-certificates/${id}`, certData));
}

export async function deleteCPDCertificate(organisationId, id) {
  requireOrg(organisationId);
  const record = data(await apiClient.get(`/cpd-certificates/${id}`));
  if (record?.organisation_id !== organisationId) throw new Error("Access denied");
  return data(await apiClient.delete(`/cpd-certificates/${id}`));
}

// ─── Courses ──────────────────────────────────────────────────────────────────
export async function getCourses(organisationId) {
  requireOrg(organisationId);
  return data(await apiClient.get(`/courses`, { params: { organisation_id: organisationId } }));
}

export async function createCourse(organisationId, courseData) {
  requireOrg(organisationId);
  return data(await apiClient.post(`/courses`, { ...courseData, organisation_id: organisationId }));
}

export async function updateCourse(organisationId, id, courseData) {
  requireOrg(organisationId);
  const record = data(await apiClient.get(`/courses/${id}`));
  if (record?.organisation_id !== organisationId) throw new Error("Access denied");
  return data(await apiClient.patch(`/courses/${id}`, courseData));
}

// ─── Course Enrolments ────────────────────────────────────────────────────────
export async function getCourseEnrolments(organisationId) {
  requireOrg(organisationId);
  return data(await apiClient.get(`/course-enrolments`, { params: { organisation_id: organisationId } }));
}

export async function getCourseEnrolmentsForUser(organisationId, userId) {
  requireOrg(organisationId);
  return data(await apiClient.get(`/course-enrolments`, { params: { organisation_id: organisationId, user_id: userId } }));
}

export async function createCourseEnrolment(organisationId, enrolmentData) {
  requireOrg(organisationId);
  return data(await apiClient.post(`/course-enrolments`, { ...enrolmentData, organisation_id: organisationId }));
}

export async function updateCourseEnrolment(organisationId, id, enrolmentData) {
  requireOrg(organisationId);
  const record = data(await apiClient.get(`/course-enrolments/${id}`));
  if (record?.organisation_id !== organisationId) throw new Error("Access denied");
  return data(await apiClient.patch(`/course-enrolments/${id}`, enrolmentData));
}

// ─── Compliance Records ───────────────────────────────────────────────────────
export async function getComplianceRecords(organisationId) {
  requireOrg(organisationId);
  return data(await apiClient.get(`/compliance-records`, { params: { organisation_id: organisationId } }));
}

export async function createComplianceRecord(organisationId, recordData) {
  requireOrg(organisationId);
  return data(await apiClient.post(`/compliance-records`, { ...recordData, organisation_id: organisationId }));
}

export async function updateComplianceRecord(organisationId, id, recordData) {
  requireOrg(organisationId);
  const record = data(await apiClient.get(`/compliance-records/${id}`));
  if (record?.organisation_id !== organisationId) throw new Error("Access denied");
  return data(await apiClient.patch(`/compliance-records/${id}`, recordData));
}

// ─── Foster Carers ────────────────────────────────────────────────────────────
export async function getFosterCarers(organisationId) {
  requireOrg(organisationId);
  return data(await apiClient.get(`/foster-carers`, { params: { organisation_id: organisationId } }));
}

export async function createFosterCarer(organisationId, carerData) {
  requireOrg(organisationId);
  return data(await apiClient.post(`/foster-carers`, { ...carerData, organisation_id: organisationId }));
}

export async function updateFosterCarer(organisationId, id, carerData) {
  requireOrg(organisationId);
  const record = data(await apiClient.get(`/foster-carers/${id}`));
  if (record?.organisation_id !== organisationId) throw new Error("Access denied");
  return data(await apiClient.patch(`/foster-carers/${id}`, carerData));
}

// ─── Placements ───────────────────────────────────────────────────────────────
export async function getPlacements(organisationId) {
  requireOrg(organisationId);
  return data(await apiClient.get(`/placements`, { params: { organisation_id: organisationId } }));
}

export async function createPlacement(organisationId, placementData) {
  requireOrg(organisationId);
  return data(await apiClient.post(`/placements`, { ...placementData, organisation_id: organisationId }));
}

export async function updatePlacement(organisationId, id, placementData) {
  requireOrg(organisationId);
  const record = data(await apiClient.get(`/placements/${id}`));
  if (record?.organisation_id !== organisationId) throw new Error("Access denied");
  return data(await apiClient.patch(`/placements/${id}`, placementData));
}

// ─── Recruitment Leads ────────────────────────────────────────────────────────
export async function getRecruitmentLeads(organisationId) {
  requireOrg(organisationId);
  return data(await apiClient.get(`/recruitment-leads`, { params: { organisation_id: organisationId } }));
}

export async function createRecruitmentLead(organisationId, leadData) {
  requireOrg(organisationId);
  return data(await apiClient.post(`/recruitment-leads`, { ...leadData, organisation_id: organisationId }));
}

// ─── Organisation ─────────────────────────────────────────────────────────────
export async function getOrganisation(organisationId) {
  requireOrg(organisationId);
  return data(await apiClient.get(`/organisations/${organisationId}`));
}

export async function updateOrganisation(organisationId, orgData) {
  requireOrg(organisationId);
  return data(await apiClient.patch(`/organisations/${organisationId}`, orgData));
}

// ─── Derived / Aggregate Metrics ─────────────────────────────────────────────
export async function getAgencyMetrics(organisationId) {
  requireOrg(organisationId);
  const [members, certs] = await Promise.all([
    getWorkforceMembers(organisationId).catch(() => []),
    getCPDCertificates(organisationId).catch(() => []),
  ]);
  const total = Array.isArray(members) ? members.length : 0;
  const certList = Array.isArray(certs) ? certs : [];
  const expiring = certList.filter(c => c.status === "expiring_soon").length;
  const expired = certList.filter(c => c.status === "expired").length;
  const totalCpdHours = certList.reduce((s, c) => s + (c.cpd_hours || 0), 0);
  return { total, fullyCompliant: 0, highRisk: 0, expiring, expired, totalCpdHours, avgCompliance: 0, unreadAlerts: 0 };
}