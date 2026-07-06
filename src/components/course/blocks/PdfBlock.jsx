import { FileText, Download } from "lucide-react";

export default function PdfBlock({ url, title }) {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2 min-w-0">
          <FileText size={15} className="text-red-500 flex-shrink-0" />
          <span className="text-sm font-semibold text-slate-700 truncate">{title}</span>
        </div>
        <button onClick={() => url && window.open(url, "_blank")} className="h-7 px-3 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 flex items-center gap-1.5 transition-colors flex-shrink-0">
          <Download size={12} /> Download
        </button>
      </div>
      <div className="h-64 bg-slate-50 flex items-center justify-center">
        {url ? (
          <iframe src={url} title={title} className="w-full h-full" />
        ) : (
          <div className="text-center px-6">
            <FileText size={32} className="text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-xs text-slate-400 mt-1">PDF preview appears here when published.</p>
          </div>
        )}
      </div>
    </div>
  );
}