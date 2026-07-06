import { useState } from "react";
import { Search, ChevronRight, AlertTriangle, CheckCircle2, Clock, Download } from "lucide-react";
import { STAFF_COMPLIANCE } from "@/lib/complianceData";

const RISK_CFG = {
  low:    { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500", label: "Low Risk"    },
  medium: { bg: "bg-amber-50",  text: "text-amber-700",   border: "border-amber-200",   dot: "bg-amber-500",   label: "Medium Risk" },
  high:   { bg: "bg-red-50",    text: "text-red-700",     border: "border-red-200",     dot: "bg-red-500",     label: "High Risk"   },
};

function ScorePill({ score }) {
  const color = score >= 90 ? "text-emerald-600 bg-emerald-50 border-emerald-200"
              : score >= 75 ? "text-amber-600 bg-amber-50 border-amber-200"
              : "text-red-600 bg-red-50 border-red-200";
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${color}`}>{score}%</span>;
}

export default function StaffMatrix({ onSelect }) {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [sort, setSort] = useState("score_asc");

  let data = STAFF_COMPLIANCE.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) &&
    (riskFilter === "all" || s.riskLevel === riskFilter)
  );
  if (sort === "score_asc")  data = [...data].sort((a,b) => a.score - b.score);
  if (sort === "score_desc") data = [...data].sort((a,b) => b.score - a.score);
  if (sort === "name")       data = [...data].sort((a,b) => a.name.localeCompare(b.name));

  return (
    <div className="card overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-100 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search staff…"
            className="w-full h-9 pl-9 pr-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400" />
        </div>
        <div className="flex gap-1.5">
          {[["all","All"],["low","Low Risk"],["medium","Med Risk"],["high","High Risk"]].map(([k,l]) => (
            <button key={k} onClick={() => setRiskFilter(k)}
              className={`h-9 px-3 text-xs font-semibold rounded-lg border transition-all ${riskFilter === k ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"}`}>
              {l}
            </button>
          ))}
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)}
          className="h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="score_asc">Sort: Lowest Score</option>
          <option value="score_desc">Sort: Highest Score</option>
          <option value="name">Sort: Name A–Z</option>
        </select>
        <button className="h-9 px-3 text-xs font-semibold border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 transition-colors">
          <Download size={12} /> Export
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {["Staff Member","Role","Compliance","Certificates","Mandatory Training","Renewals Due","Risk Level",""].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map(s => {
              const r = RISK_CFG[s.riskLevel];
              return (
                <tr key={s.id} onClick={() => onSelect(s)} className="hover:bg-blue-50/30 transition-colors cursor-pointer group">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${s.avatarColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>{s.avatar}</div>
                      <span className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-500">{s.role}</td>
                  <td className="px-4 py-3.5"><ScorePill score={s.score} /></td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-emerald-600 font-semibold">{s.validCerts}✓</span>
                      {s.expiring > 0 && <span className="text-amber-500 font-semibold">{s.expiring}⚠</span>}
                      {s.expired > 0  && <span className="text-red-600 font-semibold">{s.expired}✗</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${s.mandatoryPct === 100 ? "bg-emerald-500" : s.mandatoryPct >= 80 ? "bg-amber-400" : "bg-red-500"}`} style={{ width: `${s.mandatoryPct}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-slate-600">{s.mandatoryPct}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    {s.renewalsDue > 0
                      ? <span className="text-xs font-bold text-amber-600 bg-amber-50 rounded-full px-2 py-0.5">{s.renewalsDue}</span>
                      : <span className="text-slate-300 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${r.bg} ${r.text} ${r.border}`}>
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${r.dot} mr-1`} />
                      {r.label}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}