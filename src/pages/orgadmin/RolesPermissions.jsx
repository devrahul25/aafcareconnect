import React, { useState, useEffect } from 'react';
import { Shield, Plus, Copy, Trash2, Edit3, ShieldAlert, Loader2 } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { apiClient } from '@/api/apiClient';
import toast from 'react-hot-toast';
import RoleEditorModal from '@/components/admin/RoleEditorModal';

export default function RolesPermissions({ embedded = false }) {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/roles');
      setRoles(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleEdit = async (id) => {
    try {
      const res = await apiClient.get(`/roles/${id}`);
      setEditingRole(res.data.data);
      setEditorOpen(true);
    } catch (err) {
      toast.error('Failed to load role details');
    }
  };

  const handleDuplicate = async (id, name) => {
    try {
      await apiClient.post(`/roles/${id}/duplicate`, { name: `${name} Copy` });
      toast.success('Role duplicated');
      fetchRoles();
    } catch (err) {
      toast.error('Failed to duplicate role');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this custom role? Users assigned to this role will lose their permissions.')) return;
    try {
      await apiClient.delete(`/roles/${id}`);
      toast.success('Role deleted');
      fetchRoles();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete role');
    }
  };

  const openCreateModal = () => {
    setEditingRole(null);
    setEditorOpen(true);
  };

  return (
    <div className={embedded ? "space-y-6 animate-fade-in" : "p-6 space-y-6 animate-fade-in max-w-[1440px] mx-auto"}>
      {!embedded && (
        <PageHeader 
          title="Roles & Permissions" 
          subtitle="Manage access control and customize permissions for your organization"
          actions={
            <button onClick={openCreateModal} className="h-9 px-4 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-2 transition-colors">
              <Plus size={16} /> Create Custom Role
            </button>
          }
        />
      )}

      {embedded && (
        <div className="flex justify-end mb-4">
          <button onClick={openCreateModal} className="h-9 px-4 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-2 transition-colors">
            <Plus size={16} /> Create Custom Role
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 flex items-center justify-center text-slate-500">
            <Loader2 className="animate-spin mr-2" size={24} /> Loading roles...
          </div>
        ) : roles.map(role => (
          <div key={role.id} className="card p-0 overflow-hidden flex flex-col hover:border-blue-200 transition-colors">
            <div className={`p-5 border-b border-slate-100 flex items-start justify-between ${role.is_system ? 'bg-slate-50/50' : 'bg-white'}`}>
              <div className="flex gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${role.is_system ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'}`}>
                  {role.is_system ? <ShieldAlert size={20} /> : <Shield size={20} />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    {role.name}
                    {role.is_system && <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded uppercase">Built-in</span>}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-0.5 min-h-[32px]">
                    {role.description || 'Custom role configuration'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-5 flex-1 grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <span className="block text-xl font-heading font-bold text-slate-700">{role.user_count || 0}</span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Assigned Users</span>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <span className="block text-xl font-heading font-bold text-slate-700">{role.permission_count || 0}</span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Permissions</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-medium">
                Updated {new Date(role.updated_at).toLocaleDateString()}
              </span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => handleEdit(role.id)} 
                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" 
                  title="Edit Role"
                >
                  <Edit3 size={16} />
                </button>
                <button 
                  onClick={() => handleDuplicate(role.id, role.name)} 
                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" 
                  title="Duplicate Role"
                >
                  <Copy size={16} />
                </button>
                {!role.is_system && (
                  <button 
                    onClick={() => handleDelete(role.id)} 
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" 
                    title="Delete Role"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {editorOpen && (
        <RoleEditorModal 
          role={editingRole} 
          onClose={() => setEditorOpen(false)} 
          onSave={() => {
            setEditorOpen(false);
            fetchRoles();
          }} 
        />
      )}
    </div>
  );
}
