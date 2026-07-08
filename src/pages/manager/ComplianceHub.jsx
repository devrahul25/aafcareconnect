import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import { Shield, AlertTriangle, CheckCircle2, AlertOctagon, Download } from "lucide-react";

export default function ComplianceHub() {
  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1440px] mx-auto">
      <PageHeader 
        title="Team Compliance Hub" 
        subtitle="Monitor mandatory training and compliance status for your assigned learners"
        actions={
          <button className="h-9 px-4 text-sm font-semibold bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors">
            <Download size={14}/> Export Report
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5 border-t-4 border-t-emerald-500">
          <div className="flex items-center gap-3 mb-2">
            <Shield size={18} className="text-emerald-500" />
            <h3 className="font-bold text-slate-700">Team Compliance</h3>
          </div>
          <p className="text-3xl font-heading font-bold text-slate-900">92%</p>
          <p className="text-xs text-slate-500 mt-1">Average across all learners</p>
        </div>
        <div className="card p-5 border-t-4 border-t-amber-500">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle size={18} className="text-amber-500" />
            <h3 className="font-bold text-slate-700">Expiring Soon</h3>
          </div>
          <p className="text-3xl font-heading font-bold text-slate-900">3</p>
          <p className="text-xs text-slate-500 mt-1">Certificates within 30 days</p>
        </div>
        <div className="card p-5 border-t-4 border-t-red-500">
          <div className="flex items-center gap-3 mb-2">
            <AlertOctagon size={18} className="text-red-500" />
            <h3 className="font-bold text-slate-700">Overdue Training</h3>
          </div>
          <p className="text-3xl font-heading font-bold text-slate-900">2</p>
          <p className="text-xs text-slate-500 mt-1">Mandatory courses overdue</p>
        </div>
        <div className="card p-5 border-t-4 border-t-blue-500">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 size={18} className="text-blue-500" />
            <h3 className="font-bold text-slate-700">Fully Compliant</h3>
          </div>
          <p className="text-3xl font-heading font-bold text-slate-900">11</p>
          <p className="text-xs text-slate-500 mt-1">Learners at 100%</p>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-900">High Risk Learners</h3>
          <p className="text-xs text-slate-500 mt-0.5">Learners requiring immediate attention</p>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-start justify-between p-4 border border-red-100 bg-red-50/30 rounded-xl">
            <div>
              <h4 className="font-semibold text-slate-900">David Miller</h4>
              <p className="text-sm text-slate-600 mt-1">Safeguarding Children Level 2 is <span className="font-semibold text-red-600">overdue by 14 days</span>.</p>
            </div>
            <button className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded shadow-sm hover:bg-slate-50">
              Send Reminder
            </button>
          </div>
          <div className="flex items-start justify-between p-4 border border-amber-100 bg-amber-50/30 rounded-xl">
            <div>
              <h4 className="font-semibold text-slate-900">Emma Watson</h4>
              <p className="text-sm text-slate-600 mt-1">First Aid in Social Care expires in <span className="font-semibold text-amber-600">5 days</span>.</p>
            </div>
            <button className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded shadow-sm hover:bg-slate-50">
              Send Reminder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
