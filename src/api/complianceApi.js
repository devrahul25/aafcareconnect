import { apiClient } from "./apiClient";

export const complianceApi = {
  getSummary: async (params) => {
    const res = await apiClient.get("/compliance/summary", { params });
    return res.data?.data ?? res.data;
  },
  getStaffMatrix: async (params) => {
    const res = await apiClient.get("/compliance/staff-matrix", { params });
    return res.data?.data ?? res.data;
  },
  getExpiringCerts: async (params) => {
    const res = await apiClient.get("/compliance/expiring-certs", { params });
    return res.data?.data ?? res.data;
  },
  getMandatoryTraining: async (params) => {
    const res = await apiClient.get("/compliance/mandatory-training", { params });
    return res.data?.data ?? res.data;
  },
  getAlerts: async (params) => {
    const res = await apiClient.get("/compliance/alerts", { params });
    return res.data?.data ?? res.data;
  },
  sendReminder: async (data) => {
    const res = await apiClient.post("/compliance/remind", data);
    return res.data?.data ?? res.data;
  },
  renewCertificate: async (data) => {
    const res = await apiClient.post("/compliance/renew", data);
    return res.data?.data ?? res.data;
  },
  assignTraining: async (data) => {
    const res = await apiClient.post("/compliance/assign", data);
    return res.data?.data ?? res.data;
  },
  createCertificate: async (data) => {
    const res = await apiClient.post("/cpd-certificates", data);
    return res.data?.data ?? res.data;
  }
};
