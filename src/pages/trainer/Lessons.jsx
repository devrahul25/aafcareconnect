import React, { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { Plus, Video, FileText, Type, Presentation, Link as LinkIcon, DownloadCloud, GripVertical, Settings } from "lucide-react";

const MOCK_LESSONS = [
  { id: "1", title: "Introduction to Safeguarding", type: "Video", duration: "12 mins", req: "Must Watch", icon: Video, color: "text-blue-500", bg: "bg-blue-50" },
  { id: "2", title: "Recognizing Abuse Signs", type: "Text", duration: "15 mins", req: "Must Read", icon: Type, color: "text-emerald-500", bg: "bg-emerald-50" },
  { id: "3", title: "Reporting Procedures Policy", type: "PDF", duration: "10 mins", req: "Must Read", icon: FileText, color: "text-amber-500", bg: "bg-amber-50" },
  { id: "4", title: "Case Studies Workshop", type: "Presentation", duration: "20 mins", req: "Must Review", icon: Presentation, color: "text-violet-500", bg: "bg-violet-50" },
  { id: "5", title: "External Reporting Agency", type: "Link", duration: "5 mins", req: "Optional", icon: LinkIcon, color: "text-slate-500", bg: "bg-slate-100" },
  { id: "6", title: "Safeguarding Checklist", type: "Download", duration: "2 mins", req: "Optional", icon: DownloadCloud, color: "text-rose-500", bg: "bg-rose-50" },
];

export default function Lessons() {
  const [activeCourse, setActiveCourse] = useState("Safeguarding Children Level 2");

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1440px] mx-auto">
      <PageHeader 
        title="Manage Lessons" 
        subtitle="Organize, edit, and sequence lessons for your courses"
        actions={
          <button className="h-9 px-4 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-2 transition-colors">
            <Plus size={16} /> Add Lesson
          </button>
        }
      />

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-500">Editing Course:</span>
            <select 
              value={activeCourse} 
              onChange={e => setActiveCourse(e.target.value)}
              className="text-sm font-semibold text-slate-900 bg-transparent border-none outline-none cursor-pointer"
            >
              <option>Safeguarding Children Level 2</option>
              <option>First Aid in Social Care</option>
              <option>Attachment Theory</option>
            </select>
          </div>
          <span className="text-xs font-semibold text-slate-400">Drag to reorder</span>
        </div>

        <div className="p-2 space-y-1">
          {MOCK_LESSONS.map((l, index) => (
            <div key={l.id} className="flex items-center gap-4 p-3 rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-colors group cursor-move">
              <GripVertical size={18} className="text-slate-300 group-hover:text-slate-500" />
              <div className="w-8 font-semibold text-slate-400 text-center text-sm">{index + 1}</div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${l.bg} ${l.color}`}>
                <l.icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-900">{l.title}</h4>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                  <span className="font-medium text-slate-600">{l.type}</span>
                  <span>•</span>
                  <span>{l.duration}</span>
                  <span>•</span>
                  <span className={l.req === "Optional" ? "text-slate-400" : "text-amber-600 font-medium"}>{l.req}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="h-8 px-3 text-xs font-medium bg-white border border-slate-200 rounded shadow-sm hover:bg-slate-50 flex items-center gap-2">
                  <Settings size={14} /> Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
