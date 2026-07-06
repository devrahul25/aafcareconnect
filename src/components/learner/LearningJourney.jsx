import { CheckCircle2, BookOpen, LayoutList, ClipboardCheck, Award } from "lucide-react";

const MILESTONES = [
  {
    icon: BookOpen,
    label: "Course Started",
    description: "Safeguarding Children: Level 2",
    date: "12 Jun 2026",
    done: true,
    color: "bg-blue-600",
    ring: "ring-blue-100",
  },
  {
    icon: LayoutList,
    label: "Module Completed",
    description: "Types of Abuse — Module 2",
    date: "18 Jun 2026",
    done: true,
    color: "bg-indigo-600",
    ring: "ring-indigo-100",
  },
  {
    icon: ClipboardCheck,
    label: "Assessment Passed",
    description: "Module 2 quiz — 90%",
    date: "18 Jun 2026",
    done: true,
    color: "bg-violet-600",
    ring: "ring-violet-100",
  },
  {
    icon: Award,
    label: "Certificate Earned",
    description: "Complete final assessment to unlock",
    date: null,
    done: false,
    color: "bg-slate-300",
    ring: "ring-slate-100",
  },
];

export default function LearningJourney() {
  const completed = MILESTONES.filter((m) => m.done).length;
  const total = MILESTONES.length;

  return (
    <section aria-label="Your learning journey" className="card p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-heading font-bold text-base text-slate-900">Your Learning Journey</h2>
          <p className="text-xs text-slate-500 mt-0.5">{completed} of {total} milestones reached</p>
        </div>
        <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-3 py-1">
          {Math.round((completed / total) * 100)}% complete
        </span>
      </div>

      {/* Connector track */}
      <div className="relative">
        {/* Horizontal line connecting milestones on md+ */}
        <div className="hidden sm:block absolute top-6 left-6 right-6 h-0.5 bg-slate-100 z-0">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${((completed - 1) / (total - 1)) * 100}%` }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative z-10">
          {MILESTONES.map((m, i) => {
            const Icon = m.icon;
            return (
              <div
                key={m.label}
                className={`flex sm:flex-col items-start sm:items-center gap-3 sm:gap-2 sm:text-center p-3 sm:p-0 rounded-xl sm:rounded-none transition-all duration-300 ${m.done ? "opacity-100" : "opacity-50"}`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Icon circle */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full ${m.color} ${m.done ? `ring-4 ${m.ring}` : "ring-2 ring-slate-100"} flex items-center justify-center shadow-sm transition-all duration-300`}>
                  {m.done ? (
                    <CheckCircle2 size={22} className="text-white" />
                  ) : (
                    <Icon size={20} className="text-white/70" />
                  )}
                </div>

                <div className="min-w-0 sm:mt-1">
                  <p className={`text-xs font-bold ${m.done ? "text-slate-900" : "text-slate-400"} leading-tight`}>
                    {m.label}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug line-clamp-2">
                    {m.description}
                  </p>
                  {m.date && (
                    <p className="text-[10px] font-medium text-blue-500 mt-1">{m.date}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}