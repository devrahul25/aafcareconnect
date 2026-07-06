import { DEPT_COMPLIANCE } from "@/lib/complianceData";
import { Users } from "lucide-react";

export default function DeptCompliance() {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Users size={15} className="text-blue-600" />
        <h3 className="text-sm font-bold text-slate-900">Workforce Compliance by Department</h3>
      </div>
      <div className="space-y-3">
        {DEPT_COMPLIANCE.map(dept => {
          const color = dept.score >= 95 ? "bg-emerald-500" : dept.score >= 80 ? "bg-blue-500" : "bg-amber-500";
          return (
            <div key={dept.name}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${dept.color}`} />
                  <span className="text-sm font-semibold text-slate-800">{dept.name}</span>
                  <span className="text-[10px] text-slate-400">{dept.staff} staff</span>
                </div>
                <span className={`text-sm font-bold ${dept.score >= 95 ? "text-emerald-600" : dept.score >= 80 ? "text-blue-600" : "text-amber-600"}`}>
                  {dept.score}%
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${dept.score}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}