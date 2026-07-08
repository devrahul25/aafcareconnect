import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import { Edit3, PlayCircle, Trash2, Clock, AlertCircle } from "lucide-react";

const MOCK_DRAFTS = [
  { id: "1", title: "Attachment Theory", progress: 65, lastEdited: "3 hours ago", missing: ["Final Assessment", "Thumbnail Image"] },
  { id: "2", title: "Advanced Safeguarding", progress: 20, lastEdited: "2 days ago", missing: ["Module 2 Content", "All Quizzes"] },
  { id: "3", title: "Mental Capacity Act 2005", progress: 95, lastEdited: "1 week ago", missing: ["Review Required"] },
];

export default function DraftCourses() {
  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1440px] mx-auto">
      <PageHeader 
        title="Draft Courses" 
        subtitle="Continue working on your unpublished courses"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_DRAFTS.map(draft => (
          <div key={draft.id} className="card p-0 overflow-hidden flex flex-col group">
            <div className="p-5 flex-1">
              <div className="flex items-start justify-between mb-4">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  Draft
                </span>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock size={12} />
                  {draft.lastEdited}
                </div>
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-4">{draft.title}</h3>
              
              <div className="space-y-1.5 mb-4">
                <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                  <span>Completion Progress</span>
                  <span>{draft.progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${draft.progress}%` }} />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Missing Requirements</p>
                {draft.missing.map((req, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200 shadow-sm" title="Delete Draft">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 text-sm font-semibold bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
                  <Edit3 size={16} /> Continue
                </button>
                <button className="px-4 py-2 text-sm font-semibold bg-blue-600 border border-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" disabled={draft.progress < 100}>
                  <PlayCircle size={16} /> Publish
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
