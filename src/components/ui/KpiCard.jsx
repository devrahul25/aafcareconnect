import { TrendingUp, TrendingDown } from "lucide-react";

export default function KpiCard({ title = undefined, value = undefined, delta = undefined, deltaLabel = undefined, icon: Icon = undefined, iconBg = "bg-blue-600", onClick = undefined, children = undefined }) {
  const positive = delta > 0;
  const negative = delta < 0;
  return (
    <div
      onClick={onClick}
      className={`card p-5 flex items-start gap-4 ${onClick ? "cursor-pointer card-hover" : ""}`}
    >
      {Icon && (
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
          <Icon size={18} className="text-white" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{title}</p>
        <p className="font-heading font-bold text-2xl text-slate-900 leading-none">{value}</p>
        {delta !== undefined && delta !== null && (
          <p className={`text-xs mt-1.5 font-semibold flex items-center gap-1 ${positive ? "text-emerald-600" : negative ? "text-red-500" : "text-slate-400"}`}>
            {positive ? <TrendingUp size={11} /> : negative ? <TrendingDown size={11} /> : null}
            {deltaLabel || (positive ? `+${delta}` : delta)}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}