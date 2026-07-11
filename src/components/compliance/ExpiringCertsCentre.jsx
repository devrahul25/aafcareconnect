import { useState } from "react";
import { Send, BookOpen, Download, CheckCircle2 } from "lucide-react";
import { EXPIRING_CERTS, EXPIRED_CERTS, fmt, daysUntil } from "@/lib/complianceData";

function getBand(days) {
  if (days <= 30) return { label: "Within 30 Days", color: "text-red-600",   bg: "bg-red-50",   border: "border-red-200"   };
  if (days <= 60) return { label: "Within 60 Days", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" };
  return              { label: "Within 90 Days", color: "text-blue-600",  bg: "bg-blue-50",  border: "border-blue-200"  };
}

export default function ExpiringCertsCentre() {
  const [reminded, setReminded] = useState(new Set(EXPIRING_CERTS.filter(c => c.reminderSent).map(c => c.id)));
  const [tab, setTab] = useState("expiring");

  const handleRemind = (id) => setReminded(s => new Set(s).add(id));

  const certs = tab === "expiring" ? EXPIRING_CERTS : EXPIRED_CERTS;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Expiring ≤30d", value: EXPIRING_CERTS.filter(c => daysUntil(c.expiry) <= 30).length, bg: "bg-red-50",   border: "border-red-200",   text: "text-red-600"   },
          { label: "Expiring ≤60d", value: EXPIRING_CERTS.filter(c => { const d = daysUntil(c.expiry); return d > 30 && d <= 60; }).length, bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-600" },
          { label: "Expiring ≤90d", value: EXPIRING_CERTS.filter(c => daysUntil(c.expiry) > 60).length, bg: "bg-blue-50",  border: "border-blue-200",  text: "text-blue-600"  },
        ].map(s => (
          <div key={s.label} className={`card p-4 text-center ${s.bg} border ${s.border}`}>
            <p className={`text-2xl font-heading font-bold ${s.text}`}>{s.value}</p>
            <p className={`text-xs font-semibold ${s.text}`}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        {/* Tabs + toolbar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
            {[["expiring","Expiring Soon"],["expired","Expired"]].map(([k,l]) => (
              <button key={k} onClick={() => setTab(k)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${tab === k ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                {l}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button className="h-8 px-3 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-1.5 transition-colors">
              <Send size={11} /> Remind All
            </button>
            <button className="h-8 px-3 text-xs font-semibold border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 transition-colors">
              <Download size={11} /> Export
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {certs.map(cert => {
            const days = daysUntil(cert.expiry);
            const band = tab === "expiring" ? getBand(days) : { label: "Expired", color: "text-red-700", bg: "bg-red-50", border: "border-red-200" };
            const isSent = reminded.has(cert.id);

            return (
              <div key={cert.id} className={`flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors`}>
                <div className={`w-8 h-8 rounded-full ${cert.avatarColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>{cert.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-slate-900">{cert.title}</p>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${band.bg} ${band.color} ${band.border}`}>{band.label}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{cert.person} · {cert.provider} · {cert.category}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-bold ${band.color}`}>
                    {tab === "expired" ? fmt(cert.expiry) : `${days}d`}
                  </p>
                  <p className="text-[10px] text-slate-400">{tab === "expired" ? "expired" : "remaining"}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleRemind(cert.id)}
                    className={`h-8 px-3 text-[10px] font-semibold rounded-lg flex items-center gap-1 transition-all ${
                      isSent ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-blue-600 text-white hover:bg-blue-500"
                    }`}
                  >
                    {isSent ? <><CheckCircle2 size={10} /> Sent</> : <><Send size={10} /> Remind</>}
                  </button>
                  <button className="h-8 px-3 text-[10px] font-semibold border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 flex items-center gap-1 transition-colors">
                    <BookOpen size={10} /> Assign
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}