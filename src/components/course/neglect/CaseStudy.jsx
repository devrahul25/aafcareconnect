import { UserRound } from "lucide-react";

const TAGS = ["Persistent hunger", "Dirty clothing", "Food insecurity", "School non-attendance"];

export default function CaseStudy() {
  return (
    <section className="card p-6 bg-gradient-to-br from-slate-50 to-white">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center">
          <UserRound size={18} className="text-white" />
        </div>
        <h2 className="font-heading font-bold text-lg text-slate-900">UK Fostering Case Study</h2>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-rose-400 flex items-center justify-center text-white font-bold">E</div>
          <div>
            <p className="font-semibold text-slate-900">Emily, age 10</p>
            <p className="text-xs text-slate-500">Looked-after child · Short-term placement</p>
          </div>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed italic">
          “Emily repeatedly arrives at your home hungry and wearing dirty clothes. She tells you there is often no food at home and that ‘no one checks if I go to school.’ School have reported six late marks this half-term and two unauthorised absences.”
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {TAGS.map((t) => (
            <span key={t} className="badge badge-amber text-[11px]">{t}</span>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">As you work through this lesson, consider what you would record — and to whom you would report these concerns.</p>
      </div>
    </section>
  );
}