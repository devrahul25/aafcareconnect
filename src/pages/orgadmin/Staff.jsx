import React, { useState } from "react";
import { Search, UserPlus, MoreHorizontal, UserCog } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

const MOCK_STAFF = [
  { id: "1", name: "Alice Thompson", jobTitle: "Senior Social Worker", role: "Manager", email: "alice@eserve.com", compliance: 100, learners: 12, status: "Active" },
  { id: "2", name: "Robert Lewis", jobTitle: "Training Coordinator", role: "Trainer", email: "robert@eserve.com", compliance: 95, learners: 45, status: "Active" },
  { id: "3", name: "Sophie Clark", jobTitle: "HR Administrator", role: "Org Admin", email: "sophie@eserve.com", compliance: 100, learners: 0, status: "Active" },
  { id: "4", name: "Marcus Johnson", jobTitle: "Support Worker", role: "Staff", email: "marcus@eserve.com", compliance: 65, learners: 3, status: "Suspended" },
];

export default function Staff() {
  const [search, setSearch] = useState("");

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1440px] mx-auto">
      <PageHeader 
        title="Staff Members" 
        subtitle="Manage your organisation's administrative and support staff"
        actions={
          <button className="h-9 px-4 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-2 transition-colors">
            <UserPlus size={16} /> Invite Staff
          </button>
        }
      />

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search staff..."
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
                <th className="px-4 py-3 font-medium">Job Title</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium text-center">Compliance</th>
                <th className="px-4 py-3 font-medium text-center">Assigned Learners</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_STAFF.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                        {s.name.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <span className="font-semibold text-slate-900">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{s.jobTitle}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                      {s.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{s.email}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`font-semibold ${s.compliance >= 90 ? 'text-emerald-600' : s.compliance >= 75 ? 'text-amber-600' : 'text-red-600'}`}>
                      {s.compliance}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-medium text-slate-600">{s.learners}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      s.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                    } border`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-slate-400 hover:text-blue-600 p-1 rounded transition-colors" title="Manage Staff">
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
