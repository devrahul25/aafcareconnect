import React, { useState, useEffect } from 'react';
import { X, Save, ShieldAlert } from 'lucide-react';
import { apiClient } from '@/api/apiClient';
import toast from 'react-hot-toast';

export default function UserPermissionEditorModal({ profile, onClose, onSave }) {
  const [selectedPerms, setSelectedPerms] = useState(new Set(profile?.user_permissions?.map(rp => rp.permission_id) || []));
  const [allPerms, setAllPerms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // We also track base role permissions so we can show them as implicitly granted
  const baseRolePerms = new Set();
  if (profile?.user_roles?.[0]?.role?.permissions) {
    profile.user_roles[0].role.permissions.forEach(rp => baseRolePerms.add(rp.permission_id));
  }

  useEffect(() => {
    const fetchPerms = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/permissions');
        setAllPerms(res.data.data || []);
      } catch (err) {
        toast.error('Failed to load permissions');
      } finally {
        setLoading(false);
      }
    };
    fetchPerms();
  }, []);

  // Group permissions by resource
  const categories = allPerms.reduce((acc, p) => {
    if (!acc[p.resource]) acc[p.resource] = [];
    acc[p.resource].push(p);
    return acc;
  }, {});

  const handleToggle = (perm) => {
    // If the base role already grants this permission, we shouldn't toggle it here.
    // They should edit the role if they want to remove a base permission, OR we don't let them uncheck it.
    if (baseRolePerms.has(perm.id)) {
      toast.error('This permission is granted by their base role and cannot be removed here.');
      return;
    }

    const permId = perm.id;
    const newSelected = new Set(selectedPerms);

    if (newSelected.has(permId)) {
      newSelected.delete(permId);
      
      // Dependency: If a View permission is unchecked, uncheck its dependents
      if (perm.action.startsWith('View')) {
        const resource = perm.resource;
        const dependents = allPerms.filter(p => p.resource === resource && p.id !== permId);
        dependents.forEach(d => {
          if (!baseRolePerms.has(d.id)) newSelected.delete(d.id);
        });
      }
    } else {
      newSelected.add(permId);

      // Dependency: If Edit/Delete/etc is checked, ensure View is checked
      if (!perm.action.startsWith('View')) {
        const viewPerm = allPerms.find(p => p.resource === perm.resource && p.action.startsWith('View'));
        if (viewPerm && !baseRolePerms.has(viewPerm.id)) newSelected.add(viewPerm.id);
      }
    }

    setSelectedPerms(newSelected);
  };

  const handleSave = async () => {
    try {
      setSubmitting(true);
      const payload = {
        permission_ids: Array.from(selectedPerms)
      };

      await apiClient.patch(`/users/${profile.id}/permissions`, payload);
      toast.success('User permissions updated successfully');
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update permissions');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-2xl bg-white shadow-2xl flex flex-col animate-slide-in">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Edit Custom Permissions</h2>
            <p className="text-sm text-slate-500">
              Grant specific extra permissions to {profile.full_name} beyond their base role.
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Permissions Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Custom Permissions</h3>
              <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                {selectedPerms.size} custom selected
              </span>
            </div>

            {loading ? (
              <div className="p-8 text-center text-slate-500 text-sm">Loading permissions...</div>
            ) : (
              <div className="space-y-6">
                {Object.keys(categories).map(category => (
                  <div key={category} className="border border-slate-100 rounded-xl overflow-hidden">
                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
                      <h4 className="font-semibold text-slate-800 text-sm">{category}</h4>
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {categories[category].map(perm => {
                        const isBaseRole = baseRolePerms.has(perm.id);
                        const hasCustomPerm = selectedPerms.has(perm.id);
                        
                        return (
                          <label key={perm.id} className={`flex items-start gap-3 p-3 rounded-xl border ${isBaseRole ? 'border-slate-100 bg-slate-50 opacity-70 cursor-not-allowed' : 'border-slate-200 cursor-pointer hover:bg-slate-50'} transition-colors`}>
                            <input
                              type="checkbox"
                              checked={isBaseRole || hasCustomPerm}
                              onChange={() => handleToggle(perm)}
                              disabled={isBaseRole}
                              className="mt-1 flex-shrink-0"
                            />
                            <div>
                              <p className="text-sm font-medium text-slate-700">{perm.action} {isBaseRole && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded ml-1">By Role</span>}</p>
                              <p className="text-xs text-slate-500">{perm.description}</p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldAlert size={14} />
            <span>Base role permissions cannot be removed here.</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={submitting}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={16} />
              {submitting ? 'Saving...' : 'Save Permissions'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
