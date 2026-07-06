import { Download, Printer, FileSpreadsheet, CheckCircle2, BookOpen } from "lucide-react";
import { CPD_TRANSCRIPT, PASSPORT_PROFILE } from "@/lib/passportData";
import { jsPDF } from "jspdf";

export default function PassportTranscript() {
  const totalHours = CPD_TRANSCRIPT.reduce((s, r) => s + r.hours, 0);

  const handlePDF = () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    doc.setFillColor(15,23,42); doc.rect(0,0,210,40,"F");
    doc.setTextColor(255,255,255); doc.setFont("helvetica","bold"); doc.setFontSize(16);
    doc.text("AAF CareConnect™ — Official CPD Transcript", 105, 18, { align:"center" });
    doc.setFontSize(9); doc.setFont("helvetica","normal"); doc.setTextColor(148,163,184);
    doc.text(`${PASSPORT_PROFILE.name}  ·  ${PASSPORT_PROFILE.id}  ·  Generated ${new Date().toLocaleDateString("en-GB")}`, 105, 30, { align:"center" });
    const headers = ["Date","Course","Provider","Hours","Status"];
    const colX = [15,40,100,155,170]; const rowH = 8;
    let y = 55;
    doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.setTextColor(100,116,139);
    headers.forEach((h,i) => doc.text(h, colX[i], y));
    doc.setDrawColor(226,232,240); doc.setLineWidth(0.3); doc.line(15, y+2, 195, y+2);
    y += 10;
    doc.setFont("helvetica","normal"); doc.setTextColor(15,23,42);
    CPD_TRANSCRIPT.forEach(r => {
      if (y > 270) { doc.addPage(); y = 20; }
      const vals = [new Date(r.date).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"2-digit"}), r.course.substring(0,35), r.provider, r.hours+"h", r.status];
      vals.forEach((v,i) => { doc.setFontSize(8); doc.text(String(v), colX[i], y); });
      doc.setDrawColor(241,245,249); doc.line(15, y+2, 195, y+2); y += rowH;
    });
    y += 4;
    doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.setTextColor(37,99,235);
    doc.text(`Total CPD Hours: ${totalHours}h  ·  Courses Completed: ${CPD_TRANSCRIPT.length}`, 15, y);
    doc.save(`CPD_Transcript_${PASSPORT_PROFILE.name.replace(" ","_")}.pdf`);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="card p-5 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Official CPD Transcript</h3>
          <p className="text-xs text-slate-500 mt-0.5">{CPD_TRANSCRIPT.length} courses · {totalHours} total CPD hours · Ofsted-ready format</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handlePDF} className="h-8 px-3 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-1.5 transition-colors">
            <Download size={12} /> Export PDF
          </button>
          <button className="h-8 px-3 text-xs font-semibold border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 transition-colors">
            <FileSpreadsheet size={12} /> Excel
          </button>
          <button className="h-8 px-3 text-xs font-semibold border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 transition-colors">
            <Printer size={12} /> Print
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {["Date","Course","Provider","CPD Hours","Status"].map(h => (
                <th key={h} className="text-left px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {CPD_TRANSCRIPT.map((r, i) => (
              <tr key={i} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-5 py-3 text-xs text-slate-500 font-medium whitespace-nowrap">
                  {new Date(r.date).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" })}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <BookOpen size={12} className="text-slate-400 flex-shrink-0" />
                    <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">{r.course}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-xs text-slate-500">{r.provider}</td>
                <td className="px-5 py-3">
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 rounded-full px-2 py-0.5">{r.hours}h</span>
                </td>
                <td className="px-5 py-3">
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                    <CheckCircle2 size={11} /> Completed
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-blue-50 border-t border-blue-100">
            <tr>
              <td colSpan={3} className="px-5 py-3 text-xs font-bold text-blue-700">Total ({CPD_TRANSCRIPT.length} records)</td>
              <td className="px-5 py-3"><span className="text-sm font-bold text-blue-700">{totalHours}h</span></td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}