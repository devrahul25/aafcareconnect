import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import { Bell, CheckCircle2, AlertTriangle, UserPlus, FileText } from "lucide-react";

const NOTIFICATIONS = [
  { id: "1", type: "course_completed", title: "Course Completed", desc: "Sarah Jenkins has completed 'Safeguarding Children Level 2'.", time: "10 mins ago", unread: true, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
  { id: "2", type: "compliance_alert", title: "Compliance Warning", desc: "David Miller's First Aid certificate expires in 14 days.", time: "1 hour ago", unread: true, icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
  { id: "3", type: "new_learner", title: "New Learner Joined", desc: "Emma Watson has registered using the self-signup link.", time: "3 hours ago", unread: false, icon: UserPlus, color: "text-blue-600", bg: "bg-blue-50" },
  { id: "4", type: "org_announcement", title: "Platform Maintenance", desc: "AAF CareConnect will be undergoing scheduled maintenance on Sunday.", time: "1 day ago", unread: false, icon: Bell, color: "text-slate-600", bg: "bg-slate-100" },
];

export default function Notifications() {
  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[800px] mx-auto">
      <PageHeader 
        title="Notifications" 
        subtitle="Organisation alerts, learner activity, and announcements"
        actions={
          <button className="h-9 px-4 text-sm font-semibold bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            Mark all as read
          </button>
        }
      />

      <div className="card p-0 overflow-hidden divide-y divide-slate-100">
        {NOTIFICATIONS.map(n => (
          <div key={n.id} className={`p-4 flex gap-4 transition-colors hover:bg-slate-50/50 ${n.unread ? 'bg-blue-50/30' : ''}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${n.bg} ${n.color}`}>
              <n.icon size={18} />
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex justify-between items-start mb-1">
                <p className={`text-sm font-semibold truncate ${n.unread ? 'text-slate-900' : 'text-slate-700'}`}>
                  {n.title}
                </p>
                <span className="text-xs text-slate-400 whitespace-nowrap ml-2">{n.time}</span>
              </div>
              <p className="text-sm text-slate-500">{n.desc}</p>
            </div>
            {n.unread && (
              <div className="flex items-center justify-center w-3 flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
