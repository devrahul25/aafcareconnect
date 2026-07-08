import React, { useState } from "react";
import { Search, Plus, Edit3, BarChart2, Copy, Archive, PlayCircle } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { Link } from "react-router-dom";

const MOCK_COURSES = [
  { id: "1", title: "Safeguarding Children Level 2", category: "Safeguarding", level: "Intermediate", status: "Published", enrolled: 124, completion: 82, score: 91, updated: "2 days ago" },
  { id: "2", title: "First Aid in Social Care", category: "Health & Safety", level: "Beginner", status: "Published", enrolled: 89, completion: 94, score: 88, updated: "1 week ago" },
  { id: "3", title: "Attachment Theory", category: "Child Development", level: "Advanced", status: "Draft", enrolled: 0, completion: 0, score: 0, updated: "3 hours ago" },
  { id: "4", title: "Medication Administration", category: "Health & Safety", level: "Intermediate", status: "Archived", enrolled: 45, completion: 100, score: 95, updated: "1 year ago" },
];

export default function MyCourses() {
  const [search, setSearch] = useState("");

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1440px] mx-auto">
      <PageHeader 
        title="My Courses" 
        subtitle="Manage and track the performance of all courses you've created"
        actions={
          <Link to="/course-builder" className="h-9 px-4 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-2 transition-colors">
            <Plus size={16} /> Create New Course
          </Link>
        }
      />

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search courses..."
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
                <th className="px-4 py-3 font-medium">Course Title</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-center">Enrolled</th>
                <th className="px-4 py-3 font-medium text-center">Completion</th>
                <th className="px-4 py-3 font-medium text-center">Avg Score</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_COURSES.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{c.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Updated {c.updated}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{c.category}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      c.status === 'Published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      c.status === 'Draft' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-slate-100 text-slate-600 border-slate-200'
                    } border`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-medium text-slate-900">{c.enrolled}</td>
                  <td className="px-4 py-3 text-center text-slate-600">{c.completion}%</td>
                  <td className="px-4 py-3 text-center text-slate-600">{c.score}%</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {c.status === 'Draft' && (
                        <button className="text-emerald-500 hover:text-emerald-600 p-1.5 rounded transition-colors" title="Publish">
                          <PlayCircle size={16} />
                        </button>
                      )}
                      <button className="text-slate-400 hover:text-blue-600 p-1.5 rounded transition-colors" title="Edit">
                        <Edit3 size={16} />
                      </button>
                      <button className="text-slate-400 hover:text-blue-600 p-1.5 rounded transition-colors" title="Analytics">
                        <BarChart2 size={16} />
                      </button>
                      <button className="text-slate-400 hover:text-blue-600 p-1.5 rounded transition-colors" title="Duplicate">
                        <Copy size={16} />
                      </button>
                      {c.status !== 'Archived' && (
                        <button className="text-slate-400 hover:text-red-500 p-1.5 rounded transition-colors" title="Archive">
                          <Archive size={16} />
                        </button>
                      )}
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
