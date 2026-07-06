import { useState, useEffect } from "react";
import { X, Download, CheckCircle2, Shield, QrCode, ExternalLink, Award, AlertTriangle, Clock, RefreshCw } from "lucide-react";
import { fmt, daysUntil } from "@/lib/cpdData";
import { jsPDF } from "jspdf";
import confetti from "canvas-confetti";

const STATUS_CFG = {
  valid:         { bg: "bg-emerald-600", label: "VERIFIED & VALID",    icon: CheckCircle2 },
  expiring_soon: { bg: "bg-amber-500",   label: "EXPIRING SOON",       icon: AlertTriangle },
  expired:       { bg: "bg-red-600",     label: "EXPIRED",             icon: Clock },
};

function QRPattern({ certId }) {
  // Deterministic 7x7 SVG QR-like pattern from certId chars
  const hash = certId.split("").reduce((a, c) => a * 31 + c.charCodeAt(0), 0);
  const cells = Array.from({ length: 49 }, (_, i) => !!(hash >> (i % 30) & 1));
  return (
    <svg viewBox="0 0 70 70" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Corner squares */}
      {[[0,0],[0,6],[6,0]].map(([r,c],i) => (
        <g key={i}>
          <rect x={c*10} y={r*10} width={30} height={30} rx={3} fill="#1e293b" />
          <rect x={c*10+4} y={r*10+4} width={22} height={22} rx={2} fill="white" />
          <rect x={c*10+8} y={r*10+8} width={14} height={14} rx={1} fill="#1e293b" />
        </g>
      ))}
      {/* Data cells */}
      {cells.map((on, i) => {
        const row = Math.floor(i / 7), col = i % 7;
        const skip = (row < 3 && col < 3) || (row < 3 && col > 3) || (row > 3 && col < 3);
        if (!on || skip) return null;
        return <rect key={i} x={col*10+2} y={row*10+2} width={8} height={8} rx={1} fill="#1e293b" />;
      })}
    </svg>
  );
}

export default function CertificateViewer({ cert, onClose }) {
  const [downloading, setDownloading] = useState(false);
  const days = daysUntil(cert.expiry);
  const s = STATUS_CFG[cert.status] || STATUS_CFG.valid;
  const StatusIcon = s.icon;

  useEffect(() => {
    if (cert.status === "valid") {
      setTimeout(() => confetti({ particleCount: 60, spread: 70, origin: { y: 0.3 }, colors: ["#2563eb","#10b981","#8b5cf6"] }), 300);
    }
  }, []);

  const handleDownload = () => {
    setDownloading(true);
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    doc.setFillColor(15, 23, 42); doc.rect(0, 0, 297, 210, "F");
    doc.setFillColor(255, 255, 255); doc.rect(10, 10, 277, 190, "F");
    doc.setDrawColor(37, 99, 235); doc.setLineWidth(1.5); doc.rect(16, 16, 265, 178);
    doc.setLineWidth(0.4); doc.rect(19, 19, 259, 172);
    doc.setFillColor(37, 99, 235); doc.roundedRect(118, 24, 62, 14, 3, 3, "F");
    doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(12);
    doc.text("AAF CARECONNECT™", 149, 33, { align: "center" });
    doc.setTextColor(15, 23, 42); doc.setFontSize(28); doc.text("Certificate of Professional Development", 149, 58, { align: "center" });
    doc.setFontSize(10); doc.setTextColor(100, 116, 139); doc.setFont("helvetica", "normal");
    doc.text("This is to certify that", 149, 72, { align: "center" });
    doc.setFont("helvetica", "bold"); doc.setFontSize(22); doc.setTextColor(37, 99, 235);
    doc.text(cert.person, 149, 84, { align: "center" });
    doc.setFont("helvetica", "normal"); doc.setFontSize(11); doc.setTextColor(15, 23, 42);
    doc.text("has successfully completed", 149, 94, { align: "center" });
    doc.setFont("helvetica", "bold"); doc.setFontSize(16);
    doc.text(cert.title, 149, 104, { align: "center" });
    doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(100, 116, 139);
    doc.text(`Provider: ${cert.provider}   ·   Category: ${cert.category}   ·   ${cert.hours} CPD Hours`, 149, 114, { align: "center" });
    doc.setDrawColor(37, 99, 235); doc.setLineWidth(0.5);
    doc.line(55, 148, 108, 148); doc.line(188, 148, 241, 148);
    doc.setFontSize(9); doc.setTextColor(100, 116, 139);
    doc.text(fmt(cert.issued), 81, 154, { align: "center" });
    doc.text("Training Director, AAF", 214, 154, { align: "center" });
    doc.setFontSize(7); doc.text("Date of Issue", 81, 160, { align: "center" }); doc.text("Authorised Signature", 214, 160, { align: "center" });
    doc.setFontSize(7); doc.setTextColor(148, 163, 184);
    doc.text(`Certificate ID: ${cert.certId}   ·   Valid until: ${fmt(cert.expiry)}   ·   Verify at: aaf-careconnect.co.uk/verify`, 149, 178, { align: "center" });
    doc.save(`CPD_Certificate_${cert.certId}.pdf`);
    setTimeout(() => setDownloading(false), 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl animate-fade-in overflow-hidden">
        {/* Top status bar */}
        <div className={`${s.bg} px-6 py-3 flex items-center justify-between`}>
          <div className="flex items-center gap-2 text-white">
            <StatusIcon size={16} className="fill-white/20" />
            <span className="text-xs font-bold tracking-widest uppercase">{s.label}</span>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
            <X size={14} />
          </button>
        </div>

        {/* Certificate body */}
        <div className="p-8">
          {/* Certificate preview */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 rounded-2xl p-8 mb-6 relative overflow-hidden">
            {/* Decorative rings */}
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full border border-white/5" />
            <div className="absolute -top-4 -right-4 w-28 h-28 rounded-full border border-white/5" />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-1">AAF CareConnect™ · Professional Development</p>
                  <h2 className="text-white font-heading font-bold text-xl leading-tight">{cert.title}</h2>
                  <p className="text-slate-400 text-sm mt-1">{cert.category} · {cert.provider}</p>
                </div>
                <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award size={28} className="text-blue-400" />
                </div>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-slate-400 text-[10px] uppercase tracking-wider mb-0.5">Awarded to</p>
                  <p className="text-white font-heading font-bold text-2xl">{cert.person}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div>
                      <p className="text-[9px] text-slate-500 uppercase tracking-wider">Issued</p>
                      <p className="text-xs text-slate-300 font-semibold">{fmt(cert.issued)}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-500 uppercase tracking-wider">Valid Until</p>
                      <p className={`text-xs font-semibold ${cert.status === "expired" ? "text-red-400" : cert.status === "expiring_soon" ? "text-amber-400" : "text-emerald-400"}`}>{fmt(cert.expiry)}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-500 uppercase tracking-wider">CPD Hours</p>
                      <p className="text-xs text-white font-bold">{cert.hours}h</p>
                    </div>
                  </div>
                </div>

                {/* QR code */}
                <div className="flex flex-col items-center gap-1">
                  <div className="w-14 h-14 bg-white rounded-lg p-1">
                    <QRPattern certId={cert.certId} />
                  </div>
                  <p className="text-[8px] text-slate-500">Verify</p>
                </div>
              </div>

              {/* Certificate ID + signature */}
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-[8px] text-slate-600 uppercase tracking-wider">Certificate ID</p>
                  <p className="text-[10px] text-slate-300 font-mono font-semibold">{cert.certId}</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] text-slate-600 uppercase tracking-wider mb-0.5">Digital Signature</p>
                  <p className="text-slate-400 font-heading text-sm italic">Training Director</p>
                  <p className="text-[8px] text-slate-600">AAF CareConnect™</p>
                </div>
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
              className="flex-1 h-11 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-500 flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            >
              <Download size={15} /> {downloading ? "Generating PDF…" : "Download Certificate"}
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