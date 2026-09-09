import React, { useState, useEffect } from 'react';
import { X, Save, Building2, Mail, Phone } from 'lucide-react';
import { tokenStorage, apiClient } from "@/api/apiClient";
import { useQuery } from '@tanstack/react-query';

export default function EditOrganisationModal({ isOpen, onClose, org, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'ACTIVE',
    assigned_template_ids: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch course templates
  const { data: templatesData, isLoading: isLoadingTemplates } = useQuery({
    queryKey: ['templates'],
    queryFn: () => apiClient.get('/templates').then(res => res.data),
    enabled: isOpen
  });
  const templates = templatesData?.data || [];

  useEffect(() => {
    if (org) {
      // Map existing courses back to template IDs (exclude archived if we don't want them checked by default)
      // We check for ACTIVE/PUBLISHED status so we don't re-check archived templates.
      const assignedIds = (org.courses || [])
        .filter(c => c.parent_template_id && c.status !== 'ARCHIVED')
        .map(c => c.parent_template_id);

      setFormData({
        name: org.name || '',
        email: org.users?.[0]?.email || org.email || '',
        phone: org.phone || '',
        status: org.status || 'ACTIVE',
        assigned_template_ids: assignedIds
      });
    }
  }, [org]);

  if (!isOpen || !org) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/v1/organizations/${org.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenStorage.getAccessToken()}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        onSave(data.data);
        onClose();
      } else {
        setError(data.error || 'Failed to update organisation');
      }
    } catch (err) {
      setError('An error occurred while updating.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-800">
            <Building2 size={20} className="text-blue-600" />
            <h2 className="text-lg font-bold">Edit Organisation</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}
          
          <form id="edit-org-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Organisation Name</label>
              <div className="relative">
                <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Admin Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all text-sm bg-white"
              >
                <option value="ACTIVE">Active</option>
                <option value="TRIAL">Trial</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Course Access</label>
              <p className="text-xs text-slate-500 mb-3">Select which global course templates this organisation will have access to. Unchecking a previously assigned course will archive it for the organisation.</p>
              
              {isLoadingTemplates ? (
                <div className="text-sm text-slate-500 py-2">Loading templates...</div>
              ) : (
                <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto pr-2">
                  {templates.map(template => (
                    <label key={template.id} className="flex items-start gap-3 p-2 rounded-md hover:bg-slate-50 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                        checked={formData.assigned_template_ids.includes(template.id)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setFormData(prev => ({
                            ...prev,
                            assigned_template_ids: checked 
                              ? [...prev.assigned_template_ids, template.id]
                              : prev.assigned_template_ids.filter(id => id !== template.id)
                          }));
                        }}
                      />
                      <div className="flex-1">
                        <p className="text-sm text-slate-700">{template.title}</p>
                      </div>
                    </label>
                  ))}
                  {templates.length === 0 && (
                    <p className="text-sm text-slate-500 italic">No global templates available.</p>
                  )}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button 
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="edit-org-form"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Save size={16} />
            )}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
