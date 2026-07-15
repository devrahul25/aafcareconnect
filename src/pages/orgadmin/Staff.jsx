import React, { useState, useEffect } from "react";
import { Search, UserPlus, UserCog, Loader2, Settings, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/ui/PageHeader";
import { apiClient } from "@/api/apiClient";
import RolesPermissions from "./RolesPermissions";
import InviteStaffWizard from "@/components/admin/InviteStaffWizard";

export default function Staff({ orgId }) {
  const [search, setSearch] = useState("");
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('staff');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchStaff = async () => {
      try {
        setLoading(true);
        const params = { role: 'org_admin,manager,trainer' };
        if (orgId) {
          params.organization_id = orgId;
        }
        const res = await apiClient.get('/users', { params });
        setStaff(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch staff:", err);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchStaff();
  }, [orgId]);

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1440px] mx-auto">
      <PageHeader 
        title="Staff & Permissions" 
        subtitle="Manage your organisation's administrative and support staff, and customize their roles"
        actions={
          activeTab === 'staff' && (
            <button 
              onClick={() => setIsInviteModalOpen(true)}
              className="h-9 px-4 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-2 transition-colors"
            >
              <UserPlus size={16} /> Invite Staff
            </button>
          )
        }
      />

      <div className="flex items-center gap-6 border-b border-slate-200">
        <button
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'staff' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
          onClick={() => setActiveTab('staff')}
        >
          Staff List
        </button>
        <button
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'roles' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
          onClick={() => setActiveTab('roles')}
        >
          Roles & Permissions
        </button>
      </div>

      {activeTab === 'staff' ? (
        <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search staff..."
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
                <th className="px-4 py-3 font-medium">Job Title</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium text-center">Compliance</th>
                <th className="px-4 py-3 font-medium text-center">Assigned Learners</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-slate-500">
                    <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                    Loading staff...
                  </td>
                </tr>
              ) : staff.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-slate-500">
                    No staff found.
                  </td>
                </tr>
              ) : staff.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                        {s.full_name?.split(' ').map(n=>n[0]).join('') || 'U'}
                      </div>
                      <span className="font-semibold text-slate-900">{s.full_name || 'User'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">N/A</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">
                      {s.user_roles?.[0]?.role?.name?.replace(/_/g, ' ') || s.role_type?.replace(/_/g, ' ') || 'Staff'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{s.email}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-semibold text-slate-400">{s.metrics?.complianceScore || 0}%</span>
                  </td>
                  <td className="px-4 py-3 text-center font-medium text-slate-600">{s._count?.assigned_learners || 0}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                      s.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => navigate(`/orgadmin/staff/${s.id}`)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Manage Staff Profile">
                      <Settings size={16} />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      ) : (
        <RolesPermissions embedded={true} />
      )}

      {isInviteModalOpen && (
        <InviteStaffWizard 
          onClose={() => setIsInviteModalOpen(false)}
          onSuccess={() => fetchStaff()}
        />
      )}
    </div>
  );
}
