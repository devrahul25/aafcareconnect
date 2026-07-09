import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ArrowLeft, Building2, UserCircle, CreditCard, CheckCircle2 } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { tokenStorage } from '@/api/apiClient';

const STEPS = [
  { id: 1, title: "Organisation Info", icon: Building2 },
  { id: 2, title: "Administrator", icon: UserCircle },
  { id: 3, title: "Subscription", icon: CreditCard },
  { id: 4, title: "Review", icon: CheckCircle2 }
];

export default function CreateOrganisation() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");
  const [createdData, setCreatedData] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "INDEPENDENT_FOSTERING_AGENCY",
    email: "",
    phone: "",
    website: "",
    logo_url: "",
    address: "",
    city: "",
    county: "",
    country: "",
    postcode: "",
    registration_number: "",
    ofsted_number: "",
    
    admin_name: "",
    admin_email: "",
    admin_phone: "",
    admin_job_title: "",
    
    plan: "STANDARD",
    trial_or_paid: "PAID",
    max_learners: 50,
    max_staff: 10
  });

  const handleNext = () => {
    // Basic validation
    if (currentStep === 1) {
      if (!formData.name || !formData.email || !formData.phone) {
        alert("Please fill in all required organisation fields (Name, Email, Phone).");
        return;
      }
    }
    if (currentStep === 2) {
      if (!formData.admin_name || !formData.admin_email || !formData.admin_phone) {
        alert("Please fill in all required administrator fields (Name, Email, Phone).");
        return;
      }
    }

    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
    else navigate("/superadmin/organisations");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus("Creating Organisation...");
    
    try {
      const response = await fetch('/api/v1/organizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenStorage.getAccessToken()}`
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        const errorMsg = typeof result.error === 'object' ? JSON.stringify(result.error) : (result.error || 'Failed to create organisation');
        throw new Error(errorMsg);
      }

      // Simulate sequential loading as requested
      setTimeout(() => setSubmitStatus("Creating Organisation Admin..."), 800);
      setTimeout(() => setSubmitStatus("Generating Login Credentials..."), 1600);
      setTimeout(() => setSubmitStatus("Sending Invitation Email..."), 2400);
      
      setTimeout(() => {
        setCreatedData(result.data);
        setCurrentStep(5); // Success step
        setIsSubmitting(false);
      }, 3200);
      
    } catch (err) {
      alert("Error: " + err.message);
      setIsSubmitting(false);
    }
  };

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (currentStep === 5 && createdData) {
    return (
      <div className="p-6 space-y-6 animate-fade-in max-w-[800px] mx-auto">
        <div className="card p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Organisation Created Successfully</h2>
          
          <div className="grid grid-cols-2 gap-4 text-left bg-slate-50 p-6 rounded-lg border border-slate-100">
            <div>
              <p className="text-xs text-slate-500 mb-1">Organisation Name</p>
              <p className="font-semibold text-slate-900">{createdData.organization.name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Organisation ID</p>
              <p className="font-semibold text-slate-900 font-mono">ORG-{createdData.organization.id.substring(0,6).toUpperCase()}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Organisation Admin</p>
              <p className="font-semibold text-slate-900">{createdData.admin.name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Admin Email</p>
              <p className="font-semibold text-slate-900">{createdData.admin.email}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Subscription Plan</p>
              <p className="font-semibold text-slate-900">{createdData.subscription.plan}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Account Status</p>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                ACTIVE
              </span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-left flex justify-between items-center">
            <p className="text-sm text-blue-800">
              An invitation email containing the login URL, username, and temporary password has been sent to the Organisation Administrator.
            </p>
            {createdData.emailPreviewUrl && (
              <a 
                href={createdData.emailPreviewUrl} 
                target="_blank" 
                rel="noreferrer"
                className="ml-4 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 whitespace-nowrap"
              >
                View Sent Email
              </a>
            )}
          </div>

          <div className="text-left border border-slate-200 rounded-lg overflow-hidden mt-6">
            <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 font-medium text-sm text-slate-700 flex justify-between">
              <span>Email Preview</span>
              <span className="text-slate-500 font-normal">Subject: Welcome to AAF CareConnect</span>
            </div>
            <div className="p-6 bg-white space-y-4 text-sm text-slate-700 font-sans">
              <p>Hello {createdData.admin.name},</p>
              <p>Your organisation has been successfully created on the AAF CareConnect Platform.</p>
              <p>You have been assigned as the Organisation Administrator.</p>
              
              <div className="bg-slate-50 p-4 rounded border border-slate-100 space-y-2">
                <p><strong>Organisation:</strong> {createdData.organization.name}</p>
                <p><strong>Organisation ID:</strong> ORG-{createdData.organization.id.substring(0,6).toUpperCase()}</p>
                <p><strong>Email:</strong> {createdData.admin.email}</p>
                <p><strong>Temporary Password:</strong> <span className="font-mono bg-white px-2 py-1 border rounded">{createdData.tempPassword}</span></p>
                <p><strong>Login URL:</strong> <a href="#" className="text-blue-600">https://app.aafcareconnect.com/login</a></p>
              </div>

              <p className="text-xs text-slate-500">For security, you will be prompted to change your password after your first login.</p>
            </div>
          </div>

          <div className="flex gap-3 justify-center pt-4">
            <button onClick={() => navigate("/superadmin/organisations")} className="px-4 py-2 text-sm font-semibold bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50">
              View Organisation List
            </button>
            <button onClick={() => { setCreatedData(null); setCurrentStep(1); }} className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500">
              Create Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1200px] mx-auto">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={handleBack} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <PageHeader 
          title="Create Organisation" 
          subtitle="Onboard a new agency onto the AAF CareConnect platform"
        />
      </div>

      {/* Progress Wizard */}
      <div className="flex items-center justify-between mb-8 px-4">
        {STEPS.map((step, idx) => (
          <React.Fragment key={step.id}>
            <div className={`flex flex-col items-center gap-2 ${currentStep >= step.id ? 'text-blue-600' : 'text-slate-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors ${
                currentStep > step.id ? 'bg-blue-600 text-white border-blue-600' :
                currentStep === step.id ? 'bg-white border-blue-600 text-blue-600' :
                'bg-white border-slate-200 text-slate-400'
              }`}>
                {currentStep > step.id ? <CheckCircle2 size={20} /> : <step.icon size={18} />}
              </div>
              <span className="text-xs font-semibold">{step.title}</span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 transition-colors ${currentStep > step.id ? 'bg-blue-600' : 'bg-slate-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="flex gap-8">
        {/* Form Area */}
        <div className="flex-1 card p-6">
          {isSubmitting ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-slate-600 font-medium animate-pulse">{submitStatus}</p>
            </div>
          ) : (
            <>
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="font-bold text-lg text-slate-900 border-b pb-2">Organisation Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700">Organisation Name *</label>
                      <input type="text" value={formData.name} onChange={e => updateForm('name', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm" placeholder="e.g. Horizon Fostering" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700">Organisation Type *</label>
                      <select value={formData.type} onChange={e => updateForm('type', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white">
                        <option value="INDEPENDENT_FOSTERING_AGENCY">Independent Fostering Agency</option>
                        <option value="LOCAL_AUTHORITY">Local Authority</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700">Registration Number</label>
                      <input type="text" value={formData.registration_number} onChange={e => updateForm('registration_number', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700">Ofsted Registration</label>
                      <input type="text" value={formData.ofsted_number} onChange={e => updateForm('ofsted_number', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700">Contact Email *</label>
                      <input type="email" value={formData.email} onChange={e => updateForm('email', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700">Contact Phone *</label>
                      <input type="text" value={formData.phone} onChange={e => updateForm('phone', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm" />
                    </div>
                    <div className="col-span-2 space-y-1">
                      <label className="text-sm font-medium text-slate-700">Website</label>
                      <input type="text" value={formData.website} onChange={e => updateForm('website', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm" placeholder="https://" />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="font-bold text-lg text-slate-900 border-b pb-2">Organisation Administrator</h3>
                  <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3 mb-4">
                    <UserCircle className="text-blue-600 mt-0.5 flex-shrink-0" size={18} />
                    <p className="text-sm text-blue-800">This user will be created and assigned the <strong>Organisation Admin</strong> role. They will receive an email with their login credentials.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700">Full Name *</label>
                      <input type="text" value={formData.admin_name} onChange={e => updateForm('admin_name', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700">Email Address *</label>
                      <input type="email" value={formData.admin_email} onChange={e => updateForm('admin_email', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700">Mobile Number</label>
                      <input type="text" value={formData.admin_phone} onChange={e => updateForm('admin_phone', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700">Job Title</label>
                      <input type="text" value={formData.admin_job_title} onChange={e => updateForm('admin_job_title', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm" />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="font-bold text-lg text-slate-900 border-b pb-2">Subscription Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700">Plan Tier</label>
                      <select value={formData.plan} onChange={e => updateForm('plan', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white">
                        <option value="STANDARD">Standard</option>
                        <option value="PROFESSIONAL">Professional</option>
                        <option value="ENTERPRISE">Enterprise</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700">Account Type</label>
                      <select value={formData.trial_or_paid} onChange={e => updateForm('trial_or_paid', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white">
                        <option value="PAID">Paid (Active)</option>
                        <option value="TRIAL">14-Day Trial</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700">Maximum Learners</label>
                      <input type="number" value={formData.max_learners} onChange={e => updateForm('max_learners', parseInt(e.target.value))} className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700">Maximum Staff</label>
                      <input type="number" value={formData.max_staff} onChange={e => updateForm('max_staff', parseInt(e.target.value))} className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm" />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="font-bold text-lg text-slate-900 border-b pb-2">Review Information</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-slate-700">Organisation Details</h4>
                        <button onClick={() => setCurrentStep(1)} className="text-blue-600 text-sm font-medium hover:underline">Edit</button>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600 space-y-2">
                        <p><strong>Name:</strong> {formData.name}</p>
                        <p><strong>Type:</strong> {formData.type}</p>
                        <p><strong>Email:</strong> {formData.email}</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-slate-700">Organisation Admin</h4>
                        <button onClick={() => setCurrentStep(2)} className="text-blue-600 text-sm font-medium hover:underline">Edit</button>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600 space-y-2">
                        <p><strong>Name:</strong> {formData.admin_name}</p>
                        <p><strong>Email:</strong> {formData.admin_email}</p>
                        <p><strong>Role:</strong> Organisation Admin</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-slate-700">Subscription</h4>
                        <button onClick={() => setCurrentStep(3)} className="text-blue-600 text-sm font-medium hover:underline">Edit</button>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600 space-y-2">
                        <p><strong>Plan:</strong> {formData.plan}</p>
                        <p><strong>Type:</strong> {formData.trial_or_paid}</p>
                        <p><strong>Limits:</strong> {formData.max_learners} Learners, {formData.max_staff} Staff</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Navigation Buttons */}
              <div className="pt-8 flex justify-end gap-3 mt-auto">
                {currentStep > 1 && (
                  <button onClick={() => setCurrentStep(currentStep - 1)} className="px-4 py-2 text-sm font-semibold bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50">
                    Back
                  </button>
                )}
                {currentStep < 4 ? (
                  <button onClick={handleNext} disabled={!formData.name && currentStep === 1} className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 flex items-center gap-2">
                    Continue <ChevronRight size={16} />
                  </button>
                ) : (
                  <button onClick={handleSubmit} className="px-6 py-2 text-sm font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 flex items-center gap-2">
                    Create Organisation <CheckCircle2 size={16} />
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Live Preview Side Panel (Shown only in Steps 1-3) */}
        {currentStep < 4 && !isSubmitting && (
          <div className="w-[320px] flex-shrink-0 space-y-4 animate-fade-in">
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Live Preview</h4>
            <div className="card p-5 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Building2 size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">{formData.name || "Organisation Name"}</h3>
                <p className="text-xs text-slate-500 mt-1">{formData.type.replace(/_/g, ' ')}</p>
              </div>
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Plan</span>
                  <span className="font-medium text-slate-900">{formData.plan}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Learners Limit</span>
                  <span className="font-medium text-slate-900">{formData.max_learners}</span>
                </div>
              </div>
            </div>
            
            {currentStep === 3 && (
              <div className="card p-5 bg-blue-50/50 border-blue-100 space-y-2">
                <h4 className="font-semibold text-blue-900 text-sm">Plan Summary</h4>
                <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                  <li>Full LMS Access</li>
                  <li>Custom Branding</li>
                  <li>{formData.max_learners} Learner Seats</li>
                  <li>{formData.max_staff} Staff Seats</li>
                  <li>Email Support</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
