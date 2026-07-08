import React, { useState } from "react";
import { Search, Plus, Building2, MoreHorizontal, CheckCircle2, AlertTriangle, Archive } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "@/components/ui/PageHeader";

const MOCK_ORGS = [
  { id: "1", name: "Eserve Social Care", plan: "Enterprise", status: "Active", learners: 1450, staff: 45, compliance: 94, lastActive: "2 hours ago" },
  { id: "2", name: "Horizon Fostering", plan: "Professional", status: "Active", learners: 320, staff: 12, compliance: 88, lastActive: "5 mins ago" },
  { id: "3", name: "Oakwood Care Homes", plan: "Standard", status: "Trial", learners: 85, staff: 5, compliance: 72, lastActive: "1 day ago" },
  { id: "4", name: "Pinnacle Support", plan: "Enterprise", status: "Suspended", learners: 600, staff: 20, compliance: 45, lastActive: "2 weeks ago" },
];

export default function Organisations() {
  const [search, setSearch] = useState("");

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1440px] mx-auto">
      <PageHeader 
        title="Organisations" 
        subtitle="Manage all registered organisations on the platform"
        actions={
          <button className="h-9 px-4 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-2 transition-colors">
            <Plus size={16} /> New Organisation
          </button>
        }
      />

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search organisations..."
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
                <th className="px-4 py-3 font-medium">Organisation Name</th>
                <th className="px-4 py-3 font-medium">Subscription</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Learners</th>
                <th className="px-4 py-3 font-medium text-right">Staff</th>
                <th className="px-4 py-3 font-medium text-right">Compliance</th>
                <th className="px-4 py-3 font-medium">Last Active</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_ORGS.map((org) => (
                <tr key={org.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        <Building2 size={14} />
                      </div>
                      <div className="flex flex-col">
                        <Link to={`/superadmin/organisations/${org.id}`} className="font-bold text-slate-900 hover:text-blue-600 hover:underline transition-colors">{org.name}</Link>
                        <span className="text-[11px] text-slate-500 font-medium">ID: ORG-{org.id.padStart(4, '0')}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{org.plan}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      org.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      org.status === 'Trial' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    } border`}>
                      {org.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-right font-medium">{org.learners.toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-600 text-right font-medium">{org.staff}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-semibold ${org.compliance >= 90 ? 'text-emerald-600' : org.compliance >= 75 ? 'text-amber-600' : 'text-red-600'}`}>
                      {org.compliance}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{org.lastActive}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-slate-400 hover:text-blue-600 p-1 rounded transition-colors">
                      <MoreHorizontal size={16} />
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
