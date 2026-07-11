import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { AlertTriangle, CheckCircle2, Clock, TrendingUp, Users, Send } from "lucide-react";
import { AGENCY_COMPLIANCE, LEARNER_COMPLIANCE, CERTS, daysUntil } from "@/lib/cpdData";

const expiring = CERTS.filter(c => c.status === "expiring_soon");
const expired = CERTS.filter(c => c.status === "expired");
const compliantCount = LEARNER_COMPLIANCE.filter(l => l.compliant).length;
const complianceRate = Math.round((compliantCount / LEARNER_COMPLIANCE.length) * 100);

function RenewalForecastRow({ cert }) {
  const days = daysUntil(cert.expiry);
  const urgency = days < 0 ? "expired" : days <= 7 ? "critical" : days <= 30 ? "high" : "medium";
  const cfg = {
    expired:  { bg: "bg-red-50",    border: "border-red-200",   text: "text-red-700",   tag: "Expired"      },
    critical: { bg: "bg-red-50",    border: "border-red-200",   text: "text-red-700",   tag: `${days}d left` },
    high:     { bg: "bg-amber-50",  border: "border-amber-200", text: "text-amber-700", tag: `${days}d left` },
    medium:   { bg: "bg-blue-50",   border: "border-blue-200",  text: "text-blue-700",  tag: `${days}d left` },
  };
  const c = cfg[urgency];
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border ${c.bg} ${c.border}`}>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-slate-900 truncate">{cert.title}</p>
        <p className="text-[10px] text-slate-500">{cert.person} · {cert.provider}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={`text-[10px] font-bold ${c.text}`}>{c.tag}</span>
        <button className="h-6 px-2 text-[10px] font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors flex items-center gap-1">
          <Send size={8} /> Remind
        </button>
      </div>
    </div>
  );
}

export default function ManagerComplianceDashboard() {
  return (
    <div className="space-y-5 animate-fade-in">
      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Agency Compliance Rate", value: `${complianceRate}%`, sub: `${compliantCount}/${LEARNER_COMPLIANCE.length} learners`, icon: TrendingUp, bg: "bg-emerald-600", trend: "+3%" },
          { title: "Certificates Expiring", value: expiring.length, sub: "Next 90 days", icon: Clock, bg: "bg-amber-500" },
          { title: "Expired — Action Needed", value: expired.length, sub: "Urgent renewal required", icon: AlertTriangle, bg: "bg-red-600" },
          { title: "Total Active Learners", value: LEARNER_COMPLIANCE.length, sub: "Across agency", icon: Users, bg: "bg-blue-600" },
        ].map(k => {
          const Icon = k.icon;
          return (
            <div key={k.title} className="card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-xl ${k.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={16} className="text-white" />
                </div>
                {k.trend && (
                  <span className="ml-auto text-[10px] font-bold text-emerald-600 bg-emerald-50 rounded-full px-2 py-0.5">{k.trend}</span>
                )}
              </div>
              <p className="text-2xl font-heading font-bold text-slate-900">{k.value}</p>
              <p className="text-[11px] font-semibold text-slate-500 mt-0.5">{k.title}</p>
              <p className="text-[10px] text-slate-400">{k.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Compliance trend chart */}
        <div className="card p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-1">6-Month Compliance Trend</h3>
          <p className="text-[11px] text-slate-400 mb-4">% of learners with all valid certificates</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={AGENCY_COMPLIANCE} barSize={22} barGap={4}>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={[60, 100]} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
              <Bar dataKey="compliant" name="Compliant %" radius={[4, 4, 0, 0]} fill="#2563eb" />
              <Bar dataKey="atRisk"    name="At Risk %"    radius={[4, 4, 0, 0]} fill="#f59e0b" />
              <Bar dataKey="expired"   name="Expired %"   radius={[4, 4, 0, 0]} fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2 justify-center">
            {[["#2563eb","Compliant"],["#f59e0b","At Risk"],["#ef4444","Expired"]].map(([col, lbl]) => (
              <div key={lbl} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: col }} />
                {lbl}
              </div>
            ))}
          </div>
        </div>

        {/* Learner compliance table */}
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Learner Compliance</h3>
            <span className="text-xs text-slate-400">{LEARNER_COMPLIANCE.length} learners</span>
          </div>
          <div className="divide-y divide-slate-50">
            {LEARNER_COMPLIANCE.map(l => (
              <div key={l.name} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors group">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold flex-shrink-0">
                  {l.name.split(" ").map(w => w[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{l.name}</p>
                  <p className="text-[10px] text-slate-400">{l.role} · {l.hours}h CPD</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {l.expired > 0 && <span className="text-[9px] font-bold text-red-600 bg-red-50 rounded-full px-1.5 py-0.5">{l.expired} expired</span>}
                  {l.expiring > 0 && <span className="text-[9px] font-bold text-amber-600 bg-amber-50 rounded-full px-1.5 py-0.5">{l.expiring} expiring</span>}
                  {l.compliant ? (
                    <CheckCircle2 size={15} className="text-emerald-500" />
                  ) : (
                    <AlertTriangle size={15} className="text-red-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Renewal forecast */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Renewal Forecast & Reminders</h3>
            <p className="text-xs text-slate-400 mt-0.5">Certificates requiring action in the next 90 days</p>
          </div>
          <button className="h-8 px-3 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-1.5 transition-colors">
            <Send size={11} /> Bulk Remind All
          </button>
        </div>
        <div className="space-y-2">
          {[...expiring, ...expired].map(c => (
            <RenewalForecastRow key={c.id} cert={c} />
          ))}
        </div>
      </div>
    </div>
  );
}