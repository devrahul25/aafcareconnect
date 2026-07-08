import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import { Download, PieChart, BarChart3, TrendingUp, Users } from "lucide-react";

export default function Reports() {
  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1440px] mx-auto">
      <PageHeader 
        title="Team Reports" 
        subtitle="Generate and download training and compliance reports for your assigned team"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-5 hover:border-blue-200 transition-colors cursor-pointer group">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <PieChart size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Compliance Report</h3>
                <p className="text-sm text-slate-500 mt-0.5">Overall team compliance by category</p>
              </div>
            </div>
            <button className="text-slate-400 hover:text-blue-600">
              <Download size={18} />
            </button>
          </div>
        </div>

        <div className="card p-5 hover:border-blue-200 transition-colors cursor-pointer group">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <TrendingUp size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Learner Progress</h3>
                <p className="text-sm text-slate-500 mt-0.5">Detailed completion rates per learner</p>
              </div>
            </div>
            <button className="text-slate-400 hover:text-blue-600">
              <Download size={18} />
            </button>
          </div>
        </div>

        <div className="card p-5 hover:border-blue-200 transition-colors cursor-pointer group">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <BarChart3 size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Course Completion</h3>
                <p className="text-sm text-slate-500 mt-0.5">Completion metrics for assigned courses</p>
              </div>
            </div>
            <button className="text-slate-400 hover:text-blue-600">
              <Download size={18} />
            </button>
          </div>
        </div>

        <div className="card p-5 hover:border-blue-200 transition-colors cursor-pointer group">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                <Users size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Team CPD Summary</h3>
                <p className="text-sm text-slate-500 mt-0.5">Total CPD hours grouped by learner</p>
              </div>
            </div>
            <button className="text-slate-400 hover:text-blue-600">
              <Download size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
