import { CheckCircle2, AlertTriangle, Clock, Shield, Download, Eye } from "lucide-react";
import { daysUntil, fmt } from "@/lib/cpdData";

const STATUS_CONFIG = {
  valid:         { border: "border-emerald-200", bg: "bg-emerald-50", accent: "bg-emerald-600", text: "text-emerald-700", label: "Valid", icon: CheckCircle2 },
  expiring_soon: { border: "border-amber-300",   bg: "bg-amber-50",   accent: "bg-amber-500",   text: "text-amber-700",   label: "Expiring Soon", icon: AlertTriangle },
  expired:       { border: "border-red-300",     bg: "bg-red-50",     accent: "bg-red-600",     text: "text-red-700",     label: "Expired", icon: Clock },
};

const CAT_COLORS = {
  "Safeguarding":          "from-blue-600 to-blue-800",
  "Therapeutic Parenting": "from-violet-600 to-violet-800",
  "Health & Safety":       "from-emerald-600 to-emerald-800",
  "Mental Health":         "from-teal-600 to-teal-800",
  "Legislation":           "from-indigo-600 to-indigo-800",
  "Equality & Diversity":  "from-pink-600 to-pink-800",
  "Practice Skills":       "from-slate-600 to-slate-800",
  "Attachment":            "from-amber-600 to-amber-800",
};

export default function CertificateCard({ cert, onView }) {
  const days = daysUntil(cert.expiry);
  const s = STATUS_CONFIG[cert.status] || STATUS_CONFIG.valid;
  const StatusIcon = s.icon;
  const gradient = CAT_COLORS[cert.category] || "from-slate-600 to-slate-800";

  return (
    <div
      onClick={() => onView(cert)}
      className={`group relative bg-white rounded-2xl border-2 ${s.border} shadow-sm hover:shadow-xl hover:shadow-blue-600/8 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden`}
    >
      {/* Top accent bar */}
      <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />

      {/* Status ribbon */}
      <div className={`absolute top-4 right-4 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${s.bg} ${s.text} border ${s.border}`}>
        <StatusIcon size={9} />
        {s.label}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4 pr-20">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm`}>
            {cert.avatar}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">{cert.title}</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">{cert.person}</p>
          </div>
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-slate-50 rounded-lg p-2.5">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Provider</p>
            <p className="text-[11px] font-semibold text-slate-700 mt-0.5 truncate">{cert.provider}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-2.5">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">CPD Hours</p>
            <p className="text-[11px] font-semibold text-slate-700 mt-0.5">{cert.hours}h</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-2.5">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Issued</p>
            <p className="text-[11px] font-semibold text-slate-700 mt-0.5">{fmt(cert.issued)}</p>
          </div>
          <div className={`rounded-lg p-2.5 ${s.bg}`}>
            <p className={`text-[9px] font-bold uppercase tracking-wider ${s.text} opacity-70`}>
              {cert.status === "expired" ? "Expired" : "Expires"}
            </p>
            <p className={`text-[11px] font-bold mt-0.5 ${s.text}`}>
              {cert.status === "expired" ? fmt(cert.expiry) : `${days}d`}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            {cert.verified ? (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                <Shield size={10} className="fill-emerald-100" /> Verified
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-600">
                <AlertTriangle size={10} /> Unverified
              </span>
            )}
            <span className="text-slate-300">·</span>
            <span className="text-[10px] text-slate-400 font-mono">{cert.certId}</span>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors">
              <Eye size={11} />
            </button>
            <button className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors" onClick={e => e.stopPropagation()}>
              <Download size={11} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}