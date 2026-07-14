import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { apiClient } from '@/api/apiClient';
import { toast } from '@/components/ui/use-toast';

export default function EditUserModal({ user, onClose, onSuccess }) {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(user?.user_roles?.[0]?.role?.name || '');
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await apiClient.get('/roles');
        setRoles(res.data.data || []);
        // Set initial selected role ID
        if (user?.user_roles?.[0]?.role_id) {
          setSelectedRole(user.user_roles[0].role_id);
        }
      } catch (err) {
        toast({ title: 'Error', description: 'Failed to fetch roles', variant: 'destructive' });
      } finally {
        setLoadingRoles(false);
      }
    };
    fetchRoles();
  }, [user]);

  const handleSave = async () => {
    if (!selectedRole) return;
    setSaving(true);
    try {
      await apiClient.patch(`/users/${user.id}/role`, {
        role_id: selectedRole
      });
      toast({ title: 'Success', description: 'User role updated successfully' });
      onSuccess(); // Refresh list and close
    } catch (err) {
      toast({ title: 'Error', description: err.response?.data?.error || 'Failed to update role', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900">Edit User Role</h3>
            <p className="text-xs text-slate-500 mt-1">Change role for {user.full_name || user.email}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Role</label>
            {loadingRoles ? (
              <div className="h-10 border border-slate-200 rounded-lg flex items-center px-3 bg-slate-50">
                <Loader2 size={16} className="animate-spin text-slate-400" />
                <span className="ml-2 text-sm text-slate-500">Loading roles...</span>
              </div>
            ) : (
              <select
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              >
                <option value="">Select a role</option>
                {roles.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            )}
            <p className="text-xs text-slate-500">Select the role to assign to this user. This determines their permissions on the platform.</p>
          </div>
        </div>

        <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={saving || !selectedRole || loadingRoles}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center disabled:opacity-50"
          >
            {saving ? <><Loader2 size={16} className="animate-spin mr-2" /> Saving...</> : <><Save size={16} className="mr-2" /> Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
}
