import React, { useState } from "react";
import { Search, Loader2, BookOpen } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";
import { format } from "date-fns";

export default function OACourses() {
  const [search, setSearch] = useState("");

  const { data: response, isLoading, isError, error } = useQuery({
    queryKey: ['courses'],
    queryFn: () => apiClient.get('/courses').then(res => res.data)
  });

  const courses = response?.data || [];
  
  const filteredCourses = courses.filter(c => 
    (c.title?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (c.category?.toLowerCase() || '').includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1440px] mx-auto">
      <PageHeader 
        title="Courses" 
        subtitle="View courses assigned to your organisation by the Super Admin"
      />

      <div className="card p-0 overflow-hidden shadow-sm border border-slate-200/60">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search courses by title or category..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Course Details</th>
                <th className="px-6 py-4">Level</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Assigned On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                    <Loader2 className="animate-spin mx-auto mb-3 text-blue-500" size={28} />
                    <p>Loading assigned courses...</p>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-red-500">
                    Failed to load courses. Please try again.
                    {error && <div className="text-xs mt-2 font-mono break-words opacity-75">{error.message || String(error)}</div>}
                  </td>
                </tr>
              ) : filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <BookOpen className="w-12 h-12 text-slate-300 mb-3" />
                      <p className="text-base font-medium text-slate-900">No courses assigned yet</p>
                      <p className="text-sm mt-1">Courses assigned by the Super Admin will appear here.</p>
                    </div>
                  </td>
                </tr>
              ) : filteredCourses.map((course) => (
                <tr key={course.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600">
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block mb-0.5">{course.title}</span>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium text-slate-600 border border-slate-200">
                            {course.category || 'General'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-[11px] font-bold border uppercase tracking-wider
                      ${course.level === 'FOUNDATION' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                        course.level === 'INTERMEDIATE' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                        'bg-red-50 text-red-700 border-red-200'}`}>
                      {course.level}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-[11px] font-bold border uppercase tracking-wider
                      ${course.status === 'PUBLISHED' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                        course.status === 'DRAFT' ? 'bg-slate-50 text-slate-600 border-slate-200' : 
                        'bg-rose-50 text-rose-700 border-rose-200'}`}>
                      {course.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm font-medium">
                    {format(new Date(course.created_at), 'MMM d, yyyy')}
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
