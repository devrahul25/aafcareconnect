import { Target } from "lucide-react";

const OBJECTIVES = [
  "Define neglect and explain why it is a core safeguarding concern for UK foster carers",
  "Identify the five dimensions of neglect and their physical and behavioural indicators",
  "Recognise patterns of neglect through a realistic UK fostering case study",
  "Apply the correct Recognise → Respond → Record → Report sequence in a branching scenario",
  "Reflect on the concerns you would record, and who you would report them to",
];

export default function LearningObjectives() {
  return (
    <section className="card p-6 border-l-4 border-l-blue-500">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
          <Target size={18} className="text-blue-600" />
        </div>
        <h2 className="font-heading font-bold text-lg text-slate-900">Learning Objectives</h2>
      </div>
      <ul className="space-y-3">
        {OBJECTIVES.map((o, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="mt-0.5 w-7 h-7 shrink-0 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">{i + 1}</span>
            <span className="text-sm text-slate-700 leading-relaxed">{o}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-slate-400 border-t border-slate-100 pt-3">By the end of this lesson you should be able to do all of the above.</p>
    </section>
  );
}