import { FileDown, Download } from "lucide-react";

export default function ResourceBlock({ title, fileType = "PDF" }) {
  return (
    <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-blue-50 transition-colors">
      <FileDown size={16} className="text-blue-500 flex-shrink-0" />
      <span className="flex-1 text-sm font-medium text-slate-700 truncate">{title}</span>
      <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-200 rounded px-1.5 py-0.5">{fileType}</span>
      <Download size={14} className="text-slate-400 flex-shrink-0" />
    </a>
  );
}