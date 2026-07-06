import { CheckCircle2, AlertTriangle, Clock, Shield, Download, Eye, Award } from "lucide-react";
import { PASSPORT_CERTS, fmt, daysUntil } from "@/lib/passportData";

const STATUS_CFG = {
  valid:         { border: "border-emerald-200", bg: "bg-emerald-50",  badge: "bg-emerald-600 text-white",  text: "text-emerald-700", label: "Valid",         icon: CheckCircle2 },
  expiring_soon: { border: "border-amber-300",   bg: "bg-amber-50",    badge: "bg-amber-500 text-white",    text: "text-amber-700",   label: "Expiring Soon", icon: AlertTriangle },
  expired:       { border: "border-red-300",     bg: "bg-red-50",      badge: "bg-red-600 text-white",      text: "text-red-700",     label: "Expired",       icon: Clock },
};

const CAT_GRADIENT = {
  "Safeguarding":          "from-blue-600 to-blue-800",
  "Therapeutic Parenting": "from-violet-600 to-violet-800",
  "Health & Safety":       "from-emerald-600 to-emerald-800",
  "Mental Health":         "from-teal-600 to-teal-800",
  "Legislation":           "from-indigo-600 to-indigo-800",
  "Equality & Diversity":  "from-pink-600 to-pink-800",
  "Practice Skills":       "from-slate-600 to-slate-800",
  "Attachment":            "from-amber-600 to-amber-800",
};

export default function PassportCertifications() {
  const valid = PASSPORT_CERTS.filter(c => c.status === "valid").length;
  const expiring = PASSPORT_CERTS.filter(c => c.status === "expiring_soon").length;
  const expired = PASSPORT_CERTS.filter(c => c.status === "expired").length;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Valid", value: valid,    color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
          { label: "Expiring Soon", value: expiring, color: "text-amber-600",   bg: "bg-amber-50",   border: "border-amber-200" },
          { label: "Expired",      value: expired,  color: "text-red-600",     bg: "bg-red-50",     border: "border-red-200" },
        ].map(s => (
          <div key={s.label} className={`card p-4 text-center ${s.bg} border ${s.border}`}>
            <p className={`text-2xl font-heading font-bold ${s.color}`}>{s.value}</p>
            <p className={`text-xs font-semibold ${s.color}`}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Certificate cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {PASSPORT_CERTS.map(cert => {
          const s = STATUS_CFG[cert.status] || STATUS_CFG.valid;
          const StatusIcon = s.icon;
          const days = daysUntil(cert.expiry);
          const grad = CAT_GRADIENT[cert.category] || "from-slate-600 to-slate-800";

          return (
            <div key={cert.id} className={`group relative bg-white rounded-2xl border-2 ${s.border} shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 overflow-hidden`}>
              <div className={`h-1.5 bg-gradient-to-r ${grad}`} />

              {/* Status pill */}
              <div className={`absolute top-4 right-4 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${s.badge}`}>
                <StatusIcon size={8} /> {s.label}
              </div>

              <div className="p-5">
                {/* Header */}
                <div className="flex items-start gap-3 mb-4 pr-20">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-white flex-shrink-0 shadow-sm`}>
                    <Award size={18} className="text-white/90" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">{cert.title}</h3>
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
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-slate-50 rounded-lg p-2">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Issued</p>
                    <p className="text-[11px] font-semibold text-slate-700">{fmt(cert.issued)}</p>
                  </div>
                  <div className={`rounded-lg p-2 ${s.bg}`}>
                    <p className={`text-[9px] font-bold uppercase tracking-wider ${s.text} opacity-70`}>{cert.status === "expired" ? "Expired" : "Expires"}</p>
                    <p className={`text-[11px] font-bold ${s.text}`}>{cert.status === "expired" ? fmt(cert.expiry) : `${days}d`}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">CPD Hours</p>
                    <p className="text-[11px] font-semibold text-slate-700">{cert.hours}h</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Verified</p>
                    <p className="text-[11px] font-semibold">{cert.verified ? <span className="text-emerald-600">✓ Yes</span> : <span className="text-amber-600">Pending</span>}</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex gap-2">
                  <button className="flex-1 h-7 text-[10px] font-semibold bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 flex items-center justify-center gap-1 transition-colors">
                    <Eye size={10} /> View
                  </button>
                  <button className="flex-1 h-7 text-[10px] font-semibold bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 flex items-center justify-center gap-1 transition-colors" onClick={e => e.stopPropagation()}>
                    <Download size={10} /> PDF
                  </button>
                  {cert.verified && (
                    <button className="flex-1 h-7 text-[10px] font-semibold bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 flex items-center justify-center gap-1 transition-colors">
                      <Shield size={10} /> Verify
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}