import React, { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { Plus, Search, Edit3, Settings, HelpCircle, FileCheck2, BarChart2 } from "lucide-react";

const MOCK_QUIZZES = [
  { id: "1", title: "Safeguarding Final Assessment", course: "Safeguarding Children Level 2", questions: 20, passScore: 80, attempts: 3, type: "Final Quiz", time: "30 mins", avgScore: 85 },
  { id: "2", title: "First Aid Module 1 Quiz", course: "First Aid in Social Care", questions: 5, passScore: 100, attempts: "Unlimited", type: "Module Quiz", time: "No Limit", avgScore: 92 },
  { id: "3", title: "Attachment Theory Assignment", course: "Attachment Theory", questions: 1, passScore: 70, attempts: 1, type: "File Upload", time: "No Limit", avgScore: 0 },
];

export default function QuizzesAssessments() {
  const [search, setSearch] = useState("");

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1440px] mx-auto">
      <PageHeader 
        title="Quizzes & Assessments" 
        subtitle="Create and manage evaluations, passing criteria, and assignments"
        actions={
          <button className="h-9 px-4 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-2 transition-colors">
            <Plus size={16} /> Create Assessment
          </button>
        }
      />

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search assessments..."
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
                <th className="px-4 py-3 font-medium">Assessment Title</th>
                <th className="px-4 py-3 font-medium">Course / Module</th>
                <th className="px-4 py-3 font-medium text-center">Questions</th>
                <th className="px-4 py-3 font-medium text-center">Pass Mark</th>
                <th className="px-4 py-3 font-medium text-center">Attempts</th>
                <th className="px-4 py-3 font-medium text-center">Avg Score</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_QUIZZES.map((q) => (
                <tr key={q.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900 flex items-center gap-2">
                      {q.type === 'File Upload' ? <FileCheck2 size={16} className="text-violet-500"/> : <HelpCircle size={16} className="text-blue-500"/>}
                      {q.title}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{q.type} • {q.time}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{q.course}</td>
                  <td className="px-4 py-3 text-center text-slate-900 font-medium">{q.questions}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {q.passScore}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-slate-600">{q.attempts}</td>
                  <td className="px-4 py-3 text-center text-slate-600">{q.avgScore > 0 ? `${q.avgScore}%` : '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="text-slate-400 hover:text-blue-600 p-1.5 rounded transition-colors" title="Edit Questions">
                        <Edit3 size={16} />
                      </button>
                      <button className="text-slate-400 hover:text-blue-600 p-1.5 rounded transition-colors" title="Analytics">
                        <BarChart2 size={16} />
                      </button>
                      <button className="text-slate-400 hover:text-slate-600 p-1.5 rounded transition-colors" title="Settings">
                        <Settings size={16} />
                      </button>
                    </div>
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
