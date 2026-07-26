import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, CheckCircle2, User, Briefcase, GraduationCap, ClipboardCheck } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { apiClient } from '@/api/apiClient';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';

const STEPS = [
  { id: 1, title: "Personal Information", icon: User },
  { id: 2, title: "Employment Information", icon: Briefcase },
  { id: 3, title: "Learning & Compliance", icon: GraduationCap },
  { id: 4, title: "Review", icon: ClipboardCheck }
];

export default function CreateLearner() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [createdData, setCreatedData] = useState(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    gender: "",
    
    employee_id: "",
    job_role: "",
    department: "",
    line_manager: "",
    start_date: "",
    employment_status: "ACTIVE",

    learning_group: "",
    mandatory_learning_path: "",
    compliance_category: "",
    certificate_renewal_cycle: "12_MONTHS",
    notification_preferences: "EMAIL",
    
    assigned_course_ids: []
  });

  const { data: coursesResponse, isLoading: isLoadingCourses } = useQuery({
    queryKey: ['org-courses'],
    queryFn: () => apiClient.get('/courses').then(res => res.data)
  });
  const courses = coursesResponse?.data || [];

  const createMutation = useMutation({
    mutationFn: (data) => apiClient.post('/learners', data),
    onSuccess: (res) => {
      setCreatedData(res.data.data);
      setCurrentStep(5); // Success step
      toast({ title: "Success", description: "Learner created successfully." });
    },
    onError: (err) => {
      const errData = err.response?.data?.error;
      const errorMessage = typeof errData === 'object' ? errData.message || JSON.stringify(errData) : errData || "Failed to create learner";
      toast({ 
        title: "Error", 
        description: errorMessage, 
        variant: "destructive" 
      });
    }
  });

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.first_name || !formData.last_name || !formData.email) {
        toast({ title: "Validation Error", description: "Please fill in all required fields.", variant: "destructive" });
        return;
      }
      if (formData.phone && formData.phone.replace(/\D/g, '').length < 11) {
        toast({ title: "Validation Error", description: "Mobile Number must contain at least 11 digits.", variant: "destructive" });
        return;
      }
    }
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleSubmit = () => {
    createMutation.mutate(formData);
  };

  if (currentStep === 5 && createdData) {
    return (
      <div className="p-6 space-y-6 max-w-3xl mx-auto animate-fade-in mt-10">
        <div className="card p-10 flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
            <CheckCircle2 size={40} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Learner Created Successfully</h2>
            <p className="text-slate-500">The learner profile has been created and an invitation email has been sent.</p>
          </div>
          
          <div className="w-full max-w-md bg-slate-50 p-6 rounded-xl space-y-4 text-left border border-slate-100">
            <div>
              <p className="text-sm font-medium text-slate-500">Learner ID</p>
              <p className="text-lg font-bold text-slate-900">{createdData.learner_id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Login Email</p>
              <p className="text-slate-900">{formData.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Temporary Password</p>
              <p className="text-slate-900 font-mono bg-white p-2 rounded border inline-block mt-1">{createdData.temp_password}</p>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button onClick={() => navigate('/orgadmin/learners')} className="px-6 py-2.5 text-sm font-semibold bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
              Return to Learner List
            </button>
            <button onClick={() => { setCreatedData(null); setCurrentStep(1); setFormData({...formData, first_name: '', last_name: '', email: ''}) }} className="px-6 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors">
              Create Another Learner
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-[1200px] mx-auto">
      <PageHeader 
        title="Create Learner" 
        subtitle="Onboard a new learner to the platform"
        backButton={true}
      />

      <div className="flex gap-8">
        <div className="w-64 flex-shrink-0 hidden md:block">
          <div className="card p-4 sticky top-6">
            <nav className="space-y-1">
              {STEPS.map((step) => {
                const isActive = currentStep === step.id;
                const isPassed = currentStep > step.id;
                const Icon = step.icon;
                
                return (
                  <div 
                    key={step.id}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? "bg-blue-50 text-blue-700" : 
                      isPassed ? "text-slate-700" : "text-slate-400"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isActive ? "bg-blue-100 text-blue-600" :
                      isPassed ? "bg-emerald-100 text-emerald-600" : "bg-slate-100"
                    }`}>
                      {isPassed ? <CheckCircle2 size={16} /> : <Icon size={16} />}
                    </div>
                    {step.title}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="flex-1 card p-8 min-h-[500px] flex flex-col">
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="font-bold text-lg text-slate-900 border-b pb-2">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">First Name *</label>
                  <input type="text" value={formData.first_name} onChange={e => updateForm('first_name', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm" placeholder="e.g. Jane" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Last Name *</label>
                  <input type="text" value={formData.last_name} onChange={e => updateForm('last_name', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm" placeholder="e.g. Doe" />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-sm font-medium text-slate-700">Email Address *</label>
                  <input type="email" value={formData.email} onChange={e => updateForm('email', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm" placeholder="jane.doe@example.com" />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-sm font-medium text-slate-700">Mobile Number</label>
                  <input type="tel" value={formData.phone} onChange={e => updateForm('phone', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm" placeholder="+44..." />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="font-bold text-lg text-slate-900 border-b pb-2">Employment Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Employee ID</label>
                  <input type="text" value={formData.employee_id} onChange={e => updateForm('employee_id', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm" placeholder="EMP-1234" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Job Role</label>
                  <input type="text" value={formData.job_role} onChange={e => updateForm('job_role', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm" placeholder="Support Worker" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Department / Team</label>
                  <input type="text" value={formData.department} onChange={e => updateForm('department', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm" placeholder="Residential Care" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Line Manager</label>
                  <input type="text" value={formData.line_manager} onChange={e => updateForm('line_manager', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm" placeholder="Manager Name" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Start Date</label>
                  <input type="date" value={formData.start_date} onChange={e => updateForm('start_date', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Employment Status</label>
                  <select value={formData.employment_status} onChange={e => updateForm('employment_status', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white">
                    <option value="ACTIVE">Active (Employed)</option>
                    <option value="PROBATION">Probation</option>
                    <option value="ON_LEAVE">On Leave</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="font-bold text-lg text-slate-900 border-b pb-2">Learning & Compliance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Learning Group</label>
                  <select value={formData.learning_group} onChange={e => updateForm('learning_group', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white">
                    <option value="">Select Group...</option>
                    <option value="Foster Carers">Foster Carers</option>
                    <option value="Support Staff">Support Staff</option>
                    <option value="Management">Management</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Compliance Category</label>
                  <select value={formData.compliance_category} onChange={e => updateForm('compliance_category', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white">
                    <option value="">Select Category...</option>
                    <option value="Standard Care">Standard Care</option>
                    <option value="Advanced Care">Advanced Care</option>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <label className="text-sm font-medium text-slate-700 block mb-2">Initial Course Assignments</label>
                {isLoadingCourses ? (
                  <div className="text-sm text-slate-500">Loading courses...</div>
                ) : (
                  <div className="border border-slate-200 rounded-lg p-4 max-h-[200px] overflow-y-auto space-y-2">
                    {courses.map(course => (
                      <label key={course.id} className="flex items-center gap-3 hover:bg-slate-50 p-2 rounded cursor-pointer">
                        <input 
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                          checked={formData.assigned_course_ids.includes(course.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              updateForm('assigned_course_ids', [...formData.assigned_course_ids, course.id]);
                            } else {
                              updateForm('assigned_course_ids', formData.assigned_course_ids.filter(id => id !== course.id));
                            }
                          }}
                        />
                        <span className="text-sm text-slate-700">{course.title}</span>
                      </label>
                    ))}
                    {courses.length === 0 && <p className="text-sm text-slate-500">No courses available in this organisation.</p>}
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="font-bold text-lg text-slate-900 border-b pb-2">Review Information</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-slate-700 mb-2">Personal Information</h4>
                  <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600 space-y-2">
                    <p><strong>Name:</strong> {formData.first_name} {formData.last_name}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Phone:</strong> {formData.phone || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-700 mb-2">Employment Details</h4>
                  <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600 space-y-2">
                    <p><strong>Job Role:</strong> {formData.job_role || 'N/A'}</p>
                    <p><strong>Department:</strong> {formData.department || 'N/A'}</p>
                    <p><strong>Manager:</strong> {formData.line_manager || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-700 mb-2">Learning</h4>
                  <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600 space-y-2">
                    <p><strong>Assigned Courses:</strong> {formData.assigned_course_ids.length}</p>
                    <p><strong>Compliance Category:</strong> {formData.compliance_category || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="pt-8 flex justify-end gap-3 mt-auto border-t border-slate-100">
            {currentStep > 1 && (
              <button onClick={() => setCurrentStep(currentStep - 1)} className="px-4 py-2 text-sm font-semibold bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50">
                Back
              </button>
            )}
            {currentStep < 4 ? (
              <button onClick={handleNext} className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-2">
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button 
                onClick={handleSubmit} 
                disabled={createMutation.isPending}
                className="px-6 py-2 text-sm font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 flex items-center gap-2 disabled:opacity-50"
              >
                {createMutation.isPending ? 'Creating...' : 'Create Learner'} <CheckCircle2 size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
