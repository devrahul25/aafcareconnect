import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { AGENCY_SCORE, SCORE_TREND, SCORE_HISTORY } from "@/lib/complianceData";

function getColor(score) {
  if (score >= 90) return { stroke: "#10b981", text: "text-emerald-600", label: "Excellent", bg: "bg-emerald-50", border: "border-emerald-200" };
  if (score >= 70) return { stroke: "#f59e0b", text: "text-amber-600", label: "Needs Attention", bg: "bg-amber-50", border: "border-amber-200" };
  return { stroke: "#ef4444", text: "text-red-600", label: "Non-Compliant", bg: "bg-red-50", border: "border-red-200" };
}

function GaugeArc({ score }) {
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 200);
    return () => clearTimeout(t);
  }, [score]);

  const radius = 80;
  const cx = 100, cy = 100;
  const circumference = Math.PI * radius; // semi-circle = half circumference
  const pct = animated / 100;
  const dashOffset = circumference * (1 - pct);
  const cfg = getColor(score);

  // Gauge arc path (semi-circle, left to right)
  const startX = cx - radius, startY = cy;
  const endX = cx + radius, endY = cy;
  const trackPath = `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 115" className="w-56">
        {/* Track */}
        <path d={trackPath} fill="none" stroke="#f1f5f9" strokeWidth="16" strokeLinecap="round" />
        {/* Animated fill */}
        <path
          d={trackPath}
          fill="none"
          stroke={cfg.stroke}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
        />
        {/* Score text */}
        <text x="100" y="92" textAnchor="middle" fontSize="32" fontWeight="800" fill={cfg.stroke} fontFamily="sans-serif">{score}%</text>
        <text x="100" y="110" textAnchor="middle" fontSize="11" fontWeight="600" fill="#94a3b8" fontFamily="sans-serif">{cfg.label}</text>
      </svg>
    </div>
  );
}

export default function ComplianceScoreGauge() {
  const cfg = getColor(AGENCY_SCORE);
  const isUp = SCORE_TREND > 0;

  return (
    <div className="card p-6 flex flex-col items-center">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Agency Compliance Score</p>
      <GaugeArc score={AGENCY_SCORE} />

      {/* Trend */}
      <div className={`flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-bold ${isUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
        {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
        {isUp ? "+" : ""}{SCORE_TREND}% vs last month
      </div>

      {/* Mini history */}
      <div className="grid grid-cols-4 gap-2 mt-5 w-full">
        {SCORE_HISTORY.map(h => (
          <div key={h.period} className="text-center">
            <p className={`text-sm font-bold ${h.score >= 90 ? "text-emerald-600" : h.score >= 70 ? "text-amber-600" : "text-red-600"}`}>{h.score}%</p>
            <p className="text-[9px] text-slate-400">{h.period}</p>
          </div>
        ))}
      </div>
    </div>
  );
}