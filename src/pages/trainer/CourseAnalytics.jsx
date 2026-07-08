import React, { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { Download, Users, Clock, Award, BarChart3, TrendingDown } from "lucide-react";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const TREND_DATA = [
  { month: "Jan", time: 45, score: 78 },
  { month: "Feb", time: 52, score: 82 },
  { month: "Mar", time: 48, score: 85 },
  { month: "Apr", time: 61, score: 89 },
  { month: "May", time: 58, score: 91 },
  { month: "Jun", time: 64, score: 93 },
];

export default function CourseAnalytics() {
  const [activeCourse, setActiveCourse] = useState("Safeguarding Children Level 2");

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1440px] mx-auto">
      <PageHeader 
        title="Course Analytics" 
        subtitle="Deep dive into learner engagement and performance metrics"
        actions={
          <div className="flex items-center gap-4">
            <select 
              value={activeCourse} 
              onChange={e => setActiveCourse(e.target.value)}
              className="h-9 px-3 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option>Safeguarding Children Level 2</option>
              <option>First Aid in Social Care</option>
              <option>Attachment Theory</option>
            </select>
            <button className="h-9 px-4 text-sm font-semibold bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors">
              <Download size={14}/> Export Report
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2 text-slate-500">
            <Users size={16} />
            <span className="text-xs font-semibold">Total Learners</span>
          </div>
          <p className="text-2xl font-bold font-heading text-slate-900">124</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2 text-slate-500">
            <BarChart3 size={16} />
            <span className="text-xs font-semibold">Completion Rate</span>
          </div>
          <p className="text-2xl font-bold font-heading text-slate-900">82%</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2 text-slate-500">
            <Clock size={16} />
            <span className="text-xs font-semibold">Avg Time Spent</span>
          </div>
          <p className="text-2xl font-bold font-heading text-slate-900">45m</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2 text-slate-500">
            <Award size={16} />
            <span className="text-xs font-semibold">Avg Quiz Score</span>
          </div>
          <p className="text-2xl font-bold font-heading text-slate-900">91%</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2 text-slate-500">
            <TrendingDown size={16} />
            <span className="text-xs font-semibold">Drop-off Rate</span>
          </div>
          <p className="text-2xl font-bold font-heading text-slate-900">8%</p>
        </div>
      </div>

      <div className="card p-5">
        <div className="mb-4">
          <h2 className="font-heading font-bold text-slate-900">Engagement & Score Trends</h2>
          <p className="text-xs text-slate-400 mt-0.5">Average time spent vs. quiz scores over the last 6 months</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
            <Area type="monotone" dataKey="time" name="Avg Time (mins)" stroke="#3b82f6" strokeWidth={2} fill="url(#colorTime)" />
            <Area type="monotone" dataKey="score" name="Avg Score (%)" stroke="#10b981" strokeWidth={2} fill="url(#colorScore)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
