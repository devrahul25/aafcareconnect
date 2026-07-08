import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import { Bell, AlertTriangle, CheckCircle2, Settings } from "lucide-react";

const NOTIFICATIONS = [
  { id: "1", type: "alert", title: "Compliance Alert", desc: "David Miller has overdue mandatory training.", time: "1 hour ago", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50" },
  { id: "2", type: "success", title: "Course Completed", desc: "Sarah Jenkins completed First Aid in Social Care.", time: "3 hours ago", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
  { id: "3", type: "warning", title: "Certificate Expiring", desc: "Emma Watson's Safeguarding certificate expires in 5 days.", time: "1 day ago", icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50" },
  { id: "4", type: "info", title: "New Learner Assigned", desc: "Michael Chang has been added to your team.", time: "2 days ago", icon: Bell, color: "text-blue-500", bg: "bg-blue-50" },
];

export default function Notifications() {
  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1440px] mx-auto">
      <PageHeader 
        title="Team Notifications" 
        subtitle="Alerts and updates regarding your assigned learners"
        actions={
          <button className="h-9 px-4 text-sm font-semibold bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors">
            <Settings size={16} /> Notification Settings
          </button>
        }
      />

      <div className="card p-0 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {NOTIFICATIONS.map((n) => (
            <div key={n.id} className="p-4 hover:bg-slate-50/50 transition-colors flex items-start gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${n.bg} ${n.color}`}>
                <n.icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-900">{n.title}</h4>
                <p className="text-sm text-slate-600 mt-0.5">{n.desc}</p>
                <p className="text-xs text-slate-400 mt-1">{n.time}</p>
              </div>
              <button className="text-slate-400 hover:text-slate-600 text-xs font-medium px-2 py-1">
                Mark as read
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
