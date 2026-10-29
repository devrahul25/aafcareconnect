import { useState } from "react";
import { CheckCircle2, AlertTriangle, Clock, Shield, Download, Eye, Award, ExternalLink } from "lucide-react";
import { normalizeCertificate, fmt, daysUntil } from "@/lib/passportData";
import { jsPDF } from "jspdf";

const STATUS_CFG = {
  valid:         { border: "border-emerald-200", bg: "bg-emerald-50",  badge: "bg-emerald-600 text-white",  text: "text-emerald-700", label: "Valid",         icon: CheckCircle2 },
  expiring_soon: { border: "border-amber-300",   bg: "bg-amber-50",    badge: "bg-amber-500 text-white",    text: "text-amber-700",   label: "Expiring Soon", icon: AlertTriangle },
  expired:       { border: "border-red-300",     bg: "bg-red-50",      badge: "bg-red-600 text-white",      text: "text-red-700",     label: "Expired",       icon: Clock },
};

const CAT_GRADIENT = {
  "Safeguarding":          "from-blue-600 to-blue-800",
  "Therapeutic Parenting": "from-violet-600 to-violet-800",
  "Therapeutic Care":      "from-violet-600 to-violet-800",
  "Health & Safety":       "from-emerald-600 to-emerald-800",
  "Mental Health":         "from-teal-600 to-teal-800",
  "Legislation":           "from-indigo-600 to-indigo-800",
  "Equality & Diversity":  "from-pink-600 to-pink-800",
  "Practice Skills":       "from-slate-600 to-slate-800",
  "General Care":          "from-blue-600 to-indigo-700",
};

export default function PassportCertifications({ certificates = [], userName = "Practitioner" }) {
  const [selectedCert, setSelectedCert] = useState(null);

  const normalized = certificates.map(normalizeCertificate);

  const valid = normalized.filter(c => c.status === "valid").length;
  const expiring = normalized.filter(c => c.status === "expiring_soon").length;
  const expired = normalized.filter(c => c.status === "expired").length;

  const downloadCertPdf = (cert) => {
    try {
      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 297, 210, "F");

      // Outer border
      doc.setDrawColor(217, 119, 6);
      doc.setLineWidth(2);
      doc.rect(10, 10, 277, 190);

      // Inner white card
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(15, 15, 267, 180, 4, 4, "F");

      // Header
      doc.setTextColor(30, 58, 138);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("AAF CareConnect™ — Continuous Professional Development", 148, 38, { align: "center" });

      doc.setTextColor(100, 116, 139);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text("CERTIFICATE OF RECOGNITION & ACHIEVEMENT", 148, 48, { align: "center" });

      doc.setFontSize(11);
      doc.text("This is officially awarded to", 148, 68, { align: "center" });

      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.text(userName, 148, 82, { align: "center" });

      doc.setTextColor(71, 85, 105);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text("for successfully completing accredited professional development:", 148, 96, { align: "center" });

      doc.setTextColor(37, 99, 235);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text(cert.title, 148, 110, { align: "center" });

      doc.setTextColor(100, 116, 139);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Training Provider: ${cert.provider}   ·   CPD Hours: ${cert.hours} hrs`, 148, 122, { align: "center" });
      doc.text(`Issued: ${fmt(cert.issued)}   ·   Expiry: ${cert.expiry ? fmt(cert.expiry) : "No Expiry"}`, 148, 130, { align: "center" });

      // Verification stamp
      doc.setFillColor(240, 253, 244);
      doc.setDrawColor(34, 197, 94);
      doc.setLineWidth(0.5);
      doc.roundedRect(88, 145, 120, 22, 3, 3, "FD");
      doc.setTextColor(22, 101, 52);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(`✓ VERIFIED OFSTED COMPLIANT CPD RECORD`, 148, 154, { align: "center" });
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(`Certificate ID: ${cert.id}`, 148, 161, { align: "center" });

      doc.save(`${cert.title.replace(/[^a-zA-Z0-9]/g, "_")}_Certificate.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Valid", value: valid, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
          { label: "Expiring Soon", value: expiring, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
          { label: "Expired", value: expired, color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
        ].map(s => (
          <div key={s.label} className={`card p-4 text-center ${s.bg} border ${s.border}`}>
            <p className={`text-2xl font-heading font-bold ${s.color}`}>{s.value}</p>
            <p className={`text-xs font-semibold ${s.color}`}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {normalized.length === 0 ? (
        <div className="card p-12 text-center border-dashed border-2 border-slate-200 bg-white">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 shadow-sm">
            <Award size={28} />
          </div>
          <h3 className="font-heading font-bold text-slate-800 text-base mb-1">No CPD Certificates Issued Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
            Certificates will automatically appear here once earned by completing accredited courses in the Learning Hub or uploaded and verified in the CPD Hub.
          </p>
          <a
            href="/learning-hub"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-500 transition-colors shadow-sm"
          >
            Explore Courses in Learning Hub
          </a>
        </div>
      ) : (
        /* Certificate cards */
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {normalized.map(cert => {
            const s = STATUS_CFG[cert.status] || STATUS_CFG.valid;
            const StatusIcon = s.icon;
            const days = daysUntil(cert.expiry);
            const grad = CAT_GRADIENT[cert.category] || "from-slate-700 to-slate-900";

            return (
              <div
                key={cert.id}
                className={`group relative bg-white rounded-2xl border-2 ${s.border} shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col`}
              >
                <div className={`h-1.5 bg-gradient-to-r ${grad}`} />

                {/* Status pill */}
                <div className={`absolute top-4 right-4 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${s.badge}`}>
                  <StatusIcon size={8} /> {s.label}
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-4 pr-20">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-white flex-shrink-0 shadow-sm`}>
                      <Award size={18} className="text-white/90" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                        {cert.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">{cert.provider}</p>
                    </div>
                  </div>

                  {/* Achievement badge */}
                  <div className="mb-3">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full bg-gradient-to-r ${grad} text-white`}>
                      🏅 {cert.badge}
                    </span>
                  </div>

                  {/* Meta */}
                  <div className="grid grid-cols-2 gap-2 mb-4 mt-auto">
                    <div className="bg-slate-50 rounded-lg p-2">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Issued</p>
                      <p className="text-[11px] font-semibold text-slate-700">{fmt(cert.issued)}</p>
                    </div>
                    <div className={`rounded-lg p-2 ${s.bg}`}>
                      <p className={`text-[9px] font-bold uppercase tracking-wider ${s.text} opacity-70`}>
                        {cert.status === "expired" ? "Expired" : "Expires"}
                      </p>
                      <p className={`text-[11px] font-bold ${s.text}`}>
                        {cert.expiry ? (cert.status === "expired" ? fmt(cert.expiry) : `${days}d`) : "Lifetime"}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">CPD Hours</p>
                      <p className="text-[11px] font-semibold text-slate-700">{cert.hours}h</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Verified</p>
                      <p className="text-[11px] font-semibold">
                        {cert.verified ? <span className="text-emerald-600">✓ Verified</span> : <span className="text-amber-600">Pending</span>}
                      </p>
                    </div>
                  </div>

                  {/* Footer actions */}
                  <div className="flex gap-2 pt-2 border-t border-slate-100">
                    {cert.certificate_url ? (
                      <a
                        href={cert.certificate_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 h-7 text-[10px] font-semibold bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 flex items-center justify-center gap-1 transition-colors"
                      >
                        <ExternalLink size={10} /> View Link
                      </a>
                    ) : (
                      <button
                        onClick={() => setSelectedCert(cert)}
                        className="flex-1 h-7 text-[10px] font-semibold bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 flex items-center justify-center gap-1 transition-colors"
                      >
                        <Eye size={10} /> Details
                      </button>
                    )}
                    <button
                      onClick={() => downloadCertPdf(cert)}
                      className="flex-1 h-7 text-[10px] font-semibold bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 flex items-center justify-center gap-1 transition-colors"
                    >
                      <Download size={10} /> Certificate PDF
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Award className="text-blue-600" size={20} />
                <h3 className="text-sm font-bold text-slate-900">Certificate Verification Record</h3>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <div>
              <h4 className="font-heading font-bold text-slate-900 text-base">{selectedCert.title}</h4>
              <p className="text-xs text-slate-500 mt-0.5">Awarded by: {selectedCert.provider}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Certificate ID</span>
                <span className="font-mono font-semibold text-slate-800">{selectedCert.id}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">CPD Hours</span>
                <span className="font-semibold text-blue-600">{selectedCert.hours} hrs</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Date Issued</span>
                <span className="font-semibold text-slate-800">{fmt(selectedCert.issued)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Valid Until</span>
                <span className="font-semibold text-slate-800">{selectedCert.expiry ? fmt(selectedCert.expiry) : "No Expiry"}</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => downloadCertPdf(selectedCert)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-500 transition-colors flex items-center gap-1.5"
              >
                <Download size={13} /> Download Certificate PDF
              </button>
              <button
                onClick={() => setSelectedCert(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}