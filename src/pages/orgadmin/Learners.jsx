import React, { useState, useEffect } from "react";
import { Search, UserPlus, MoreHorizontal, UserCog, Download, Loader2 } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { apiClient } from "@/api/apiClient";

export default function Learners({ orgId }) {
  const [search, setSearch] = useState("");
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLearners = async () => {
      try {
        setLoading(true);
        const params = { role: 'learner' };
        if (orgId) {
          params.organization_id = orgId;
        }
        const res = await apiClient.get('/users', { params });
        setLearners(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch learners:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLearners();
  }, [orgId]);

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1440px] mx-auto">
      <PageHeader 
        title="Learners" 
        subtitle="Manage learners, assign training, and view compliance"
        actions={
          <div className="flex items-center gap-2">
            <button className="h-9 px-4 text-sm font-semibold bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors">
              <Download size={16} /> Export
            </button>
            <button className="h-9 px-4 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-2 transition-colors">
              <UserPlus size={16} /> Invite Learner
            </button>
          </div>
        }
      />

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search learners by name or email..."
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
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium text-center">Courses (Done/Assigned)</th>
                <th className="px-4 py-3 font-medium">Compliance</th>
                <th className="px-4 py-3 font-medium text-center">Certificates</th>
                <th className="px-4 py-3 font-medium text-center">CPD Hours</th>
                <th className="px-4 py-3 font-medium">Last Active</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-slate-500">
                    <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                    Loading learners...
                  </td>
                </tr>
              ) : learners.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-slate-500">
                    No learners found.
                  </td>
                </tr>
              ) : learners.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                        {l.full_name?.split(' ').map(n=>n[0]).join('') || 'U'}
                      </div>
                      <span className="font-semibold text-slate-900">{l.full_name || 'User'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{l.email}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-medium text-slate-900">0</span>
                    <span className="text-slate-400 mx-1">/</span>
                    <span className="text-slate-500">0</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                      N/A
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-slate-600 font-medium">0</td>
                  <td className="px-4 py-3 text-center text-slate-600 font-medium">0h</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {l.last_login_at ? new Date(l.last_login_at).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-slate-400 hover:text-blue-600 p-1 rounded transition-colors" title="Manage Learner">
                      <UserCog size={16} />
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
