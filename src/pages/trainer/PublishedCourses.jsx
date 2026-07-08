import React, { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { Search, Edit3, BarChart2, Copy, Archive, Users, Award, Star } from "lucide-react";

const MOCK_PUBLISHED = [
  { id: "1", title: "Safeguarding Children Level 2", published: "12 May 2026", active: 45, completion: 82, rating: 4.8, certs: 124 },
  { id: "2", title: "First Aid in Social Care", published: "01 Mar 2026", active: 22, completion: 94, rating: 4.9, certs: 89 },
  { id: "3", title: "Equality, Diversity & Inclusion", published: "15 Jan 2026", active: 18, completion: 76, rating: 4.5, certs: 56 },
];

export default function PublishedCourses() {
  const [search, setSearch] = useState("");

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1440px] mx-auto">
      <PageHeader 
        title="Published Courses" 
        subtitle="Manage and monitor your live courses currently available to learners"
      />

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search published courses..."
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
                <th className="px-4 py-3 font-medium">Published Date</th>
                <th className="px-4 py-3 font-medium text-center">Active Learners</th>
                <th className="px-4 py-3 font-medium text-center">Completion %</th>
                <th className="px-4 py-3 font-medium text-center">Avg Rating</th>
                <th className="px-4 py-3 font-medium text-center">Certificates</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_PUBLISHED.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{c.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Live</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{c.published}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1.5 text-slate-700">
                      <Users size={14} className="text-blue-500" />
                      <span className="font-medium">{c.active}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${c.completion}%` }} />
                      </div>
                      <span className="text-xs text-slate-600 font-medium">{c.completion}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                      <span className="font-medium text-slate-700">{c.rating}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-700 font-medium">
                      <Award size={14} className="text-violet-500" />
                      {c.certs}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="text-slate-400 hover:text-blue-600 p-1.5 rounded transition-colors" title="Edit Content">
                        <Edit3 size={16} />
                      </button>
                      <button className="text-slate-400 hover:text-blue-600 p-1.5 rounded transition-colors" title="Analytics">
                        <BarChart2 size={16} />
                      </button>
                      <button className="text-slate-400 hover:text-blue-600 p-1.5 rounded transition-colors" title="Duplicate">
                        <Copy size={16} />
                      </button>
                      <button className="text-slate-400 hover:text-red-500 p-1.5 rounded transition-colors" title="Archive Course">
                        <Archive size={16} />
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
