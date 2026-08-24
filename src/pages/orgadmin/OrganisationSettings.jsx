import React, { useState, useEffect } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { Save, Building2, Image as ImageIcon, Mail, Bell, Award, Upload } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";
import { toast } from "react-hot-toast";

export default function OrganisationSettings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("profile");

  const { data, isLoading } = useQuery({
    queryKey: ['organization', user?.organization_id],
    queryFn: () => apiClient.get(`/organizations/${user?.organization_id}`).then(res => res.data),
    enabled: !!user?.organization_id,
  });

  const organization = data?.data || {};

  const [formData, setFormData] = useState({
    name: "",
    registration_number: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    county: "",
    country: "",
    postcode: "",
    logo_url: ""
  });

  const [logoFile, setLogoFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (organization.id) {
      setFormData({
        name: organization.name || "",
        registration_number: organization.registration_number || "",
        email: organization.email || "",
        phone: organization.phone || "",
        website: organization.website || "",
        address: organization.address || "",
        city: organization.city || "",
        county: organization.county || "",
        country: organization.country || "",
        postcode: organization.postcode || "",
        logo_url: organization.logo_url || ""
      });
    }
  }, [organization]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      let newLogoUrl = formData.logo_url;

      if (logoFile) {
        try {
          const uploadResponse = await apiClient.post("/storage/upload-url", {
            filename: logoFile.name,
            contentType: logoFile.type,
            folder: "logos"
          });
          const { uploadUrl, cloudfrontUrl } = uploadResponse.data.data;
          
          const res = await fetch(uploadUrl, {
            method: "PUT",
            body: logoFile,
            headers: { "Content-Type": logoFile.type }
          });
          
          if (!res.ok) {
            throw new Error("S3 Upload Failed");
          }
          
          newLogoUrl = cloudfrontUrl;
        } catch (uploadError) {
          console.warn("S3 upload failed (likely mock AWS credentials). Falling back to base64.", uploadError);
          // Fallback to base64 for local development
          newLogoUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(logoFile);
          });
        }
      }

      await apiClient.put(`/organizations/${user.organization_id}`, {
        ...formData,
        logo_url: newLogoUrl
      });

      toast.success("Settings saved successfully");
      queryClient.invalidateQueries(['organization', user.organization_id]);
      setLogoFile(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1000px] mx-auto">
      <PageHeader 
        title="Organisation Settings" 
        subtitle="Manage your agency profile, branding, and defaults"
        actions={
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="h-9 px-4 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Save size={14} /> {isSaving ? "Saving..." : "Save Changes"}
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 space-y-2">
          <nav className="flex flex-col space-y-1">
            <button onClick={() => setActiveTab("profile")} className={`flex items-center gap-3 px-3 py-2.5 font-medium rounded-lg text-sm transition-colors ${activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Building2 size={16} /> Organisation Profile
            </button>
            <button onClick={() => setActiveTab("branding")} className={`flex items-center gap-3 px-3 py-2.5 font-medium rounded-lg text-sm transition-colors ${activeTab === 'branding' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
              <ImageIcon size={16} /> Logo & Branding
            </button>
            <button onClick={() => setActiveTab("contact")} className={`flex items-center gap-3 px-3 py-2.5 font-medium rounded-lg text-sm transition-colors ${activeTab === 'contact' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Mail size={16} /> Contact Information
            </button>
          </nav>
        </div>
        
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="card p-6 space-y-6">
            {activeTab === 'profile' && (
              <>
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900">Organisation Profile</h3>
                  <p className="text-sm text-slate-500 mt-1">Update your agency's basic information.</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Agency Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Registration Number (Ofsted/CQC)</label>
                    <input type="text" name="registration_number" value={formData.registration_number} onChange={handleChange} className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm" />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'branding' && (
              <>
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900">Logo & Branding</h3>
                  <p className="text-sm text-slate-500 mt-1">Upload your organisation's logo to personalise the platform.</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Organisation Logo</label>
                    <p className="text-xs text-slate-500 mb-2">Recommended dimensions: 512x512 pixels (1:1 ratio) for best display in the sidebar.</p>
                    <div className="flex items-center gap-6 mt-2">
                      <div className="w-24 h-24 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {logoFile ? (
                          <img src={URL.createObjectURL(logoFile)} alt="Logo Preview" className="w-full h-full object-cover" />
                        ) : formData.logo_url ? (
                          <img src={formData.logo_url} alt="Current Logo" className="w-full h-full object-cover" />
                        ) : (
                          <Building2 size={32} className="text-slate-300" />
                        )}
                      </div>
                      <div>
                        <label className="cursor-pointer h-9 px-4 text-sm font-semibold bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-2 transition-colors w-max">
                          <Upload size={14} /> Upload New Logo
                          <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'contact' && (
              <>
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900">Contact Information</h3>
                  <p className="text-sm text-slate-500 mt-1">Update your organisation's contact details.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Phone Number</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium text-slate-700">Website</label>
                    <input type="url" name="website" value={formData.website} onChange={handleChange} className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium text-slate-700">Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">County</label>
                    <input type="text" name="county" value={formData.county} onChange={handleChange} className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Country</label>
                    <input type="text" name="country" value={formData.country} onChange={handleChange} className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Postcode</label>
                    <input type="text" name="postcode" value={formData.postcode} onChange={handleChange} className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm" />
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
