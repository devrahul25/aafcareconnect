import { useState } from "react";
import { NotebookPen, Save, CheckCircle2 } from "lucide-react";

export default function ReflectionSection({ onSaved }) {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);

  const save = () => {
    if (!text.trim()) return;
    setSaved(true);
    onSaved?.();
  };

  return (
    <section className="card p-6 border-l-4 border-l-blue-400">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
          <NotebookPen size={18} className="text-blue-600" />
        </div>
        <h2 className="font-heading font-bold text-lg text-slate-900">Reflection</h2>
      </div>
      <p className="text-sm font-semibold text-slate-700 mb-2">What concerns would you record, and who would you report them to?</p>
      <textarea
        value={text}
        onChange={(e) => { setText(e.target.value); setSaved(false); }}
        rows={5}
        placeholder="Describe what you would record about Emily’s presentation and disclosures, and to whom you would report — e.g. your Supervising Social Worker, the Designated Safeguarding Lead, or MASH…"
        className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
      />
      <button onClick={save} className="mt-3 h-9 px-4 text-sm font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 inline-flex items-center gap-2">
        {saved ? <><CheckCircle2 size={14} /> Saved</> : <><Save size={14} /> Save reflection</>}
      </button>
    </section>
  );
}