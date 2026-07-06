import { useState } from "react";
import { Bell, BellRing, CheckCircle2, X } from "lucide-react";
import { ALERTS } from "@/lib/complianceData";

const ALERT_CFG = {
  critical: { bg: "bg-red-50",    border: "border-l-red-500",    dot: "bg-red-500",   text: "text-red-700"   },
  warning:  { bg: "bg-amber-50",  border: "border-l-amber-500",  dot: "bg-amber-500", text: "text-amber-700" },
  info:     { bg: "bg-blue-50",   border: "border-l-blue-500",   dot: "bg-blue-500",  text: "text-blue-700"  },
};

export default function AlertCentre() {
  const [alerts, setAlerts] = useState(ALERTS);
  const [filter, setFilter] = useState("all");

  const dismiss = (id) => setAlerts(a => a.filter(x => x.id !== id));
  const markRead = (id) => setAlerts(a => a.map(x => x.id === id ? { ...x, read: true } : x));

  const visible = alerts.filter(a => filter === "all" || a.type === filter || (filter === "unread" && !a.read));
  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="card p-5 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="relative">
            <BellRing size={20} className="text-blue-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] font-bold text-white">{unreadCount}</span>
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Compliance Alert Centre</h3>
            <p className="text-xs text-slate-400">{unreadCount} unread alert{unreadCount !== 1 ? "s" : ""}</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          {[["all","All"],["critical","Critical"],["warning","Warnings"],["info","Info"],["unread","Unread"]].map(([k,l]) => (
            <button key={k} onClick={() => setFilter(k)}
              className={`h-8 px-3 text-xs font-semibold rounded-lg border transition-all ${filter === k ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-500 border-slate-200 hover:border-blue-300"}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {visible.length === 0 && (
          <div className="card p-8 text-center text-slate-400">
            <CheckCircle2 size={28} className="mx-auto mb-2 text-emerald-400" />
            <p className="text-sm">No alerts — everything looks great!</p>
          </div>
        )}
        {visible.map(alert => {
          const c = ALERT_CFG[alert.type] || ALERT_CFG.info;
          return (
            <div key={alert.id}
              className={`card border-l-4 ${c.border} ${c.bg} p-4 flex items-start gap-3 ${!alert.read ? "ring-1 ring-blue-100" : ""}`}
              onClick={() => markRead(alert.id)}
            >
              <span className="text-xl flex-shrink-0">{alert.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className={`text-sm font-bold ${c.text}`}>{alert.title}</p>
                  {!alert.read && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
                </div>
                <p className="text-xs text-slate-600 mt-0.5">{alert.body}</p>
                <p className="text-[10px] text-slate-400 mt-1">{alert.time}</p>
              </div>
              <button onClick={e => { e.stopPropagation(); dismiss(alert.id); }}
                className="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-white/60 transition-colors flex-shrink-0">
                <X size={12} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}