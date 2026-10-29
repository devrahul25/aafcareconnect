import { Download, Printer, FileSpreadsheet, CheckCircle2, Clock, BookOpen } from "lucide-react";
import { fmt } from "@/lib/passportData";
import { jsPDF } from "jspdf";

export default function PassportTranscript({ transcript = [], profile = {} }) {
  const userName = profile?.name || "Practitioner";
  const passportId = profile?.id || "AAF-PAS-LIVE";
  const orgName = profile?.organisation || "AAF CareConnect";

  const totalHours = transcript.reduce((s, r) => s + (Number(r.hours) || 0), 0);
  const completedCount = transcript.filter(r => r.status === "completed" || r.status === "COMPLETED").length;

  const handlePDF = () => {
    try {
      const doc = new jsPDF({ unit: "mm", format: "a4" });

      // Slate Navy Banner
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 42, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("AAF CareConnect™ — Official CPD Transcript", 105, 18, { align: "center" });

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(148, 163, 184);
      doc.text(`${userName}  ·  ${passportId}  ·  ${orgName}`, 105, 28, { align: "center" });
      doc.text(`Generated: ${new Date().toLocaleDateString("en-GB")}`, 105, 35, { align: "center" });

      const headers = ["Date", "Course / Training", "Provider", "Hours", "Status"];
      const colX = [15, 42, 115, 160, 178];
      const rowH = 8;
      let y = 56;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      headers.forEach((h, i) => doc.text(h, colX[i], y));

      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(15, y + 2, 195, y + 2);
      y += 8;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(15, 23, 42);

      if (transcript.length === 0) {
        doc.setFontSize(10);
        doc.setTextColor(148, 163, 184);
        doc.text("No completed training or CPD records registered yet.", 105, y + 15, { align: "center" });
      } else {
        transcript.forEach(r => {
          if (y > 270) {
            doc.addPage();
            y = 20;
          }
          const dateStr = r.date ? fmt(r.date) : "—";
          const titleStr = (r.course || r.title || "").substring(0, 40);
          const providerStr = (r.provider || "AAF CareConnect").substring(0, 25);
          const hoursStr = `${r.hours || 0}h`;
          const statusStr = (r.status === "completed" || r.status === "COMPLETED") ? "Completed" : "In Progress";

          const vals = [dateStr, titleStr, providerStr, hoursStr, statusStr];
          vals.forEach((v, i) => {
            doc.setFontSize(8);
            doc.text(String(v), colX[i], y);
          });

          doc.setDrawColor(241, 245, 249);
          doc.line(15, y + 2, 195, y + 2);
          y += rowH;
        });

        y += 4;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(37, 99, 235);
        doc.text(`Total Accredited CPD Hours: ${totalHours}h  ·  Total Training Records: ${transcript.length}`, 15, y);
      }

      doc.save(`CPD_Transcript_${userName.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error("Failed to generate transcript PDF:", err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="card p-5 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Official Continuous Professional Development Transcript</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {transcript.length} recorded training units · {totalHours} total accredited CPD hours · Ofsted compliant format
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePDF}
            className="h-8 px-3 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download size={12} /> Export Official PDF
          </button>
          <button
            onClick={handlePrint}
            className="h-8 px-3 text-xs font-semibold border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
          >
            <Printer size={12} /> Print
          </button>
        </div>
      </div>

      {/* Table */}
      {transcript.length === 0 ? (
        <div className="card p-12 text-center border-dashed border-2 border-slate-200 bg-white">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <BookOpen size={28} />
          </div>
          <h3 className="font-heading font-bold text-slate-800 text-base mb-1">CPD Transcript is Empty</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
            As you enrol in and complete accredited courses in the Learning Hub, your formal CPD records and hours will automatically populate this transcript.
          </p>
          <a
            href="/learning-hub"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-500 transition-colors shadow-sm"
          >
            Go to Learning Hub
          </a>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {["Date", "Course / Training", "Provider", "CPD Hours", "Status"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transcript.map((r, i) => {
                const isCompleted = r.status === "completed" || r.status === "COMPLETED";
                return (
                  <tr key={i} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-5 py-3 text-xs text-slate-500 font-medium whitespace-nowrap">
                      {fmt(r.date)}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <BookOpen size={12} className="text-slate-400 flex-shrink-0" />
                        <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                          {r.course || r.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-500">{r.provider || "AAF CareConnect"}</td>
                    <td className="px-5 py-3">
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 rounded-full px-2 py-0.5">
                        {r.hours || 0}h
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {isCompleted ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                          <CheckCircle2 size={11} /> Completed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600">
                          <Clock size={11} /> In Progress
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-blue-50 border-t border-blue-100">
              <tr>
                <td colSpan={3} className="px-5 py-3 text-xs font-bold text-blue-700">
                  Total Records: {transcript.length} ({completedCount} Completed)
                </td>
                <td className="px-5 py-3">
                  <span className="text-sm font-bold text-blue-700">{totalHours}h</span>
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}