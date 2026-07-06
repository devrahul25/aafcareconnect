// @ts-nocheck
import { Calendar, Clock, Award, TrendingUp } from "lucide-react";
import { CPD_TIMELINE, fmtShort } from "@/lib/cpdData";

const CAT_COLORS = {
  "Safeguarding":          { dot: "bg-blue-600",   line: "bg-blue-100",   badge: "bg-blue-50 text-blue-700"   },
  "Therapeutic Parenting": { dot: "bg-violet-600", line: "bg-violet-100", badge: "bg-violet-50 text-violet-700" },
  "Health & Safety":       { dot: "bg-emerald-600",line: "bg-emerald-100",badge: "bg-emerald-50 text-emerald-700" },
  "Mental Health":         { dot: "bg-teal-600",   line: "bg-teal-100",   badge: "bg-teal-50 text-teal-700"   },
  "Legislation":           { dot: "bg-indigo-600", line: "bg-indigo-100", badge: "bg-indigo-50 text-indigo-700" },
  "Equality & Diversity":  { dot: "bg-pink-600",   line: "bg-pink-100",   badge: "bg-pink-50 text-pink-700"   },
  "Practice Skills":       { dot: "bg-slate-600",  line: "bg-slate-200",  badge: "bg-slate-100 text-slate-700" },
  "Attachment":            { dot: "bg-amber-600",  line: "bg-amber-100",  badge: "bg-amber-50 text-amber-700" },
};

// Group by year
function groupByYear(items) {
  return items.reduce((acc, item) => {
    const y = new Date(item.date).getFullYear();
    if (!acc[y]) acc[y] = [];
    acc[y].push(item);
    return acc;
  }, {});
}

export default function CPDTimeline() {
  const sorted = [...CPD_TIMELINE].sort((a, b) => new Date(b.date) - new Date(a.date));
  const byYear = groupByYear(sorted);
  const years = Object.keys(byYear).sort((a, b) => b - a);
  const totalHours = CPD_TIMELINE.reduce((s, e) => s + e.hours, 0);
  const totalCerts = CPD_TIMELINE.length;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card p-4 text-center">
          <p className="text-2xl font-heading font-bold text-slate-900">{totalCerts}</p>
          <p className="text-xs text-slate-500 mt-0.5">Qualifications earned</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-heading font-bold text-blue-600">{totalHours}h</p>
          <p className="text-xs text-slate-500 mt-0.5">Total CPD hours</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-heading font-bold text-emerald-600">{years.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Years of continuous CPD</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="card p-6 space-y-8">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">Professional Learning Journey</h3>
        </div>

        {years.map((year) => (
          <div key={year}>
            {/* Year marker */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">{year}</span>
              </div>
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-xs text-slate-400 font-medium">
                {byYear[year].reduce((s, e) => s + e.hours, 0)}h CPD
              </span>
            </div>

            <div className="space-y-0 ml-5 relative">
              {/* Vertical connector */}
              <div className="absolute left-4 top-2 bottom-2 w-px bg-slate-100" />

              {byYear[year].map((event, i) => {
                const c = CAT_COLORS[event.category] || CAT_COLORS["Practice Skills"];
                return (
                  <div key={i} className="relative flex items-start gap-4 pb-5 last:pb-0 group">
                    {/* Dot */}
                    <div className={`relative z-10 w-9 h-9 rounded-full ${c.dot} flex items-center justify-center text-lg flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform`}>
                      {event.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1 pb-4 border-b border-slate-50 last:border-0 group-hover:translate-x-0.5 transition-transform">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{event.title}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">{event.provider}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.badge}`}>{event.category}</span>
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 rounded-full px-2 py-0.5">{event.hours}h</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-1.5">
                        <Calendar size={10} className="text-slate-400" />
                        <span className="text-[10px] text-slate-400">{fmtShort(event.date)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}