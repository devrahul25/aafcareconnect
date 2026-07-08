import React, { useState } from "react";
import { Search, Filter, MoreHorizontal, UserCog } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { DEMO_PLATFORM_USERS } from "@/lib/platformStore";

export default function PlatformUsers() {
  const [search, setSearch] = useState("");

  const users = [
    { id: "1", name: "Sarah Jenkins", org: "Eserve Social Care", role: "Manager", email: "sarah@eserve.com", status: "Active", lastLogin: "10 mins ago" },
    { id: "2", name: "Michael Chang", org: "Eserve Social Care", role: "Trainer", email: "michael@eserve.com", status: "Active", lastLogin: "1 hour ago" },
    { id: "3", name: "Emma Watson", org: "Horizon Fostering", role: "Org Admin", email: "emma@horizon.com", status: "Active", lastLogin: "3 hours ago" },
    { id: "4", name: "David Miller", org: "Oakwood Care Homes", role: "Learner", email: "david@oakwood.com", status: "Suspended", lastLogin: "1 month ago" },
    ...DEMO_PLATFORM_USERS.slice(0, 4).map((u, i) => ({
      id: `demo-${i}`,
      name: u.name,
      org: "Eserve Social Care",
      role: "Learner",
      email: u.email,
      status: "Active",
      lastLogin: "2 days ago"
    }))
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1440px] mx-auto">
      <PageHeader 
        title="Platform Users" 
        subtitle="View and manage all user accounts across the entire platform"
      />

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by name, email, or org..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="h-9 px-3 text-sm font-medium bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2">
              <Filter size={14} /> Role Filter
            </button>
            <button className="h-9 px-3 text-sm font-medium bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2">
              <Filter size={14} /> Org Filter
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/50 text-slate-500 font-medium">
              <tr>
                <th className="px-4 py-3 font-medium">User Name</th>
                <th className="px-4 py-3 font-medium">Organisation</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Last Login</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                        {u.name.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <span className="font-semibold text-slate-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{u.org}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      u.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                    } border`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{u.lastLogin}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 rounded transition-colors" title="Edit User">
                        <UserCog size={16} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-900 rounded transition-colors" title="More Actions">
                        <MoreHorizontal size={16} />
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
