import React, { useState } from 'react';
import { apiClient } from '@/api/apiClient';
import { Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsTab({ staffId, profile, onUpdate }) {
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(profile?.status || 'ACTIVE');

  const handleStatusChange = async (newStatus) => {
    try {
      setSaving(true);
      await apiClient.patch(`/users/${staffId}/status`, { status: newStatus });
      setStatus(newStatus);
      toast.success(`User status updated to ${newStatus}`);
      if (onUpdate) onUpdate();
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-900">Account Settings</h2>
      </div>

      <div className="space-y-8 max-w-2xl">
        {/* Status Settings */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Account Status</h3>
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Active Status</div>
                  <div className="text-sm text-slate-500 mt-1">
                    Determine whether this staff member can log in and access the platform.
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusChange('ACTIVE')}
                    disabled={saving || status === 'ACTIVE'}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                      status === 'ACTIVE' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => handleStatusChange('SUSPENDED')}
                    disabled={saving || status === 'SUSPENDED'}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                      status === 'SUSPENDED' 
                        ? 'bg-amber-100 text-amber-700' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Suspended
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div>
          <h3 className="text-sm font-bold text-red-600 uppercase tracking-wider mb-4">Danger Zone</h3>
          <div className="bg-white border border-red-200 rounded-xl overflow-hidden">
            <div className="p-4 bg-red-50/50">
              <div className="flex gap-4 items-start">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-red-900">Deactivate Account</div>
                  <div className="text-sm text-red-700 mt-1 mb-4">
                    Deactivating this account will immediately revoke all access. This action cannot be fully undone without administrator intervention.
                  </div>
                  <button
                    onClick={() => {
                      if(window.confirm('Are you sure you want to deactivate this account?')) {
                        handleStatusChange('INACTIVE');
                      }
                    }}
                    disabled={saving || status === 'INACTIVE'}
                    className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-bold hover:bg-red-50 transition-colors"
                  >
                    {saving && status === 'INACTIVE' ? <Loader2 className="w-4 h-4 animate-spin inline mr-2" /> : null}
                    Deactivate Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
