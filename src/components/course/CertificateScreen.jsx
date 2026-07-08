import { useState, useEffect } from "react";
import { Award, Download, CheckCircle2, BookOpen, Clock } from "lucide-react";
import { jsPDF } from "jspdf";
import confetti from "canvas-confetti";

export default function CertificateScreen({ course, learnerName }) {
  const [downloaded, setDownloaded] = useState(false);
  const cpdSaved = useState(false)[0]; // CPD record handled by parent on pass

  const issueDate = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const certId = `AAF-SG2-${Date.now().toString(36).toUpperCase().slice(-6)}`;

  useEffect(() => {
    confetti({ particleCount: 140, spread: 90, origin: { y: 0.45 }, colors: ["#2563eb", "#10b981", "#f59e0b", "#8b5cf6"] });
    const t = setTimeout(() => confetti({ particleCount: 70, spread: 120, origin: { y: 0.3 }, colors: ["#2563eb", "#10b981", "#f59e0b", "#8b5cf6"] }), 400);
    return () => clearTimeout(t);
  }, []);

  const downloadCertificate = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    // Background
    doc.setFillColor(15, 23, 42); doc.rect(0, 0, 297, 210, "F");
    doc.setFillColor(255, 255, 255); doc.rect(10, 10, 277, 190, "F");
    // Border
    doc.setDrawColor(37, 99, 235); doc.setLineWidth(1.5);
    doc.rect(16, 16, 265, 178);
    doc.setLineWidth(0.4); doc.setDrawColor(37, 99, 235);
    doc.rect(19, 19, 259, 172);
    // Brand
    doc.setFillColor(37, 99, 235); doc.roundedRect(118, 28, 60, 14, 3, 3, "F");
    doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(13);
    doc.text("AAF CARECONNECT", 148, 37, { align: "center" });
    // Title
    doc.setTextColor(15, 23, 42); doc.setFontSize(30); doc.text("Certificate of Completion", 148, 60, { align: "center" });
    doc.setFontSize(11); doc.setTextColor(100, 116, 139); doc.setFont("helvetica", "normal");
    doc.text("This certifies that", 148, 74, { align: "center" });
    // Learner
    doc.setFont("helvetica", "bold"); doc.setFontSize(24); doc.setTextColor(37, 99, 235);
    doc.text(learnerName, 148, 88, { align: "center" });
    // Course
    doc.setFont("helvetica", "normal"); doc.setFontSize(12); doc.setTextColor(15, 23, 42);
    doc.text("has successfully completed", 148, 100, { align: "center" });
    doc.setFont("helvetica", "bold"); doc.setFontSize(18);
    doc.text(course.title, 148, 110, { align: "center" });
    // Meta line
    doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(100, 116, 139);
    doc.text(`Category: ${course.category}   ·   Level: ${course.level}   ·   ${course.cpd_hours} CPD Hours`, 148, 120, { align: "center" });
    // Footer
    doc.setDrawColor(37, 99, 235); doc.setLineWidth(0.5); doc.line(60, 150, 110, 150); doc.line(186, 150, 236, 150);
    doc.setFontSize(9); doc.setTextColor(100, 116, 139);
    doc.text(issueDate, 85, 156, { align: "center" });
    doc.text("Training Director", 211, 156, { align: "center" });
    doc.setFontSize(7); doc.text("Date of Issue", 85, 161, { align: "center" }); doc.text("Signature", 211, 161, { align: "center" });
    doc.setFontSize(8); doc.setTextColor(148, 163, 184);
    doc.text(`Certificate ID: ${certId}`, 148, 178, { align: "center" });
    doc.text("All About Fostering · CPD Accredited Training", 148, 184, { align: "center" });
    doc.save(`Certificate - ${course.title}.pdf`);
    setDownloaded(true);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="card p-8 text-center border-emerald-200">
          <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <Award size={40} className="text-emerald-600" />
          </div>
          <h2 className="font-heading font-bold text-3xl text-slate-900 mb-2">Congratulations!</h2>
          <p className="text-slate-500 mb-6">
            You've completed <span className="font-semibold text-slate-900">{course.title}</span> and earned a certificate worth <span className="font-bold text-emerald-600">{course.cpd_hours} CPD hours</span>.
          </p>

          {/* Mini certificate preview */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-xl p-6 mb-6 text-white">
            <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">AAF CareConnect</p>
            <p className="font-heading font-bold text-xl mb-1">Certificate of Completion</p>
            <p className="text-slate-300 text-sm mb-3">{course.title}</p>
            <p className="text-2xl font-heading font-bold">{learnerName}</p>
            <p className="text-slate-400 text-xs mt-2">Issued {issueDate} · ID {certId} · {course.cpd_hours} CPD hours</p>
          </div>

          {/* Status row */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-emerald-50 rounded-xl p-3">
              <CheckCircle2 size={16} className="text-emerald-600 mx-auto mb-1" />
              <p className="text-xs font-semibold text-emerald-700">CPD Hours Added</p>
              <p className="text-[10px] text-emerald-600">{course.cpd_hours} hours</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-3">
              <BookOpen size={16} className="text-blue-600 mx-auto mb-1" />
              <p className="text-xs font-semibold text-blue-700">Progress Updated</p>
              <p className="text-[10px] text-blue-600">100% complete</p>
            </div>
            <div className="bg-violet-50 rounded-xl p-3">
              <Clock size={16} className="text-violet-600 mx-auto mb-1" />
              <p className="text-xs font-semibold text-violet-700">Valid Until</p>
              <p className="text-[10px] text-violet-600">2 years from issue</p>
            </div>
          </div>

          {/* Button */}
          <button
            onClick={downloadCertificate}
            className="h-11 px-8 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-500 inline-flex items-center gap-2 transition-colors"
          >
            <Download size={16} /> {downloaded ? "Download Again" : "Download Certificate"}
          </button>
          <p className="text-xs text-slate-400 mt-3">
            Your certificate has been saved to your CPD record. You can re-download it anytime from CPD Hub.
          </p>
        </div>
      </div>
    </div>
  );
}