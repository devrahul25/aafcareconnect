import React, { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { Filter, Search, ChevronRight } from "lucide-react";

const PROGRESS_DATA = [
  { id: "1", learner: "Sarah Jenkins", course: "Safeguarding Children Level 2", progress: 100, status: "Completed", timeSpent: "2h 15m", score: "94%" },
  { id: "2", learner: "Sarah Jenkins", course: "First Aid in Social Care", progress: 60, status: "In Progress", timeSpent: "1h 30m", score: "-" },
  { id: "3", learner: "David Miller", course: "Safeguarding Children Level 2", progress: 0, status: "Not Started", timeSpent: "0m", score: "-" },
  { id: "4", learner: "Emma Watson", course: "Attachment Theory", progress: 100, status: "Completed", timeSpent: "3h 10m", score: "88%" },
  { id: "5", learner: "Michael Chang", course: "Health & Safety Basics", progress: 100, status: "Completed", timeSpent: "45m", score: "100%" },
];

export default function LearningProgress() {
  const [search, setSearch] = useState("");

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1440px] mx-auto">
      <PageHeader 
        title="Learning Progress" 
        subtitle="Track detailed course progress and assessment scores for your team"
        actions={
          <button className="h-9 px-4 text-sm font-semibold bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors">
            <Filter size={16} /> Filter Results
          </button>
        }
      />

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by learner or course..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/50 text-slate-500 font-medium">
              <tr>
                <th className="px-4 py-3 font-medium">Learner</th>
                <th className="px-4 py-3 font-medium">Course</th>
                <th className="px-4 py-3 font-medium">Progress</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-center">Time Spent</th>
                <th className="px-4 py-3 font-medium text-center">Score</th>
                <th className="px-4 py-3 font-medium text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {PROGRESS_DATA.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900">{p.learner}</td>
                  <td className="px-4 py-3 text-slate-700">{p.course}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${p.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} 
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">{p.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                      p.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      p.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-slate-100 text-slate-600 border-slate-200'
                    } border`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-slate-600">{p.timeSpent}</td>
                  <td className="px-4 py-3 text-center font-medium text-slate-900">{p.score}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-slate-400 hover:text-blue-600 p-1.5 rounded transition-colors" title="View Timeline">
                      <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
