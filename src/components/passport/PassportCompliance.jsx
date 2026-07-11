import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { COMPLIANCE_ITEMS, PASSPORT_PROFILE, fmt, daysUntil } from "@/lib/passportData";

const STATUS_CFG = {
  compliant: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500", label: "Compliant"        },
  action:    { icon: AlertTriangle, color: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-200",  dot: "bg-amber-500",  label: "Action Required"  },
  expired:   { icon: XCircle,       color: "text-red-600",    bg: "bg-red-50",    border: "border-red-200",    dot: "bg-red-500",    label: "Non-Compliant"    },
};

export default function PassportCompliance() {
  const compliant = COMPLIANCE_ITEMS.filter(i => i.status === "compliant").length;
  const action = COMPLIANCE_ITEMS.filter(i => i.status === "action").length;
  const expired = COMPLIANCE_ITEMS.filter(i => i.status === "expired").length;
  const score = PASSPORT_PROFILE.complianceScore;

  const getGrade = (s) => {
    if (s >= 90) return { label: "Excellent", color: "text-emerald-600" };
    if (s >= 75) return { label: "Good", color: "text-blue-600" };
    if (s >= 60) return { label: "Needs Improvement", color: "text-amber-600" };
    return { label: "Non-Compliant", color: "text-red-600" };
  };
  const grade = getGrade(score);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Score hero */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1 card p-6 text-center bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
          <p className="text-5xl font-heading font-bold text-emerald-600">{score}%</p>
          <p className={`text-sm font-bold mt-1 ${grade.color}`}>{grade.label}</p>
          <p className="text-xs text-slate-500 mt-1">Overall Compliance Score</p>
          <div className="mt-3 h-2 bg-emerald-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${score}%` }} />
          </div>
        </div>

        {/* Traffic light summary */}
        {[
          { ...STATUS_CFG.compliant, count: compliant, label2: "Compliant" },
          { ...STATUS_CFG.action,    count: action,    label2: "Action Required" },
          { ...STATUS_CFG.expired,   count: expired,   label2: "Non-Compliant" },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label2} className={`card p-5 text-center ${s.bg} border ${s.border}`}>
              <Icon size={24} className={`${s.color} mx-auto mb-2`} />
              <p className={`text-3xl font-heading font-bold ${s.color}`}>{s.count}</p>
              <p className={`text-xs font-semibold ${s.color}`}>{s.label2}</p>
              <div className={`w-3 h-3 rounded-full ${s.dot} mx-auto mt-2 animate-pulse`} />
            </div>
          );
        })}
      </div>

      {/* Items table */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Compliance Requirements</h3>
          <p className="text-xs text-slate-400 mt-0.5">Traffic light status for all mandatory and recommended requirements</p>
        </div>
        <div className="divide-y divide-slate-50">
          {COMPLIANCE_ITEMS.map((item, i) => {
            const s = STATUS_CFG[item.status] || STATUS_CFG.compliant;
            const Icon = s.icon;
            const days = daysUntil(item.expiry);
            return (
              <div key={i} className={`flex items-center gap-4 px-5 py-3.5 hover:${s.bg} transition-colors`}>
                <div className={`w-8 h-8 rounded-lg ${s.bg} border ${s.border} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={15} className={s.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    {item.mandatory && <span className="text-[9px] font-bold text-red-600 bg-red-50 border border-red-200 rounded-full px-1.5 py-0.5">Mandatory</span>}
                  </div>
                  <p className="text-xs text-slate-400">Expires {fmt(item.expiry)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-xs font-bold ${s.color}`}>{s.label}</p>
                  {days > 0 && days <= 90 && (
                    <p className="text-[10px] text-amber-500 font-semibold">{days}d remaining</p>
                  )}
                  {days <= 0 && (
                    <p className="text-[10px] text-red-600 font-semibold">Expired</p>
                  )}
                </div>
                {/* Traffic light dot */}
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${s.dot} ${item.status !== "compliant" ? "animate-pulse" : ""}`} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}