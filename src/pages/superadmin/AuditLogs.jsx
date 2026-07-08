import React, { useState } from "react";
import { Search, History, Filter } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

const MOCK_AUDIT = [
  { id: "1", date: "07 Jul 2026, 14:32", user: "Admin", org: "Platform", action: "Organisation Suspended", entity: "Organisation", ip: "192.168.1.105", status: "Success" },
  { id: "2", date: "07 Jul 2026, 11:15", user: "Admin", org: "Platform", action: "Course Template Published", entity: "Course", ip: "192.168.1.105", status: "Success" },
  { id: "3", date: "06 Jul 2026, 09:45", user: "System", org: "Horizon Fostering", action: "Subscription Renewed", entity: "Organisation", ip: "10.0.0.5", status: "Success" },
  { id: "4", date: "06 Jul 2026, 08:30", user: "Admin", org: "Platform", action: "Platform Settings Updated", entity: "System", ip: "192.168.1.105", status: "Success" },
  { id: "5", date: "05 Jul 2026, 16:20", user: "System", org: "Oakwood Care Homes", action: "Payment Failed", entity: "Organisation", ip: "10.0.0.5", status: "Failed" },
];

export default function AuditLogs() {
  const [search, setSearch] = useState("");

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1440px] mx-auto">
      <PageHeader 
        title="Audit Logs" 
        subtitle="System activity and platform-wide events"
      />

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search logs..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="h-9 px-3 text-sm font-medium bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors">
              <Filter size={14} /> Date Range
            </button>
            <button className="h-9 px-3 text-sm font-medium bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors">
              <Filter size={14} /> Action Type
            </button>
            <button className="h-9 px-3 text-sm font-medium bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors">
              <Filter size={14} /> Organisation
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/50 text-slate-500 font-medium">
              <tr>
                <th className="px-4 py-3 font-medium">Date & Time</th>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Organisation</th>
                <th className="px-4 py-3 font-medium">Action</th>
                <th className="px-4 py-3 font-medium">Entity</th>
                <th className="px-4 py-3 font-medium">IP Address</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_AUDIT.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 text-slate-500 text-xs">{log.date}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{log.user}</td>
                  <td className="px-4 py-3 text-slate-600">{log.org}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <History size={14} className="text-slate-400" />
                      <span className="text-slate-700">{log.action}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{log.entity}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs font-mono">{log.ip}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.status === 'Success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                    } border`}>
                      {log.status}
                    </span>
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
