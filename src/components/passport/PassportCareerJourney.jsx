// @ts-nocheck
import { useState } from "react";
import { CAREER_TIMELINE } from "@/lib/passportData";

const TYPE_CFG = {
  milestone: { ring: "ring-blue-500",   dot: "bg-blue-600",   bg: "bg-blue-50",   border: "border-blue-200",   text: "text-blue-700",   label: "Milestone"  },
  placement: { ring: "ring-violet-500", dot: "bg-violet-600", bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-700", label: "Placement"  },
  cert:      { ring: "ring-emerald-500",dot: "bg-emerald-600",bg: "bg-emerald-50",border: "border-emerald-200",text: "text-emerald-700",label: "Certificate" },
  level:     { ring: "ring-amber-500",  dot: "bg-amber-500",  bg: "bg-amber-50",  border: "border-amber-200",  text: "text-amber-700",  label: "Level Up"   },
};

const groupByYear = (items) => items.reduce((acc, item) => {
  if (!acc[item.year]) acc[item.year] = [];
  acc[item.year].push(item);
  return acc;
}, {});

export default function PassportCareerJourney() {
  const [expanded, setExpanded] = useState(new Set(["2026","2024"]));
  const sorted = [...CAREER_TIMELINE].sort((a, b) => b.year - a.year || 0);
  const byYear = groupByYear(sorted);
  const years = Object.keys(byYear).sort((a, b) => b - a);

  const toggle = (y) => setExpanded(s => { const n = new Set(s); n.has(y) ? n.delete(y) : n.add(y); return n; });

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Type legend */}
      <div className="card p-4 flex items-center gap-4 flex-wrap">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Key:</p>
        {Object.entries(TYPE_CFG).map(([type, cfg]) => (
          <div key={type} className="flex items-center gap-1.5 text-xs text-slate-600">
            <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="card p-6 space-y-6">
        {years.map(year => {
          const isOpen = expanded.has(year);
          const events = byYear[year];
          return (
            <div key={year}>
              {/* Year header */}
              <button onClick={() => toggle(year)} className="flex items-center gap-3 w-full group mb-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-700 transition-colors shadow-sm">
                  <span className="text-white text-sm font-bold">{year}</span>
                </div>
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                  {events.length} event{events.length !== 1 ? "s" : ""}  {isOpen ? "▲" : "▼"}
                </span>
              </button>

              {isOpen && (
                <div className="ml-6 space-y-0 relative">
                  {/* Vertical line */}
                  <div className="absolute left-4 top-2 bottom-2 w-px bg-slate-100" />

                  {events.map((event, i) => {
                    const c = TYPE_CFG[event.type] || TYPE_CFG.cert;
                    return (
                      <div key={i} className="relative flex items-start gap-4 pb-5 last:pb-0 group/item">
                        {/* Dot */}
                        <div className={`relative z-10 w-9 h-9 rounded-full ring-4 ring-white ${c.dot} flex items-center justify-center text-lg flex-shrink-0 shadow-sm group-hover/item:scale-110 transition-transform`}>
                          {event.icon}
                        </div>

                        {/* Content */}
                        <div className={`flex-1 ${c.bg} border ${c.border} rounded-xl p-3.5 pb-4 group-hover/item:shadow-md transition-shadow`}>
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <div>
                              <h4 className={`text-sm font-bold ${c.text}`}>{event.title}</h4>
                              <p className="text-xs text-slate-500 mt-0.5">{event.desc}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${c.border} ${c.text}`}>{c.label}</span>
                              <span className="text-[10px] text-slate-400 font-medium">{event.month} {year}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}