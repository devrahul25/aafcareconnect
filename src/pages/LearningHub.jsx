import { useState, useEffect } from "react";
import { useOutletContext, Link } from "react-router-dom";
import {
  BookOpen, Search, Plus, Users, Play,
  CheckCircle2, ChevronRight, AlertTriangle,
  UserPlus, Send, BarChart3, X
} from "lucide-react";
import CourseCard from "@/components/course/CourseCard";
import ContinueLearning from "@/components/learner/ContinueLearning";
import LearningJourney from "@/components/learner/LearningJourney";
import AICoach from "@/components/learner/AICoach";
import SmartProgress from "@/components/learner/SmartProgress";
import StatusBadge from "@/components/ui/StatusBadge";
import PageHeader from "@/components/ui/PageHeader";
import KpiCard from "@/components/ui/KpiCard";
import CompletionCelebration from "@/components/gamification/CompletionCelebration";
import LearnerProfileDrawer from "@/components/gamification/LearnerProfileDrawer";
import BadgeIcon from "@/components/gamification/BadgeIcon";
import DailyGoals from "@/components/learner/DailyGoals";
import ManagerAnalytics from "@/components/manager/ManagerAnalytics";
import ScenarioPractice from "@/components/learner/ScenarioPractice";
import { BADGES, LEARNER_GAMIFICATION, CURRENT_PROGRESS } from "@/lib/gamification";
import { BADGE_BG } from "@/components/gamification/badgeStyles";
import { getCourses, getWorkforceMembers } from "@/lib/orgData";
import { apiClient } from "@/api/apiClient";

// ─── Demo catalogue (shown when no organisationId) ────────────────────────────
const DEMO_COURSES = [
  { id: 1,  title: "Safeguarding Children: Level 2",       category: "Safeguarding",          level: "Foundation",   duration: 60,  learners: 84, completions: 71, rating: 4.9, mandatory: true,  status: "published", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80" },
  { id: 2,  title: "Therapeutic Parenting in Practice",    category: "Therapeutic Parenting", level: "Intermediate", duration: 90,  learners: 61, completions: 44, rating: 4.8, mandatory: false, status: "published", image: "https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=400&q=80" },
  { id: 3,  title: "Attachment Theory for Foster Carers",  category: "Attachment",            level: "Intermediate", duration: 75,  learners: 72, completions: 58, rating: 4.7, mandatory: true,  status: "published", image: "https://images.unsplash.com/photo-1573497491765-dccce02b29df?w=400&q=80" },
  { id: 4,  title: "First Aid & Emergency Response",       category: "Health & Safety",       level: "Foundation",   duration: 120, learners: 53, completions: 43, rating: 4.9, mandatory: true,  status: "published", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80" },
  { id: 5,  title: "Understanding Trauma & Loss",          category: "Therapeutic Parenting", level: "Advanced",     duration: 60,  learners: 38, completions: 30, rating: 4.6, mandatory: false, status: "published", image: "https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?w=400&q=80" },
  { id: 6,  title: "Cultural Identity & Diversity",        category: "Equality & Diversity",  level: "Foundation",   duration: 45,  learners: 47, completions: 35, rating: 4.5, mandatory: false, status: "published", image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&q=80" },
  { id: 7,  title: "Fostering Legislation Update 2024",    category: "Legislation",           level: "Foundation",   duration: 30,  learners: 91, completions: 84, rating: 4.4, mandatory: true,  status: "published", image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&q=80" },
  { id: 8,  title: "Safe Caring in the Home",              category: "Safeguarding",          level: "Foundation",   duration: 50,  learners: 0,  completions: 0,  rating: null, mandatory: true,  status: "draft",     image: "https://images.unsplash.com/photo-1560252829-804f1aedf1be?w=400&q=80" },
];
const DEMO_LEARNERS = [
  { id: 1,  name: "Emma Clarke",    role: "Foster Carer",  enrolled: 4, completed: 4, overdue: 0, progress: 100, status: "compliant",     avatar: "EC", color: "bg-emerald-600" },
  { id: 2,  name: "James Okafor",   role: "Foster Carer",  enrolled: 5, completed: 3, overdue: 1, progress: 60,  status: "at_risk",       avatar: "JO", color: "bg-amber-500"   },
  { id: 3,  name: "Priya Sharma",   role: "Trainer",       enrolled: 3, completed: 2, overdue: 0, progress: 78,  status: "in_progress",   avatar: "PS", color: "bg-blue-600"    },
  { id: 4,  name: "Mark Thompson",  role: "RI",            enrolled: 6, completed: 4, overdue: 2, progress: 67,  status: "at_risk",       avatar: "MT", color: "bg-rose-600"    },
  { id: 5,  name: "Sarah Mitchell", role: "Social Worker", enrolled: 3, completed: 3, overdue: 0, progress: 100, status: "compliant",     avatar: "SM", color: "bg-violet-600"  },
  { id: 6,  name: "Daniel Rees",    role: "Foster Carer",  enrolled: 5, completed: 5, overdue: 0, progress: 100, status: "compliant",     avatar: "DR", color: "bg-indigo-600"  },
  { id: 7,  name: "Claire Nguyen",  role: "Foster Carer",  enrolled: 4, completed: 1, overdue: 3, progress: 25,  status: "non_compliant", avatar: "CN", color: "bg-red-600"     },
];

const STATUS_LEARNER = { compliant: "badge-green", in_progress: "badge-blue", at_risk: "badge-amber", non_compliant: "badge-red" };
const STATUS_LABEL   = { compliant: "Compliant", in_progress: "In Progress", at_risk: "At Risk", non_compliant: "Non-Compliant" };
const LEVEL_CLS      = { Foundation: "bg-emerald-50 text-emerald-700", Intermediate: "bg-amber-50 text-amber-700", Advanced: "bg-red-50 text-red-700" };
const DEMO_CATS = ["All", "Safeguarding", "Therapeutic Parenting", "Attachment", "Health & Safety", "Legislation", "Equality & Diversity"];

// Normalise a Course entity record to the display shape
function normaliseCourse(c, idx) {
  return {
    id: c.id || idx,
    title: c.title,
    category: c.category || "Other",
    level: c.level || "Foundation",
    duration: c.duration_minutes || 60,
    learners: 0,
    completions: 0,
    rating: null,
    mandatory: c.mandatory || false,
    status: c.status || "published",
    image: c.thumbnail_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",
  };
}

export default function LearningHub() {
  const { user, organisationId } = /** @type {any} */ (useOutletContext() || {});
  const [tab,          setTab]          = useState("catalogue");
  const [search,       setSearch]       = useState("");
  const [category,     setCategory]     = useState("All");
  const [filter,       setFilter]       = useState("all");
  const [selected,     setSelected]     = useState(null);
  const [enrollOpen,   setEnrollOpen]   = useState(false);
  const [profileLearner, setProfileLearner] = useState(null);
  const [celebrate,    setCelebrate]    = useState(false);
  const [courses,      setCourses]      = useState([]);
  const [learners,     setLearners]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [isDemo,       setIsDemo]       = useState(false);
  const [cats,         setCats]         = useState(DEMO_CATS);

  useEffect(() => {
    if (!organisationId) {
      setCourses(DEMO_COURSES);
      setLearners(DEMO_LEARNERS);
      setCats(DEMO_CATS);
      setIsDemo(true);
      setLoading(false);
      return;
    }
    Promise.all([
      getCourses(organisationId),
      getWorkforceMembers(organisationId),
      apiClient.get("/courses/categories").then(r => r.data.data || r.data || []).catch(() => []),
    ])
      .then(([rawCourses, members, apiCats]) => {
        setCourses(rawCourses.length > 0 ? rawCourses.map(normaliseCourse) : DEMO_COURSES);
        setLearners(members.length > 0 ? members.map((m, i) => ({
          id: m.id || i,
          name: m.full_name,
          role: m.role_type || "learner",
          enrolled: 0, completed: 0, overdue: 0, progress: 0,
          status: "in_progress",
          avatar: m.full_name?.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase() || "??",
          color: "bg-blue-600",
        })) : DEMO_LEARNERS);
        // Set category pills — merge API cats with "All" prefix
        if (apiCats.length > 0) {
          setCats(["All", ...apiCats]);
        }
        setIsDemo(rawCourses.length === 0 && members.length === 0);
      })
      .catch(() => {
        setCourses(DEMO_COURSES);
        setLearners(DEMO_LEARNERS);
        setCats(DEMO_CATS);
        setIsDemo(true);
      })
      .finally(() => setLoading(false));
  }, [organisationId]);

  const filteredCourses = courses.filter(c => {
    const ms = c.title.toLowerCase().includes(search.toLowerCase());
    const mc = category === "All" || c.category === category;
    const mf = filter === "all" ? true : filter === "mandatory" ? c.mandatory : filter === "draft" ? c.status === "draft" : true;
    return ms && mc && mf;
  });
  const filteredLearners = learners.filter(l => l.name?.toLowerCase().includes(search.toLowerCase()));
  const overdue = learners.filter(l => l.overdue > 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5 animate-fade-in max-w-[1400px] mx-auto">
      <PageHeader
        title="Learning Hub"
        subtitle="Manage courses, track learner progress and drive compliance"
        actions={
          <div className="flex gap-2">
            {isDemo && <span className="h-9 px-3 text-xs font-bold bg-amber-50 border border-amber-200 text-amber-600 rounded-lg flex items-center">⚠ Demo Mode</span>}
            <button onClick={() => setEnrollOpen(true)} className="h-9 px-4 text-sm font-semibold bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors">
              <UserPlus size={14} /> Enrol Learner
            </button>
            <button className="h-9 px-4 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-2 transition-colors">
              <Plus size={14} /> Add Course
            </button>
          </div>
        }
      />

      <ContinueLearning userName={user?.full_name} />
      <AICoach userName={user?.full_name} />
      <LearningJourney />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Courses"     value={courses.length}                                        icon={BookOpen}     iconBg="bg-blue-600"    delta={3}  deltaLabel="+3 this month" />
        <KpiCard title="Active Learners"   value={learners.length}                                       icon={Users}        iconBg="bg-indigo-600"              />
        <KpiCard title="Completions"       value={courses.reduce((s,c) => s + (c.completions||0), 0)}   icon={CheckCircle2} iconBg="bg-emerald-600" delta={14} deltaLabel="+14 this month" />
        <KpiCard title="At Risk / Overdue" value={learners.filter(l => l.status==="non_compliant"||l.status==="at_risk").length} icon={AlertTriangle} iconBg="bg-red-500" />
      </div>

      {overdue.length > 0 && (
        <div className="card border-l-4 border-l-amber-400 bg-amber-50/50 p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle size={16} className="text-amber-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-slate-900">{overdue.length} learners have overdue mandatory training</p>
              <p className="text-xs text-slate-500 mt-0.5">{overdue.map(l => l.name?.split(" ")[0]).join(", ")} — click to send a reminder</p>
            </div>
          </div>
          <button className="h-8 px-3 text-xs font-semibold bg-amber-500 text-white rounded-lg hover:bg-amber-400 flex items-center gap-1.5 transition-colors flex-shrink-0">
            <Send size={12} /> Send Reminders
          </button>
        </div>
      )}

      <div className="flex gap-0 border-b border-slate-200">
        {[["catalogue","Course Catalogue"],["learners","Learners & Progress"],["progress","My Progress"],["analytics","Manager Analytics"]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px ${tab === key ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={tab === "catalogue" ? "Search courses…" : "Search learners…"}
            className="w-full h-9 pl-9 pr-3 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400" />
        </div>
        {tab === "catalogue" && (
          <div className="flex gap-2 flex-wrap">
            {[["all","All"],["mandatory","Mandatory"],["draft","Drafts"]].map(([key, label]) => (
              <button key={key} onClick={() => setFilter(key)}
                className={`h-9 px-3 text-xs font-semibold rounded-lg border transition-all ${filter === key ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"}`}>
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {tab === "catalogue" && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex gap-2 flex-wrap -mt-2">
            {cats.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`h-7 px-3 text-xs font-medium rounded-full transition-all ${category === c ? "bg-slate-900 text-white" : "bg-white text-slate-500 border border-slate-200 hover:border-slate-400"}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredCourses.map(course => (
              <CourseCard key={course.id} course={course} onSelect={() => setSelected(course)} />
            ))}
            {filteredCourses.length === 0 && (
              <div className="col-span-full py-16 text-center text-slate-400">
                <BookOpen size={36} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No courses match your filters</p>
              </div>
            )}
          </div>
          <div className="border-t border-slate-200 pt-6">
            <ScenarioPractice />
          </div>
        </div>
      )}

      {tab === "learners" && (
        <div className="card overflow-hidden animate-fade-in">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {["Learner","Role","Enrolled","Completed","Overdue","Progress","Status",""].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLearners.map(learner => (
                <tr key={learner.id} onClick={() => setProfileLearner(learner)} className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${learner.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>{learner.avatar}</div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900">{learner.name}</p>
                        {(() => {
                          const g = LEARNER_GAMIFICATION[learner.id];
                          if (!g) return null;
                          return (
                            <div className="flex items-center gap-1 mt-0.5">
                              {g.earnedBadges.slice(0,4).map((id) => {
                                const b = BADGES.find(x => x.id === id);
                                if (!b) return null;
                                return <span key={id} className={`w-4 h-4 rounded-full flex items-center justify-center ${BADGE_BG[b.color]}`}><BadgeIcon name={b.icon} size={9} className="text-white" /></span>;
                              })}
                              <span className="text-[10px] font-medium text-slate-400 ml-1">{g.xp} XP · {g.streakDays}d streak</span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-500">{learner.role}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-slate-700 text-center">{learner.enrolled}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-emerald-600 text-center">{learner.completed}</td>
                  <td className="px-5 py-3.5 text-center">
                    {learner.overdue > 0 ? <span className="text-sm font-bold text-red-600">{learner.overdue}</span> : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-5 py-3.5 w-36">
                    <div className="flex items-center gap-2">
                      <div className="progress-bar flex-1">
                        <div className={`progress-fill ${learner.progress === 100 ? "bg-emerald-500" : learner.overdue > 0 ? "bg-amber-400" : "bg-blue-500"}`} style={{ width: `${learner.progress}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-slate-600 w-8 text-right">{learner.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`badge ${STATUS_LEARNER[learner.status] || "badge-slate"}`}>{STATUS_LABEL[learner.status] || learner.status}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all">
                      <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "progress" && (
        <div className="space-y-5">
          <DailyGoals />
          <SmartProgress profile={CURRENT_PROGRESS} onCelebrate={() => setCelebrate(true)} />
        </div>
      )}

      {tab === "analytics" && <ManagerAnalytics />}

      {selected      && <CourseDrawer course={selected} onClose={() => setSelected(null)} />}
      {enrollOpen    && <EnrolModal courses={filteredCourses} onClose={() => setEnrollOpen(false)} />}
      <CompletionCelebration open={celebrate} onClose={() => setCelebrate(false)} profile={CURRENT_PROGRESS} courseTitle={CURRENT_PROGRESS.recentCompletion?.course} />
      {profileLearner && <LearnerProfileDrawer learner={profileLearner} onClose={() => setProfileLearner(null)} />}
    </div>
  );
}

function CourseDrawer({ course, onClose }) {
  const completionPct = course.learners > 0 ? Math.round((course.completions / course.learners) * 100) : 0;
  const LEVEL_CLS = { Foundation: "bg-emerald-50 text-emerald-700", Intermediate: "bg-amber-50 text-amber-700", Advanced: "bg-red-50 text-red-700" };
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in">
        <div className="h-40 relative overflow-hidden flex-shrink-0 bg-slate-900">
          <img src={course.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-900/40 to-blue-900/50" />
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${LEVEL_CLS[course.level] || "bg-slate-100 text-slate-600"}`}>{course.level}</span>
              {course.mandatory && <span className="badge badge-red text-[10px]">Mandatory</span>}
              <StatusBadge status={course.status} />
            </div>
            <h2 className="font-heading font-bold text-xl text-slate-900">{course.title}</h2>
            <p className="text-sm text-slate-500 mt-1">{course.category}</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[{label:"Duration",value:`${course.duration}m`},{label:"Learners",value:course.learners},{label:"Completions",value:course.completions}].map(s => (
              <div key={s.label} className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="font-heading font-bold text-lg text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
          {course.learners > 0 && (
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-600">Completion Rate</span>
                <span className="font-bold text-slate-900">{completionPct}%</span>
              </div>
              <div className="progress-bar h-2"><div className="progress-fill h-2" style={{ width: `${completionPct}%` }} /></div>
            </div>
          )}
        </div>
        <div className="p-6 border-t border-slate-100 flex gap-3">
          <button className="flex-1 h-10 text-sm font-semibold bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
            <BarChart3 size={14} /> Analytics
          </button>
          <Link to="/learning-hub/course/sg-2" className="flex-1 h-10 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors flex items-center justify-center gap-2">
            <Play size={14} /> Start Course
          </Link>
        </div>
      </div>
    </div>
  );
}

function EnrolModal({ courses, onClose }) {
  const [step, setStep] = useState(1);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-slate-900">Enrol a Learner</h2>
            <p className="text-xs text-slate-400 mt-0.5">Step {step} of 2</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors"><X size={15}/></button>
        </div>
        {step === 1 ? (
          <div className="p-6 space-y-4">
            <div>
              <label className="field-label">Select Learner</label>
              <input placeholder="Search by name or email…" className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="field-label">Select Course</label>
              <select className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700">
                <option value="">Choose a course…</option>
                {courses.filter(c => c.status === "published").map(c => <option key={c.id}>{c.title}</option>)}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={onClose} className="flex-1 h-9 text-sm font-semibold border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={() => setStep(2)} className="flex-1 h-9 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors">Next →</button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
              <CheckCircle2 size={32} className="text-emerald-500 mx-auto mb-2" />
              <p className="font-semibold text-slate-900">Ready to enrol</p>
              <p className="text-xs text-slate-500 mt-1">A welcome email will be sent to the learner.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 h-9 text-sm font-semibold border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">← Back</button>
              <button onClick={onClose} className="flex-1 h-9 text-sm font-semibold bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-colors flex items-center justify-center gap-2"><UserPlus size={13}/> Confirm Enrolment</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}