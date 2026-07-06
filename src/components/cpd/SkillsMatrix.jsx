import { useState } from "react";
import { SKILLS_MATRIX, LEVEL_LABELS } from "@/lib/cpdData";
import { ChevronDown, Info } from "lucide-react";

function SkillBar({ skill, animate }) {
  const pct = (skill.level / skill.maxLevel) * 100;
  const colorMap = { 1: "bg-red-400", 2: "bg-amber-400", 3: "bg-yellow-400", 4: "bg-emerald-500", 5: "bg-blue-600" };
  return (
    <div className="space-y-1 group/skill">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-700 font-medium group-hover/skill:text-blue-600 transition-colors">{skill.name}</span>
        <span className="text-[10px] font-bold text-slate-500 tabular-nums">{LEVEL_LABELS[skill.level]}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${colorMap[skill.level] || "bg-slate-400"}`}
            style={{ width: animate ? `${pct}%` : "0%" }}
          />
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: skill.maxLevel }).map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-sm ${i < skill.level ? colorMap[skill.level] || "bg-slate-400" : "bg-slate-100"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SkillsMatrix() {
  const [expanded, setExpanded] = useState("Safeguarding");
  const [animated] = useState(true);

  const overallAvg = SKILLS_MATRIX.reduce((s, cat) => {
    const avg = cat.skills.reduce((a, sk) => a + sk.level, 0) / cat.skills.length;
    return s + avg;
  }, 0) / SKILLS_MATRIX.length;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="card p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Professional Skills Matrix</h3>
            <p className="text-xs text-slate-500">Competency levels across {SKILLS_MATRIX.length} professional domains · Scale: Awareness → Expert</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-1.5">
            <Info size={12} />
            <span>Overall proficiency: <span className="font-bold text-slate-900">{overallAvg.toFixed(1)}/5</span></span>
          </div>
        </div>

        {/* Level legend */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {LEVEL_LABELS.slice(1).map((l, i) => (
            <div key={l} className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <div className={`w-2 h-2 rounded-sm ${["bg-red-400","bg-amber-400","bg-yellow-400","bg-emerald-500","bg-blue-600"][i]}`} />
              <span>{i+1} – {l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Accordion categories */}
      <div className="space-y-2">
        {SKILLS_MATRIX.map((cat) => {
          const avg = cat.skills.reduce((a, sk) => a + sk.level, 0) / cat.skills.length;
          const isOpen = expanded === cat.category;
          return (
            <div key={cat.category} className={`card overflow-hidden transition-all duration-200 ${isOpen ? "ring-1 ring-blue-200" : ""}`}>
              <button
                onClick={() => setExpanded(isOpen ? null : cat.category)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${cat.color} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white text-xs font-bold">{cat.category[0]}</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-900">{cat.category}</p>
                    <p className="text-[10px] text-slate-400">{cat.skills.length} competencies</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Mini progress */}
                  <div className="hidden sm:flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${(avg / 5) * 100}%` }} />
                    </div>
                    <span className="text-xs font-bold text-slate-600 tabular-nums">{avg.toFixed(1)}/5</span>
                  </div>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 space-y-3 animate-fade-in border-t border-slate-50 pt-4">
                  {cat.skills.map((sk) => (
                    <SkillBar key={sk.name} skill={sk} animate={animated} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}