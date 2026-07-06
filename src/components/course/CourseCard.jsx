import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Play, Clock, Users, Star, Heart, Bookmark, Flame, Sparkles,
  CheckCircle2, Video, BookOpen, ListChecks, NotebookPen, Award, Zap, ArrowRight,
} from "lucide-react";
import confetti from "canvas-confetti";
import CircularProgress from "./CircularProgress";

const LEVEL_CLS = {
  Foundation: "bg-emerald-50 text-emerald-700",
  Intermediate: "bg-amber-50 text-amber-700",
  Advanced: "bg-red-50 text-red-700",
};

// Per-user learning state (illustrative — wired to real data in a later phase)
const UPDATED = new Set([2, 5, 7]);          // "Recently updated" courses
const COMPLETED = new Set([1, 3]);            // courses this user has completed
const IN_PROGRESS = {                          // in-progress courses + streak
  4: { progress: 62, streak: 3 },
  6: { progress: 28, streak: 1 },
};

const FORMATS = [
  { icon: Video, label: "Video lessons" },
  { icon: BookOpen, label: "Reading" },
  { icon: ListChecks, label: "Quiz" },
  { icon: NotebookPen, label: "Reflection" },
  { icon: Award, label: "Certificate" },
];

const cpdHours = (d) => (d % 60 === 0 ? (d / 60).toFixed(0) : (d / 60).toFixed(1));

export default function CourseCard({ course, onSelect }) {
  const [fav, setFav] = useState(false);
  const [bm, setBm] = useState(false);

  const completionPct = course.learners > 0 ? Math.round((course.completions / course.learners) * 100) : 0;
  const ip = IN_PROGRESS[course.id];
  const isDone = COMPLETED.has(course.id);
  const xp = Math.round(course.duration * 2);

  const celebrate = (e) => {
    e.stopPropagation();
    confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 }, colors: ["#2563eb", "#10b981", "#f59e0b", "#8b5cf6"] });
  };

  return (
    <article
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(); } }}
      aria-label={`${course.title}, ${course.level} level${course.mandatory ? ", mandatory" : ""}`}
      className="group relative card overflow-hidden cursor-pointer rounded-xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-600/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      {/* Continue learning ribbon */}
      {ip && (
        <div className="absolute top-0 left-0 z-20 flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold pl-2.5 pr-3 py-1 rounded-br-xl shadow-sm">
          <Play size={9} className="fill-white" /> Continue learning
        </div>
      )}
      {/* Streak indicator */}
      {ip?.streak > 1 && !isDone && (
        <div className="absolute top-2 right-2 z-20 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 shadow-sm border border-amber-100">
          <Flame size={11} className="text-orange-500" />
          <span className="text-[10px] font-bold text-orange-600">{ip.streak}-day streak</span>
        </div>
      )}

      {/* Banner */}
      <div className="h-28 relative overflow-hidden bg-slate-900">
        <img src={course.image} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/30 to-slate-900/10" />
        {course.mandatory && (
          <div className="absolute top-2 left-2 badge badge-red text-[10px] shadow-sm">Mandatory</div>
        )}
        {course.status === "draft" && (
          <div className="absolute bottom-2 left-2 z-20 badge badge-amber text-[10px] shadow-sm">Draft</div>
        )}

        {/* Progress ring / completed badge */}
        {ip && (
          <div className="absolute bottom-2 left-2 z-20">
            <CircularProgress value={ip.progress} size={42} />
          </div>
        )}
        {isDone && (
          <div className="absolute bottom-2 left-2 z-20 w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center shadow-md" title="Completed">
            <CheckCircle2 size={20} className="text-white" />
          </div>
        )}

        {/* Favourite / bookmark */}
        <div className="absolute bottom-2 right-2 z-20 flex gap-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); setFav((v) => !v); }}
            aria-label={fav ? "Remove from favourites" : "Add to favourites"}
            aria-pressed={fav}
            className="w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
          >
            <Heart size={13} className={fav ? "text-rose-500 fill-rose-500" : "text-slate-500"} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setBm((v) => !v); }}
            aria-label={bm ? "Remove bookmark" : "Bookmark course"}
            aria-pressed={bm}
            className="w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
          >
            <Bookmark size={13} className={bm ? "text-blue-600 fill-blue-600" : "text-slate-500"} />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${LEVEL_CLS[course.level]}`}>{course.level}</span>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-2 py-0.5">
              <Clock size={9} /> {cpdHours(course.duration)} CPD
            </span>
            {UPDATED.has(course.id) && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-violet-700 bg-violet-50 border border-violet-100 rounded-full px-2 py-0.5">
                <Sparkles size={9} /> Updated
              </span>
            )}
          </div>
        </div>

        <h3 className="font-heading text-sm font-bold text-slate-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[2.5rem]">
          {course.title}
        </h3>

        {/* XP + celebrate */}
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100 rounded-full px-2 py-0.5">
            <Zap size={10} className="text-amber-500" /> {xp} XP
          </span>
          {isDone && (
            <button
              onClick={celebrate}
              aria-label="Celebrate course completion"
              className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5 hover:bg-emerald-100 transition-colors"
            >
              <Sparkles size={10} /> Celebrate
            </button>
          )}
        </div>

        {/* Format indicators */}
        <div className="flex items-center gap-1.5 mb-3" aria-label="Course includes">
          {FORMATS.map((f) => {
            const Icon = f.icon;
            return (
              <span key={f.label} title={f.label} aria-label={f.label} className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-colors">
                <Icon size={13} />
              </span>
            );
          })}
        </div>

        {!ip && course.status === "published" && course.learners > 0 && (
          <div className="mb-3">
            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
              <span>Org completion</span><span>{completionPct}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${completionPct}%` }} />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-50">
          <span className="flex items-center gap-1"><Clock size={10} /> {course.duration}m</span>
          <span className="flex items-center gap-1"><Users size={10} /> {course.learners}</span>
          {course.rating ? (
            <span className="flex items-center gap-1"><Star size={10} className="fill-amber-400 text-amber-400" /> {course.rating}</span>
          ) : (
            <span className="text-slate-300">No rating</span>
          )}
        </div>

        {ip && (
          <Link
            to="/learning-hub/course/sg-2"
            onClick={(e) => e.stopPropagation()}
            className="mt-3 w-full h-9 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center justify-center gap-1.5 transition-colors"
          >
            Resume <ArrowRight size={13} />
          </Link>
        )}
      </div>
    </article>
  );
}