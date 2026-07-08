import React, { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { Clock, History, Download, Filter, FileText } from "lucide-react";

const CPD_HISTORY = [
  { id: 1, title: "Information Security Basics", date: "12 May 2026", hours: 1.5, category: "Compliance", type: "Online Course" },
  { id: 2, title: "Health & Safety Basics", date: "01 Mar 2026", hours: 2.0, category: "Health & Safety", type: "Online Course" },
  { id: 3, title: "First Aid Practical Seminar", date: "15 Jan 2026", hours: 4.0, category: "Practical Training", type: "In-Person Event" },
  { id: 4, title: "Safeguarding Policy Review", date: "10 Nov 2025", hours: 1.0, category: "Safeguarding", type: "Reading Material" },
];

export default function CPDRecord() {
  const [filterYear, setFilterYear] = useState("2026");

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1440px] mx-auto">
      <PageHeader 
        title="CPD Record" 
        subtitle="Track your Continuing Professional Development hours and activities"
        actions={
          <button className="h-9 px-4 text-sm font-semibold bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors">
            <Download size={16} /> Export Record
          </button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 bg-gradient-to-br from-blue-600 to-blue-800 text-white border-0">
          <div className="flex items-center gap-2 mb-4 text-blue-100">
            <Clock size={20} />
            <h3 className="font-semibold text-sm">Total CPD Hours (YTD)</h3>
          </div>
          <div className="text-4xl font-heading font-bold">34.5<span className="text-xl font-medium text-blue-200 ml-1">hrs</span></div>
          <div className="mt-4 pt-4 border-t border-blue-500/30 flex justify-between text-sm">
            <span className="text-blue-200">Target: 40 hrs</span>
            <span className="font-bold text-white">86% Complete</span>
          </div>
        </div>
        
        <div className="card p-6 md:col-span-2">
          <h3 className="font-semibold text-slate-900 mb-4 text-sm">Hours by Category</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-600">Health & Safety</span>
                <span className="text-slate-900">12 hrs</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '35%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-600">Safeguarding</span>
                <span className="text-slate-900">10 hrs</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '28%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-600">Compliance & Legal</span>
                <span className="text-slate-900">8 hrs</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '24%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <History size={18} className="text-blue-600" /> Learning History
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Filter size={16} /> Filter by Year:
            </div>
            <select 
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="h-8 px-2 text-sm bg-slate-50 border border-slate-200 rounded outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="All">All Time</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/50 text-slate-500 font-medium">
              <tr>
                <th className="px-4 py-3 font-medium">Activity Title</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium text-center">Date Completed</th>
                <th className="px-4 py-3 font-medium text-center">CPD Hours</th>
                <th className="px-4 py-3 font-medium text-right">Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {CPD_HISTORY.filter(h => filterYear === 'All' || h.date.includes(filterYear)).map((h) => (
                <tr key={h.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-4 font-semibold text-slate-900">{h.title}</td>
                  <td className="px-4 py-4 text-slate-600">{h.type}</td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                      {h.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center text-slate-700">{h.date}</td>
                  <td className="px-4 py-4 text-center font-bold text-blue-600">+{h.hours.toFixed(1)}</td>
                  <td className="px-4 py-4 text-right">
                    <button className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-50 transition-colors inline-flex items-center gap-1">
                      <FileText size={12} /> View
                    </button>
                  </td>
                </tr>
              ))}
              {CPD_HISTORY.filter(h => filterYear === 'All' || h.date.includes(filterYear)).length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No records found for the selected year.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
