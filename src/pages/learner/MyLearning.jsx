import React, { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { Link } from "react-router-dom";
import { Play, CheckCircle2, Clock, BookOpen, ChevronRight } from "lucide-react";

const COURSES = {
  inProgress: [
    { id: "safeguarding-2", title: "Safeguarding Children Level 2", category: "Safeguarding", progress: 45, duration: "2 hours", dueDate: "30 Jul 2026", img: "https://images.unsplash.com/photo-1602494539150-13f508a85534?q=80&w=800&auto=format&fit=crop" },
    { id: "first-aid", title: "First Aid in Social Care", category: "Health & Safety", progress: 80, duration: "4 hours", dueDate: "15 Aug 2026", img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop" },
  ],
  assigned: [
    { id: "mca-2005", title: "Mental Capacity Act 2005", category: "Legal & Compliance", progress: 0, duration: "3 hours", dueDate: "01 Sep 2026", img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop" },
    { id: "attachment", title: "Attachment Theory", category: "Child Development", progress: 0, duration: "1.5 hours", dueDate: "10 Sep 2026", img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop" },
  ],
  completed: [
    { id: "info-sec", title: "Information Security Basics", category: "Compliance", progress: 100, duration: "1 hour", dateCompleted: "12 May 2026", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop" },
    { id: "health-safety", title: "Health & Safety Basics", category: "Health & Safety", progress: 100, duration: "2 hours", dateCompleted: "01 Mar 2026", img: "https://images.unsplash.com/photo-1584813470613-5b1c1cad8002?q=80&w=800&auto=format&fit=crop" },
  ]
};

export default function MyLearning() {
  const [activeTab, setActiveTab] = useState("inProgress");

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1440px] mx-auto">
      <PageHeader 
        title="My Learning" 
        subtitle="Access your assigned training, continue learning, and review past courses"
      />

      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit mb-6">
        <button 
          onClick={() => setActiveTab("inProgress")}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'inProgress' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          In Progress ({COURSES.inProgress.length})
        </button>
        <button 
          onClick={() => setActiveTab("assigned")}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'assigned' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Assigned ({COURSES.assigned.length})
        </button>
        <button 
          onClick={() => setActiveTab("completed")}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'completed' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Completed ({COURSES.completed.length})
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {COURSES[activeTab].map(course => (
          <div key={course.id} className="card p-0 overflow-hidden flex flex-col group cursor-pointer hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-40 overflow-hidden bg-slate-100">
              <img src={course.img} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white backdrop-blur-md border border-white/20 mb-2">
                  {course.category}
                </span>
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-bold text-slate-900 leading-snug mb-3 line-clamp-2">{course.title}</h3>
              
              <div className="flex items-center gap-4 text-xs text-slate-500 mb-4 font-medium">
                <div className="flex items-center gap-1.5"><Clock size={14} className="text-slate-400" /> {course.duration}</div>
                {course.dueDate && <div className="flex items-center gap-1.5"><BookOpen size={14} className="text-slate-400" /> Due: {course.dueDate}</div>}
                {course.dateCompleted && <div className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-500" /> {course.dateCompleted}</div>}
              </div>

              <div className="mt-auto space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
                  <span>{activeTab === 'completed' ? 'Completed' : 'Progress'}</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${activeTab === 'completed' ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${course.progress}%` }} />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100">
              {activeTab === 'completed' ? (
                <button className="w-full h-9 text-sm font-semibold bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                  View Certificate
                </button>
              ) : (
                <Link to={`/learning-hub/course/${course.id}`} className="w-full h-9 text-sm font-semibold bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <Play size={14} fill="currentColor" /> {activeTab === 'inProgress' ? 'Continue Learning' : 'Start Course'}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
