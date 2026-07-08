import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import { HelpCircle, Play, RotateCcw, AlertTriangle, CheckCircle2 } from "lucide-react";

const ASSESSMENTS = [
  { id: "1", course: "Safeguarding Children Level 2", questions: 20, passScore: 80, attemptsRemaining: 2, status: "Pending", type: "Final Quiz", time: "30 mins", color: "text-amber-500", bg: "bg-amber-50" },
  { id: "2", course: "First Aid in Social Care", questions: 10, passScore: 100, attemptsRemaining: "Unlimited", status: "In Progress", type: "Module Quiz", time: "No Limit", color: "text-blue-500", bg: "bg-blue-50" },
  { id: "3", course: "Information Security Basics", questions: 15, passScore: 75, attemptsRemaining: 0, status: "Passed", type: "Final Quiz", time: "20 mins", color: "text-emerald-500", bg: "bg-emerald-50" },
  { id: "4", course: "Attachment Theory", questions: 5, passScore: 100, attemptsRemaining: 1, status: "Failed", type: "Module Quiz", time: "10 mins", color: "text-red-500", bg: "bg-red-50" },
];

export default function Assessments() {
  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1440px] mx-auto">
      <PageHeader 
        title="My Assessments" 
        subtitle="Complete your pending quizzes to earn your certificates"
      />

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-100">
              <tr>
                <th className="px-4 py-3 font-medium">Course & Quiz Type</th>
                <th className="px-4 py-3 font-medium text-center">Questions</th>
                <th className="px-4 py-3 font-medium text-center">Pass Mark</th>
                <th className="px-4 py-3 font-medium text-center">Attempts Left</th>
                <th className="px-4 py-3 font-medium text-center">Status</th>
                <th className="px-4 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ASSESSMENTS.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${a.bg} ${a.color}`}>
                        <HelpCircle size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{a.course}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{a.type} • {a.time}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center font-medium text-slate-700">{a.questions}</td>
                  <td className="px-4 py-4 text-center font-bold text-slate-700">{a.passScore}%</td>
                  <td className="px-4 py-4 text-center text-slate-600 font-medium">
                    {a.attemptsRemaining === 0 ? <span className="text-red-500">0</span> : a.attemptsRemaining}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border ${
                      a.status === 'Passed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      a.status === 'Failed' ? 'bg-red-50 text-red-700 border-red-200' :
                      a.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {a.status === 'Passed' && <CheckCircle2 size={12} />}
                      {a.status === 'Failed' && <AlertTriangle size={12} />}
                      {a.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    {a.status === 'Passed' ? (
                      <button className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5">
                        Review Results
                      </button>
                    ) : a.status === 'Failed' && a.attemptsRemaining === 0 ? (
                      <button className="px-3 py-1.5 text-xs font-semibold bg-slate-100 border border-slate-200 rounded-lg text-slate-400 cursor-not-allowed inline-flex items-center gap-1.5">
                        Locked
                      </button>
                    ) : (
                      <button className="px-3 py-1.5 text-xs font-semibold bg-blue-600 border border-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors inline-flex items-center gap-1.5 shadow-sm">
                        {a.status === 'In Progress' ? <><RotateCcw size={14}/> Resume</> : <><Play size={14}/> Start</>}
                      </button>
                    )}
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
