import React, { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { Award, Download, Search, FileText } from "lucide-react";

const CERTIFICATES = [
  { id: "CERT-2026-0891", course: "Information Security Basics", issueDate: "12 May 2026", expiryDate: "12 May 2027", status: "Valid" },
  { id: "CERT-2026-0422", course: "Health & Safety Basics", issueDate: "01 Mar 2026", expiryDate: "01 Mar 2029", status: "Valid" },
  { id: "CERT-2025-1104", course: "Fire Safety Awareness", issueDate: "15 Jan 2025", expiryDate: "15 Jan 2026", status: "Expired" },
];

export default function Certificates() {
  const [search, setSearch] = useState("");

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1440px] mx-auto">
      <PageHeader 
        title="My Certificates" 
        subtitle="View and download your earned course certificates"
      />

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search certificates..."
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
                <th className="px-4 py-3 font-medium">Course Name</th>
                <th className="px-4 py-3 font-medium">Certificate Number</th>
                <th className="px-4 py-3 font-medium">Issue Date</th>
                <th className="px-4 py-3 font-medium">Expiry Date</th>
                <th className="px-4 py-3 font-medium text-center">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {CERTIFICATES.filter(c => c.course.toLowerCase().includes(search.toLowerCase())).map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${c.status === 'Valid' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        <Award size={20} />
                      </div>
                      <span className="font-bold text-slate-900">{c.course}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-mono text-xs text-slate-500">{c.id}</td>
                  <td className="px-4 py-4 text-slate-700">{c.issueDate}</td>
                  <td className="px-4 py-4 text-slate-700">{c.expiryDate}</td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${
                      c.status === 'Valid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5">
                        <FileText size={14} /> View
                      </button>
                      <button className="px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors inline-flex items-center gap-1.5">
                        <Download size={14} /> PDF
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
