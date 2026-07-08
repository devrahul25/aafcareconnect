import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import { BookOpen, AlertTriangle, CheckCircle2, Award, Bell } from "lucide-react";

const NOTIFICATIONS = [
  { id: "1", title: "New Course Assigned", desc: "You have been assigned 'Mental Capacity Act 2005'. Please complete it by 01 Sep 2026.", time: "2 hours ago", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50" },
  { id: "2", title: "Course Due Soon", desc: "Your course 'Safeguarding Children Level 2' is due in 3 days.", time: "1 day ago", icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50" },
  { id: "3", title: "Certificate Available", desc: "Your certificate for 'Information Security Basics' is now available to download.", time: "3 days ago", icon: Award, color: "text-emerald-500", bg: "bg-emerald-50" },
  { id: "4", title: "Quiz Passed", desc: "Congratulations! You passed the 'Health & Safety Basics' final assessment.", time: "1 week ago", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
];

export default function Notifications() {
  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1440px] mx-auto">
      <PageHeader 
        title="Notifications" 
        subtitle="Stay updated on your course assignments, due dates, and achievements"
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
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><Bell size={10}/> {n.time}</p>
              </div>
              <button className="text-slate-400 hover:text-blue-600 text-xs font-semibold px-2 py-1 transition-colors">
                Mark as read
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
