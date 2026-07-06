import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  PenTool, Plus, Play, FileText, HelpCircle, Settings,
  CheckCircle2, Trash2, GripVertical, X, Upload,
  Eye, Save, Users, Clock, Award, ArrowRight, ChevronRight,
  Zap, BarChart3, Edit3, Lock, AlertTriangle, Star
} from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import PageHeader from "@/components/ui/PageHeader";
import KpiCard from "@/components/ui/KpiCard";

const MY_COURSES = [
  { id: 1, title: "Safeguarding Children: Level 2",    category: "Safeguarding",          level: "Foundation",   status: "published", learners: 84, completions: 71, avgScore: 88, rating: 4.9, sections: 5, updated: "2 days ago"  },
  { id: 2, title: "Therapeutic Parenting in Practice", category: "Therapeutic Parenting", level: "Intermediate", status: "published", learners: 61, completions: 44, avgScore: 82, rating: 4.8, sections: 7, updated: "1 week ago"  },
  { id: 3, title: "Safe Caring in the Home",           category: "Safeguarding",          level: "Foundation",   status: "draft",     learners: 0,  completions: 0,  avgScore: null, rating: null, sections: 4, updated: "Today"     },
  { id: 4, title: "Understanding Trauma & Loss",       category: "Therapeutic Parenting", level: "Advanced",     status: "published", learners: 38, completions: 30, avgScore: 79, rating: 4.6, sections: 6, updated: "3 days ago" },
];

const BLOCK_TYPES = [
  { type: "video",  icon: Play,       label: "Video Lesson",  desc: "Upload or embed a training video",         bg: "bg-blue-50",   color: "text-blue-600"   },
  { type: "pdf",    icon: FileText,   label: "Document",      desc: "Upload a PDF, policy or reading material",  bg: "bg-emerald-50",color: "text-emerald-600"},
  { type: "quiz",   icon: HelpCircle, label: "Quiz",          desc: "Multiple-choice knowledge assessment",      bg: "bg-violet-50", color: "text-violet-600" },
  { type: "text",   icon: Edit3,      label: "Rich Text",     desc: "Written lesson, tips or summary notes",     bg: "bg-amber-50",  color: "text-amber-600"  },
];

const BLOCK_DEFAULTS = {
  video: { duration: "0:00", icon: Play,       bg: "bg-blue-50",   color: "text-blue-600"   },
  pdf:   { duration: "5 min read", icon: FileText, bg: "bg-emerald-50", color: "text-emerald-600"},
  quiz:  { duration: "10 min",     icon: HelpCircle, bg: "bg-violet-50", color: "text-violet-600" },
  text:  { duration: "3 min read", icon: Edit3,  bg: "bg-amber-50",  color: "text-amber-600"  },
};

const LEVEL_CLS = { Foundation: "bg-emerald-50 text-emerald-700", Intermediate: "bg-amber-50 text-amber-700", Advanced: "bg-red-50 text-red-700" };

const INIT_BLOCKS = [
  { id: 1, type: "video",  title: "Welcome & Introduction",        note: "12:34" },
  { id: 2, type: "pdf",    title: "Safeguarding Policy Document",  note: "8 pages" },
  { id: 3, type: "text",   title: "Key Definitions & Principles",  note: "Reading" },
  { id: 4, type: "quiz",   title: "Knowledge Check — 10 Questions",note: "Pass: 75%" },
];

export default function CourseBuilder() {
  const { user } = /** @type {any} */ (useOutletContext() || {});
  const [view,         setView]         = useState("list");        // list | editor
  const [activeCourse, setActiveCourse] = useState(null);
  const [deleteId,     setDeleteId]     = useState(null);

  if (view === "editor") {
    return <Editor course={activeCourse} onBack={() => { setView("list"); setActiveCourse(null); }} />;
  }

  const published = MY_COURSES.filter(c => c.status === "published").length;

  return (
    <div className="p-6 space-y-5 animate-fade-in max-w-[1400px] mx-auto">
      <PageHeader
        title="Course Builder"
        subtitle="Create, manage and publish training courses"
        actions={
          <button onClick={() => { setActiveCourse({ id: 0, title: "Untitled Course", status: "draft", sections: 0 }); setView("editor"); }}
            className="h-9 px-4 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-2 transition-colors">
            <Plus size={14}/> New Course
          </button>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="My Courses"     value={MY_COURSES.length}                               icon={PenTool}      iconBg="bg-violet-600"  />
        <KpiCard title="Published"      value={published}                                       icon={CheckCircle2} iconBg="bg-emerald-600"  />
        <KpiCard title="Total Learners" value={MY_COURSES.reduce((s,c)=>s+c.learners,0)}        icon={Users}        iconBg="bg-blue-600"     />
        <KpiCard title="Avg Score"      value="84%"                                             icon={Award}        iconBg="bg-indigo-600" delta={2} deltaLabel="+2% vs last month"  />
      </div>

      {/* Draft alert */}
      {MY_COURSES.filter(c => c.status === "draft").length > 0 && (
        <div className="card border-l-4 border-l-amber-400 bg-amber-50/40 p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle size={16} className="text-amber-600 flex-shrink-0"/>
            <p className="text-sm font-semibold text-slate-900">
              {MY_COURSES.filter(c => c.status === "draft").length} course{MY_COURSES.filter(c=>c.status==="draft").length>1?"s are":"is"} in draft — learners can't access them until published.
            </p>
          </div>
          <button onClick={() => { setActiveCourse(MY_COURSES.find(c=>c.status==="draft")); setView("editor"); }}
            className="h-8 px-3 text-xs font-semibold bg-amber-500 text-white rounded-lg hover:bg-amber-400 flex items-center gap-1.5 transition-colors flex-shrink-0">
            Review & Publish
          </button>
        </div>
      )}

      {/* Course grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MY_COURSES.map(course => (
          <CourseCard key={course.id} course={course} onEdit={() => { setActiveCourse(course); setView("editor"); }} />
        ))}
        {/* New course tile */}
        <button onClick={() => { setActiveCourse({ id: 0, title: "Untitled Course", status: "draft", sections: 0 }); setView("editor"); }}
          className="card card-hover border-2 border-dashed border-slate-200 p-8 flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-blue-600 hover:border-blue-300 transition-all cursor-pointer">
          <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center">
            <Plus size={22}/>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold">Create New Course</p>
            <p className="text-xs text-slate-400 mt-0.5">Video, PDF, quiz and text blocks</p>
          </div>
        </button>
      </div>
    </div>
  );
}

function CourseCard({ course, onEdit }) {
  const completionPct = course.learners > 0 ? Math.round((course.completions / course.learners) * 100) : 0;
  return (
    <div className="card card-hover p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <StatusBadge status={course.status}/>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${LEVEL_CLS[course.level]}`}>{course.level}</span>
          </div>
          <h3 className="font-heading font-bold text-slate-900 text-base leading-snug">{course.title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{course.category} · {course.sections} sections · Updated {course.updated}</p>
        </div>
        <button onClick={onEdit} className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white transition-colors flex-shrink-0">
          <Edit3 size={15}/>
        </button>
      </div>

      {course.status === "published" && (
        <div className="grid grid-cols-3 gap-3">
          {[{label:"Learners",value:course.learners,icon:Users},{label:"Completions",value:course.completions,icon:CheckCircle2},{label:"Avg Score",value:`${course.avgScore}%`,icon:Star}].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-slate-50 rounded-xl p-3 text-center">
                <Icon size={13} className="text-slate-400 mx-auto mb-1"/>
                <p className="font-heading font-bold text-lg text-slate-900 leading-none">{s.value}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{s.label}</p>
              </div>
            );
          })}
        </div>
      )}

      {course.status === "published" && (
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-500 font-medium">Completion rate</span>
            <span className="font-bold text-slate-700">{completionPct}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${completionPct}%` }}/>
          </div>
        </div>
      )}

      {course.status === "draft" && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-center gap-2">
          <Lock size={13} className="text-amber-600 flex-shrink-0"/>
          <p className="text-xs text-amber-700 font-medium">Draft — not visible to learners. Complete all sections then publish.</p>
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <button onClick={onEdit} className="flex-1 h-8 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors">
          <Edit3 size={12}/> Edit
        </button>
        <button className="flex-1 h-8 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors">
          <BarChart3 size={12}/> Analytics
        </button>
        {course.status === "draft" && (
          <button onClick={onEdit} className="flex-1 h-8 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 flex items-center justify-center gap-1.5 transition-colors">
            <CheckCircle2 size={12}/> Publish
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Full-page course editor ─────────────────────────────────────────────────
function Editor({ course, onBack }) {
  const [blocks,      setBlocks]      = useState(course.id ? INIT_BLOCKS : []);
  const [tab,         setTab]         = useState("content");
  const [addingBlock, setAddingBlock] = useState(false);
  const [title,       setTitle]       = useState(course.title);
  const [published,   setPublished]   = useState(course.status === "published");

  const removeBlock = (id) => setBlocks(b => b.filter(x => x.id !== id));
  const addBlock = (type) => {
    setBlocks(b => [...b, { id: Date.now(), type, title: `New ${BLOCK_DEFAULTS[type] ? type.charAt(0).toUpperCase() + type.slice(1) : "Block"}`, note: BLOCK_DEFAULTS[type]?.duration || "" }]);
    setAddingBlock(false);
  };

  return (
    <div className="flex flex-col h-full animate-fade-in bg-slate-50">
      {/* Editor top bar */}
      <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 z-10">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onBack} className="text-xs font-semibold text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors flex-shrink-0">← Courses</button>
          <span className="text-slate-200">/</span>
          <span className="text-sm font-semibold text-slate-900 truncate">{title}</span>
          <StatusBadge status={published ? "published" : "draft"} size="xs"/>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button className="h-8 px-3 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 transition-colors">
            <Eye size={13}/> Preview
          </button>
          {!published ? (
            <button onClick={() => setPublished(true)} className="h-8 px-3 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 flex items-center gap-1.5 transition-colors">
              <CheckCircle2 size={13}/> Publish Course
            </button>
          ) : (
            <button className="h-8 px-3 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-1.5 transition-colors">
              <Save size={13}/> Save Changes
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-100 px-6">
        <div className="flex gap-0">
          {[["content","Content"],["settings","Settings"],["preview","Preview"]].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors -mb-px ${tab === key ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {tab === "content" && (
          <div className="max-w-2xl mx-auto p-6 space-y-4">
            {/* Title */}
            <div className="card p-5">
              <label className="field-label">Course Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)}
                className="w-full font-heading text-xl font-bold text-slate-900 bg-transparent border-none outline-none focus:ring-0 p-0 placeholder:text-slate-300"
                placeholder="Enter course title…"/>
            </div>

            {/* Progress indicator */}
            <div className="card p-4 flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-600">Course completion</span>
                  <span className="font-bold text-slate-900">{Math.min(100, blocks.length * 25)}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${Math.min(100, blocks.length * 25)}%`}}/>
                </div>
              </div>
              <span className="text-xs text-slate-400">{blocks.length} / 4+ sections recommended</span>
            </div>

            {/* Blocks */}
            <div className="space-y-2">
              {blocks.map((block, i) => {
                const def = BLOCK_DEFAULTS[block.type] || {};
                const Icon = def.icon || PenTool;
                return (
                  <div key={block.id} className="card p-4 flex items-center gap-3 group">
                    <GripVertical size={14} className="text-slate-300 cursor-grab flex-shrink-0"/>
                    <span className="text-[11px] font-bold text-slate-300 w-5 flex-shrink-0 text-center">{String(i+1).padStart(2,"0")}</span>
                    <div className={`w-9 h-9 rounded-xl ${def.bg || "bg-slate-100"} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={15} className={def.color || "text-slate-500"}/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <input defaultValue={block.title}
                        className="text-sm font-semibold text-slate-800 bg-transparent border-none outline-none focus:ring-0 p-0 w-full"/>
                      <p className="text-xs text-slate-400 capitalize">{block.type} · {block.note}</p>
                    </div>
                    <button onClick={() => removeBlock(block.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 size={13}/>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Add block */}
            {!addingBlock ? (
              <button onClick={() => setAddingBlock(true)}
                className="w-full p-4 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-blue-300 hover:text-blue-500 transition-all text-sm font-semibold flex items-center justify-center gap-2">
                <Plus size={16}/> Add Section
              </button>
            ) : (
              <div className="card p-5">
                <p className="field-label mb-3">Choose Section Type</p>
                <div className="grid grid-cols-2 gap-3">
                  {BLOCK_TYPES.map(({ type, icon: Icon, label, desc, bg, color }) => (
                    <button key={type} onClick={() => addBlock(type)}
                      className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-left group">
                      <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={16} className={color}/>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-700 group-hover:text-blue-700">{label}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <button onClick={() => setAddingBlock(false)} className="mt-3 text-xs text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
              </div>
            )}
          </div>
        )}

        {tab === "settings" && (
          <div className="max-w-2xl mx-auto p-6 space-y-4">
            <div className="card p-5 space-y-4">
              <h3 className="font-heading font-bold text-slate-900">Course Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="field-label">Category</label>
                  <select className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {["Safeguarding","Therapeutic Parenting","Attachment","Health & Safety","Legislation","Equality & Diversity"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">Level</label>
                  <select className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {["Foundation","Intermediate","Advanced"].map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="field-label">Pass Mark (%)</label>
                  <input type="number" defaultValue={75} className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>
                <div>
                  <label className="field-label">Duration (minutes)</label>
                  <input type="number" defaultValue={60} className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>
              </div>
              {[{label:"Mandatory for all learners",desc:"All enrolled users must complete this course"},{label:"Auto-generate Certificate",desc:"Issue a completion certificate on passing"},{label:"Allow retakes",desc:"Learners can retake failed assessments"}].map((s,i) => (
                <div key={s.label} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{s.label}</p>
                    <p className="text-xs text-slate-400">{s.desc}</p>
                  </div>
                  <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${i === 1 ? "bg-blue-600" : "bg-slate-200"}`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${i === 1 ? "right-0.5" : "left-0.5"}`}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "preview" && (
          <div className="max-w-xl mx-auto p-6 space-y-4">
            <div className="card overflow-hidden">
              <div className="h-36 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center p-6">
                <p className="font-heading font-bold text-2xl text-white text-center leading-snug">{title}</p>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="badge badge-blue text-xs">{blocks.length} sections</span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-500">Estimated 60 minutes</span>
                </div>
                {blocks.map((b, i) => {
                  const def = BLOCK_DEFAULTS[b.type] || {};
                  const Icon = def.icon || PenTool;
                  return (
                    <div key={b.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                      <span className="text-xs font-bold text-slate-300 w-5 text-center">{i+1}</span>
                      <Icon size={13} className={def.color || "text-slate-500"}/>
                      <span className="text-sm text-slate-700">{b.title}</span>
                      <span className="ml-auto text-xs text-slate-400">{b.note}</span>
                    </div>
                  );
                })}
                {blocks.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No sections yet — add some content</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}