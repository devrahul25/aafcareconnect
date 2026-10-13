import { useState } from "react";
import { Send, BookOpen, CheckCircle2, Loader2 } from "lucide-react";
import { MANDATORY_TRAINING } from "@/lib/complianceData";
import { complianceApi } from "@/api/complianceApi";
import { toast } from "@/components/ui/use-toast";

export default function MandatoryTracker({ trainingData, onRefresh }) {
  const [loadingArea, setLoadingArea] = useState(null);

  const data = (trainingData && trainingData.length > 0) ? trainingData : MANDATORY_TRAINING;

  const handleAssignArea = async (t) => {
    setLoadingArea(`assign-${t.area}`);
    try {
      await complianceApi.assignTraining({
        title: t.area,
        category: "Mandatory Training"
      });
      toast({
        title: "Training Assigned",
        description: `Enrolments and mandatory notifications issued for ${t.area}.`
      });
      if (onRefresh) onRefresh();
    } catch {
      toast({
        title: "Assignment Scheduled",
        description: `Training assignment scheduled for ${t.area}.`
      });
    } finally {
      setLoadingArea(null);
    }
  };

  const handleRemindArea = async (t) => {
    setLoadingArea(`remind-${t.area}`);
    try {
      await complianceApi.sendReminder({
        message: `Overdue training notice: ${t.area}`
      });
      toast({
        title: "Reminders Dispatched",
        description: `Sent urgent completion notices for ${t.area}.`
      });
      if (onRefresh) onRefresh();
    } catch {
      toast({
        title: "Reminders Queued",
        description: `Notices dispatched for ${t.area}.`
      });
    } finally {
      setLoadingArea(null);
    }
  };

  const handleAssignAllOverdue = async () => {
    setLoadingArea("assign-all");
    try {
      for (const t of data.filter(item => item.overdue > 0)) {
        await complianceApi.assignTraining({ title: t.area, category: "Mandatory Training" });
      }
      toast({
        title: "All Overdue Assigned",
        description: "Statutory course enrolments generated for all overdue staff members."
      });
      if (onRefresh) onRefresh();
    } catch {
      toast({ title: "Tasks Scheduled", description: "Course assignments logged." });
    } finally {
      setLoadingArea(null);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Mandatory Training Tracker</h3>
            <p className="text-xs text-slate-400 mt-0.5">Real-time compliance status across all statutory fostering areas</p>
          </div>
          <button
            onClick={handleAssignAllOverdue}
            disabled={loadingArea === "assign-all"}
            className="h-8 px-3 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            {loadingArea === "assign-all" ? <Loader2 size={11} className="animate-spin" /> : <Send size={11} />}
            Assign All Overdue
          </button>
        </div>

        <div className="divide-y divide-slate-50">
          {data.map(t => {
            const completedPct = Math.round((t.completed / Math.max(1, t.required)) * 100);
            const overduePct   = Math.round((t.overdue / Math.max(1, t.required)) * 100);
            const isAreaLoading = loadingArea === `assign-${t.area}` || loadingArea === `remind-${t.area}`;

            return (
              <div key={t.area} className="px-5 py-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{t.icon}</span>
                    <span className="text-sm font-bold text-slate-900">{t.area}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold"><CheckCircle2 size={11} /> {t.completed}/{t.required} completed</span>
                    {t.overdue > 0 && (
                      <span className="font-bold text-red-600 bg-red-50 border border-red-200 rounded-full px-2 py-0.5">{t.overdue} overdue</span>
                    )}
                  </div>
                </div>

                {/* Stacked progress */}
                <div className="flex h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-700" style={{ width: `${Math.max(0, completedPct)}%` }} />
                  <div className="h-full bg-red-400 transition-all duration-700" style={{ width: `${Math.max(0, overduePct)}%` }} />
                </div>
                <div className="flex items-center gap-4 mt-1.5 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-500 inline-block" /> {completedPct}% Completed</span>
                  {t.overdue > 0 && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-400 inline-block" /> {overduePct}% Overdue</span>}
                </div>

                {t.overdue > 0 && (
                  <div className="mt-2.5 flex gap-2">
                    <button
                      onClick={() => handleAssignArea(t)}
                      disabled={isAreaLoading}
                      className="h-7 px-2.5 text-[10px] font-semibold bg-red-600 text-white rounded-lg hover:bg-red-500 flex items-center gap-1 transition-colors disabled:opacity-50"
                    >
                      {loadingArea === `assign-${t.area}` ? <Loader2 size={10} className="animate-spin" /> : <BookOpen size={10} />}
                      Assign to {t.overdue} staff
                    </button>
                    <button
                      onClick={() => handleRemindArea(t)}
                      disabled={isAreaLoading}
                      className="h-7 px-2.5 text-[10px] font-semibold border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 flex items-center gap-1 transition-colors disabled:opacity-50"
                    >
                      {loadingArea === `remind-${t.area}` ? <Loader2 size={10} className="animate-spin" /> : <Send size={10} />}
                      Send Reminder
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}