import { CheckCircle2, ChevronLeft, ChevronRight, Clock } from "lucide-react";

export default function CourseTopBar({
  courseTitle,
  moduleTitle,
  lessonTitle,
  progressPercent,
  estimatedTime,
  isLast,
  isFirst,
  isCompleted,
  onPrev,
  onNext,
  onMarkComplete,
}) {
  const pct = Math.min(100, Math.max(0, Math.round(Number(progressPercent) || 0)));

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-3 flex-shrink-0">
      <div className="flex items-center justify-between gap-4 mb-2.5">
        <div className="min-w-0">
          <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider truncate">{courseTitle}</p>
          <h2 className="font-heading font-bold text-slate-900 text-base leading-tight truncate">{moduleTitle} · <span className="text-slate-500 font-medium">{lessonTitle}</span></h2>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onPrev}
            disabled={isFirst}
            className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            onClick={onNext}
            disabled={isLast && !isCompleted}
            className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs font-bold text-slate-600 w-10 text-right">{pct}%</span>
        {estimatedTime && (
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 rounded-full px-2.5 py-1 flex items-center gap-1 whitespace-nowrap">
            <Clock size={11} /> {estimatedTime} remaining
          </span>
        )}
        {isCompleted ? (
          <span className="h-8 px-3 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg flex items-center gap-1.5 whitespace-nowrap">
            <CheckCircle2 size={13} className="text-emerald-600" /> Completed
          </span>
        ) : (
          <button
            onClick={onMarkComplete}
            className="h-8 px-3 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <CheckCircle2 size={13} /> Mark Complete
          </button>
        )}
      </div>
    </div>
  );
}