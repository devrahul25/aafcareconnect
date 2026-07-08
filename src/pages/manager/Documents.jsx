import React, { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { Search, Download, FileText, Upload } from "lucide-react";

const DOCUMENTS_DATA = [
  { id: "1", title: "Assessment Form Q2", learner: "Sarah Jenkins", category: "Assessment", uploadDate: "01 Jul 2026", uploader: "Manager" },
  { id: "2", title: "Supervision Notes", learner: "David Miller", category: "Review Notes", uploadDate: "15 Jun 2026", uploader: "Manager" },
  { id: "3", title: "External Training Evidence", learner: "Emma Watson", category: "Training Evidence", uploadDate: "10 Jun 2026", uploader: "Learner" },
];

export default function Documents() {
  const [search, setSearch] = useState("");

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1440px] mx-auto">
      <PageHeader 
        title="Supporting Documents" 
        subtitle="Manage and upload external evidence and review notes for your team"
        actions={
          <button className="h-9 px-4 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-2 transition-colors">
            <Upload size={16} /> Upload Document
          </button>
        }
      />

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search documents..."
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
                <th className="px-4 py-3 font-medium">Document Title</th>
                <th className="px-4 py-3 font-medium">Learner</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Upload Date</th>
                <th className="px-4 py-3 font-medium">Uploaded By</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {DOCUMENTS_DATA.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900 flex items-center gap-2">
                    <FileText size={16} className="text-slate-400" />
                    {d.title}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{d.learner}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                      {d.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{d.uploadDate}</td>
                  <td className="px-4 py-3 text-slate-600">{d.uploader}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-slate-400 hover:text-blue-600 p-1.5 rounded transition-colors" title="Download">
                      <Download size={16} />
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
