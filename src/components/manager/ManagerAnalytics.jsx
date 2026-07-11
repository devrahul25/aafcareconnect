// @ts-nocheck
import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";
import {
  TrendingUp, AlertTriangle, CheckCircle2, BarChart3,
  ArrowUp, ArrowDown, ShieldAlert, Clock, ChevronRight, Zap
} from "lucide-react";
import { LEARNER_GAMIFICATION } from "@/lib/gamification";

// ─── Demo data ──────────────────────────────────────────────────────────────
const LEARNERS = [
  { id: 1,  name: "Emma Clarke",    role: "Foster Carer",  enrolled: 4, completed: 4, overdue: 0, progress: 100, status: "compliant",     avatar: "EC", color: "bg-emerald-600", riskScore: 8,  engagement: 94 },
  { id: 2,  name: "James Okafor",   role: "Foster Carer",  enrolled: 5, completed: 3, overdue: 1, progress: 60,  status: "at_risk",       avatar: "JO", color: "bg-amber-500",   riskScore: 52, engagement: 61 },
  { id: 3,  name: "Priya Sharma",   role: "Trainer",       enrolled: 3, completed: 2, overdue: 0, progress: 78,  status: "in_progress",   avatar: "PS", color: "bg-blue-600",    riskScore: 20, engagement: 80 },
  { id: 4,  name: "Mark Thompson",  role: "RI",            enrolled: 6, completed: 4, overdue: 2, progress: 67,  status: "at_risk",       avatar: "MT", color: "bg-rose-600",    riskScore: 71, engagement: 45 },
  { id: 5,  name: "Sarah Mitchell", role: "Social Worker", enrolled: 3, completed: 3, overdue: 0, progress: 100, status: "compliant",     avatar: "SM", color: "bg-violet-600",  riskScore: 5,  engagement: 98 },
  { id: 6,  name: "Daniel Rees",    role: "Foster Carer",  enrolled: 5, completed: 5, overdue: 0, progress: 100, status: "compliant",     avatar: "DR", color: "bg-indigo-600",  riskScore: 4,  engagement: 100 },
  { id: 7,  name: "Claire Nguyen",  role: "Foster Carer",  enrolled: 4, completed: 1, overdue: 3, progress: 25,  status: "non_compliant", avatar: "CN", color: "bg-red-600",     riskScore: 88, engagement: 22 },
];

const COMPLETION_TREND = [
  { month: "Jan", completions: 12, target: 15 },
  { month: "Feb", completions: 18, target: 15 },
  { month: "Mar", completions: 14, target: 18 },
  { month: "Apr", completions: 22, target: 18 },
  { month: "May", completions: 28, target: 20 },
  { month: "Jun", completions: 31, target: 20 },
];

const CATEGORY_DATA = [
  { name: "Safeguarding",        value: 35, color: "#2563eb" },
  { name: "Therapeutic",         value: 22, color: "#7c3aed" },
  { name: "Health & Safety",     value: 18, color: "#059669" },
  { name: "Attachment",          value: 15, color: "#d97706" },
  { name: "Legislation",         value: 10, color: "#dc2626" },
];

const ENGAGEMENT_DATA = [
  { name: "Emma",   xp: 1540, streak: 18 },
  { name: "James",  xp: 720,  streak: 5 },
  { name: "Priya",  xp: 680,  streak: 9 },
  { name: "Mark",   xp: 890,  streak: 3 },
  { name: "Sarah",  xp: 1310, streak: 22 },
  { name: "Daniel", xp: 1660, streak: 14 },
  { name: "Claire", xp: 210,  streak: 0 },
];

const RISK_COLOUR = (score) => {
  if (score <= 20) return { bar: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50", label: "Low" };
  if (score <= 50) return { bar: "bg-amber-400",   text: "text-amber-700",   bg: "bg-amber-50",   label: "Medium" };
  if (score <= 75) return { bar: "bg-orange-500",  text: "text-orange-700",  bg: "bg-orange-50",  label: "High" };
  return { bar: "bg-red-500", text: "text-red-700", bg: "bg-red-50", label: "Critical" };
};

function StatCard({ title, value, delta, deltaUp, sub, icon: Icon, iconBg }) {
  return (
    <div className="card p-4 flex flex-col gap-2 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-500">{title}</p>
        <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center`}>
          <Icon size={14} className="text-white" />
        </div>
      </div>
      <p className="font-heading font-black text-2xl text-slate-900">{value}</p>
      {delta !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-semibold ${deltaUp ? "text-emerald-600" : "text-red-500"}`}>
          {deltaUp ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
          {delta} {sub}
        </div>
      )}
      {sub && delta === undefined && <p className="text-[11px] text-slate-400">{sub}</p>}
    </div>
  );
}

function RiskRow({ learner }) {
  const r = RISK_COLOUR(learner.riskScore);
  const g = LEARNER_GAMIFICATION[learner.id];
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer">
      <div className={`w-8 h-8 rounded-full ${learner.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
        {learner.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-semibold text-slate-900 truncate">{learner.name}</p>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${r.bg} ${r.text}`}>{r.label}</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span>{learner.role}</span>
          {learner.overdue > 0 && (
            <span className="flex items-center gap-0.5 text-red-500 font-semibold">
              <AlertTriangle size={9} /> {learner.overdue} overdue
            </span>
          )}
          {g && <span className="flex items-center gap-0.5"><Zap size={9} className="text-amber-500" /> {g.xp} XP</span>}
        </div>
      </div>
      {/* Risk bar */}
      <div className="w-24 flex-shrink-0">
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full ${r.bar} rounded-full transition-all duration-700`} style={{ width: `${learner.riskScore}%` }} />
        </div>
        <p className={`text-[10px] font-bold mt-0.5 text-right ${r.text}`}>{learner.riskScore}/100</p>
      </div>
      <div className="w-16 flex-shrink-0 text-right">
        <p className="text-sm font-bold text-slate-900">{learner.engagement}%</p>
        <p className="text-[10px] text-slate-400">engaged</p>
      </div>
      <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-lg text-xs">
      <p className="font-bold text-slate-700 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold">{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function ManagerAnalytics() {
  const [sort, setSort] = useState("risk");
  const sorted = [...LEARNERS].sort((a, b) =>
    sort === "risk" ? b.riskScore - a.riskScore :
    sort === "engagement" ? b.engagement - a.engagement :
    sort === "overdue" ? b.overdue - a.overdue : 0
  );

  const compliantCount = LEARNERS.filter((l) => l.status === "compliant").length;
  const atRiskCount = LEARNERS.filter((l) => l.status === "at_risk" || l.status === "non_compliant").length;
  const avgEngagement = Math.round(LEARNERS.reduce((s, l) => s + l.engagement, 0) / LEARNERS.length);

  return (
    <div className="space-y-6 animate-fade-in">

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Compliant Learners"  value={`${compliantCount}/${LEARNERS.length}`} icon={CheckCircle2} iconBg="bg-emerald-600" delta="+2" deltaUp={true}  sub="vs last month" />
        <StatCard title="At Risk / Non-Compliant" value={atRiskCount}                        icon={ShieldAlert}  iconBg="bg-red-500"     delta="-1" deltaUp={true}  sub="vs last month" />
        <StatCard title="Avg Engagement Score" value={`${avgEngagement}%`}                  icon={TrendingUp}   iconBg="bg-blue-600"    delta="+6%" deltaUp={true} sub="vs last month" />
        <StatCard title="Overdue Mandatory"   value={LEARNERS.reduce((s,l)=>s+l.overdue,0)} icon={Clock}        iconBg="bg-amber-500"   sub="mandatory items"  />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Completion trend */}
        <div className="lg:col-span-2 card p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1.5">
            <BarChart3 size={13} /> Completion Trend
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={COMPLETION_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="completions" stroke="#2563eb" strokeWidth={2.5} dot={{ fill: "#2563eb", r: 4 }} name="Completions" />
              <Line type="monotone" dataKey="target"      stroke="#e2e8f0" strokeWidth={2}   dot={false} strokeDasharray="4 4" name="Target" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category pie */}
        <div className="card p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1.5">
            <BarChart3 size={13} /> Completions by Category
          </p>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                {CATEGORY_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-2">
            {CATEGORY_DATA.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                <span className="flex-1 text-slate-600 truncate">{d.name}</span>
                <span className="font-bold text-slate-900">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Engagement XP bar chart */}
      <div className="card p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1.5">
          <Zap size={13} className="text-amber-500" /> Learner XP & Engagement
        </p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={ENGAGEMENT_DATA} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="xp" fill="#2563eb" radius={[4, 4, 0, 0]} name="XP" />
            <Bar dataKey="streak" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Streak (days)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Risk & engagement table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-sm font-bold text-slate-900">Learner Risk & Engagement Scores</p>
            <p className="text-xs text-slate-500 mt-0.5">Sorted by compliance risk · click a learner for their full profile</p>
          </div>
          <div className="flex gap-1.5">
            {[["risk","Risk"],["engagement","Engagement"],["overdue","Overdue"]].map(([key, label]) => (
              <button key={key} onClick={() => setSort(key)}
                className={`h-7 px-3 text-xs font-semibold rounded-lg border transition-all ${sort === key ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="p-3 space-y-1">
          {sorted.map((l) => <RiskRow key={l.id} learner={l} />)}
        </div>
      </div>

    </div>
  );
}