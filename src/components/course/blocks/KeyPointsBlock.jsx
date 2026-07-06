import { Lightbulb } from "lucide-react";

export default function KeyPointsBlock({ points }) {
  return (
    <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
      <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3 flex items-center gap-1.5">
        <Lightbulb size={13} className="text-amber-500" /> Key Points
      </p>
      <ul className="space-y-2">
        {points.map((p, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
            <span className="leading-snug">{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}