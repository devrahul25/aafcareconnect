import { useState } from "react";
import { GitBranch, Play, CheckCircle2, ArrowRight, RotateCcw, ShieldCheck, Heart, Users, Sparkles } from "lucide-react";
import BranchingScenario from "@/components/course/neglect/BranchingScenario";

const SCENARIOS = [
  {
    id: "neglect-emily",
    title: "Recognising Neglect: Emily's Story",
    category: "Safeguarding",
    difficulty: "Intermediate",
    description: "Emily arrives hungry and in dirty clothes. Apply the Recognise → Respond → Record → Report sequence in two real-time decision points.",
    xp: 80,
    duration: "5 min",
    categoryColor: "bg-blue-600",
    difficultyColor: "bg-amber-50 text-amber-700",
    icon: ShieldCheck,
    component: BranchingScenario,
  },
  {
    id: "contact-disclosure",
    title: "Post-Contact Disclosure",
    category: "Safeguarding",
    difficulty: "Foundation",
    description: "A child returns from contact visibly upset and reluctant to speak. Practice the correct immediate response without leading questions.",
    xp: 60,
    duration: "4 min",
    categoryColor: "bg-indigo-600",
    difficultyColor: "bg-emerald-50 text-emerald-700",
    icon: Heart,
    component: null, // coming soon
  },
  {
    id: "allegation-carer",
    title: "Allegation Against a Carer",
    category: "Escalation",
    difficulty: "Advanced",
    description: "Another carer in the same household is alleged to have harmed a child. Navigate the correct LADO referral path step by step.",
    xp: 100,
    duration: "6 min",
    categoryColor: "bg-rose-600",
    difficultyColor: "bg-red-50 text-red-700",
    icon: Users,
    component: null, // coming soon
  },
];

function ScenarioCard({ scenario, onLaunch }) {
  const Icon = scenario.icon;
  return (
    <div className="card overflow-hidden group hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-600/10 transition-all duration-300">
      <div className={`h-2 ${scenario.categoryColor}`} />
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-10 h-10 rounded-xl ${scenario.categoryColor} flex items-center justify-center flex-shrink-0 shadow-sm`}>
            <Icon size={18} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap mb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{scenario.category}</span>
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${scenario.difficultyColor}`}>{scenario.difficulty}</span>
              {!scenario.component && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-400">Coming soon</span>
              )}
            </div>
            <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
              {scenario.title}
            </h3>
          </div>
        </div>

        <p className="text-[12px] text-slate-500 leading-relaxed mb-4">{scenario.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-0.5">⚡ {scenario.xp} XP</span>
            <span>{scenario.duration}</span>
          </div>
          <button
            onClick={() => scenario.component && onLaunch(scenario)}
            disabled={!scenario.component}
            className={`h-8 px-3 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
              scenario.component
                ? "bg-blue-600 text-white hover:bg-blue-500 active:scale-95"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            {scenario.component ? <><Play size={11} className="fill-white" /> Start</> : <>Locked</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ScenarioPractice() {
  const [active, setActive] = useState(null);
  const [completedIds, setCompletedIds] = useState(new Set());

  const handleComplete = () => {
    if (active) setCompletedIds((s) => new Set(s).add(active.id));
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-sm">
            <GitBranch size={16} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Practice Scenarios</h2>
            <p className="text-[11px] text-slate-400">Interactive branching case studies · earn XP</p>
          </div>
        </div>
        {completedIds.size > 0 && (
          <span className="text-[10px] font-bold text-violet-600 bg-violet-50 border border-violet-100 rounded-full px-2.5 py-1 flex items-center gap-1">
            <Sparkles size={10} /> {completedIds.size} completed
          </span>
        )}
      </div>

      {/* Active scenario */}
      {active && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500">Playing: <span className="text-slate-900">{active.title}</span></p>
            <button
              onClick={() => setActive(null)}
              className="text-xs text-slate-400 hover:text-slate-600 underline transition-colors"
            >
              ✕ Close scenario
            </button>
          </div>
          <active.component onComplete={handleComplete} />
        </div>
      )}

      {/* Cards grid */}
      {!active && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {SCENARIOS.map((s) => (
            <div key={s.id} className="relative">
              {completedIds.has(s.id) && (
                <div className="absolute -top-1.5 -right-1.5 z-10 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
                  <CheckCircle2 size={14} className="text-white" />
                </div>
              )}
              <ScenarioCard scenario={s} onLaunch={setActive} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}