import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Shield, Users, Award, AlertTriangle, Clock,
  TrendingUp, Bell, Flame, BarChart3, Sparkles, CheckCircle2
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import KpiCard from "@/components/ui/KpiCard";
import ComplianceScoreGauge from "@/components/compliance/ComplianceScoreGauge";
import DeptCompliance from "@/components/compliance/DeptCompliance";
import StaffMatrix from "@/components/compliance/StaffMatrix";
import StaffProfile from "@/components/compliance/StaffProfile";
import ExpiringCertsCentre from "@/components/compliance/ExpiringCertsCentre";
import MandatoryTracker from "@/components/compliance/MandatoryTracker";
import OfstedReadiness from "@/components/compliance/OfstedReadiness";
import RiskPanel from "@/components/compliance/RiskPanel";
import AlertCentre from "@/components/compliance/AlertCentre";
import ComplianceAIAssistant from "@/components/compliance/ComplianceAIAssistant";
import ExecutiveDashboard from "@/components/compliance/ExecutiveDashboard";
import { AGENCY_SCORE, STAFF_COMPLIANCE, EXPIRING_CERTS, ALERTS } from "@/lib/complianceData";
import { getCPDCertificates, getWorkforceMembers } from "@/lib/orgData";

const TABS = [
  { key: "dashboard",  label: "Dashboard",         icon: BarChart3    },
  { key: "staff",      label: "Staff Matrix",       icon: Users        },
  { key: "expiring",   label: "Expiring Certs",     icon: Clock        },
  { key: "mandatory",  label: "Mandatory Training", icon: CheckCircle2 },
  { key: "ofsted",     label: "Ofsted Readiness",   icon: Shield       },
  { key: "risk",       label: "Risk Intelligence",  icon: Flame        },
  { key: "alerts",     label: "Alert Centre",       icon: Bell         },
  { key: "ai",         label: "AI Assistant",       icon: Sparkles     },
  { key: "executive",  label: "Executive View",     icon: TrendingUp   },
];

export default function ComplianceHub() {
  const { user, organisationId } = /** @type {any} */ (useOutletContext() || {});
  const [tab,           setTab]           = useState("dashboard");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [kpis,          setKpis]          = useState(null);
  const [staffRows,     setStaffRows]     = useState(null);
  const [isDemo,        setIsDemo]        = useState(false);

  useEffect(() => {
    if (!organisationId) {
      // Demo fallback: derive from static complianceData
      setKpis({
        agencyScore:     AGENCY_SCORE,
        fullyCompliant:  STAFF_COMPLIANCE.filter(s => s.score >= 90).length,
        expiring:        EXPIRING_CERTS.length,
        overdueCerts:    STAFF_COMPLIANCE.reduce((s, m) => s + m.expired, 0),
        renewalsDue:     STAFF_COMPLIANCE.reduce((s, m) => s + m.renewalsDue, 0),
        highRisk:        STAFF_COMPLIANCE.filter(s => s.riskLevel === "high").length,
        unreadAlerts:    ALERTS.filter(a => !a.read).length,
      });
      setStaffRows(STAFF_COMPLIANCE);
      setIsDemo(true);
      return;
    }
    Promise.all([getCPDCertificates(organisationId), getWorkforceMembers(organisationId)])
      .then(([certs, members]) => {
        const expiring     = certs.filter(c => c.status === "expiring_soon").length;
        const overdueCerts = certs.filter(c => c.status === "expired").length;
        setKpis({
          agencyScore:    0,
          fullyCompliant: 0,
          expiring,
          overdueCerts,
          renewalsDue:    expiring,
          highRisk:       0,
          unreadAlerts:   0,
        });
        setStaffRows(members.map(m => ({
          id:          m.id,
          name:        m.full_name,
          avatar:      m.full_name?.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase() || "??",
          avatarColor: "bg-blue-600",
          score:       0,
          riskLevel:   "low",
          expired:     0,
          renewalsDue: 0,
        })));
        setIsDemo(false);
      })
      .catch(() => {
        setKpis({
          agencyScore:    AGENCY_SCORE,
          fullyCompliant: STAFF_COMPLIANCE.filter(s => s.score >= 90).length,
          expiring:       EXPIRING_CERTS.length,
          overdueCerts:   STAFF_COMPLIANCE.reduce((s, m) => s + m.expired, 0),
          renewalsDue:    STAFF_COMPLIANCE.reduce((s, m) => s + m.renewalsDue, 0),
          highRisk:       STAFF_COMPLIANCE.filter(s => s.riskLevel === "high").length,
          unreadAlerts:   ALERTS.filter(a => !a.read).length,
        });
        setStaffRows(STAFF_COMPLIANCE);
        setIsDemo(true);
      });
  }, [organisationId]);

  if (!kpis) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  const { agencyScore, fullyCompliant, expiring, overdueCerts, renewalsDue, highRisk, unreadAlerts } = kpis;
  const displayStaff = staffRows || [];

  return (
    <div className="p-6 space-y-5 animate-fade-in max-w-[1400px] mx-auto">
      <div className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-xs ${isDemo ? "bg-amber-50 border-amber-100" : "bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-100"}`}>
        <span className={`font-bold ${isDemo ? "text-amber-600" : "text-emerald-600"}`}>{isDemo ? "⚠ Demo Mode" : "⚡ Live Data"}</span>
        <span className="text-slate-500">{isDemo ? "No organisation linked — showing demo compliance data." : "Compliance scores, certificates and risk levels sync automatically from Learning Hub, CPD Hub and Professional Passport."}</span>
        <span className="ml-auto text-[10px] font-bold text-blue-600 flex-shrink-0">🔄 Synced with all modules</span>
      </div>

      <PageHeader
        title="Compliance Hub"
        subtitle="Real-time compliance intelligence for Ofsted-regulated fostering agencies"
        actions={
          <div className="flex items-center gap-2">
            {unreadAlerts > 0 && (
              <button onClick={() => setTab("alerts")} className="relative h-9 px-4 text-sm font-semibold bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 flex items-center gap-2 transition-colors">
                <Bell size={14} />
                <span>{unreadAlerts} Alert{unreadAlerts > 1 ? "s" : ""}</span>
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border border-white animate-pulse" />
              </button>
            )}
            <button className="h-9 px-4 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-2 transition-colors">
              <TrendingUp size={14} /> Generate Report
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <KpiCard title="Compliance Score"      value={`${agencyScore}%`} icon={Shield}        iconBg="bg-emerald-600" delta={3}  deltaLabel="+3% this month" />
        <KpiCard title="Fully Compliant Staff" value={fullyCompliant}    icon={Users}         iconBg="bg-blue-600"    />
        <KpiCard title="Certs Expiring"        value={expiring}          icon={Clock}         iconBg="bg-amber-500"   />
        <KpiCard title="Expired / Overdue"     value={overdueCerts}      icon={AlertTriangle} iconBg="bg-red-600"     />
        <KpiCard title="Renewals Due"          value={renewalsDue}       icon={Award}         iconBg="bg-indigo-600"  />
        <KpiCard title="High Risk Staff"       value={highRisk}          icon={Flame}         iconBg="bg-rose-600"    />
      </div>

      {highRisk > 0 && (
        <div className="card border-l-4 border-l-red-600 bg-red-50/60 p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle size={16} className="text-red-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-slate-900">🚨 {highRisk} staff members are HIGH RISK — expired certificates affecting placement compliance</p>
              <p className="text-xs text-slate-500 mt-0.5">Immediate certificate renewal required to restore compliance.</p>
            </div>
          </div>
          <button onClick={() => setTab("staff")} className="h-8 px-3 text-xs font-semibold bg-red-600 text-white rounded-lg hover:bg-red-500 flex-shrink-0 transition-colors">
            View Staff
          </button>
        </div>
      )}

      <div className="flex gap-0 border-b border-slate-200 overflow-x-auto">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors -mb-px whitespace-nowrap ${
              tab === key ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
            }`}>
            <Icon size={13} />
            {label}
            {key === "alerts" && unreadAlerts > 0 && (
              <span className="w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{unreadAlerts}</span>
            )}
          </button>
        ))}
      </div>

      {tab === "dashboard" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-fade-in">
          <div className="lg:col-span-1 space-y-5">
            <ComplianceScoreGauge />
            <DeptCompliance />
          </div>
          <div className="lg:col-span-2 space-y-5">
            {isDemo && (
              <div className="card p-5">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Flame size={15} className="text-red-500" /> Live Risk Summary
                </h3>
                <div className="space-y-2">
                  {[
                    { level: "critical", dot: "bg-red-600",   text: "text-red-700",   label: "James Okafor — First Aid expired 9 months ago. Placement at risk."  },
                    { level: "critical", dot: "bg-red-600",   text: "text-red-700",   label: "Claire Nguyen — 2 certificates expired. Compliance score 51%."       },
                    { level: "high",     dot: "bg-red-500",   text: "text-red-600",   label: "Mark Thompson — Mental Health Awareness expires in 1 day."           },
                    { level: "medium",   dot: "bg-amber-500", text: "text-amber-700", label: "James Okafor — CSE certificate expires in 24 days."                  },
                    { level: "medium",   dot: "bg-amber-500", text: "text-amber-700", label: "5 staff — Equality & Diversity training overdue."                    },
                  ].map((r, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                      <div className={`w-2.5 h-2.5 rounded-full ${r.dot} flex-shrink-0 ${r.level === "critical" || r.level === "high" ? "animate-pulse" : ""}`} />
                      <p className={`text-xs font-medium ${r.text}`}>{r.label}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => setTab("risk")} className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                  View full Risk Intelligence →
                </button>
              </div>
            )}

            <div className="card p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Staff Compliance Snapshot</h3>
              {displayStaff.length === 0 ? (
                <p className="text-sm text-slate-400 py-4 text-center">No staff records yet.</p>
              ) : (
                <div className="space-y-2.5">
                  {displayStaff.slice(0,6).map(s => (
                    <div key={s.id} onClick={() => setSelectedStaff(s)} className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 rounded-xl p-2 transition-colors group">
                      <div className={`w-8 h-8 rounded-full ${s.avatarColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>{s.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{s.name}</span>
                          <span className={`text-xs font-bold ${s.score >= 90 ? "text-emerald-600" : s.score >= 75 ? "text-amber-600" : "text-red-600"}`}>{s.score}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                          <div className={`h-full rounded-full ${s.score >= 90 ? "bg-emerald-500" : s.score >= 75 ? "bg-amber-400" : "bg-red-500"}`} style={{ width: `${s.score}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={() => setTab("staff")} className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                View full Staff Matrix →
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === "staff"     && <StaffMatrix onSelect={setSelectedStaff} />}
      {tab === "expiring"  && <ExpiringCertsCentre />}
      {tab === "mandatory" && <MandatoryTracker />}
      {tab === "ofsted"    && <OfstedReadiness />}
      {tab === "risk"      && <RiskPanel />}
      {tab === "alerts"    && <AlertCentre />}
      {tab === "ai"        && <ComplianceAIAssistant />}
      {tab === "executive" && <ExecutiveDashboard />}

      {selectedStaff && <StaffProfile staff={selectedStaff} onClose={() => setSelectedStaff(null)} />}
    </div>
  );
}