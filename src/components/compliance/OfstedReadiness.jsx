import { Shield, CheckCircle2, AlertTriangle, XCircle, Download } from "lucide-react";

const STATUS_CFG = {
  green: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", label: "Compliant"        },
  amber: { icon: AlertTriangle,color: "text-amber-600",  bg: "bg-amber-50",   border: "border-amber-200",   label: "Action Required"  },
  red:   { icon: XCircle,      color: "text-red-600",    bg: "bg-red-50",     border: "border-red-200",     label: "Non-Compliant"    },
};

const ACT_CFG = {
  red:   { bg: "bg-red-50",    border: "border-l-red-500",   icon: XCircle,       text: "text-red-700"    },
  amber: { bg: "bg-amber-50",  border: "border-l-amber-500", icon: AlertTriangle,  text: "text-amber-700"  },
  green: { bg: "bg-emerald-50",border: "border-l-emerald-500",icon: CheckCircle2, text: "text-emerald-700" },
};

export default function OfstedReadiness({ score }) {
  const currentScore = score !== undefined ? score : 100;
  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference * (1 - currentScore / 100);

  const ofstedAreas = [
    { area: "Safeguarding & Child Protection", score: currentScore, icon: "🛡️", status: currentScore >= 90 ? "green" : currentScore >= 75 ? "amber" : "red" },
    { area: "Workforce Competency & Training", score: currentScore, icon: "👥", status: currentScore >= 90 ? "green" : currentScore >= 75 ? "amber" : "red" },
    { area: "Statutory Health, Safety & Governance", score: Math.min(100, currentScore + 2), icon: "📋", status: currentScore >= 85 ? "green" : "amber" },
    { area: "Care Practice & Record Keeping", score: currentScore, icon: "📁", status: currentScore >= 90 ? "green" : currentScore >= 75 ? "amber" : "red" },
  ];

  const ofstedActions = currentScore >= 90
    ? [
        { severity: "green", text: "All statutory fostering regulations and staff qualifications meet Ofsted compliance benchmarks." },
        { severity: "green", text: "Regular training auditing is active. Agency is well-prepared for inspection review." }
      ]
    : [
        { severity: currentScore < 75 ? "red" : "amber", text: "Review overdue staff certifications and schedule renewal sessions to avoid inspection non-compliance findings." },
        { severity: "amber", text: "Ensure all statutory training registers in Learning Hub are fully updated." }
      ];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Hero */}
      <div className="card p-6 bg-gradient-to-br from-slate-900 to-blue-950 border-0 text-white">
        <div className="flex items-center gap-6">
          {/* Circular gauge */}
          <div className="relative flex-shrink-0">
            <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
              <circle cx="60" cy="60" r="54" fill="none" strokeWidth="10" strokeLinecap="round"
                stroke={currentScore >= 90 ? "#10b981" : currentScore >= 75 ? "#f59e0b" : "#ef4444"}
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ transition: "stroke-dashoffset 1.2s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="font-heading font-bold text-3xl text-white">{currentScore}%</p>
              <p className="text-[9px] text-slate-400 uppercase tracking-wider">Readiness</p>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Shield size={18} className="text-blue-400" />
              <h2 className="font-heading font-bold text-xl text-white">Ofsted Inspection Readiness</h2>
            </div>
            <p className="text-slate-300 text-sm mb-3">
              {currentScore >= 90
                ? "✅ Your agency is inspection-ready. Maintain current standards."
                : currentScore >= 75
                ? "⚠️ Minor actions recommended before inspection. Review items below."
                : "🚨 Compliance attention required. Promptly renew overdue records."}
            </p>
            <div className="flex gap-3">
              <button className="h-8 px-4 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center gap-1.5 transition-colors">
                <Download size={12} /> Generate Ofsted Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Area breakdown */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {ofstedAreas.map(area => {
          const s = STATUS_CFG[area.status];
          const Icon = s.icon;
          return (
            <div key={area.area} className={`card p-4 ${s.bg} border ${s.border}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{area.icon}</span>
                <Icon size={16} className={s.color} />
              </div>
              <p className={`text-xl font-heading font-bold ${s.color}`}>{area.score}%</p>
              <p className="text-xs font-bold text-slate-700 mt-0.5">{area.area}</p>
              <span className={`text-[9px] font-bold ${s.color}`}>{s.label}</span>
            </div>
          );
        })}
      </div>

      {/* Action items */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Inspection Action Items</h3>
          <p className="text-xs text-slate-400 mt-0.5">Real-time items requiring review before statutory inspection</p>
        </div>
        <div className="divide-y divide-slate-50">
          {ofstedActions.map((a, i) => {
            const c = ACT_CFG[a.severity];
            const Icon = c.icon;
            return (
              <div key={i} className={`flex items-center gap-3 px-5 py-3.5 border-l-4 ${c.bg} ${c.border}`}>
                <Icon size={15} className={c.text + " flex-shrink-0"} />
                <p className={`text-sm font-medium ${c.text}`}>{a.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}