import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck } from "lucide-react";
import { fmt, daysUntil } from "@/lib/passportData";

const STATUS_CFG = {
  compliant: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500", label: "Compliant" },
  action:    { icon: AlertTriangle, color: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-200",  dot: "bg-amber-500",  label: "Action Required" },
  expired:   { icon: XCircle,       color: "text-red-600",    bg: "bg-red-50",    border: "border-red-200",    dot: "bg-red-500",    label: "Non-Compliant" },
};

export default function PassportCompliance({ complianceItems = [], complianceScore = 100 }) {
  const compliant = complianceItems.filter(i => i.status === "compliant").length;
  const action = complianceItems.filter(i => i.status === "action").length;
  const expired = complianceItems.filter(i => i.status === "expired").length;

  const score = Math.max(0, Math.min(100, Math.round(complianceScore)));

  const getGrade = (s) => {
    if (s >= 90) return { label: "Outstanding / Excellent", color: "text-emerald-600", bg: "bg-emerald-50" };
    if (s >= 75) return { label: "Good Standard", color: "text-blue-600", bg: "bg-blue-50" };
    if (s >= 60) return { label: "Action Plan Needed", color: "text-amber-600", bg: "bg-amber-50" };
    return { label: "Non-Compliant Risk", color: "text-red-600", bg: "bg-red-50" };
  };

  const grade = getGrade(score);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Score hero */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1 card p-6 text-center bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 border-emerald-200 shadow-sm flex flex-col justify-center">
          <p className="text-5xl font-heading font-bold text-emerald-600">{score}%</p>
          <p className={`text-xs font-bold mt-1.5 ${grade.color}`}>{grade.label}</p>
          <p className="text-[11px] text-slate-500 mt-1">Live Ofsted Compliance Score</p>
          <div className="mt-3 h-2 bg-emerald-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
              style={{ width: `${score}%` }}
            />
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
            <div key={s.label2} className={`card p-5 text-center ${s.bg} border ${s.border} shadow-sm flex flex-col justify-center`}>
              <Icon size={24} className={`${s.color} mx-auto mb-2`} />
              <p className={`text-3xl font-heading font-bold ${s.color}`}>{s.count}</p>
              <p className={`text-xs font-semibold ${s.color}`}>{s.label2}</p>
              <div className={`w-2.5 h-2.5 rounded-full ${s.dot} mx-auto mt-2 ${s.count > 0 && s.label2 !== "Compliant" ? "animate-pulse" : ""}`} />
            </div>
          );
        })}
      </div>

      {/* Items table */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Mandatory & Regulatory Compliance Requirements</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Traffic light status derived from verified CPD records, certifications, and statutory training
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            {complianceItems.length} Monitored Standards
          </span>
        </div>

        {complianceItems.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No compliance items logged yet. Items will populate based on your statutory role requirements.
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {complianceItems.map((item, i) => {
              const s = STATUS_CFG[item.status] || STATUS_CFG.compliant;
              const Icon = s.icon;
              const days = item.expiry ? daysUntil(item.expiry) : null;

              return (
                <div key={i} className={`flex items-center gap-4 px-5 py-3.5 hover:${s.bg} transition-colors`}>
                  <div className={`w-8 h-8 rounded-lg ${s.bg} border ${s.border} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={15} className={s.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                      {item.mandatory && (
                        <span className="text-[9px] font-bold text-red-600 bg-red-50 border border-red-200 rounded-full px-1.5 py-0.5">
                          Mandatory
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">
                      {item.expiry ? `Expires: ${fmt(item.expiry)}` : `Provider: ${item.provider || "AAF CareConnect"}`}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-xs font-bold ${s.color}`}>{s.label}</p>
                    {days !== null && days > 0 && days <= 90 && (
                      <p className="text-[10px] text-amber-500 font-semibold">{days}d remaining</p>
                    )}
                    {days !== null && days <= 0 && (
                      <p className="text-[10px] text-red-600 font-semibold">Overdue / Expired</p>
                    )}
                  </div>
                  {/* Traffic light dot */}
                  <div
                    className={`w-3 h-3 rounded-full flex-shrink-0 ${s.dot} ${
                      item.status !== "compliant" ? "animate-pulse" : ""
                    }`}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}