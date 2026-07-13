import React, { useState, useEffect } from 'react';
import { X, Save, AlertTriangle } from 'lucide-react';
import { apiClient } from '@/api/apiClient';
import toast from 'react-hot-toast';

export default function RoleEditorModal({ role, onClose, onSave }) {
  const [name, setName] = useState(role ? role.name : '');
  const [description, setDescription] = useState(role?.description || '');
  const [selectedPerms, setSelectedPerms] = useState(new Set(role?.permissions?.map(rp => rp.permission_id) || []));
  const [allPerms, setAllPerms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isSystem = role?.is_system;

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
    const permId = perm.id;
    const newSelected = new Set(selectedPerms);

    if (newSelected.has(permId)) {
      newSelected.delete(permId);
      
      // Dependency: If a View permission is unchecked, uncheck its dependents
      if (perm.action.startsWith('View')) {
        const resource = perm.resource;
        const dependents = allPerms.filter(p => p.resource === resource && p.id !== permId);
        dependents.forEach(d => newSelected.delete(d.id));
      }
    } else {
      newSelected.add(permId);

      // Dependency: If Edit/Delete/etc is checked, ensure View is checked
      if (!perm.action.startsWith('View')) {
        const viewPerm = allPerms.find(p => p.resource === perm.resource && p.action.startsWith('View'));
        if (viewPerm) newSelected.add(viewPerm.id);
      }
    }

    setSelectedPerms(newSelected);
  };

  const handleSave = async () => {
    if (!name.trim()) return toast.error('Role name is required');
    
    try {
      setSubmitting(true);
      const payload = {
        name,
        description,
        permission_ids: Array.from(selectedPerms)
      };

      if (role?.id) {
        await apiClient.put(`/roles/${role.id}`, payload);
        toast.success('Role updated successfully');
      } else {
        await apiClient.post('/roles', payload);
        toast.success('Role created successfully');
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save role');
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
            <h2 className="text-lg font-bold text-slate-900">{role ? 'Edit Role' : 'Create Custom Role'}</h2>
            <p className="text-sm text-slate-500">
              {isSystem ? 'System roles can only have their permissions modified.' : 'Configure role details and permissions.'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Details Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Role Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                disabled={isSystem}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none disabled:bg-slate-100 disabled:text-slate-500"
                placeholder="e.g. Training Coordinator"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none min-h-[80px] resize-none"
                placeholder="Briefly describe what this role does..."
              />
            </div>
          </div>

          {/* Permissions Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Permissions</h3>
              <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                {selectedPerms.size} selected
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
                        const hasPerm = selectedPerms.has(perm.id);
                        return (
                          <label key={perm.id} className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                            <input
                              type="checkbox"
                              checked={hasPerm}
                              onChange={() => handleToggle(perm)}
                              disabled={isSystem}
                              className="mt-1 flex-shrink-0"
                            />
                            <div>
                              <p className="text-sm font-medium text-slate-700">{perm.action}</p>
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
          <div className="flex items-center gap-2 text-xs text-amber-600">
            <AlertTriangle size={14} />
            <span>Changes affect all assigned users instantly.</span>
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
              {submitting ? 'Saving...' : 'Save Role'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
