import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import { Plus, Bell, Eye } from "lucide-react";

const ASSIGNMENTS_DATA = [
  { id: "1", course: "Safeguarding Children Level 2", learners: 4, dueDate: "15 Aug 2026", completion: 50, status: "Active" },
  { id: "2", course: "First Aid in Social Care", learners: 2, dueDate: "30 Jul 2026", completion: 100, status: "Completed" },
  { id: "3", course: "Attachment Theory", learners: 3, dueDate: "01 Jul 2026", completion: 66, status: "Overdue" },
  { id: "4", course: "Health & Safety Basics", learners: 5, dueDate: "20 Sep 2026", completion: 20, status: "Active" },
];

export default function CourseAssignments() {
  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1440px] mx-auto">
      <PageHeader 
        title="Course Assignments" 
        subtitle="Manage and track training assigned to your team"
        actions={
          <button className="h-9 px-4 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-2 transition-colors">
            <Plus size={16} /> New Assignment
          </button>
        }
      />

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/50 text-slate-500 font-medium">
              <tr>
                <th className="px-4 py-3 font-medium">Course Name</th>
                <th className="px-4 py-3 font-medium text-center">Assigned Learners</th>
                <th className="px-4 py-3 font-medium">Due Date</th>
                <th className="px-4 py-3 font-medium">Completion</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ASSIGNMENTS_DATA.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-900">{a.course}</td>
                  <td className="px-4 py-3 text-center text-slate-700">{a.learners}</td>
                  <td className="px-4 py-3 text-slate-600">{a.dueDate}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${a.completion === 100 ? 'bg-emerald-500' : a.status === 'Overdue' ? 'bg-red-500' : 'bg-blue-500'}`} 
                          style={{ width: `${a.completion}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">{a.completion}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                      a.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      a.status === 'Overdue' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-blue-50 text-blue-700 border-blue-200'
                    } border`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {a.status !== 'Completed' && (
                        <button className="text-slate-400 hover:text-amber-500 p-1.5 rounded transition-colors" title="Send Reminder">
                          <Bell size={16} />
                        </button>
                      )}
                      <button className="text-slate-400 hover:text-blue-600 p-1.5 rounded transition-colors" title="View Details">
                        <Eye size={16} />
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
