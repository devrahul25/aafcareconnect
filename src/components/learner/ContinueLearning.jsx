import { Link } from "react-router-dom";
import { Play, Clock, BookOpen, Award, ChevronRight, ArrowRight, CheckCircle2 } from "lucide-react";
import CircularProgress from "@/components/course/CircularProgress";

// Illustrative in-progress state — replace with real entity data in a later phase
const IN_PROGRESS_COURSE = {
  id: "sg-2",
  title: "Safeguarding Children: Level 2",
  category: "Safeguarding",
  image: "https://media.base44.com/images/public/6a3a6f4029c809f694c625de/7542d57a4_generated_image.png",
  progress: 62,
  lastLesson: "The Four Categories of Abuse",
  currentLesson: "Recognising Neglect",
  minutesRemaining: 45,
  cpdEarned: 1.5,
  cpdTotal: 3,
};

const NEXT_COURSE = {
  title: "Therapeutic Parenting in Practice",
  category: "Therapeutic Parenting",
  image: "https://media.base44.com/images/public/6a3a6f4029c809f694c625de/ef9f132b5_generated_image.png",
  level: "Intermediate",
  cpd: 1.5,
};

export default function ContinueLearning({ userName }) {
  const c = IN_PROGRESS_COURSE;

  return (
    <section aria-label="Continue learning" className="space-y-3 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-lg text-slate-900">
            Continue Learning{userName ? `, ${userName.split(" ")[0]}` : ""}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Pick up where you left off</p>
        </div>
        <Link to="/learning-hub/course/sg-2" className="text-xs font-semibold text-blue-600 hover:text-blue-500 flex items-center gap-1 transition-colors">
          View all <ChevronRight size={13} />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main resume card */}
        <div className="lg:col-span-2 card overflow-hidden flex flex-col sm:flex-row group hover:shadow-lg hover:shadow-blue-600/10 transition-all duration-300">
          {/* Thumbnail */}
          <div className="relative w-full sm:w-48 h-36 sm:h-auto flex-shrink-0 bg-slate-900 overflow-hidden">
            <img src={c.image} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900/60 sm:block hidden" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/60 sm:hidden block" />
            {/* Circular progress on image */}
            <div className="absolute bottom-3 left-3">
              <CircularProgress value={c.progress} size={52} stroke={5} />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">{c.category}</span>
              <h3 className="font-heading font-bold text-slate-900 mt-0.5 text-base leading-snug">{c.title}</h3>

              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-slate-500">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-0.5">Last completed</p>
                  <p className="font-medium text-slate-700 flex items-center gap-1">
                    <CheckCircle2 size={11} className="text-emerald-500 flex-shrink-0" />
                    <span className="truncate">{c.lastLesson}</span>
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-0.5">Current lesson</p>
                  <p className="font-medium text-slate-700 flex items-center gap-1">
                    <Play size={10} className="text-blue-500 fill-blue-500 flex-shrink-0" />
                    <span className="truncate">{c.currentLesson}</span>
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-0.5">Time remaining</p>
                  <p className="font-medium text-slate-700 flex items-center gap-1">
                    <Clock size={11} className="text-slate-400 flex-shrink-0" />{c.minutesRemaining} min
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-0.5">CPD earned</p>
                  <p className="font-medium text-slate-700 flex items-center gap-1">
                    <Award size={11} className="text-amber-500 flex-shrink-0" />
                    {c.cpdEarned} / {c.cpdTotal} hrs
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>{c.progress}% complete</span>
                  <span>{100 - c.progress}% remaining</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${c.progress}%` }}
                  />
                </div>
              </div>
            </div>

            <Link
              to="/learning-hub/course/sg-2"
              className="mt-4 self-start h-9 px-5 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-500 flex items-center gap-2 transition-colors"
            >
              <Play size={13} className="fill-white" /> Resume Course
            </Link>
          </div>
        </div>

        {/* Next recommended */}
        <div className="card overflow-hidden flex flex-col group hover:shadow-lg hover:shadow-blue-600/10 transition-all duration-300">
          <div className="relative h-28 flex-shrink-0 bg-slate-900 overflow-hidden">
            <img src={NEXT_COURSE.image} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
            <div className="absolute bottom-2 left-3">
              <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">Up Next</span>
            </div>
          </div>
          <div className="p-4 flex flex-col flex-1 justify-between">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-violet-600">{NEXT_COURSE.category}</span>
              <h4 className="font-heading font-bold text-sm text-slate-900 mt-0.5 leading-snug group-hover:text-blue-600 transition-colors">
                {NEXT_COURSE.title}
              </h4>
              <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                <span className="flex items-center gap-1"><Award size={10} className="text-amber-500" /> {NEXT_COURSE.cpd} CPD hrs</span>
                <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-semibold">{NEXT_COURSE.level}</span>
              </div>
            </div>
            <button className="mt-4 w-full h-9 text-sm font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-700 flex items-center justify-center gap-2 transition-colors">
              Preview <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}