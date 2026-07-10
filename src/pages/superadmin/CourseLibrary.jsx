import React, { useState } from "react";
import { Search, Plus, BookTemplate, Edit3, Copy, Archive, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "@/components/ui/PageHeader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";

export default function CourseTemplates() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['templates'],
    queryFn: () => apiClient.get('/templates').then(res => res.data)
  });

  const duplicateMutation = useMutation({
    mutationFn: (id) => apiClient.post(`/templates/${id}/duplicate`),
    onSuccess: () => {
      toast({ title: "Template Duplicated", description: "A copy of the template has been created." });
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to duplicate template.", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiClient.delete(`/templates/${id}`),
    onSuccess: () => {
      toast({ title: "Template Deleted", description: "The template has been permanently removed." });
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete template.", variant: "destructive" });
    }
  });

  const templates = response?.data || [];
  
  const filteredTemplates = templates.filter(t => 
    (t.title?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (t.category?.toLowerCase() || '').includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1440px] mx-auto">
      <PageHeader 
        title="Course Templates" 
        subtitle="Manage global course templates available to all organisations"
        actions={
          <Link to="/superadmin/course-builder/new" className="h-9 px-4 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-2 transition-colors shadow-sm">
            <Plus size={16} /> Create Template
          </Link>
        }
      />

      <div className="card p-0 overflow-hidden shadow-sm border border-slate-200/60">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search templates..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
            <p className="text-sm font-medium">Loading templates...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center p-12 text-red-500 bg-red-50/50">
            <p className="text-sm font-medium">Failed to load templates. Please try again.</p>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-slate-400 bg-slate-50/30">
            <BookTemplate className="w-12 h-12 mb-4 text-slate-300" />
            <p className="text-base font-medium text-slate-600 mb-1">No templates found</p>
            <p className="text-sm text-slate-500 mb-6">Get started by creating your first global course template.</p>
            <Link to="/superadmin/course-builder/new" className="h-9 px-4 text-sm font-semibold bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-2 transition-colors">
              <Plus size={16} /> Create Template
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-5 py-4">Template Title</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Version</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Last Updated</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredTemplates.map((t) => (
                  <tr key={t.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold flex-shrink-0 group-hover:bg-indigo-100 transition-colors">
                          <BookTemplate size={16} />
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900 block">{t.title}</span>
                          {t.description && (
                            <span className="text-xs text-slate-500 block truncate max-w-xs mt-0.5">{t.description}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600 font-medium">{t.category}</td>
                    <td className="px-5 py-4 text-slate-500">v{t.version || '1.0'}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        t.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        t.status === 'DRAFT' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      } border`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-sm font-medium">
                      {format(new Date(t.updated_at), "dd MMM yyyy")}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to={`/superadmin/course-builder/${t.id}`} className="text-slate-400 hover:text-blue-600 p-1.5 hover:bg-blue-50 rounded transition-colors" title="Edit Builder">
                          <Edit3 size={16} />
                        </Link>
                        <button 
                          className="text-slate-400 hover:text-indigo-600 p-1.5 hover:bg-indigo-50 rounded transition-colors disabled:opacity-50" 
                          title="Duplicate"
                          disabled={duplicateMutation.isPending}
                          onClick={() => duplicateMutation.mutate(t.id)}
                        >
                          <Copy size={16} />
                        </button>
                        <button 
                          className="text-slate-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded transition-colors disabled:opacity-50" 
                          title="Archive"
                          disabled={deleteMutation.isPending}
                          onClick={() => {
                            if (window.confirm("Are you sure you want to permanently delete this template?")) {
                              deleteMutation.mutate(t.id);
                            }
                          }}
                        >
                          <Archive size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
