import React, { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { User, Mail, Phone, Briefcase, Bell, Lock, Save, MapPin } from "lucide-react";

export default function MyProfile() {
  const [profile, setProfile] = useState({
    firstName: "Sarah",
    lastName: "Jenkins",
    email: "learner@eserve.org.uk",
    phone: "07700 900123",
    role: "Foster Carer",
    organization: "AAF CareConnect Fostering",
    location: "London, UK"
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    courseReminders: true,
    certificateExpiry: true
  });

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1000px] mx-auto">
      <PageHeader 
        title="My Profile" 
        subtitle="Manage your personal information and preferences"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Quick Info */}
        <div className="space-y-6">
          <div className="card p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4 border-4 border-white shadow-sm">
              <span className="text-3xl font-bold font-heading">{profile.firstName[0]}{profile.lastName[0]}</span>
            </div>
            <h2 className="font-bold text-xl text-slate-900">{profile.firstName} {profile.lastName}</h2>
            <p className="text-sm text-slate-500 mb-4">{profile.role}</p>
            
            <button className="w-full h-9 text-sm font-semibold bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
              Change Photo
            </button>
          </div>

          <div className="card p-5 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Security</h3>
            <button className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-blue-100 hover:bg-blue-50/50 transition-colors text-left group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center text-slate-500 group-hover:text-blue-600 transition-colors">
                  <Lock size={16} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">Change Password</div>
                  <div className="text-xs text-slate-500 mt-0.5">Update your secure login</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="md:col-span-2 space-y-6">
          <div className="card p-6">
            <h3 className="font-bold text-slate-900 mb-5 text-lg">Personal Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input type="text" value={profile.firstName} onChange={(e) => setProfile({...profile, firstName: e.target.value})} className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Last Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input type="text" value={profile.lastName} onChange={(e) => setProfile({...profile, lastName: e.target.value})} className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
                </div>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input type="email" value={profile.email} disabled className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed" />
                </div>
                <p className="text-[11px] text-slate-400">Contact your administrator to change your email address.</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input type="tel" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input type="text" value={profile.location} onChange={(e) => setProfile({...profile, location: e.target.value})} className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-slate-900 mb-5 text-lg flex items-center gap-2"><Briefcase size={18} className="text-blue-500"/> Organisation Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Organisation</label>
                <input type="text" value={profile.organization} disabled className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed font-medium" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Role</label>
                <input type="text" value={profile.role} disabled className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed font-medium" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-slate-900 mb-5 text-lg flex items-center gap-2"><Bell size={18} className="text-blue-500"/> Notification Preferences</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Email Alerts</div>
                  <div className="text-xs text-slate-500 mt-0.5">Receive general updates via email</div>
                </div>
                <input type="checkbox" checked={notifications.emailAlerts} onChange={(e) => setNotifications({...notifications, emailAlerts: e.target.checked})} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer" />
              </label>
              <label className="flex items-center justify-between p-3 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                <div>
                  <div className="text-sm font-semibold text-slate-900">SMS Alerts</div>
                  <div className="text-xs text-slate-500 mt-0.5">Receive urgent updates via SMS</div>
                </div>
                <input type="checkbox" checked={notifications.smsAlerts} onChange={(e) => setNotifications({...notifications, smsAlerts: e.target.checked})} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer" />
              </label>
              <label className="flex items-center justify-between p-3 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Course Reminders</div>
                  <div className="text-xs text-slate-500 mt-0.5">Reminders for upcoming course deadlines</div>
                </div>
                <input type="checkbox" checked={notifications.courseReminders} onChange={(e) => setNotifications({...notifications, courseReminders: e.target.checked})} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer" />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button className="px-6 py-2.5 text-sm font-semibold bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button className="px-6 py-2.5 text-sm font-semibold bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
              <Save size={16} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
