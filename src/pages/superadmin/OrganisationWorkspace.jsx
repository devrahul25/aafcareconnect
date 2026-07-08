import React, { useState } from "react";
import { useLocation, Link, useParams } from "react-router-dom";
import PageHeader from "@/components/ui/PageHeader";
import { Building2, Users, BookOpen, CheckCircle2, Award, PieChart, CreditCard, Settings, ChevronLeft } from "lucide-react";

// Import existing Org Admin views to reuse
import OrgStaff from "../orgadmin/Staff";
import OrgLearners from "../orgadmin/Learners";
import OrgSettings from "../orgadmin/OrganisationSettings";
// Note: Some of these might need slight adjustments to accept orgId prop if they fetch data
// But for mock frontend, they will just render identically.

const TABS = [
  { id: "overview", label: "Overview", icon: Building2 },
  { id: "staff", label: "Staff", icon: Users },
  { id: "learners", label: "Learners", icon: Users },
  { id: "courses", label: "Courses", icon: BookOpen },
  { id: "compliance", label: "Compliance", icon: CheckCircle2 },
  { id: "certificates", label: "Certificates", icon: Award },
  { id: "reports", label: "Reports", icon: PieChart },
  { id: "subscription", label: "Subscription", icon: CreditCard },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function OrganisationWorkspace() {
  const { orgId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  // In a real app, we would fetch the org details based on orgId.
  const orgName = orgId === "1" ? "Eserve Social Care" : 
                  orgId === "2" ? "Horizon Fostering" : 
                  "Oakwood Care Homes";

  const renderTabContent = () => {
    switch(activeTab) {
      case "overview":
        return <div className="p-6 text-center text-slate-500">Overview Dashboard (Reuses Org Dashboard components)</div>;
      case "staff":
        return <OrgStaff />;
      case "learners":
        return <OrgLearners />;
      case "settings":
        return <OrgSettings />;
      default:
        return (
          <div className="p-12 flex flex-col items-center justify-center text-slate-500 bg-white rounded-xl border border-slate-200 shadow-sm mt-6">
            <Building2 size={48} className="text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">Module Active</h3>
            <p className="text-sm">This reuses the Organisation Admin '{activeTab}' module seamlessly.</p>
          </div>
        );
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1440px] mx-auto">
      <div>
        <Link to="/superadmin/organisations" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-4">
          <ChevronLeft size={16} /> Back to Organisations
        </Link>
        <PageHeader 
          title={orgName} 
          subtitle="Super Admin Organisation Workspace"
          actions={
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                Active Subscription
              </span>
            </div>
          }
        />
      </div>

      <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-slate-200 no-scrollbar">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id 
                ? "border-blue-600 text-blue-700 bg-blue-50/50" 
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {renderTabContent()}
      </div>
    </div>
  );
}
