import React, { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";
import debounce from "lodash/debounce";
import { Award } from "lucide-react";

export default function CertificateSettings({ course, setSaveStatus }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    certificate_enabled: course.certificate_enabled ?? true,
    certificate_title: course.certificate_title || "",
    cpd_hours: course.cpd_hours || 0,
    expiry_months: course.expiry_months || 12,
    auto_issue: course.auto_issue ?? true,
  });

  const updateMutation = useMutation({
    mutationFn: (data) => apiClient.patch(`/templates/${course.id}`, data),
    onMutate: () => setSaveStatus("saving"),
    onSuccess: (res) => {
      setSaveStatus("saved");
      queryClient.setQueryData(['template', course.id], res);
    },
    onError: () => setSaveStatus("error")
  });

   
  const debouncedSave = useCallback(
    debounce((data) => {
      updateMutation.mutate(data);
    }, 1000),
    [course.id]
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;
    
    if (name === 'cpd_hours' || name === 'expiry_months') {
      newValue = newValue === "" ? "" : Number(newValue);
    }

    const newFormData = { ...formData, [name]: newValue };
    setFormData(newFormData);
    setSaveStatus("saving");
    debouncedSave(newFormData);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Certificate & CPD</h2>
        <p className="text-sm text-slate-500 mt-1">Configure the certificate issued upon course completion.</p>
      </div>

      <div className="card p-6 space-y-6 shadow-sm border border-slate-200">
        
        {/* Enable Certificate Toggle */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <label className="block text-sm font-semibold text-slate-900">Enable Certificate</label>
            <p className="text-xs text-slate-500 mt-0.5">Learners will receive a certificate when they pass this course.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              name="certificate_enabled"
              checked={formData.certificate_enabled}
              onChange={handleChange}
              className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {formData.certificate_enabled && (
          <div className="space-y-6 pt-2 animate-fade-in">
            {/* Certificate Title */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">Certificate Title (Optional)</label>
              <p className="text-xs text-slate-500 mb-2">If left blank, the course title will be used on the certificate.</p>
              <input 
                type="text" 
                name="certificate_title"
                value={formData.certificate_title}
                onChange={handleChange}
                placeholder="e.g. Certificate of Achievement in First Aid"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* CPD Hours */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">CPD Hours</label>
                <div className="relative">
                  <Award className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input 
                    type="number" 
                    name="cpd_hours"
                    value={formData.cpd_hours}
                    onChange={handleChange}
                    step="0.5"
                    min="0"
                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Expiry Period */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">Valid For (Months)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    name="expiry_months"
                    value={formData.expiry_months}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                    Months
                  </div>
                </div>
              </div>
            </div>

            {/* Auto-issue Toggle */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div>
                <label className="block text-sm font-semibold text-slate-900">Auto-issue Certificate</label>
                <p className="text-xs text-slate-500 mt-0.5">Automatically generate and email the certificate upon course completion.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="auto_issue"
                  checked={formData.auto_issue}
                  onChange={handleChange}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
