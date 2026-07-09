import { useState, useEffect } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import {
  Users, BookOpen, CheckCircle2, Clock, AlertTriangle,
  TrendingUp, Award, ArrowRight, Download, UserPlus, Play,
  Building2, Library, Bell
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { getAgencyMetrics, getCPDCertificates } from "@/lib/orgData";
import { DEMO_PLATFORM_USERS, DEMO_ALL_CERTIFICATES, DEMO_PLATFORM_ALERTS, getAgencyMetrics as getDemoMetrics } from "@/lib/platformStore";
import { tokenStorage } from "@/api/apiClient";

// ─── Chart data (static — not org-specific) ───────────────────────────────────
const TREND_DATA = [
  { month: "Jan", completed: 38, assigned: 52 },
  { month: "Feb", completed: 44, assigned: 58 },
  { month: "Mar", completed: 51, assigned: 63 },
  { month: "Apr", completed: 47, assigned: 60 },
  { month: "May", completed: 62, assigned: 71 },
  { month: "Jun", completed: 58, assigned: 68 },
];
const EXPIRY_DATA = [
  { month: "Jul", expiring: 3 },
  { month: "Aug", expiring: 7 },
  { month: "Sep", expiring: 4 },
  { month: "Oct", expiring: 2 },
];
const COMPLIANCE = [
  { label: "Safeguarding",          pct: 94 },
  { label: "First Aid",             pct: 82 },
  { label: "Mental Health",         pct: 76 },
  { label: "Fostering Legislation", pct: 96 },
];

function pctColor(pct) {
  if (pct >= 90) return "bg-emerald-500";
  if (pct >= 75) return "bg-amber-400";
  return "bg-red-500";
}
function pctText(pct) {
  if (pct >= 90) return "text-emerald-600";
  if (pct >= 75) return "text-amber-600";
  return "text-red-600";
}

export default function Dashboard() {
  const { user, organisationId } = /** @type {any} */ (useOutletContext() || {});
  const { hasRole } = useAuth();
  const name = user?.full_name?.split(" ")[0] || "there";
  const isSuperAdmin = hasRole("super_admin");
  const isOrgAdmin = hasRole("org_admin") && !isSuperAdmin;
  const isManager = hasRole("manager") && !isOrgAdmin && !isSuperAdmin;
  const isTrainer = hasRole("trainer") && !isManager && !isOrgAdmin && !isSuperAdmin;
  const isLearner = !isSuperAdmin && !isOrgAdmin && !isManager && !isTrainer;

  const [metrics, setMetrics] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [superAdminMetrics, setSuperAdminMetrics] = useState(null);

  useEffect(() => {
    if (isSuperAdmin) {
      fetch('/api/v1/dashboard/superadmin', {
        headers: { 'Authorization': `Bearer ${tokenStorage.getAccessToken()}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSuperAdminMetrics(data.data);
        }
      })
      .catch(err => console.error("Failed to fetch superadmin metrics:", err))
      .finally(() => setLoading(false));
      return;
    }

    if (isManager || isTrainer || isLearner) {
      setLoading(false);
      return;
    }
    
    if (!organisationId) {
      // Demo fallback
      const m = getDemoMetrics();
      setMetrics(m);
      setActivity(buildDemoActivity());
      setLoading(false);
      return;
    }
    getAgencyMetrics(organisationId)
      .then(m => {
        setMetrics(m);
        setActivity([]);
      })
      .catch(() => {
        setMetrics(getDemoMetrics());
        setActivity(buildDemoActivity());
      })
      .finally(() => setLoading(false));
  }, [organisationId, isSuperAdmin]);

  const kpis = metrics ? [
    { label: "Active Learners",       value: String(metrics.total),          icon: Users,         bg: "bg-blue-600",    delta: "+2",     deltaLabel: "this week",    trend: "up"   },
    { label: "Fully Compliant Staff", value: String(metrics.fullyCompliant), icon: CheckCircle2,  bg: "bg-emerald-600", delta: "+1",     deltaLabel: "this month",   trend: "up"   },
    { label: "Certificates Expiring", value: String(metrics.expiring),       icon: AlertTriangle, bg: "bg-amber-500",   delta: "90",     deltaLabel: "days or less", trend: "warn" },
    { label: "Expired / Overdue",     value: String(metrics.expired),        icon: Clock,         bg: "bg-red-500",     delta: "urgent", deltaLabel: "action needed",trend: "down" },
    { label: "High Risk Staff",       value: String(metrics.highRisk),       icon: AlertTriangle, bg: "bg-rose-600",    delta: "urgent", deltaLabel: "action needed",trend: "down" },
    { label: "Compliance %",          value: `${metrics.avgCompliance}%`,    icon: TrendingUp,    bg: "bg-emerald-600", delta: "+3%",    deltaLabel: "vs last month",trend: "up"   },
    { label: "Total CPD Hours",       value: `${metrics.totalCpdHours}h`,    icon: Award,         bg: "bg-violet-600",  delta: "+38h",   deltaLabel: "this month",   trend: "up"   },
  ] : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (isTrainer) {
    return (
      <div className="p-6 space-y-6 animate-fade-in max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-heading font-bold text-2xl text-slate-900">Good morning, {name} 👋</h1>
            <p className="text-slate-500 text-sm mt-0.5">Trainer Dashboard · {new Date().toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-9 px-4 text-sm font-semibold bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors">
              <Download size={14}/> Export Analytics
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <div className="card p-4 flex flex-col gap-3 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-slate-500 leading-tight">Total Courses</p>
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0"><BookOpen size={14} className="text-white"/></div>
            </div>
            <p className="font-heading font-bold text-2xl text-slate-900 leading-none">12</p>
            <div className="flex items-center gap-1"><span className="text-[11px] font-bold text-slate-500">8 published</span></div>
          </div>
          <div className="card p-4 flex flex-col gap-3 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-slate-500 leading-tight">Total Learners</p>
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center flex-shrink-0"><Users size={14} className="text-white"/></div>
            </div>
            <p className="font-heading font-bold text-2xl text-slate-900 leading-none">450</p>
            <div className="flex items-center gap-1"><span className="text-[11px] font-bold text-emerald-600">↑ 12%</span><span className="text-[11px] text-slate-400">vs last month</span></div>
          </div>
          <div className="card p-4 flex flex-col gap-3 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-slate-500 leading-tight">Avg Completion</p>
              <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0"><TrendingUp size={14} className="text-white"/></div>
            </div>
            <p className="font-heading font-bold text-2xl text-slate-900 leading-none">78%</p>
            <div className="flex items-center gap-1"><span className="text-[11px] font-bold text-violet-600">↑ 2%</span><span className="text-[11px] text-slate-400">vs last month</span></div>
          </div>
          <div className="card p-4 flex flex-col gap-3 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-slate-500 leading-tight">Avg Quiz Score</p>
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0"><Award size={14} className="text-white"/></div>
            </div>
            <p className="font-heading font-bold text-2xl text-slate-900 leading-none">85%</p>
            <div className="flex items-center gap-1"><span className="text-[11px] font-bold text-slate-500">across all courses</span></div>
          </div>
          <div className="card p-4 flex flex-col gap-3 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-slate-500 leading-tight">Pending Reviews</p>
              <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center flex-shrink-0"><Clock size={14} className="text-white"/></div>
            </div>
            <p className="font-heading font-bold text-2xl text-slate-900 leading-none">14</p>
            <div className="flex items-center gap-1"><span className="text-[11px] font-bold text-rose-600">action required</span></div>
          </div>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-heading font-bold text-slate-900">Enrolment vs Completion</h2>
                <p className="text-xs text-slate-400 mt-0.5">Learner metrics across all your courses</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={TREND_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradTrainerAssigned" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gradTrainerCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: 12 }}/>
                <Area type="monotone" dataKey="assigned" stroke="#8b5cf6" strokeWidth={2} fill="url(#gradTrainerAssigned)" dot={false}/>
                <Area type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} fill="url(#gradTrainerCompleted)" dot={false}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-slate-900">Recent Course Activity</h2>
            </div>
            <div className="space-y-0">
              <div className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 mt-0.5">SJ</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 leading-snug"><span className="font-semibold text-slate-900">Sarah Jenkins</span> completed your quiz in <span className="font-semibold">First Aid</span></p>
                  <p className="text-[11px] text-slate-400 mt-0.5">10 mins ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 mt-0.5"><Play size={10} fill="currentColor"/></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 leading-snug">New video uploaded to <span className="font-semibold text-slate-900">Safeguarding Children</span></p>
                  <p className="text-[11px] text-slate-400 mt-0.5">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
                <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 mt-0.5"><BookOpen size={10}/></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 leading-snug"><span className="font-semibold text-slate-900">Attachment Theory</span> was published.</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">3 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isManager) {
    return (
      <div className="p-6 space-y-6 animate-fade-in max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-heading font-bold text-2xl text-slate-900">Good morning, {name} 👋</h1>
            <p className="text-slate-500 text-sm mt-0.5">Manager Dashboard · {new Date().toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-9 px-4 text-sm font-semibold bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors">
              <Download size={14}/> Export Team Report
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <div className="card p-4 flex flex-col gap-3 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-slate-500 leading-tight">Assigned Learners</p>
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0"><Users size={14} className="text-white"/></div>
            </div>
            <p className="font-heading font-bold text-2xl text-slate-900 leading-none">14</p>
            <div className="flex items-center gap-1"><span className="text-[11px] font-bold text-emerald-600">↑ 1</span><span className="text-[11px] text-slate-400">new this week</span></div>
          </div>
          <div className="card p-4 flex flex-col gap-3 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-slate-500 leading-tight">Team Compliance</p>
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center flex-shrink-0"><TrendingUp size={14} className="text-white"/></div>
            </div>
            <p className="font-heading font-bold text-2xl text-slate-900 leading-none">92%</p>
            <div className="flex items-center gap-1"><span className="text-[11px] font-bold text-emerald-600">↑ 4%</span><span className="text-[11px] text-slate-400">vs last month</span></div>
          </div>
          <div className="card p-4 flex flex-col gap-3 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-slate-500 leading-tight">Certificates Expiring</p>
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0"><AlertTriangle size={14} className="text-white"/></div>
            </div>
            <p className="font-heading font-bold text-2xl text-slate-900 leading-none">3</p>
            <div className="flex items-center gap-1"><span className="text-[11px] font-bold text-slate-500">within 30 days</span></div>
          </div>
          <div className="card p-4 flex flex-col gap-3 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-slate-500 leading-tight">High Risk Learners</p>
              <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center flex-shrink-0"><AlertTriangle size={14} className="text-white"/></div>
            </div>
            <p className="font-heading font-bold text-2xl text-slate-900 leading-none">1</p>
            <div className="flex items-center gap-1"><span className="text-[11px] font-bold text-rose-600">action required</span></div>
          </div>
          <div className="card p-4 flex flex-col gap-3 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-slate-500 leading-tight">Pending Reviews</p>
              <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0"><Clock size={14} className="text-white"/></div>
            </div>
            <p className="font-heading font-bold text-2xl text-slate-900 leading-none">5</p>
            <div className="flex items-center gap-1"><span className="text-[11px] font-bold text-slate-500">assignments</span></div>
          </div>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-heading font-bold text-slate-900">Team Learning Progress</h2>
                <p className="text-xs text-slate-400 mt-0.5">Assigned vs completed courses</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={TREND_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradMgrAssigned" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gradMgrCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: 12 }}/>
                <Area type="monotone" dataKey="assigned" stroke="#3b82f6" strokeWidth={2} fill="url(#gradMgrAssigned)" dot={false}/>
                <Area type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} fill="url(#gradMgrCompleted)" dot={false}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-slate-900">Recent Team Activity</h2>
            </div>
            <div className="space-y-0">
              <div className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 mt-0.5">SJ</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 leading-snug"><span className="font-semibold text-slate-900">Sarah Jenkins</span> completed <span className="font-semibold">First Aid</span></p>
                  <p className="text-[11px] text-slate-400 mt-0.5">10 mins ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 mt-0.5">DM</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 leading-snug"><span className="font-semibold text-slate-900">David Miller</span> submitted a quiz</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 mt-0.5">EW</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 leading-snug"><span className="font-semibold text-slate-900">Emma Watson</span> has an expiring certificate</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">3 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isSuperAdmin) {
    return (
      <div className="p-6 space-y-6 animate-fade-in max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-heading font-bold text-2xl text-slate-900">Platform Command Center</h1>
            <p className="text-slate-500 text-sm mt-0.5">Overview of platform health, usage, and revenue · {new Date().toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-9 px-4 text-sm font-semibold bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors">
              <Download size={14}/> Generate Report
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/superadmin/organisations" className="card p-4 flex items-center gap-3 hover:border-blue-500 hover:bg-blue-50/30 transition-all group cursor-pointer">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Building2 size={18} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">Create Organisation</div>
              <div className="text-xs text-slate-500">Onboard a new client</div>
            </div>
          </Link>
          <Link to="/superadmin/users" className="card p-4 flex items-center gap-3 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all group cursor-pointer">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Users size={18} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">Invite Platform User</div>
              <div className="text-xs text-slate-500">Add an admin or learner</div>
            </div>
          </Link>
          <Link to="/superadmin/course-library" className="card p-4 flex items-center gap-3 hover:border-violet-500 hover:bg-violet-50/30 transition-all group cursor-pointer">
            <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors">
              <Library size={18} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">Create Course Template</div>
              <div className="text-xs text-slate-500">Add to master library</div>
            </div>
          </Link>
          <Link to="/superadmin/notifications" className="card p-4 flex items-center gap-3 hover:border-amber-500 hover:bg-amber-50/30 transition-all group cursor-pointer">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Bell size={18} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">Send Announcement</div>
              <div className="text-xs text-slate-500">Broadcast to platform</div>
            </div>
          </Link>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="card p-4 flex flex-col gap-3 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-slate-500 leading-tight">Total Organisations</p>
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0"><Building2 size={14} className="text-white"/></div>
            </div>
            <p className="font-heading font-bold text-2xl text-slate-900 leading-none">{superAdminMetrics?.totalOrganizations || 0}</p>
            <div className="flex items-center gap-1"><span className="text-[11px] font-bold text-emerald-600">Live</span><span className="text-[11px] text-slate-400">data</span></div>
          </div>
          <div className="card p-4 flex flex-col gap-3 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-slate-500 leading-tight">Active Learners</p>
              <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0"><Users size={14} className="text-white"/></div>
            </div>
            <p className="font-heading font-bold text-2xl text-slate-900 leading-none">{superAdminMetrics?.activeLearners || 0}</p>
            <div className="flex items-center gap-1"><span className="text-[11px] font-bold text-emerald-600">Live</span><span className="text-[11px] text-slate-400">data</span></div>
          </div>
          <div className="card p-4 flex flex-col gap-3 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-slate-500 leading-tight">Monthly Revenue</p>
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center flex-shrink-0"><span className="text-white font-bold text-sm">£</span></div>
            </div>
            <p className="font-heading font-bold text-2xl text-slate-900 leading-none">£{superAdminMetrics?.monthlyRevenue || 0}</p>
            <div className="flex items-center gap-1"><span className="text-[11px] font-bold text-emerald-600">Live</span><span className="text-[11px] text-slate-400">data</span></div>
          </div>
          <div className="card p-4 flex flex-col gap-3 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-slate-500 leading-tight">Platform Compliance</p>
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center flex-shrink-0"><TrendingUp size={14} className="text-white"/></div>
            </div>
            <p className="font-heading font-bold text-2xl text-slate-900 leading-none">{superAdminMetrics?.platformCompliance || 0}%</p>
            <div className="flex items-center gap-1"><span className="text-[11px] font-bold text-emerald-600">Live</span><span className="text-[11px] text-slate-400">data</span></div>
          </div>
          <div className="card p-4 flex flex-col gap-3 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-slate-500 leading-tight">Active Subscriptions</p>
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0"><CheckCircle2 size={14} className="text-white"/></div>
            </div>
            <p className="font-heading font-bold text-2xl text-slate-900 leading-none">{superAdminMetrics?.activeSubscriptions || 0}</p>
            <div className="flex items-center gap-1"><span className="text-[11px] font-bold text-emerald-600">Live</span><span className="text-[11px] text-slate-400">data</span></div>
          </div>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-heading font-bold text-slate-900">Platform Usage Growth</h2>
                <p className="text-xs text-slate-400 mt-0.5">Learners active over the last 6 months</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={superAdminMetrics?.userGrowth || []} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: 12 }}/>
                <Area type="monotone" dataKey="users" name="Active Learners" stroke="#8b5cf6" strokeWidth={2} fill="url(#gradUsers)" dot={false}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-slate-900">Recent Platform Activity</h2>
            </div>
            <div className="space-y-0">
              {superAdminMetrics?.recentActivity?.length > 0 ? superAdminMetrics.recentActivity.map((log) => (
                <div key={log.id} className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 mt-0.5">
                    {log.user?.full_name ? log.user.full_name.substring(0,2).toUpperCase() : 'SYS'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 leading-snug">
                      <span className="font-semibold text-slate-900">{log.event_type}</span> <span className="text-slate-500">{log.description || 'System Event'}</span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {new Date(log.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="py-4 text-center text-sm text-slate-500">No recent activity</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-heading font-bold text-2xl text-slate-900">Good morning, {name} 👋</h1>
          <p className="text-slate-500 text-sm mt-0.5">Administrator Dashboard · {new Date().toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-slate-400 text-xs font-medium">AAF CareConnect™ — The UK's Connected Care Platform</p>
            {!organisationId && <span className="text-[9px] font-bold bg-amber-50 text-amber-600 border border-amber-200 rounded-full px-2 py-0.5">⚠ Demo Mode</span>}
            {organisationId  && <span className="text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full px-2 py-0.5">🔄 Live Data</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/cpd-certificates">
            <button className="h-9 px-4 text-sm font-semibold bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors">
              <Download size={14}/> Export Report
            </button>
          </Link>
          <Link to="/learning-hub">
            <button className="h-9 px-4 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-2 transition-colors">
              <Play size={14}/> Enrol Learner
            </button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {kpis.map(({ label, value, icon: Icon, bg, delta, deltaLabel, trend }) => (
          <div key={label} className="card p-4 flex flex-col gap-3 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-slate-500 leading-tight">{label}</p>
              <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={14} className="text-white" />
              </div>
            </div>
            <p className="font-heading font-bold text-2xl text-slate-900 leading-none">{value}</p>
            <div className="flex items-center gap-1">
              <span className={`text-[11px] font-bold ${trend === "up" ? "text-emerald-600" : trend === "warn" ? "text-amber-600" : "text-red-600"}`}>
                {trend === "up" ? "↑" : trend === "warn" ? "⚠" : "↓"} {delta}
              </span>
              <span className="text-[11px] text-slate-400">{deltaLabel}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Training Completion Trend */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-heading font-bold text-slate-900">Training Completion Trend</h2>
              <p className="text-xs text-slate-400 mt-0.5">Assigned vs completed — last 6 months</p>
            </div>
            <Link to="/learning-hub" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">View all <ArrowRight size={11}/></Link>
          </div>
          <div className="flex items-center gap-4 mb-3">
            <span className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-2.5 h-2.5 rounded-full bg-blue-200 inline-block"/>Assigned</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"/>Completed</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={TREND_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradAssigned" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gradCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: 12 }}/>
              <Area type="monotone" dataKey="assigned"  stroke="#3b82f6" strokeWidth={2} fill="url(#gradAssigned)"  dot={false}/>
              <Area type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} fill="url(#gradCompleted)" dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Certificate Expiry Timeline */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-heading font-bold text-slate-900">Certificate Expiry Timeline</h2>
              <p className="text-xs text-slate-400 mt-0.5">Certificates expiring per month — next 4 months</p>
            </div>
            <Link to="/cpd-certificates" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">View all <ArrowRight size={11}/></Link>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={EXPIRY_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: 12 }} formatter={(val) => [`${val} certificates`, "Expiring"]}/>
              <Bar dataKey="expiring" radius={[6,6,0,0]} fill="#f59e0b" label={{ position: "top", fontSize: 11, fill: "#94a3b8" }}/>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 pt-3 border-t border-slate-50 flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"/>Expiring soon</span>
            <span className="text-xs text-slate-400">Action recommended &gt; 5 in any month</span>
          </div>
        </div>
      </div>

      {/* Bottom row: Compliance + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        {/* Compliance breakdown */}
        <div className="xl:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-slate-900">Compliance by Area</h2>
            <Link to="/cpd-certificates" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">Full report <ArrowRight size={11}/></Link>
          </div>
          <div className="space-y-4">
            {COMPLIANCE.map(({ label, pct }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${pctColor(pct)}`}/>
                    <span className="text-sm font-medium text-slate-700">{label}</span>
                  </div>
                  <span className={`text-sm font-bold ${pctText(pct)}`}>{pct}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${pctColor(pct)}`} style={{ width: `${pct}%` }}/>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-slate-50 flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"/>≥ 90% Compliant</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block"/>75–89% At Risk</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-2 h-2 rounded-full bg-red-500 inline-block"/>&lt; 75% Critical</span>
          </div>
        </div>

        {/* Activity feed */}
        <div className="xl:col-span-3 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-slate-900">Activity Feed</h2>
            <span className="text-xs font-semibold text-slate-400">Today</span>
          </div>
          {activity.length === 0 && organisationId ? (
            <p className="text-sm text-slate-400 py-8 text-center">Activity will appear here as learners complete courses.</p>
          ) : (
            <div className="space-y-0">
              {activity.map((a, i) => {
                const Icon = a.icon;
                return (
                  <div key={i} className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
                    <div className={`w-8 h-8 rounded-full ${a.color} flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 mt-0.5`}>
                      {a.name.split(" ").map(n => n[0]).join("").slice(0,2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 leading-snug">
                        <span className="font-semibold text-slate-900">{a.name}</span>
                        {" "}<span className="text-slate-500">{a.action}</span>{" "}
                        <span className="font-medium text-slate-800">{a.item}</span>
                        {a.score && <span className="ml-1 text-xs text-slate-400">· {a.score}</span>}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{a.time}</p>
                    </div>
                    <div className={`w-7 h-7 rounded-lg ${a.bgLight} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={13} className={a.iconColor}/>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function buildDemoActivity() {
  return [
    { icon: CheckCircle2, color: "bg-emerald-500", iconColor: "text-emerald-600", bgLight: "bg-emerald-50", name: "Emma Clarke",    action: "completed",   item: "Safeguarding Level 2",      score: "94%", time: "10 min ago"  },
    { icon: Download,     color: "bg-blue-500",    iconColor: "text-blue-600",    bgLight: "bg-blue-50",    name: "James Okafor",   action: "downloaded",  item: "First Aid Certificate",     score: null,  time: "32 min ago"  },
    { icon: CheckCircle2, color: "bg-emerald-500", iconColor: "text-emerald-600", bgLight: "bg-emerald-50", name: "Daniel Rees",    action: "completed",   item: "Therapeutic Parenting",     score: "88%", time: "1 hr ago"    },
    { icon: UserPlus,     color: "bg-violet-500",  iconColor: "text-violet-600",  bgLight: "bg-violet-50",  name: "Sarah Mitchell", action: "enrolled in", item: "Cultural Diversity",        score: null,  time: "2 hrs ago"   },
    { icon: CheckCircle2, color: "bg-emerald-500", iconColor: "text-emerald-600", bgLight: "bg-emerald-50", name: "Priya Sharma",   action: "completed",   item: "Attachment Theory",         score: "91%", time: "3 hrs ago"   },
    { icon: Download,     color: "bg-blue-500",    iconColor: "text-blue-600",    bgLight: "bg-blue-50",    name: "Mark Thompson",  action: "downloaded",  item: "Fostering Legislation PDF", score: null,  time: "Yesterday"   },
    { icon: UserPlus,     color: "bg-violet-500",  iconColor: "text-violet-600",  bgLight: "bg-violet-50",  name: "Claire Nguyen",  action: "added as",    item: "new learner",               score: null,  time: "Yesterday"   },
  ];
}