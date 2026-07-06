// @ts-nocheck
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";
import { SKILLS_RADAR, SKILL_LEVEL_LABELS } from "@/lib/passportData";

const LEVEL_COLORS = { 1: "bg-red-400", 2: "bg-amber-400", 3: "bg-yellow-400", 4: "bg-emerald-500", 5: "bg-blue-600" };
const LEVEL_TEXT   = { 1: "text-red-600", 2: "text-amber-600", 3: "text-yellow-600", 4: "text-emerald-600", 5: "text-blue-600" };

const radarData = SKILLS_RADAR.map(s => ({ subject: s.skill, A: (s.level / s.maxLevel) * 100, fullMark: 100 }));

export default function PassportSkillsMatrix() {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Radar chart */}
        <div className="card p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Skills Radar</h3>
          <p className="text-xs text-slate-400 mb-4">Visual overview of competency levels across all domains</p>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#64748b", fontWeight: 600 }} />
              <Radar name="Competency" dataKey="A" stroke="#2563eb" fill="#2563eb" fillOpacity={0.2} strokeWidth={2} dot={{ r: 4, fill: "#2563eb" }} />
              <Tooltip
                formatter={(v) => [`${Math.round(v)}%`]}
                contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e2e8f0" }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Level legend */}
        <div className="card p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Competency Levels</h3>
          <p className="text-xs text-slate-400 mb-4">Individual skill ratings across all domains</p>
          <div className="space-y-4">
            {SKILLS_RADAR.map(s => (
              <div key={s.skill}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-700">{s.skill}</span>
                  <span className={`text-[10px] font-bold ${LEVEL_TEXT[s.level]}`}>{SKILL_LEVEL_LABELS[s.level]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${LEVEL_COLORS[s.level]} rounded-full transition-all duration-700`} style={{ width: `${(s.level/s.maxLevel)*100}%` }} />
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: s.maxLevel }).map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-sm ${i < s.level ? LEVEL_COLORS[s.level] : "bg-slate-100"}`} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Level key */}
      <div className="card p-4 flex items-center gap-6 flex-wrap">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Proficiency Scale:</p>
        {SKILL_LEVEL_LABELS.slice(1).map((l, i) => (
          <div key={l} className="flex items-center gap-1.5 text-xs text-slate-600">
            <div className={`w-2.5 h-2.5 rounded-sm ${LEVEL_COLORS[i+1]}`} />
            <span>{i+1} — {l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}