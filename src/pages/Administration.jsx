// @ts-nocheck
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Settings, Users, Building2, Bell, Plus, X,
  Mail, Edit3, Search, Download, Shield, Clock, AlertTriangle, CheckCircle2
} from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import PageHeader from "@/components/ui/PageHeader";
import UserDrawerEnhanced from "@/components/admin/UserDrawerEnhanced";
import AuditLog from "@/components/admin/AuditLog";
import { getWorkforceMembers, getCPDCertificates } from "@/lib/orgData";
import { DEMO_PLATFORM_USERS, DEMO_PLATFORM_ALERTS, getAgencyMetrics as getDemoMetrics, DEMO_ORGANISATION } from "@/lib/platformStore";

const MODULES = [
  { name: "Dashboard",             phase: 1, enabled: true,  key: "dashboard"      },
  { name: "Learning Hub",          phase: 1, enabled: true,  key: "learning"       },
  { name: "CPD & Certificates",    phase: 1, enabled: true,  key: "cpd"            },
  { name: "Course Builder",        phase: 1, enabled: true,  key: "course_builder" },
  { name: "Professional Passport", phase: 1, enabled: true,  key: "passport"       },
  { name: "Compliance Hub",        phase: 1, enabled: true,  key: "compliance"     },
  { name: "Form F Hub",            phase: 2, enabled: false, key: "form_f"         },
  { name: "Recruitment CRM",       phase: 3, enabled: false, key: "crm"            },
  { name: "Workforce ERP",         phase: 3, enabled: false, key: "erp"            },
  { name: "AI Assistant",          phase: 3, enabled: false, key: "ai"             },
];

const ROLE_LABELS = {
  administrator: "Administrator", manager: "Manager", learner: "Learner",
  trainer: "Trainer", responsible_individual: "Responsible Individual",
};
const ROLE_BADGE = {
  administrator: "badge-violet", manager: "badge-blue", learner: "badge-slate",
  trainer: "badge-green", responsible_individual: "badge-red",
};
const RISK_CFG = {
  low:    { dot: "bg-emerald-500", text: "text-emerald-600", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  medium: { dot: "bg-amber-500",  text: "text-amber-600",   badge: "bg-amber-50 text-amber-700 border-amber-200"       },
  high:   { dot: "bg-red-500",    text: "text-red-600",     badge: "bg-red-50 text-red-700 border-red-200"             },
};

const TABS = ["users","audit","organisation","modules","notifications"];
const TAB_LABELS = { users: "Users & Compliance", audit: "Audit Log", organisation: "Organisation", modules: "Module Settings", notifications: "Notifications" };

// Derive a display-friendly user row from a live WorkforceMember record
function memberToRow(m) {
  const initials = m.full_name?.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase() || "??";
  const colors = ["bg-blue-600","bg-emerald-600","bg-violet-600","bg-amber-500","bg-rose-600","bg-indigo-600","bg-teal-600","bg-pink-600"];
  const avatarColor = colors[m.full_name?.charCodeAt(0) % colors.length] || "bg-slate-600";
  return {
    id: m.id,
    name: m.full_name,
    email: m.email,
    avatar: initials,
    avatarColor,
    orgRole: m.role_type || "learner",
    status: m.status || "active",
    complianceScore: 0,
    cpdHours: 0,
    certificates: 0,
    mandatoryPct: 0,
    riskLevel: "low",
    lastActivity: "—",
    _raw: m,
  };
}

export default function Administration() {
  const { user, organisationId, organisation } = /** @type {any} */ (useOutletContext() || {});
  const [tab,        setTab]        = useState("users");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [selected,   setSelected]   = useState(null);
  const [modules,    setModules]    = useState(MODULES);
  const [search,     setSearch]     = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [users,      setUsers]      = useState([]);
  const [metrics,    setMetrics]    = useState({ total:0, fullyCompliant:0, highRisk:0, expiring:0, expired:0, avgCompliance:0 });
  const [loading,    setLoading]    = useState(true);
  const [isDemo,     setIsDemo]     = useState(false);

  useEffect(() => {
    if (!organisationId) {
      setUsers(DEMO_PLATFORM_USERS);
      setMetrics(getDemoMetrics());
      setIsDemo(true);
      setLoading(false);
      return;
    }
    Promise.all([getWorkforceMembers(organisationId), getCPDCertificates(organisationId)])
      .then(([members, certs]) => {
        const rows = members.map(memberToRow);
        // Patch CPD hours + certificate counts per user
        rows.forEach(r => {
          const userCerts = certs.filter(c => c.user_id === r._raw.created_by_id || c.user_id === r.id);
          r.certificates = userCerts.length;
          r.cpdHours     = userCerts.reduce((s, c) => s + (c.cpd_hours || 0), 0);
        });
        setUsers(rows);
        setMetrics({
          total: rows.length,
          fullyCompliant: 0,
          highRisk: 0,
          expiring: certs.filter(c => c.status === "expiring_soon").length,
          expired:  certs.filter(c => c.status === "expired").length,
          avgCompliance: 0,
        });
        setIsDemo(false);
      })
      .catch(() => {
        setUsers(DEMO_PLATFORM_USERS);
        setMetrics(getDemoMetrics());
        setIsDemo(true);
      })
      .finally(() => setLoading(false));
  }, [organisationId]);

  const unread = isDemo ? DEMO_PLATFORM_ALERTS.filter(a => !a.read).length : 0;
  const orgDisplay = organisation || DEMO_ORGANISATION;

  const filteredUsers = users.filter(u => {
    const ms = (u.name || u.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
               (u.email || "").toLowerCase().includes(search.toLowerCase());
    const mr = riskFilter === "all" || u.riskLevel === riskFilter;
    return ms && mr;
  });

  const toggleModule = (key) => {
    setModules(m => m.map(mod => mod.key === key && mod.phase === 1 ? { ...mod, enabled: !mod.enabled } : mod));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5 animate-fade-in max-w-[1400px] mx-auto">
      <PageHeader
        title="Administration"
        subtitle="Manage users, compliance, modules and organisation settings"
        actions={
          tab === "users" ? (
            <div className="flex gap-2">
              <button className="h-9 px-4 text-sm font-semibold bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors">
                <Download size={14} /> Export Report
              </button>
              <button onClick={() => setInviteOpen(true)} className="h-9 px-4 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-2 transition-colors">
                <Plus size={14} /> Invite User
              </button>
            </div>
          ) : null
        }
      />

      {/* Sync / demo banner */}
      <div className={`flex items-center gap-3 px-4 py-2.5 border rounded-xl text-xs ${isDemo ? "bg-amber-50 border-amber-100" : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100"}`}>
        <span className={`font-bold ${isDemo ? "text-amber-600" : "text-blue-600"}`}>{isDemo ? "⚠ Demo Mode" : "🔄 Connected Platform"}</span>
        <span className="text-slate-500">{isDemo ? "No organisation linked yet — showing demo data." : "All user data, compliance scores and certificates sync automatically across all modules."}</span>
        {unread > 0 && (
          <span className="ml-auto text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 rounded-full px-2 py-0.5 flex-shrink-0">
            {unread} unread platform alerts
          </span>
        )}
      </div>

      {/* Agency KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Staff",       value: metrics.total,          icon: Users,         bg: "bg-blue-600"    },
          { label: "Fully Compliant",   value: metrics.fullyCompliant, icon: CheckCircle2,  bg: "bg-emerald-600" },
          { label: "High Risk",         value: metrics.highRisk,       icon: AlertTriangle, bg: "bg-red-600"     },
          { label: "Certs Expiring",    value: metrics.expiring,       icon: Clock,         bg: "bg-amber-500"   },
          { label: "Agency Compliance", value: `${metrics.avgCompliance}%`, icon: Shield,  bg: "bg-indigo-600"  },
        ].map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="card p-4">
              <div className={`w-8 h-8 rounded-lg ${k.bg} flex items-center justify-center mb-2`}><Icon size={15} className="text-white" /></div>
              <p className="text-xl font-heading font-bold text-slate-900">{k.value}</p>
              <p className="text-[11px] font-semibold text-slate-500">{k.label}</p>
              <p className={`text-[9px] font-bold mt-0.5 ${isDemo ? "text-amber-500" : "text-emerald-600"}`}>{isDemo ? "⚠ Demo" : "⚡ Live Data"}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-slate-200 overflow-x-auto">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px whitespace-nowrap ${tab === t ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {/* USERS tab */}
      {tab === "users" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-48">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users…"
                className="w-full h-9 pl-9 pr-3 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400" />
            </div>
            <div className="flex gap-1.5">
              {[["all","All"],["low","Low Risk"],["medium","Med Risk"],["high","High Risk"]].map(([k,l]) => (
                <button key={k} onClick={() => setRiskFilter(k)}
                  className={`h-9 px-3 text-xs font-semibold rounded-lg border transition-all ${riskFilter === k ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"}`}>
                  {l}
                </button>
              ))}
            </div>
            <span className="text-xs text-slate-400 font-medium">{filteredUsers.length} users</span>
          </div>

          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {["User","Role","Compliance","CPD Hrs","Certs","Mandatory %","Risk Level","Last Active",""].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map(u => {
                  const r = RISK_CFG[u.riskLevel] || RISK_CFG.low;
                  const scoreColor = (u.complianceScore||0) >= 90 ? "text-emerald-600" : (u.complianceScore||0) >= 75 ? "text-amber-600" : "text-red-600";
                  return (
                    <tr key={u.id} onClick={() => setSelected(u)} className="hover:bg-blue-50/30 cursor-pointer group transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full ${u.avatarColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>{u.avatar}</div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{u.name || u.full_name}</p>
                            <p className="text-[10px] text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5"><span className={`badge ${ROLE_BADGE[u.orgRole] || "badge-slate"}`}>{ROLE_LABELS[u.orgRole] || u.orgRole}</span></td>
                      <td className="px-4 py-3.5"><span className={`text-sm font-bold ${scoreColor}`}>{u.complianceScore ?? "—"}%</span></td>
                      <td className="px-4 py-3.5 text-xs font-semibold text-slate-700">{u.cpdHours}h</td>
                      <td className="px-4 py-3.5 text-xs font-semibold text-slate-700">{u.certificates}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${(u.mandatoryPct||0) === 100 ? "bg-emerald-500" : (u.mandatoryPct||0) >= 80 ? "bg-amber-400" : "bg-red-500"}`} style={{ width: `${u.mandatoryPct||0}%` }} />
                          </div>
                          <span className="text-xs font-semibold text-slate-600">{u.mandatoryPct ?? 0}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${r.badge}`}>
                          <span className={`inline-block w-1.5 h-1.5 rounded-full ${r.dot} mr-1`} />
                          {u.riskLevel || "low"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-500">{u.lastActivity}</td>
                      <td className="px-4 py-3.5">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all">
                          <Edit3 size={13} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredUsers.length === 0 && (
                  <tr><td colSpan={9} className="px-4 py-12 text-center text-slate-400 text-sm">No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "audit" && <AuditLog />}

      {tab === "organisation" && (
        <div className="max-w-2xl space-y-5">
          <div className="card p-6 space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-heading font-bold text-xl">AAF</div>
              <div className="flex-1">
                <p className="font-heading font-bold text-lg text-slate-900">{orgDisplay.name}</p>
                <p className="text-sm text-slate-500">{orgDisplay.type} · Ofsted No. {orgDisplay.ofstedNumber || orgDisplay.ofsted_number || "—"}</p>
              </div>
              <button className="h-8 px-3 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 transition-colors">
                <Edit3 size={12} /> Edit
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {[
                { icon: Mail,      label: "Email",   value: orgDisplay.email   },
                { icon: Building2, label: "Address", value: orgDisplay.address },
              ].map(s => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <Icon size={14} className="text-slate-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-400">{s.label}</p>
                      <p className="text-sm font-medium text-slate-900">{s.value || "—"}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {tab === "modules" && (
        <div className="max-w-2xl space-y-4">
          <div className="card p-5 space-y-3">
            <h3 className="font-heading font-bold text-slate-900 mb-1">Active Modules</h3>
            {modules.filter(m => m.phase === 1).map(mod => (
              <div key={mod.key} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-slate-700">{mod.name}</p>
                  <p className="text-xs text-slate-400">Phase {mod.phase} · {mod.enabled ? "Active" : "Disabled"}</p>
                </div>
                <div onClick={() => toggleModule(mod.key)}
                  className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${mod.enabled ? "bg-blue-600" : "bg-slate-200"}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${mod.enabled ? "right-0.5" : "left-0.5"}`} />
                </div>
              </div>
            ))}
          </div>
          <div className="card p-5 space-y-3">
            <h3 className="font-heading font-bold text-slate-900 mb-1">Upcoming Modules</h3>
            {modules.filter(m => m.phase > 1).map(mod => (
              <div key={mod.key} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl opacity-50">
                <div>
                  <p className="text-sm font-semibold text-slate-700">{mod.name}</p>
                  <p className="text-xs text-slate-400">Phase {mod.phase} · Coming soon</p>
                </div>
                <span className="badge badge-slate text-[10px]">Locked</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "notifications" && (
        <div className="max-w-2xl space-y-4">
          <div className="card p-5 space-y-3">
            <h3 className="font-heading font-bold text-slate-900">Email Reminders</h3>
            {[
              { label: "Certificate expiry reminder",    desc: "Send 90, 60 and 30 days before expiry",          on: true  },
              { label: "Training overdue alert",         desc: "Notify manager when learner is 7+ days overdue", on: true  },
              { label: "Course completion notification", desc: "Confirm to learner and manager on completion",    on: true  },
              { label: "New enrolment welcome email",    desc: "Welcome email when a learner is enrolled",        on: true  },
              { label: "Weekly compliance digest",       desc: "Summary email every Monday morning",              on: false },
              { label: "High risk staff alert",          desc: "Immediate alert when staff becomes high risk",    on: true  },
            ].map((n) => (
              <div key={n.label} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-slate-700">{n.label}</p>
                  <p className="text-xs text-slate-400">{n.desc}</p>
                </div>
                <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${n.on ? "bg-blue-600" : "bg-slate-200"}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${n.on ? "right-0.5" : "left-0.5"}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {inviteOpen && <InviteModal onClose={() => setInviteOpen(false)} />}
      {selected && <UserDrawerEnhanced user={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function InviteModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-heading font-bold text-slate-900">Invite User</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200"><X size={15} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="field-label">Email Address *</label>
            <input type="email" placeholder="user@agency.co.uk" className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="field-label">Full Name</label>
            <input placeholder="e.g. Emma Clarke" className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="field-label">Role *</label>
            <select className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700">
              <option value="learner">Learner</option>
              <option value="manager">Manager</option>
              <option value="trainer">Trainer</option>
              <option value="administrator">Administrator</option>
            </select>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700">
            An invitation email will be sent. The new user will automatically appear in Compliance Hub and Professional Passport.
          </div>
        </div>
        <div className="p-6 border-t border-slate-100 flex gap-3">
          <button onClick={onClose} className="flex-1 h-9 text-sm font-semibold border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
          <button onClick={onClose} className="flex-1 h-9 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors flex items-center justify-center gap-2">
            <Mail size={13} /> Send Invitation
          </button>
        </div>
      </div>
    </div>
  );
}