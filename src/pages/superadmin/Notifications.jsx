import React, { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { Bell, Plus, Trash2, Search } from "lucide-react";

const MOCK_ANNOUNCEMENTS = [
  { id: "1", message: "Scheduled maintenance on July 15th at 02:00 AM UTC.", audience: "Platform Wide", date: "08 Jul 2026", status: "Sent" },
  { id: "2", message: "New Safeguarding Level 3 course template is now available.", audience: "All Organisations", date: "05 Jul 2026", status: "Sent" },
  { id: "3", message: "Reminder: Complete mandatory compliance updates by end of Q3.", audience: "Specific Roles (Learners)", date: "01 Jul 2026", status: "Sent" },
  { id: "4", message: "Welcome to Horizon Fostering - Onboarding steps.", audience: "Specific Organisation (Horizon Fostering)", date: "28 Jun 2026", status: "Sent" },
];

export default function Notifications() {
  const [search, setSearch] = useState("");

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1440px] mx-auto">
      <PageHeader 
        title="Notifications Center" 
        subtitle="Manage and send announcements to platform users"
        actions={
          <button className="h-9 px-4 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-2 transition-colors">
            <Plus size={16} /> Create New Notification
          </button>
        }
      />

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search announcements..."
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
                <th className="px-4 py-3 font-medium w-1/2">Message</th>
                <th className="px-4 py-3 font-medium">Audience</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_ANNOUNCEMENTS.map((announcement) => (
                <tr key={announcement.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                        <Bell size={14} />
                      </div>
                      <span className="font-medium text-slate-900 leading-snug">{announcement.message}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {announcement.audience}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{announcement.date}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-slate-400 hover:text-red-600 p-1.5 rounded transition-colors" title="Delete Notification">
                      <Trash2 size={16} />
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
