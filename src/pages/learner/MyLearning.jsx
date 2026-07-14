import React, { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { Link } from "react-router-dom";
import { Play, CheckCircle2, Clock, BookOpen, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";

export default function MyLearning() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("inProgress");

  const { data: enrolments = [], isLoading } = useQuery({
    queryKey: ['course-enrolments', user?.id],
    queryFn: () => apiClient.get(`/course-enrolments?userId=${user?.id}`).then(res => res.data.data || []),
    enabled: !!user?.id
  });

  const COURSES = {
    inProgress: enrolments.filter(e => e.status === 'IN_PROGRESS'),
    assigned: enrolments.filter(e => e.status === 'ENROLLED' || e.status === 'ASSIGNED' || !e.status), // Fallback
    completed: enrolments.filter(e => e.status === 'COMPLETED')
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p>Loading your courses...</p>
      </div>
    );
  }

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
        {COURSES[activeTab].length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            No courses found in this category.
          </div>
        )}
        {COURSES[activeTab].map(enrolment => {
          const course = enrolment.course || {};
          const progress = enrolment.progress_percent || 0;
          return (
            <div key={enrolment.id} className="card p-0 overflow-hidden flex flex-col group cursor-pointer hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-40 overflow-hidden bg-slate-100 flex items-center justify-center">
                {course.thumbnail_url ? (
                  <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <BookOpen className="w-12 h-12 text-slate-300 group-hover:scale-110 transition-transform duration-500" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white backdrop-blur-md border border-white/20 mb-2">
                    {course.category || 'General'}
                  </span>
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-slate-900 leading-snug mb-3 line-clamp-2">{course.title}</h3>
                
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4 font-medium">
                  <div className="flex items-center gap-1.5"><Clock size={14} className="text-slate-400" /> {course.duration_minutes || 0} mins</div>
                  {activeTab === 'completed' && <div className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-500" /> {new Date(enrolment.updated_at).toLocaleDateString()}</div>}
                </div>

                <div className="mt-auto space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
                    <span>{activeTab === 'completed' ? 'Completed' : 'Progress'}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${activeTab === 'completed' ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${progress}%` }} />
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
          );
        })}
      </div>
    </div>
  );
}
