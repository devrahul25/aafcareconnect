import React, { useState, useEffect } from 'react';
import { X, Loader2, Mail, User, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { apiClient } from '@/api/apiClient';
import toast from 'react-hot-toast';

export default function InviteStaffModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    role_id: ''
  });
  
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [successData, setSuccessData] = useState(null); // Will hold the temp password

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoadingRoles(true);
        const res = await apiClient.get('/roles');
        // Filter out learner and super_admin from the invite list if needed,
        // but typically the backend handles what roles are visible.
        const availableRoles = (res.data.data || []).filter(r => r.name !== 'super_admin' && r.name !== 'learner' && r.name !== 'org_admin');
        setRoles(availableRoles);
      } catch (err) {
        toast.error('Failed to load roles');
      } finally {
        setLoadingRoles(false);
      }
    };
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email || !formData.role_id) {
      return toast.error("Please fill in all required fields.");
    }

    try {
      setSubmitting(true);
      const res = await apiClient.post('/users/invite', formData);
      toast.success('Staff invited successfully!');
      setSuccessData({
        email: formData.email,
        tempPassword: res.data.data.tempPassword
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to invite staff');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <h2 className="text-lg font-bold text-slate-900">Invite Staff Member</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {successData ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Invitation Sent!</h3>
                <p className="text-slate-500 mt-2 text-sm">
                  An account has been created for {successData.email}.
                </p>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left mt-6">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Temporary Credentials</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-white p-2 rounded border border-slate-100">
                    <span className="text-slate-500 text-sm font-medium">Email</span>
                    <span className="text-slate-900 text-sm font-bold">{successData.email}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white p-2 rounded border border-slate-100">
                    <span className="text-slate-500 text-sm font-medium">Password</span>
                    <span className="text-slate-900 text-sm font-bold tracking-wider">{successData.tempPassword}</span>
                  </div>
                </div>
                <p className="text-xs text-rose-500 mt-3 flex items-start gap-1.5 font-medium">
                  <ShieldAlert size={14} className="mt-0.5 flex-shrink-0" />
                  Please securely share these credentials with the staff member. They will be required to change their password upon first login.
                </p>
              </div>

              <div className="pt-4">
                <button 
                  onClick={onClose}
                  className="w-full h-11 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="e.g. Jane Doe"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jane@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Assign Role *</label>
                {loadingRoles ? (
                  <div className="flex items-center gap-2 text-slate-500 text-sm py-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading roles...
                  </div>
                ) : (
                  <select
                    name="role_id"
                    value={formData.role_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all appearance-none"
                    required
                  >
                    <option value="" disabled>Select a role</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>
                        {role.name.replace(/_/g, ' ')} {role.is_system ? '(Built-in)' : '(Custom)'}
                      </option>
                    ))}
                  </select>
                )}
                <p className="text-xs text-slate-500 mt-1.5">
                  The user will inherit all permissions associated with this role.
                </p>
              </div>

              <div className="pt-4 flex gap-3 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 h-11 px-4 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || loadingRoles}
                  className="flex-1 h-11 px-4 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? 'Inviting...' : 'Send Invite'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
