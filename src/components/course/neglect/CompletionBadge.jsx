import { Award, Trophy } from "lucide-react";

export default function CompletionBadge({ percent, completed, cpdHours }) {
  return (
    <section className={`card p-6 border-l-4 ${completed ? "border-l-emerald-400" : "border-l-slate-300"} animate-fade-in`}>
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${completed ? "bg-emerald-500 scale-110 shadow-lg shadow-emerald-200" : "bg-slate-100"}`}>
          {completed ? <Trophy size={26} className="text-white" /> : <Award size={24} className="text-slate-400" />}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-heading font-bold text-lg text-slate-900">{completed ? "Lesson Complete" : "Lesson Progress"}</h2>
          <p className="text-xs text-slate-500 mb-2">Estimated {cpdHours} CPD hour{cpdHours !== 1 ? "s" : ""} on completion</p>
          <div className="progress-bar h-2">
            <div className={`progress-fill h-2 ${completed ? "bg-emerald-500" : "bg-blue-500"}`} style={{ width: `${percent}%` }} />
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="font-heading font-bold text-2xl text-slate-900">{percent}%</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-wide">complete</p>
        </div>
      </div>
      {completed && (
        <p className="mt-3 text-xs text-emerald-600 font-medium">
          Great work — this lesson’s interactive sections are complete. Mark the lesson as complete above to continue to the next.
        </p>
      )}
    </section>
  );
}