import React, { useState } from "react";
import { Search, UserPlus, FileText, Download, Eye, PlusCircle } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

const MOCK_TEAM_LEARNERS = [
  { id: "1", name: "Sarah Jenkins", role: "Foster Carer", courses: { done: 6, total: 8 }, compliance: "Compliant", certs: 4, cpd: 12, lastActive: "10 mins ago" },
  { id: "2", name: "Michael Chang", role: "Support Worker", courses: { done: 5, total: 5 }, compliance: "Compliant", certs: 5, cpd: 15, lastActive: "1 hour ago" },
  { id: "3", name: "David Miller", role: "Foster Carer", courses: { done: 2, total: 6 }, compliance: "Action Needed", certs: 1, cpd: 4, lastActive: "2 days ago" },
  { id: "4", name: "Emma Watson", role: "Social Worker", courses: { done: 1, total: 4 }, compliance: "At Risk", certs: 0, cpd: 2, lastActive: "1 week ago" },
];

export default function MyLearners() {
  const [search, setSearch] = useState("");

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1440px] mx-auto">
      <PageHeader 
        title="My Learners" 
        subtitle="View and support your assigned team of learners"
        actions={
          <div className="flex items-center gap-2">
            <button className="h-9 px-4 text-sm font-semibold bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors">
              <Download size={16} /> Export Team Report
            </button>
            <button className="h-9 px-4 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-2 transition-colors">
              <BookPlusIcon size={16} /> Assign Course
            </button>
          </div>
        }
      />

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search team members..."
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
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium text-center">Courses (Done/Assigned)</th>
                <th className="px-4 py-3 font-medium text-center">Compliance</th>
                <th className="px-4 py-3 font-medium text-center">CPD Hours</th>
                <th className="px-4 py-3 font-medium">Last Active</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_TEAM_LEARNERS.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                        {l.name.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <span className="font-semibold text-slate-900">{l.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{l.role}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-medium text-slate-900">{l.courses.done}</span>
                    <span className="text-slate-400 mx-1">/</span>
                    <span className="text-slate-500">{l.courses.total}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      l.compliance === 'Compliant' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      l.compliance === 'At Risk' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    } border`}>
                      {l.compliance}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-slate-600 font-medium">{l.cpd}h</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{l.lastActive}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="text-slate-400 hover:text-blue-600 p-1.5 rounded transition-colors" title="View Profile">
                        <Eye size={16} />
                      </button>
                      <button className="text-slate-400 hover:text-blue-600 p-1.5 rounded transition-colors" title="Add Note">
                        <FileText size={16} />
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

function BookPlusIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
      <path d="M12 7v6"/>
      <path d="M9 10h6"/>
    </svg>
  );
}
