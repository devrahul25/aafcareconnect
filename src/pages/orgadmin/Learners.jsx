import React, { useState } from "react";
import { Search, UserPlus, MoreHorizontal, UserCog, Download } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

const MOCK_LEARNERS = [
  { id: "1", name: "Sarah Jenkins", email: "sarah@example.com", assigned: 8, completed: 6, compliance: "Compliant", certs: 4, cpd: 12, lastActive: "10 mins ago" },
  { id: "2", name: "Michael Chang", email: "michael@example.com", assigned: 5, completed: 5, compliance: "Compliant", certs: 5, cpd: 15, lastActive: "1 hour ago" },
  { id: "3", name: "David Miller", email: "david@example.com", assigned: 6, completed: 2, compliance: "Action Needed", certs: 1, cpd: 4, lastActive: "2 days ago" },
  { id: "4", name: "Emma Watson", email: "emma@example.com", assigned: 4, completed: 1, compliance: "At Risk", certs: 0, cpd: 2, lastActive: "1 week ago" },
];

export default function Learners() {
  const [search, setSearch] = useState("");

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1440px] mx-auto">
      <PageHeader 
        title="Learners" 
        subtitle="Manage learners, assign training, and view compliance"
        actions={
          <div className="flex items-center gap-2">
            <button className="h-9 px-4 text-sm font-semibold bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors">
              <Download size={16} /> Export
            </button>
            <button className="h-9 px-4 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-2 transition-colors">
              <UserPlus size={16} /> Invite Learner
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
              placeholder="Search learners by name or email..."
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
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium text-center">Courses (Done/Assigned)</th>
                <th className="px-4 py-3 font-medium">Compliance</th>
                <th className="px-4 py-3 font-medium text-center">Certificates</th>
                <th className="px-4 py-3 font-medium text-center">CPD Hours</th>
                <th className="px-4 py-3 font-medium">Last Active</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_LEARNERS.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                        {l.name.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <span className="font-semibold text-slate-900">{l.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{l.email}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-medium text-slate-900">{l.completed}</span>
                    <span className="text-slate-400 mx-1">/</span>
                    <span className="text-slate-500">{l.assigned}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      l.compliance === 'Compliant' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      l.compliance === 'At Risk' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    } border`}>
                      {l.compliance}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-slate-600 font-medium">{l.certs}</td>
                  <td className="px-4 py-3 text-center text-slate-600 font-medium">{l.cpd}h</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{l.lastActive}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-slate-400 hover:text-blue-600 p-1 rounded transition-colors" title="Manage Learner">
                      <UserCog size={16} />
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
