import { useState, useEffect } from "react";
import { X, Download, CheckCircle2, Shield, QrCode, ExternalLink, Award, AlertTriangle, Clock, RefreshCw, Loader2 } from "lucide-react";
import { fmt, daysUntil } from "@/lib/cpdData";
import confetti from "canvas-confetti";
import CertificateTemplate from "@/components/course/CertificateTemplate";
import { downloadCertificateFromElement } from "@/lib/certificatePdf";
import { useAuth } from "@/lib/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";

const STATUS_CFG = {
  valid:         { bg: "bg-emerald-600", label: "VERIFIED & VALID",    icon: CheckCircle2 },
  expiring_soon: { bg: "bg-amber-500",   label: "EXPIRING SOON",       icon: AlertTriangle },
  expired:       { bg: "bg-red-600",     label: "EXPIRED",             icon: Clock },
};

export default function CertificateViewer({ cert, onClose }) {
  const { user } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const days = daysUntil(cert.expiry);
  const s = STATUS_CFG[cert.status] || STATUS_CFG.valid;
  const StatusIcon = s.icon;

  const { data: orgData } = useQuery({
    queryKey: ['organization', user?.organization_id],
    queryFn: () => apiClient.get(`/organizations/${user?.organization_id}`).then(res => res.data),
    enabled: !!user?.organization_id && !cert?.organisationLogo,
  });

  const org = orgData?.data || user?.organization || {};
  const effectiveOrgLogo = cert?.organisationLogo || cert?.certificate_logo_url || cert?.logo_url || org?.certificate_logo_url || org?.logo_url || null;
  const effectiveOrgName = cert?.provider && cert.provider !== "CareConnect Demo Authority" ? cert.provider : (org?.name || cert?.provider || "CareConnect Demo Authority");

  useEffect(() => {
    if (cert.status === "valid") {
      setTimeout(() => confetti({ particleCount: 60, spread: 70, origin: { y: 0.3 }, colors: ["#2563eb","#10b981","#8b5cf6"] }), 300);
    }
  }, []);

  const handleDownload = async () => {
    setDownloading(true);
    await downloadCertificateFromElement(`viewer-cert-${cert.certId || 'doc'}`, `CPD_Certificate_${cert.certId || 'cert'}.pdf`);
    setDownloading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl animate-fade-in overflow-hidden max-h-[95vh] flex flex-col">
        {/* Top status bar */}
        <div className={`${s.bg} px-6 py-3 flex items-center justify-between flex-shrink-0`}>
          <div className="flex items-center gap-2 text-white">
            <StatusIcon size={16} className="fill-white/20" />
            <span className="text-xs font-bold tracking-widest uppercase">{s.label}</span>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
            <X size={14} />
          </button>
        </div>

        {/* Certificate body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* High-Fidelity Certificate Preview */}
          <div className="flex justify-center mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-[#FCFBF7] shadow-inner p-2">
            <div className="overflow-x-auto max-w-full">
              <div style={{ width: "1050px", transform: "scale(0.72)", transformOrigin: "top center", height: "540px" }}>
                <CertificateTemplate
                  id={`viewer-cert-${cert.certId || 'doc'}`}
                  learnerName={cert.person || "Jane Smith"}
                  courseTitle={cert.title || "Safeguarding Children"}
                  organisationName={effectiveOrgName}
                  organisationLogo={effectiveOrgLogo}
                  issueDate={cert.issued}
                  level="Advanced"
                  category={cert.category || "Mandatory"}
                  cpdHours={cert.hours || 2}
                  certNumber={cert.certId || "AAF-ORG-2026-001245"}
                />
              </div>
            </div>
          </div>

          {/* Verification + actions */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3">
              <QrCode size={18} className="text-slate-500 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-700">QR Verification</p>
                <p className="text-[10px] text-slate-400">Scannable at any inspection</p>
              </div>
            </div>
            <div className={`rounded-xl p-3 flex items-center gap-3 ${cert.verified ? "bg-emerald-50" : "bg-amber-50"}`}>
              <Shield size={18} className={cert.verified ? "text-emerald-600" : "text-amber-600"} />
              <div>
                <p className={`text-xs font-semibold ${cert.verified ? "text-emerald-700" : "text-amber-700"}`}>
                  {cert.verified ? "Manager Verified" : "Pending Verification"}
                </p>
                <p className="text-[10px] text-slate-400">{cert.verified ? "Approved for compliance" : "Awaiting approval"}</p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex-1 h-11 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-500 flex items-center justify-center gap-2 transition-colors disabled:opacity-60 shadow-sm"
            >
              {downloading ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
              {downloading ? "Generating PDF…" : "Download Certificate"}
            </button>
            <button className="h-11 px-4 text-sm font-semibold border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors">
              <ExternalLink size={14} /> Share
            </button>
            {cert.status === "expired" && (
              <button className="h-11 px-4 text-sm font-semibold bg-red-600 text-white rounded-xl hover:bg-red-500 flex items-center justify-center gap-2 transition-colors">
                <RefreshCw size={14} /> Renew
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}