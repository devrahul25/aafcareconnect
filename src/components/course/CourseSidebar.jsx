import { Link } from "react-router-dom";
import { CheckCircle2, Circle, Play, PlayCircle, ChevronRight } from "lucide-react";

function lessonsTotal(course) {
  return course.modules.reduce((n, m) => n + m.lessons.length, 0);
}

export default function CourseSidebar({
  course,
  currentModuleIdx,
  currentLessonIdx,
  completedLessons,
  onSelect,
  onContinue,
}) {
  const total = lessonsTotal(course);
  const doneCount = completedLessons.size;
  const overallPct = Math.round((doneCount / total) * 100);

  return (
    <aside className="w-72 flex-shrink-0 h-full sidebar flex flex-col">
      {/* Course header */}
      <div className="px-4 py-4 border-b border-white/5 flex-shrink-0">
        <Link to="/learning-hub" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 mb-2 font-medium">
          ← Back to Learning Hub
        </Link>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Course</p>
        <h1 className="font-heading font-bold text-white text-sm leading-snug">{course.title}</h1>
        <p className="text-[11px] text-slate-500 mt-1">{course.category} · {course.level}</p>
      </div>

      {/* Modules / lessons */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {course.modules.map((mod, mi) => {
          const modTotal = mod.lessons.length;
          const modDone = mod.lessons.filter((l) => completedLessons.has(l.id)).length;
          const modPct = modTotal ? Math.round((modDone / modTotal) * 100) : 0;
          return (
            <div key={mod.id}>
              <div className="flex items-center justify-between px-2 mb-1.5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
                  Module {mi + 1} · {mod.title}
                </p>
                <span className="text-[10px] font-bold text-blue-400">{modPct}%</span>
              </div>
              <div className="space-y-0.5">
                {mod.lessons.map((lesson, li) => {
                  const done = completedLessons.has(lesson.id);
                  const current = mi === currentModuleIdx && li === currentLessonIdx;
                  const Icon = done ? CheckCircle2 : lesson.type === "assessment" ? PlayCircle : Circle;
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => onSelect(mi, li)}
                      className={`sidebar-item w-full text-left flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium ${current ? "active" : ""}`}
                    >
                      <Icon size={15} className={`flex-shrink-0 mt-0.5 ${done ? "text-emerald-400" : current ? "text-white" : "text-slate-500"}`} />
                      <span className="leading-snug">
                        {lesson.title}
                        <span className="block text-[10px] text-slate-500 font-normal">{lesson.duration}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer progress + continue */}
      <div className="px-4 py-3 border-t border-white/5 space-y-3 flex-shrink-0">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
            <span>{doneCount} of {total} lessons</span>
            <span className="font-bold text-blue-400">{overallPct}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${overallPct}%` }} />
          </div>
        </div>
        <button
          onClick={onContinue}
          className="w-full h-9 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center justify-center gap-1.5 transition-colors"
        >
          <Play size={13} /> Continue Learning <ChevronRight size={14} />
        </button>
      </div>
    </aside>
  );
}