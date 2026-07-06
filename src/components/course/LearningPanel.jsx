import { useState } from "react";
import { NotebookPen, BookOpen, FileDown, Save, CheckCircle2 } from "lucide-react";

const TABS = [
  { key: "notes",     label: "Notes",            icon: NotebookPen },
  { key: "journal",   label: "Reflective Journal", icon: BookOpen },
  { key: "resources", label: "Resources",        icon: FileDown },
];

const DEFAULT_RESOURCES = [
  { title: "Safeguarding Handout (PDF)", fileType: "PDF" },
  { title: "Agency Safeguarding Policy", fileType: "LINK" },
  { title: "Reporting Template (DOCX)", fileType: "DOCX" },
  { title: "Useful Contacts & Helplines", fileType: "PDF" },
];

export default function LearningPanel({ lesson, panel, setPanel }) {
  const [tab, setTab] = useState("notes");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const update = (field, value) => setPanel((p) => ({ ...p, [field]: value }));

  // Pull any resource blocks straight out of the lesson content, if present
  const lessonResources = (lesson?.content || [])
    .filter((b) => b.type === "resource")
    .map((b) => ({ title: b.title, fileType: b.fileType || "PDF" }));
  const resources = lessonResources.length ? lessonResources : DEFAULT_RESOURCES;

  return (
    <aside className="w-80 flex-shrink-0 h-full bg-white border-l border-slate-200 flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 flex-shrink-0">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 px-2 py-3 text-xs font-semibold flex flex-col items-center gap-1 border-b-2 -mb-px transition-colors ${
                tab === t.key ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <Icon size={15} /> {t.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Notes */}
        {tab === "notes" && (
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Personal Notes</p>
            <textarea
              value={panel.notes || ""}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="Jot down key thoughts, reminders or questions for this lesson…"
              rows={12}
              className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
            <button
              onClick={handleSave}
              className="w-full h-9 text-sm font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 flex items-center justify-center gap-2 transition-colors"
            >
              {saved ? <><CheckCircle2 size={14} /> Saved</> : <><Save size={14} /> Save Notes</>}
            </button>
            {panel.notes && panel.notes.trim().length > 0 && (
              <p className="text-[11px] text-slate-400">{panel.notes.trim().split(/\s+/).length} words saved locally.</p>
            )}
          </div>
        )}

        {/* Reflective Journal */}
        {tab === "journal" && (
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Reflective Journal</p>
            <div>
              <label className="field-label">What have you learned?</label>
              <textarea
                value={panel.learned || ""}
                onChange={(e) => update("learned", e.target.value)}
                placeholder="Summarise the most important things you take from this lesson…"
                rows={5}
                className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>
            <div>
              <label className="field-label">How will this affect your practice?</label>
              <textarea
                value={panel.practice || ""}
                onChange={(e) => update("practice", e.target.value)}
                placeholder="Describe what you will do differently as a foster carer…"
                rows={5}
                className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>
            <button
              onClick={handleSave}
              className="w-full h-9 text-sm font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 flex items-center justify-center gap-2 transition-colors"
            >
              {saved ? <><CheckCircle2 size={14} /> Saved</> : <><Save size={14} /> Save Journal Entry</>}
            </button>
          </div>
        )}

        {/* Resources */}
        {tab === "resources" && (
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Downloadable Resources</p>
            {resources.map((r, i) => (
              <a key={i} href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-lg hover:bg-blue-50 transition-colors">
                <FileDown size={15} className={r.fileType === "DOCX" ? "text-amber-500" : r.fileType === "LINK" ? "text-blue-500" : "text-red-500"} />
                <span className="flex-1 text-sm font-medium text-slate-700">{r.title}</span>
                <span className="text-[9px] font-bold text-slate-400 bg-white border border-slate-200 rounded px-1.5 py-0.5">{r.fileType}</span>
              </a>
            ))}
            <p className="text-[11px] text-slate-400 pt-2">Resources for: <span className="font-medium text-slate-500">{lesson?.title}</span></p>
          </div>
        )}
      </div>
    </aside>
  );
}