import { BookOpen, FileText, ExternalLink } from "lucide-react";

const RESOURCES = [
  { title: "Working Together to Safeguard Children", desc: "Statutory inter-agency guidance (HM Government, 2023).", url: "https://www.gov.uk/government/publications/working-together-to-safeguard-children--2", type: "Statutory Guidance" },
  { title: "Keeping Children Safe in Education", desc: "Statutory safeguarding guidance for schools and colleges (DfE, 2024).", url: "https://www.gov.uk/government/publications/keeping-children-safe-in-education--2", type: "Statutory Guidance" },
  { title: "Neglect — NSPCC Learning", desc: "Practical guidance on recognising and responding to neglect.", url: "https://learning.nspcc.org.uk/child-abuse-and-neglect/neglect", type: "Reference" },
];

export default function ResourcesSection() {
  return (
    <section className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center">
          <BookOpen size={18} className="text-white" />
        </div>
        <h2 className="font-heading font-bold text-lg text-slate-900">Resources & References</h2>
      </div>
      <div className="space-y-3">
        {RESOURCES.map((r) => (
          <a key={r.title} href={r.url} target="_blank" rel="noreferrer"
            className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <FileText size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900">{r.title}</p>
              <p className="text-xs text-slate-500">{r.desc}</p>
            </div>
            <span className="badge badge-blue text-[10px] flex-shrink-0">{r.type}</span>
            <ExternalLink size={14} className="text-slate-300 flex-shrink-0" />
          </a>
        ))}
      </div>
    </section>
  );
}