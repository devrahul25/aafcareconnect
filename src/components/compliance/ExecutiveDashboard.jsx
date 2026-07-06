import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { TrendingUp, Download, Shield, Users, Award, AlertTriangle } from "lucide-react";
import { COMPLIANCE_TREND, DEPT_COMPLIANCE, AGENCY_SCORE, SCORE_TREND, STAFF_COMPLIANCE } from "@/lib/complianceData";
import { jsPDF } from "jspdf";

const FORECAST = [
  { month: "Jul", score: 92, target: 93 },
  { month: "Aug", score: 93, target: 93 },
  { month: "Sep", score: 91, target: 93 },
  { month: "Oct", score: 94, target: 93 },
  { month: "Nov", score: 95, target: 93 },
  { month: "Dec", score: 95, target: 93 },
];

const COMBINED = [...COMPLIANCE_TREND, ...FORECAST.map(f => ({ ...f, forecast: f.score, score: undefined }))];

export default function ExecutiveDashboard() {
  const highRisk = STAFF_COMPLIANCE.filter(s => s.riskLevel === "high").length;
  const fullyCompliant = STAFF_COMPLIANCE.filter(s => s.score >= 90).length;

  const handleReport = () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    doc.setFillColor(15,23,42); doc.rect(0,0,210,50,"F");
    doc.setTextColor(255,255,255); doc.setFont("helvetica","bold"); doc.setFontSize(18);
    doc.text("AAF CareConnect™ — Executive Compliance Report", 105, 22, { align:"center" });
    doc.setFontSize(9); doc.setFont("helvetica","normal"); doc.setTextColor(148,163,184);
    doc.text(`Generated ${new Date().toLocaleDateString("en-GB")}  ·  Shining Stars Fostering Agency`, 105, 35, { align:"center" });
    doc.setFillColor(255,255,255); doc.roundedRect(10, 58, 88, 45, 3,3,"F");
    doc.setTextColor(15,23,42); doc.setFont("helvetica","bold"); doc.setFontSize(28);
    doc.text(`${AGENCY_SCORE}%`, 54, 78, { align:"center" });
    doc.setFontSize(9); doc.setFont("helvetica","normal"); doc.setTextColor(100,116,139);
    doc.text("Overall Compliance Score", 54, 86, { align:"center" });
    doc.text(`Up ${SCORE_TREND}% from last month`, 54, 94, { align:"center" });
    doc.setFillColor(255,255,255); doc.roundedRect(110, 58, 88, 45, 3,3,"F");
    doc.setTextColor(15,23,42); doc.setFont("helvetica","bold"); doc.setFontSize(28);
    doc.text(`${fullyCompliant}/${STAFF_COMPLIANCE.length}`, 154, 78, { align:"center" });
    doc.setFontSize(9); doc.setFont("helvetica","normal"); doc.setTextColor(100,116,139);
    doc.text("Staff Fully Compliant", 154, 86, { align:"center" });
    doc.text(`${highRisk} high-risk staff`, 154, 94, { align:"center" });
    doc.save("Executive_Compliance_Report.pdf");
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header strip */}
      <div className="card p-5 bg-gradient-to-r from-slate-900 to-indigo-950 border-0 text-white flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <TrendingUp size={20} className="text-blue-400" />
          <div>
            <h3 className="font-heading font-bold text-white">Executive Compliance Dashboard</h3>
            <p className="text-xs text-slate-400">Agency Director View · Shining Stars Fostering Agency</p>
          </div>
        </div>
        <button onClick={handleReport} className="h-9 px-4 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center gap-2 transition-colors">
          <Download size={13} /> Generate Executive Report
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Shield,        bg: "bg-emerald-600", label: "Compliance Score",    value: `${AGENCY_SCORE}%`,  sub: `+${SCORE_TREND}% this month`  },
          { icon: Users,         bg: "bg-blue-600",    label: "Fully Compliant",     value: fullyCompliant,      sub: `of ${STAFF_COMPLIANCE.length} staff` },
          { icon: AlertTriangle, bg: "bg-red-600",     label: "High Risk Staff",     value: highRisk,            sub: "Require immediate action"      },
          { icon: Award,         bg: "bg-indigo-600",  label: "Ofsted Readiness",    value: "92%",               sub: "Inspection ready"               },
        ].map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="card p-5">
              <div className={`w-10 h-10 rounded-xl ${k.bg} flex items-center justify-center mb-3`}>
                <Icon size={18} className="text-white" />
              </div>
              <p className="text-2xl font-heading font-bold text-slate-900">{k.value}</p>
              <p className="text-xs font-bold text-slate-600 mt-0.5">{k.label}</p>
              <p className="text-[10px] text-slate-400">{k.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Trend + forecast */}
        <div className="card p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Compliance Trend & Forecast</h3>
          <p className="text-xs text-slate-400 mb-4">6-month actual + 6-month projection vs 93% target</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={COMBINED}>
              <CartesianGrid stroke="#f1f5f9" strokeDasharray="4 2" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis domain={[75, 100]} tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e2e8f0" }} />
              <Line dataKey="score"    name="Actual"    stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4 }} connectNulls />
              <Line dataKey="forecast" name="Forecast"  stroke="#2563eb" strokeWidth={2} strokeDasharray="6 3" dot={false} connectNulls />
              <Line dataKey="target"   name="Target"    stroke="#10b981" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Dept bar chart */}
        <div className="card p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Compliance by Department</h3>
          <p className="text-xs text-slate-400 mb-4">Current scores across workforce groups</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={DEPT_COMPLIANCE} layout="vertical" barSize={16}>
              <XAxis type="number" domain={[0,100]} tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} width={110} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e2e8f0" }} formatter={v => [`${v}%`]} />
              <Bar dataKey="score" name="Compliance %" radius={[0,4,4,0]}>
                {DEPT_COMPLIANCE.map((d, i) => (
                  <rect key={i} fill={d.score >= 95 ? "#10b981" : d.score >= 85 ? "#3b82f6" : "#f59e0b"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Staff performance table */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Staff Performance Overview</h3>
        </div>
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {["Staff","Role","Score","CPD Hours","Mandatory %","Risk"].map(h => (
                <th key={h} className="text-left px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {[...STAFF_COMPLIANCE].sort((a,b) => a.score - b.score).map(s => (
              <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full ${s.avatarColor} flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0`}>{s.avatar}</div>
                    <span className="text-xs font-semibold text-slate-800">{s.name}</span>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-[11px] text-slate-500">{s.role}</td>
                <td className="px-4 py-2.5">
                  <span className={`text-xs font-bold ${s.score >= 90 ? "text-emerald-600" : s.score >= 75 ? "text-amber-600" : "text-red-600"}`}>{s.score}%</span>
                </td>
                <td className="px-4 py-2.5 text-xs text-slate-600">{s.cpdHours}h</td>
                <td className="px-4 py-2.5 text-xs text-slate-600">{s.mandatoryPct}%</td>
                <td className="px-4 py-2.5">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    s.riskLevel === "low" ? "bg-emerald-50 text-emerald-700" : s.riskLevel === "medium" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"
                  }`}>{s.riskLevel}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}