import React, { useState, useEffect } from 'react';
import { X, Loader2, Mail, User, Phone, Briefcase, Calendar, Users, Target, CheckCircle2, ChevronRight, ChevronLeft, ShieldAlert } from 'lucide-react';
import { apiClient } from '@/api/apiClient';
import toast from 'react-hot-toast';

const STEPS = [
  'Personal Details',
  'Employment Details',
  'Assign Role',
  'Review'
];

export default function InviteStaffWizard({ onClose, onSuccess }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    employee_id: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
    job_title: '',
    department: '',
    employment_type: 'EMPLOYED',
    start_date: new Date().toISOString().split('T')[0],
    role_id: '',
    responsibility_scope: {
      learners: [],
      teams: [],
      departments: []
    }
  });

  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoadingRoles(true);
        const res = await apiClient.get('/roles');
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

  const handleScopeChange = (type, value) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData(prev => ({
      ...prev,
      responsibility_scope: {
        ...prev.responsibility_scope,
        [type]: arrayValue
      }
    }));
  };

  const handleNext = () => {
    if (currentStep === 0) {
      if (!formData.full_name || !formData.email) return toast.error("Name and Email are required");
      if (formData.phone && formData.phone.replace(/\D/g, '').length < 11) {
        return toast.error("Phone number must contain at least 11 digits");
      }
    }
    if (currentStep === 1) {
      if (!formData.job_title || !formData.department) return toast.error("Job Title and Department are required");
    }
    if (currentStep === 2) {
      if (!formData.role_id) return toast.error("Please select a role");
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
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

  const renderStep = () => {
    switch(currentStep) {
      case 0:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="e.g. Jane Doe" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="jane@example.com" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+44 7700 900000" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all" />
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Employee ID (Auto-generated)</label>
              <div className="relative">
                <input type="text" name="employee_id" value={formData.employee_id} readOnly className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm outline-none text-slate-500 font-medium" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Job Title *</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input type="text" name="job_title" value={formData.job_title} onChange={handleChange} placeholder="e.g. Senior Manager" className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Department *</label>
                <input type="text" name="department" value={formData.department} onChange={handleChange} placeholder="e.g. Safeguarding" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Employment Type</label>
                <select name="employment_type" value={formData.employment_type} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all appearance-none">
                  <option value="EMPLOYED">Employed</option>
                  <option value="SELF_EMPLOYED">Self Employed</option>
                  <option value="CONTRACTOR">Contractor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all" />
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Assign Role *</label>
              {loadingRoles ? (
                <div className="flex items-center gap-2 text-slate-500 text-sm py-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading roles...</div>
              ) : (
                <div className="grid gap-3">
                  {roles.map(role => (
                    <label key={role.id} className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${formData.role_id === role.id ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'}`}>
                      <input type="radio" name="role_id" value={role.id} checked={formData.role_id === role.id} onChange={handleChange} className="mt-1" />
                      <div className="ml-3">
                        <span className="block text-sm font-bold text-slate-900">{role.name.replace(/_/g, ' ')}</span>
                        <span className="block text-xs text-slate-500 mt-0.5">{role.description || 'Full permissions associated with this role.'}</span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 text-sm">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-2">Personal & Employment</h4>
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div>Name: <span className="font-semibold text-slate-900">{formData.full_name}</span></div>
                <div>Email: <span className="font-semibold text-slate-900">{formData.email}</span></div>
                <div>Job Title: <span className="font-semibold text-slate-900">{formData.job_title}</span></div>
                <div>Department: <span className="font-semibold text-slate-900">{formData.department}</span></div>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-2">Role & Access</h4>
              <div className="text-slate-600">
                Assigned Role: <span className="font-semibold text-slate-900 uppercase">{roles.find(r => r.id === formData.role_id)?.name.replace(/_/g, ' ') || 'None'}</span>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  if (successData) {
    return (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden p-6 text-center animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Invitation Sent!</h3>
          <p className="text-slate-500 mt-2 text-sm">An account has been created for {successData.email}.</p>
          
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
          <button onClick={onClose} className="mt-6 w-full h-11 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors">Done</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col h-[650px] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <h2 className="text-lg font-bold text-slate-900">Invite Staff Member</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-6 bg-slate-50/50">
          <div className="flex justify-between mb-2">
            {STEPS.map((step, idx) => (
              <div key={idx} className={`text-[10px] font-bold uppercase tracking-wider ${idx <= currentStep ? 'text-blue-600' : 'text-slate-400'}`}>
                Step {idx + 1}
              </div>
            ))}
          </div>
          <div className="flex h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mt-4 mb-2">{STEPS[currentStep]}</h3>
        </div>

        {/* Form Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
          <button 
            onClick={handleBack} 
            disabled={currentStep === 0}
            className="h-10 px-4 text-sm font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-0 transition-all flex items-center gap-1"
          >
            <ChevronLeft size={16} /> Back
          </button>
          
          {currentStep < STEPS.length - 1 ? (
            <button 
              onClick={handleNext}
              className="h-10 px-6 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors flex items-center gap-1 shadow-sm shadow-blue-200"
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={submitting}
              className="h-10 px-6 text-sm font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors flex items-center gap-2 shadow-sm shadow-emerald-200 disabled:opacity-50"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? 'Creating Account...' : 'Create Staff Account'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
