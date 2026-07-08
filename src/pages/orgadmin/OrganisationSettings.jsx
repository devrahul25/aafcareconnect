import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import { Save, Building2, Image, Mail, Bell, Shield, Award } from "lucide-react";

export default function OrganisationSettings() {
  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1000px] mx-auto">
      <PageHeader 
        title="Organisation Settings" 
        subtitle="Manage your agency profile, branding, and defaults"
        actions={
          <button className="h-9 px-4 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-2 transition-colors">
            <Save size={14} /> Save Changes
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 space-y-2">
          <nav className="flex flex-col space-y-1">
            <button className="flex items-center gap-3 px-3 py-2.5 bg-blue-50 text-blue-700 font-medium rounded-lg text-sm transition-colors">
              <Building2 size={16} /> Organisation Profile
            </button>
            <button className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 font-medium rounded-lg text-sm transition-colors">
              <Image size={16} /> Logo & Branding
            </button>
            <button className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 font-medium rounded-lg text-sm transition-colors">
              <Mail size={16} /> Contact Information
            </button>
            <button className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 font-medium rounded-lg text-sm transition-colors">
              <Award size={16} /> Default Training Settings
            </button>
            <button className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 font-medium rounded-lg text-sm transition-colors">
              <Bell size={16} /> Notification Preferences
            </button>
          </nav>
        </div>
        
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="card p-6 space-y-6">
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-900">Organisation Profile</h3>
              <p className="text-sm text-slate-500 mt-1">Update your agency's basic information.</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Agency Name</label>
                <input type="text" defaultValue="Eserve Social Care" className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Registration Number (Ofsted/CQC)</label>
                <input type="text" defaultValue="SC123456" className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm" />
              </div>
              
              <div className="pt-4 border-t border-slate-100">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Allow self-registration for learners</p>
                    <p className="text-xs text-slate-500">Learners can sign up using your organisation's unique invite link.</p>
                  </div>
                </label>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Weekly Summary Emails</p>
                    <p className="text-xs text-slate-500">Receive a weekly digest of learner progress and compliance.</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
