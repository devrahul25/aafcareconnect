import React, { useState } from "react";
import { Search, Plus, BookTemplate, MoreHorizontal, Edit3, Copy, Archive } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "@/components/ui/PageHeader";

const MOCK_TEMPLATES = [
  { id: "1", title: "Safeguarding Children Level 2", category: "Safeguarding", version: "v2.1", status: "Published", updated: "12 Oct 2026", orgs: 142 },
  { id: "2", title: "First Aid at Work", category: "Health & Safety", version: "v1.4", status: "Published", updated: "05 Nov 2026", orgs: 89 },
  { id: "3", title: "Mental Capacity Act 2005", category: "Legislation", version: "v3.0", status: "Draft", updated: "2 days ago", orgs: 0 },
  { id: "4", title: "Fire Safety Awareness", category: "Health & Safety", version: "v1.1", status: "Archived", updated: "1 year ago", orgs: 12 },
];

export default function CourseTemplates() {
  const [search, setSearch] = useState("");

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1440px] mx-auto">
      <PageHeader 
        title="Course Templates" 
        subtitle="Manage global course templates available to all organisations"
        actions={
          <Link to="/course-builder" className="h-9 px-4 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-2 transition-colors">
            <Plus size={16} /> Create Template
          </Link>
        }
      />

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search templates..."
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
                <th className="px-4 py-3 font-medium">Template Title</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Version</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Last Updated</th>
                <th className="px-4 py-3 font-medium text-right">Orgs Using</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_TEMPLATES.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        <BookTemplate size={14} />
                      </div>
                      <span className="font-semibold text-slate-900">{t.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{t.category}</td>
                  <td className="px-4 py-3 text-slate-500">{t.version}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      t.status === 'Published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      t.status === 'Draft' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                      'bg-amber-50 text-amber-700 border-amber-200'
                    } border`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{t.updated}</td>
                  <td className="px-4 py-3 text-slate-900 text-right font-semibold">{t.orgs}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="text-slate-400 hover:text-blue-600 p-1.5 rounded transition-colors" title="Edit">
                        <Edit3 size={14} />
                      </button>
                      <button className="text-slate-400 hover:text-blue-600 p-1.5 rounded transition-colors" title="Duplicate">
                        <Copy size={14} />
                      </button>
                      <button className="text-slate-400 hover:text-red-600 p-1.5 rounded transition-colors" title="Archive">
                        <Archive size={14} />
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
