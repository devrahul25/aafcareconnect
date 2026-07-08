import React, { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { Plus, Search, FileText, Download, Trash2, Edit3, Image as ImageIcon, Film } from "lucide-react";

const MOCK_RESOURCES = [
  { id: "1", title: "Safeguarding Policy Template 2026", type: "PDF", size: "2.4 MB", date: "10 Jun 2026", icon: FileText, color: "text-amber-500", bg: "bg-amber-50" },
  { id: "2", title: "Incident Reporting Form", type: "Word", size: "1.1 MB", date: "05 Jun 2026", icon: FileText, color: "text-blue-500", bg: "bg-blue-50" },
  { id: "3", title: "Handwashing Guidelines Poster", type: "Image", size: "4.2 MB", date: "01 Jun 2026", icon: ImageIcon, color: "text-emerald-500", bg: "bg-emerald-50" },
  { id: "4", title: "First Aid Demonstration", type: "Video", size: "124 MB", date: "28 May 2026", icon: Film, color: "text-violet-500", bg: "bg-violet-50" },
];

export default function Resources() {
  const [search, setSearch] = useState("");

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1440px] mx-auto">
      <PageHeader 
        title="Course Resources" 
        subtitle="Manage downloadable files, templates, and supplementary materials"
        actions={
          <button className="h-9 px-4 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-2 transition-colors">
            <Plus size={16} /> Upload Resource
          </button>
        }
      />

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search resources..."
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
                <th className="px-4 py-3 font-medium">Resource Name</th>
                <th className="px-4 py-3 font-medium">File Type</th>
                <th className="px-4 py-3 font-medium">File Size</th>
                <th className="px-4 py-3 font-medium">Upload Date</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_RESOURCES.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${r.bg} ${r.color}`}>
                        <r.icon size={20} />
                      </div>
                      <span className="font-semibold text-slate-900">{r.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                      {r.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{r.size}</td>
                  <td className="px-4 py-3 text-slate-600">{r.date}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="text-slate-400 hover:text-blue-600 p-1.5 rounded transition-colors" title="Download">
                        <Download size={16} />
                      </button>
                      <button className="text-slate-400 hover:text-blue-600 p-1.5 rounded transition-colors" title="Edit Metadata">
                        <Edit3 size={16} />
                      </button>
                      <button className="text-slate-400 hover:text-red-500 p-1.5 rounded transition-colors" title="Delete">
                        <Trash2 size={16} />
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
