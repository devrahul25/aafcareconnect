import { RISK_ITEMS } from "@/lib/complianceData";
import { AlertTriangle, Flame, Info, Send, RefreshCw } from "lucide-react";

const RISK_CFG = {
  critical: { bg: "bg-red-600",    light: "bg-red-50",    border: "border-red-200",    text: "text-red-700",    icon: Flame,         label: "Critical" },
  high:     { bg: "bg-red-500",    light: "bg-red-50",    border: "border-red-200",    text: "text-red-600",    icon: AlertTriangle, label: "High Risk" },
  medium:   { bg: "bg-amber-500",  light: "bg-amber-50",  border: "border-amber-200",  text: "text-amber-700",  icon: AlertTriangle, label: "Medium Risk" },
  low:      { bg: "bg-blue-500",   light: "bg-blue-50",   border: "border-blue-200",   text: "text-blue-700",   icon: Info,          label: "Low Risk"  },
};

const HEAT_MAP = [
  [5,3,1,0],[4,4,2,1],[2,3,3,2],[1,1,2,3]
];
const HEAT_LABELS_X = ["People","Process","Cert","Training"];
const HEAT_LABELS_Y = ["Critical","High","Medium","Low"];
const HEAT_COLOR = (v) => v >= 4 ? "bg-red-600 text-white" : v >= 3 ? "bg-amber-500 text-white" : v >= 2 ? "bg-yellow-400 text-slate-900" : v >= 1 ? "bg-emerald-200 text-emerald-900" : "bg-slate-100 text-slate-400";

export default function RiskPanel() {
  const groups = ["critical","high","medium","low"];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Risk items */}
        <div className="space-y-3">
          {groups.map(level => {
            const items = RISK_ITEMS.filter(r => r.level === level);
            if (!items.length) return null;
            const cfg = RISK_CFG[level];
            const Icon = cfg.icon;
            return (
              <div key={level}>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-t-xl ${cfg.bg}`}>
                  <Icon size={13} className="text-white" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">{cfg.label}</span>
                  <span className="ml-auto text-xs font-bold bg-white/20 text-white rounded-full px-1.5">{items.length}</span>
                </div>
                <div className={`border-x border-b ${cfg.border} rounded-b-xl overflow-hidden`}>
                  {items.map((r, i) => (
                    <div key={i} className={`flex items-start gap-3 px-4 py-3 ${i > 0 ? `border-t ${cfg.border}` : ""} ${cfg.light} hover:brightness-95 transition-all`}>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold ${cfg.text}`}>{r.person} — {r.area}</p>
                        <p className="text-[11px] text-slate-600 mt-0.5">{r.issue}</p>
                      </div>
                      <button className={`h-6 px-2 text-[9px] font-semibold text-white rounded-md flex items-center gap-1 flex-shrink-0 transition-colors ${cfg.bg} hover:opacity-80`}>
                        {r.days < 0 ? <><RefreshCw size={9} /> Renew</> : <><Send size={9} /> Remind</>}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Heat map */}
        <div className="card p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Risk Heat Map</h3>
          <p className="text-xs text-slate-400 mb-4">Risk distribution across domains and severity levels</p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="w-20" />
                  {HEAT_LABELS_X.map(l => (
                    <th key={l} className="text-[10px] font-bold text-slate-500 pb-2 text-center">{l}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HEAT_MAP.map((row, ri) => (
                  <tr key={ri}>
                    <td className="text-[10px] font-bold text-slate-500 pr-2 py-1 whitespace-nowrap">{HEAT_LABELS_Y[ri]}</td>
                    {row.map((val, ci) => (
                      <td key={ci} className="p-1">
                        <div className={`w-full aspect-square rounded-lg flex items-center justify-center text-sm font-bold ${HEAT_COLOR(val)} transition-all hover:scale-105`}>
                          {val > 0 ? val : "·"}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Risk count:</p>
            {[[0,"bg-slate-100","None"],[1,"bg-emerald-200","1"],[2,"bg-yellow-400","2"],[3,"bg-amber-500","3+"],[4,"bg-red-600","4+"]].map(([,bg,label]) => (
              <div key={label} className="flex items-center gap-1 text-[10px] text-slate-500">
                <div className={`w-3 h-3 rounded-sm ${bg}`} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}