import { X, CheckCircle2, AlertTriangle, Clock, Award, TrendingUp, Send, RefreshCw } from "lucide-react";

const RISK_CFG = {
  low:    { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", label: "Low Risk"    },
  medium: { bg: "bg-amber-50",  text: "text-amber-700",   border: "border-amber-200",   label: "Medium Risk" },
  high:   { bg: "bg-red-50",    text: "text-red-700",     border: "border-red-200",     label: "High Risk"   },
};

const PROFILE_CERTS = {
  2: [ // James Okafor
    { title: "Therapeutic Parenting", status: "valid",         days: 180 },
    { title: "Child Sexual Exploitation", status: "expiring_soon", days: 24 },
    { title: "Safeguarding Level 1",  status: "expiring_soon", days: 60 },
    { title: "Paediatric First Aid",  status: "expired",       days: -283 },
    { title: "Equality & Diversity",  status: "valid",         days: 300 },
  ],
  7: [ // Claire Nguyen
    { title: "Looked After Children", status: "expired", days: -756 },
    { title: "Safeguarding Level 2",  status: "expired", days: -543 },
    { title: "Induction Training",    status: "valid",   days: 200 },
    { title: "GDPR Awareness",        status: "valid",   days: 400 },
  ],
};

export default function StaffProfile({ staff, onClose }) {
  if (!staff) return null;
  const r = RISK_CFG[staff.riskLevel] || RISK_CFG.low;
  const certs = PROFILE_CERTS[staff.id] || [
    { title: "Safeguarding Level 2",   status: "valid", days: 180 },
    { title: "First Aid",              status: "valid", days: 300 },
    { title: "Therapeutic Parenting",  status: "valid", days: 220 },
  ];

  const scoreColor = staff.score >= 90 ? "text-emerald-600" : staff.score >= 75 ? "text-amber-600" : "text-red-600";
  const scoreRing  = staff.score >= 90 ? "stroke-emerald-500" : staff.score >= 75 ? "stroke-amber-500" : "stroke-red-500";

  const circumference = 2 * Math.PI * 36;
  const dashOffset = circumference * (1 - staff.score / 100);

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-lg bg-white shadow-2xl flex flex-col animate-slide-in overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 to-blue-950 p-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl ${staff.avatarColor} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
              {staff.avatar}
            </div>
            <div>
              <h2 className="font-heading font-bold text-xl text-white">{staff.name}</h2>
              <p className="text-blue-300 text-sm">{staff.role}</p>
              <span className={`inline-flex items-center gap-1 mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${r.bg} ${r.text} ${r.border}`}>
                {r.label}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
            <X size={15} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Score ring */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-6">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="36" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                <circle cx="40" cy="40" r="36" fill="none" strokeWidth="8" strokeLinecap="round"
                  className={scoreRing}
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  style={{ transition: "stroke-dashoffset 1s ease" }}
                />
                <text x="40" y="40" textAnchor="middle" dominantBaseline="central" className="rotate-90 origin-center"
                  style={{ fontSize: 16, fontWeight: 800, fill: "currentColor", transform: "rotate(90deg)", transformOrigin: "40px 40px" }}>
                </text>
              </svg>
              <div>
                <p className={`text-3xl font-heading font-bold ${scoreColor}`}>{staff.score}%</p>
                <p className="text-sm text-slate-600 font-semibold">Compliance Score</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
                  <span>📜 {staff.certs} certificates</span>
                  <span>⏰ {staff.cpdHours}h CPD</span>
                  <span>✅ {staff.mandatoryPct}% mandatory</span>
                  <span>🔔 {staff.renewalsDue} renewals due</span>
                </div>
              </div>
            </div>
          </div>

          {/* Certificates */}
          <div className="p-6 space-y-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Certificates</h3>
            {certs.map((c, i) => {
              const isExpired = c.status === "expired";
              const isExpiring = c.status === "expiring_soon";
              return (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${isExpired ? "bg-red-50 border-red-200" : isExpiring ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"}`}>
                  {isExpired ? <Clock size={14} className="text-red-500 flex-shrink-0" />
                    : isExpiring ? <AlertTriangle size={14} className="text-amber-500 flex-shrink-0" />
                    : <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />}
                  <span className="text-xs font-semibold text-slate-800 flex-1">{c.title}</span>
                  <span className={`text-[10px] font-bold ${isExpired ? "text-red-600" : isExpiring ? "text-amber-600" : "text-emerald-600"}`}>
                    {isExpired ? `Expired ${Math.abs(c.days)}d ago` : isExpiring ? `${c.days}d left` : `${c.days}d`}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Recommendations */}
          <div className="p-6 space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recommended Actions</h3>
            {staff.expired > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-red-700">🚨 Expired Certificate — Urgent Action</p>
                  <p className="text-[11px] text-red-600 mt-0.5">Renew expired certificate immediately to restore compliance.</p>
                </div>
                <button className="h-7 px-2 text-[10px] font-semibold bg-red-600 text-white rounded-lg hover:bg-red-500 flex items-center gap-1 whitespace-nowrap transition-colors">
                  <RefreshCw size={9} /> Assign Renewal
                </button>
              </div>
            )}
            {staff.mandatoryPct < 100 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-amber-700">⚠️ Mandatory Training Incomplete</p>
                  <p className="text-[11px] text-amber-600 mt-0.5">{100 - staff.mandatoryPct}% of mandatory training still outstanding.</p>
                </div>
                <button className="h-7 px-2 text-[10px] font-semibold bg-amber-500 text-white rounded-lg hover:bg-amber-400 flex items-center gap-1 whitespace-nowrap transition-colors">
                  <Send size={9} /> Assign Training
                </button>
              </div>
            )}
            {staff.renewalsDue > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-blue-700">🔔 {staff.renewalsDue} Renewal{staff.renewalsDue > 1 ? "s" : ""} Due Soon</p>
                  <p className="text-[11px] text-blue-600 mt-0.5">Send renewal reminder to avoid compliance gap.</p>
                </div>
                <button className="h-7 px-2 text-[10px] font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-1 whitespace-nowrap transition-colors">
                  <Send size={9} /> Remind
                </button>
              </div>
            )}
            {staff.score >= 90 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                <p className="text-xs font-bold text-emerald-700">✅ Staff member is compliant — no immediate action required</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}