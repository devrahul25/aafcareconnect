import React, { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { Download, Filter, TrendingUp, Award, BookOpen } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const COMPLETION_TREND = [
  { month: "Jan", completed: 42, assigned: 55 },
  { month: "Feb", completed: 50, assigned: 60 },
  { month: "Mar", completed: 65, assigned: 75 },
  { month: "Apr", completed: 60, assigned: 70 },
  { month: "May", completed: 78, assigned: 85 },
  { month: "Jun", completed: 85, assigned: 90 },
];

const COMPLIANCE_BY_CATEGORY = [
  { category: "Safeguarding", pct: 95 },
  { category: "First Aid", pct: 82 },
  { category: "Health & Safety", pct: 75 },
  { category: "Information Sec", pct: 98 },
];

export default function Reports() {
  const [filter, setFilter] = useState("All Departments");

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1440px] mx-auto">
      <PageHeader 
        title="Reports & Analytics" 
        subtitle="Track learner progress, course completions, and compliance"
        actions={
          <div className="flex items-center gap-2">
            <button className="h-9 px-3 text-sm font-medium bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2">
              <Filter size={14} /> Filters
            </button>
            <button className="h-9 px-4 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-2 transition-colors">
              <Download size={14}/> Export Report
            </button>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 flex flex-col gap-3 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-slate-500 leading-tight">Total Courses Completed</p>
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0"><BookOpen size={14} className="text-white"/></div>
          </div>
          <p className="font-heading font-bold text-2xl text-slate-900 leading-none">380</p>
          <div className="flex items-center gap-1"><span className="text-[11px] font-bold text-emerald-600">↑ 12%</span><span className="text-[11px] text-slate-400">vs last month</span></div>
        </div>
        <div className="card p-4 flex flex-col gap-3 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-slate-500 leading-tight">Total CPD Hours</p>
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0"><Award size={14} className="text-white"/></div>
          </div>
          <p className="font-heading font-bold text-2xl text-slate-900 leading-none">1,245h</p>
          <div className="flex items-center gap-1"><span className="text-[11px] font-bold text-emerald-600">↑ 45h</span><span className="text-[11px] text-slate-400">this month</span></div>
        </div>
        <div className="card p-4 flex flex-col gap-3 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-slate-500 leading-tight">Avg. Compliance</p>
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center flex-shrink-0"><TrendingUp size={14} className="text-white"/></div>
          </div>
          <p className="font-heading font-bold text-2xl text-slate-900 leading-none">88%</p>
          <div className="flex items-center gap-1"><span className="text-[11px] font-bold text-emerald-600">↑ 2%</span><span className="text-[11px] text-slate-400">vs last month</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Learner Progress */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-heading font-bold text-slate-900">Training Completion Trend</h2>
              <p className="text-xs text-slate-400 mt-0.5">Assigned vs completed over time</p>
            </div>
          </div>
          <div className="flex items-center gap-4 mb-3">
            <span className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-2.5 h-2.5 rounded-full bg-blue-200 inline-block"/>Assigned</span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"/>Completed</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={COMPLETION_TREND} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="orgAssigned" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="orgCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 500 }}
                />
                <Area type="monotone" dataKey="assigned" stroke="#3b82f6" strokeWidth={2} fill="url(#orgAssigned)" dot={false} />
                <Area type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} fill="url(#orgCompleted)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Compliance by Category */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-heading font-bold text-slate-900">Compliance by Category</h2>
              <p className="text-xs text-slate-400 mt-0.5">Average compliance rates across training types</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={COMPLIANCE_BY_CATEGORY} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b", fontWeight: 500 }} width={100} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Compliance']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 500 }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="pct" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
