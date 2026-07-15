import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '@/api/apiClient';
import PageHeader from '@/components/ui/PageHeader';
import { Loader2, ArrowLeft, User, Briefcase, Shield, Target, FileText, Settings, BookOpen, Activity, ChevronRight, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import AssignedLearnersTab from './StaffProfileTabs/AssignedLearnersTab';
import AssignedCoursesTab from './StaffProfileTabs/AssignedCoursesTab';
import ActivityLogsTab from './StaffProfileTabs/ActivityLogsTab';
import SettingsTab from './StaffProfileTabs/SettingsTab';

const TABS = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'employment', label: 'Employment', icon: Briefcase },
  { id: 'role', label: 'Role & Permissions', icon: Shield },
  { id: 'responsibilities', label: 'Responsibilities', icon: Target },
  { id: 'learners', label: 'Assigned Learners', icon: User },
  { id: 'courses', label: 'Assigned Courses', icon: BookOpen },
  { id: 'activity', label: 'Activity Logs', icon: Activity },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function StaffProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Responsibilities Editor State
  const [editingScopes, setEditingScopes] = useState(false);
  const [scopeData, setScopeData] = useState({ teams: '', departments: '', learners: '' });
  const [savingScopes, setSavingScopes] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/users/${id}/profile`);
      setProfile(res.data.data);
      if (res.data.data.staff_profile?.responsibility_scope) {
        const scopes = res.data.data.staff_profile.responsibility_scope;
        setScopeData({
          teams: scopes.teams?.join(', ') || '',
          departments: scopes.departments?.join(', ') || '',
          learners: scopes.learners?.join(', ') || ''
        });
      }
    } catch (err) {
      toast.error('Failed to load staff profile');
      navigate('/orgadmin/staff');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveScopes = async () => {
    try {
      setSavingScopes(true);
      const responsibility_scope = {
        teams: scopeData.teams.split(',').map(s => s.trim()).filter(Boolean),
        departments: scopeData.departments.split(',').map(s => s.trim()).filter(Boolean),
        learners: scopeData.learners.split(',').map(s => s.trim()).filter(Boolean),
      };

      await apiClient.put(`/users/${id}/responsibilities`, { responsibility_scope });
      toast.success('Responsibilities updated successfully');
      setEditingScopes(false);
      fetchProfile();
    } catch (err) {
      toast.error('Failed to update responsibilities');
    } finally {
      setSavingScopes(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  const staff = profile.staff_profile || {};
  const role = profile.user_roles?.[0]?.role || {};

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-in fade-in duration-300">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => navigate('/orgadmin/staff')} className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-sm">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{profile.full_name}</h1>
          <p className="text-sm text-slate-500">{staff.job_title || 'Staff Member'} • {staff.department || 'No Department'}</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm sticky top-6">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all mb-1 last:mb-0 ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 font-semibold' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                    <span className="text-sm">{tab.label}</span>
                  </div>
                  {isActive && <ChevronRight size={16} className="text-blue-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Profile Overview</h2>
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 rounded-2xl bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-700">
                    {profile.full_name?.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{profile.full_name}</h3>
                    <p className="text-slate-500 mb-2">{profile.email} {profile.phone && `• ${profile.phone}`}</p>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {profile.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-sm font-semibold text-slate-500 mb-1">Employee ID</div>
                    <div className="font-bold text-slate-900">{staff.employee_id || '-'}</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-sm font-semibold text-slate-500 mb-1">Primary Role</div>
                    <div className="font-bold text-slate-900 uppercase">{role?.name?.replace(/_/g, ' ') || 'None'}</div>
                  </div>
                </div>
              </div>
            )}

            {/* EMPLOYMENT TAB */}
            {activeTab === 'employment' && (
              <div className="p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Employment Details</h2>
                <div className="space-y-6 max-w-lg">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Job Title</label>
                      <div className="text-slate-900 font-medium">{staff.job_title || 'N/A'}</div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Department</label>
                      <div className="text-slate-900 font-medium">{staff.department || 'N/A'}</div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Employment Type</label>
                      <div className="text-slate-900 font-medium">{staff.employment_type || 'N/A'}</div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Start Date</label>
                      <div className="text-slate-900 font-medium">{staff.start_date ? new Date(staff.start_date).toLocaleDateString() : 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ROLE & PERMISSIONS TAB */}
            {activeTab === 'role' && (
              <div className="p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-2">Role & Permissions</h2>
                <p className="text-slate-500 text-sm mb-6">Permissions determine what actions this staff member can perform across the platform.</p>
                
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-8">
                  <div className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-1">Assigned Role</div>
                  <div className="text-2xl font-bold text-blue-700 capitalize">{role?.name?.replace(/_/g, ' ') || 'No Role Assigned'}</div>
                </div>

                <h3 className="font-bold text-slate-900 mb-4">Effective Permissions</h3>
                <div className="grid grid-cols-2 gap-3">
                  {role?.permissions?.map((rp, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl bg-slate-50">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <Check size={16} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 capitalize">{rp.permission.action} {rp.permission.resource}</div>
                        {rp.permission.description && <div className="text-xs text-slate-500">{rp.permission.description}</div>}
                      </div>
                    </div>
                  ))}
                  {!role?.permissions?.length && (
                    <div className="col-span-2 text-center p-8 border border-dashed border-slate-300 rounded-xl text-slate-500">
                      No specific permissions attached to this role.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* RESPONSIBILITIES TAB */}
            {activeTab === 'responsibilities' && (
              <div className="p-8">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold text-slate-900">Responsibility Scope</h2>
                  {!editingScopes ? (
                    <button onClick={() => setEditingScopes(true)} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors">
                      Edit Scope
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => setEditingScopes(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                      <button onClick={handleSaveScopes} disabled={savingScopes} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-500 transition-colors flex items-center gap-2">
                        {savingScopes && <Loader2 size={16} className="animate-spin" />} Save Changes
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-slate-500 text-sm mb-6 max-w-2xl">
                  Responsibilities define the specific boundaries of this staff member's access. If they have permission to "Manage Learners", they will only be able to manage learners within the teams or departments listed below.
                </p>

                <div className="space-y-6 max-w-2xl">
                  {/* Teams */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Assigned Teams</label>
                    {editingScopes ? (
                      <input type="text" value={scopeData.teams} onChange={e => setScopeData({...scopeData, teams: e.target.value})} placeholder="Comma separated teams" className="w-full px-4 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all" />
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {staff.responsibility_scope?.teams?.map(t => (
                          <span key={t} className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium text-slate-700">{t}</span>
                        ))}
                        {!staff.responsibility_scope?.teams?.length && <span className="text-sm text-slate-400 italic">No teams assigned</span>}
                      </div>
                    )}
                  </div>

                  {/* Departments */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Assigned Departments</label>
                    {editingScopes ? (
                      <input type="text" value={scopeData.departments} onChange={e => setScopeData({...scopeData, departments: e.target.value})} placeholder="Comma separated departments" className="w-full px-4 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all" />
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {staff.responsibility_scope?.departments?.map(t => (
                          <span key={t} className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium text-slate-700">{t}</span>
                        ))}
                        {!staff.responsibility_scope?.departments?.length && <span className="text-sm text-slate-400 italic">No departments assigned</span>}
                      </div>
                    )}
                  </div>

                  {/* Individual Learners */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Specific Learner IDs</label>
                    {editingScopes ? (
                      <input type="text" value={scopeData.learners} onChange={e => setScopeData({...scopeData, learners: e.target.value})} placeholder="Comma separated learner IDs" className="w-full px-4 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all" />
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {staff.responsibility_scope?.learners?.map(t => (
                          <span key={t} className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium text-slate-700">{t}</span>
                        ))}
                        {!staff.responsibility_scope?.learners?.length && <span className="text-sm text-slate-400 italic">No specific learners assigned</span>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* NEW TABS */}
            {activeTab === 'learners' && <AssignedLearnersTab staffId={id} />}
            {activeTab === 'courses' && <AssignedCoursesTab staffId={id} />}
            {activeTab === 'activity' && <ActivityLogsTab staffId={id} />}
            {activeTab === 'settings' && <SettingsTab staffId={id} profile={profile} onUpdate={fetchProfile} />}

          </div>
        </div>
      </div>
    </div>
  );
}
