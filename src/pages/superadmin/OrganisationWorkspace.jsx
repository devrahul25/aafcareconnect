import React, { useState, useEffect } from "react";
import { useLocation, Link, useParams } from "react-router-dom";
import PageHeader from "@/components/ui/PageHeader";
import { Building2, Users, BookOpen, CheckCircle2, Award, PieChart, CreditCard, Settings, ChevronLeft } from "lucide-react";

import OrgStaff from "../orgadmin/Staff";
import OrgLearners from "../orgadmin/Learners";
import OrgSettings from "../orgadmin/OrganisationSettings";
import { apiClient } from "@/api/apiClient";

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
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrgMetrics = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/dashboard/organization/${orgId}`);
        setMetrics(res.data.data);
      } catch (err) {
        console.error("Failed to fetch organization metrics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrgMetrics();
  }, [orgId]);

  const orgName = metrics?.organization?.name || "Loading Organization...";
  const subscriptionStatus = metrics?.organization?.subscriptions?.[0]?.status || "UNKNOWN";

  const renderTabContent = () => {
    if (loading) {
      return <div className="p-12 text-center text-slate-500">Loading organization data...</div>;
    }

    switch(activeTab) {
      case "overview":
        return (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-600">Active Learners</h3>
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600"><Users size={16}/></div>
              </div>
              <p className="font-heading font-bold text-2xl text-slate-900 leading-none">{metrics?.activeLearners || 0}</p>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-600">Active Staff</h3>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600"><Building2 size={16}/></div>
              </div>
              <p className="font-heading font-bold text-2xl text-slate-900 leading-none">{metrics?.activeStaff || 0}</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-600">Compliance</h3>
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600"><CheckCircle2 size={16}/></div>
              </div>
              <p className="font-heading font-bold text-2xl text-slate-900 leading-none">{metrics?.complianceScore || 0}%</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-600">Course Completions</h3>
                <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600"><BookOpen size={16}/></div>
              </div>
              <p className="font-heading font-bold text-2xl text-slate-900 leading-none">{metrics?.courseCompletions || 0}</p>
            </div>
          </div>
        );
      case "staff":
        return <OrgStaff orgId={orgId} />;
      case "learners":
        return <OrgLearners orgId={orgId} />;
      case "settings":
        return <OrgSettings orgId={orgId} />;
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
              <span className={`px-2.5 py-1 text-xs font-bold border rounded-md uppercase tracking-wider ${
                subscriptionStatus === 'ACTIVE' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                {subscriptionStatus}
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
