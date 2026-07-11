import React, { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { Save, Lock, CreditCard, Code, ShieldAlert, Mail } from "lucide-react";

export default function PlatformSettings() {
  const [activeTab, setActiveTab] = useState("auth");

  const tabs = [
    { id: "auth", icon: Lock, label: "Authentication Methods" },
    { id: "payment", icon: CreditCard, label: "Payment Gateway" },
    { id: "api", icon: Code, label: "API Integrations" },
    { id: "security", icon: ShieldAlert, label: "Security Policies" },
    { id: "email", icon: Mail, label: "Email Templates" },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1000px] mx-auto">
      <PageHeader 
        title="Platform Settings" 
        subtitle="Configure global platform behavior and integrations"
        actions={
          <button className="h-9 px-4 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-2 transition-colors">
            <Save size={14} /> Save Changes
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-1 space-y-2">
          <nav className="flex flex-col space-y-1">
            {tabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-3 py-2.5 font-medium rounded-lg text-sm transition-colors ${
                  activeTab === tab.id ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="col-span-1 md:col-span-3 space-y-6">
          <div className="card p-6 space-y-6">
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-900">
                {tabs.find(t => t.id === activeTab)?.label}
              </h3>
              <p className="text-sm text-slate-500 mt-1">These settings affect all organisations on the platform.</p>
            </div>
            
            {activeTab === "auth" && (
              <div className="space-y-4">
                <div className="pt-2 border-slate-100">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="text-sm font-medium text-slate-900">Single Sign-On (SSO)</p>
                      <p className="text-xs text-slate-500">Allow users to sign in using their organisation's identity provider.</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                  </label>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="text-sm font-medium text-slate-900">Two-Factor Authentication (2FA)</p>
                      <p className="text-xs text-slate-500">Enforce 2FA for all Super Admin and Org Admin accounts.</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                  </label>
                </div>
              </div>
            )}

            {activeTab === "payment" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Stripe Secret Key</label>
                  <input type="password" defaultValue="sk_live_xxxxxxxxxxxx" className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Stripe Webhook Secret</label>
                  <input type="password" defaultValue="whsec_xxxxxxxxxxxx" className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm" />
                </div>
              </div>
            )}
            
            {activeTab !== "auth" && activeTab !== "payment" && (
              <div className="py-8 text-center border-2 border-dashed border-slate-100 rounded-lg">
                <p className="text-sm text-slate-500">Settings for this category are being built.</p>
                <button className="mt-3 text-sm font-medium text-blue-600 hover:underline">Edit Settings</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
