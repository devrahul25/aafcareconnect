import React, { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { Search, Download, Eye, ShieldCheck } from "lucide-react";

const CERTIFICATES_DATA = [
  { id: "1", learner: "Sarah Jenkins", course: "Safeguarding Children Level 2", issued: "10 Jun 2026", expiry: "10 Jun 2027", status: "Valid" },
  { id: "2", learner: "Michael Chang", course: "Health & Safety Basics", issued: "05 May 2026", expiry: "05 May 2027", status: "Valid" },
  { id: "3", learner: "Emma Watson", course: "First Aid in Social Care", issued: "15 Jul 2025", expiry: "15 Jul 2026", status: "Expiring Soon" },
  { id: "4", learner: "David Miller", course: "Attachment Theory", issued: "01 Jan 2025", expiry: "01 Jan 2026", status: "Expired" },
];

export default function Certificates() {
  const [search, setSearch] = useState("");

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1440px] mx-auto">
      <PageHeader 
        title="Team Certificates" 
        subtitle="Review and manage certificates earned by your assigned learners"
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
                <th className="px-4 py-3 font-medium">Learner</th>
                <th className="px-4 py-3 font-medium">Course</th>
                <th className="px-4 py-3 font-medium">Issue Date</th>
                <th className="px-4 py-3 font-medium">Expiry Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {CERTIFICATES_DATA.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900">{c.learner}</td>
                  <td className="px-4 py-3 text-slate-700">{c.course}</td>
                  <td className="px-4 py-3 text-slate-600">{c.issued}</td>
                  <td className="px-4 py-3 text-slate-600">{c.expiry}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                      c.status === 'Valid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      c.status === 'Expired' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-amber-50 text-amber-700 border-amber-200'
                    } border`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="text-slate-400 hover:text-blue-600 p-1.5 rounded transition-colors" title="Verify">
                        <ShieldCheck size={16} />
                      </button>
                      <button className="text-slate-400 hover:text-blue-600 p-1.5 rounded transition-colors" title="View Certificate">
                        <Eye size={16} />
                      </button>
                      <button className="text-slate-400 hover:text-blue-600 p-1.5 rounded transition-colors" title="Download">
                        <Download size={16} />
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
