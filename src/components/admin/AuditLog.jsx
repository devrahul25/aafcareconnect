import { AUDIT_LOG } from "@/lib/platformStore";

const MODULE_COLORS = {
  "Learning Hub":          "bg-blue-50 text-blue-700 border-blue-200",
  "CPD Hub":               "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Compliance Hub":        "bg-red-50 text-red-700 border-red-200",
  "Professional Passport": "bg-violet-50 text-violet-700 border-violet-200",
  "Administration":        "bg-slate-100 text-slate-600 border-slate-200",
};

export default function AuditLog({ userId, limit }) {
  const entries = userId
    ? AUDIT_LOG.filter(a => a.userId === userId)
    : AUDIT_LOG;
  const display = limit ? entries.slice(0, limit) : entries;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">🔄 Auto Updated</span>
        <span className="text-[10px] text-slate-400">Platform-wide audit trail — every action logged automatically</span>
      </div>
      {display.map(entry => (
        <div key={entry.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
          <span className="text-xl flex-shrink-0">{entry.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800">{entry.detail}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-[10px] text-slate-400">{entry.userName}</span>
              <span className="text-slate-300">·</span>
              <span className="text-[10px] text-slate-400">{new Date(entry.timestamp).toLocaleDateString("en-GB", { day:"2-digit", month:"short", hour:"2-digit", minute:"2-digit" })}</span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${MODULE_COLORS[entry.module] || MODULE_COLORS["Administration"]}`}>{entry.module}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}