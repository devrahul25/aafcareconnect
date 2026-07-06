import { Sparkles, CheckCircle2 } from "lucide-react";

const TAKEAWAYS = [
  "Neglect is the most common category of abuse in the UK and is cumulative, not a single event.",
  "Recognise neglect across five dimensions: physical, medical, educational, emotional and supervisory.",
  "Record factually — what you saw and heard, using the child’s exact words — not your interpretation.",
  "Report to your Supervising Social Worker or DSL the same day; if a child is in immediate danger, call 999 first.",
  "Never promise secrecy, never investigate, and never confront birth family yourself.",
];

export default function KeyTakeaways() {
  return (
    <section className="card p-6 bg-gradient-to-br from-blue-50/60 to-white border-l-4 border-l-blue-500">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
          <Sparkles size={18} className="text-white" />
        </div>
        <h2 className="font-heading font-bold text-lg text-slate-900">Key Takeaways</h2>
      </div>
      <ul className="space-y-2">
        {TAKEAWAYS.map((t, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
            <CheckCircle2 size={16} className="text-blue-600 mt-0.5 shrink-0" />
            <span className="leading-relaxed">{t}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}