// @ts-nocheck
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";
import { SKILL_LEVEL_LABELS, buildDynamicSkills } from "@/lib/passportData";

const LEVEL_COLORS = { 1: "bg-slate-400", 2: "bg-amber-500", 3: "bg-blue-500", 4: "bg-emerald-500", 5: "bg-violet-600" };
const LEVEL_TEXT   = { 1: "text-slate-600", 2: "text-amber-600", 3: "text-blue-600", 4: "text-emerald-600", 5: "text-violet-600" };

export default function PassportSkillsMatrix({ skills = [] }) {
  const activeSkills = skills.length > 0 ? skills : buildDynamicSkills({ certificates: [], enrolments: [] });

  const radarData = activeSkills.map(s => ({
    subject: s.skill,
    A: Math.round((s.level / (s.maxLevel || 5)) * 100),
    fullMark: 100,
  }));

  const totalPossible = activeSkills.length * 5;
  const totalEarned = activeSkills.reduce((acc, s) => acc + s.level, 0);
  const overallCompetency = Math.round((totalEarned / totalPossible) * 100);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Top Summary Banner */}
      <div className="card p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-sm font-bold text-blue-900">Live Practice Competency Matrix</h3>
          <p className="text-xs text-blue-700 mt-0.5">
            Skill levels dynamically advance as you complete accredited training courses and earn CPD qualifications.
          </p>
        </div>
        <div className="text-right flex items-center gap-3">
          <div className="text-right">
            <span className="text-2xl font-heading font-bold text-blue-700">{overallCompetency}%</span>
            <p className="text-[10px] font-semibold text-blue-600 uppercase">Average Competency</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Radar chart */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold text-slate-900">Skills Radar</h3>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              8 Core Domains
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4">Visual overview of competency ratings across all practice domains</p>
          <ResponsiveContainer width="100%" height={290}>
            <RadarChart data={radarData} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#475569", fontWeight: 600 }} />
              <Radar
                name="Competency"
                dataKey="A"
                stroke="#2563eb"
                fill="#2563eb"
                fillOpacity={0.25}
                strokeWidth={2}
                dot={{ r: 4, fill: "#2563eb" }}
              />
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
          <p className="text-xs text-slate-400 mb-4">Domain ratings assessed through accredited course completions</p>
          <div className="space-y-4">
            {activeSkills.map(s => {
              const max = s.maxLevel || 5;
              const pct = Math.round((s.level / max) * 100);
              const colorClass = LEVEL_COLORS[s.level] || "bg-blue-600";
              const textClass = LEVEL_TEXT[s.level] || "text-blue-600";

              return (
                <div key={s.skill}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-700">{s.skill}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold ${textClass}`}>
                        {SKILL_LEVEL_LABELS[s.level] || "Beginner"} ({pct}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colorClass} rounded-full transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: max }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-sm ${i < s.level ? colorClass : "bg-slate-100"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Level key */}
      <div className="card p-4 flex items-center gap-6 flex-wrap">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Proficiency Framework:</p>
        {SKILL_LEVEL_LABELS.slice(1).map((l, i) => (
          <div key={l} className="flex items-center gap-1.5 text-xs text-slate-600">
            <div className={`w-2.5 h-2.5 rounded-sm ${LEVEL_COLORS[i + 1] || "bg-blue-600"}`} />
            <span>{i + 1} — {l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}