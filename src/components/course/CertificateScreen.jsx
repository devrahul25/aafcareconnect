import { useState, useEffect, useRef } from "react";
import { Award, Download, CheckCircle2, BookOpen, Clock, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";
import CertificateTemplate, { formatCertDate } from "./CertificateTemplate";
import { downloadCertificateFromElement } from "@/lib/certificatePdf";

export default function CertificateScreen({ course, learnerName, organisationName, organisationLogo }) {
  const [downloading, setDownloading] = useState(false);
  const certRef = useRef(null);

  const certId = course?.cert_id || `AAF-ORG-2026-${Math.floor(100000 + Math.random() * 900000)}`;

  useEffect(() => {
    confetti({ particleCount: 140, spread: 90, origin: { y: 0.45 }, colors: ["#2563eb", "#10b981", "#f59e0b", "#8b5cf6"] });
    const t = setTimeout(() => confetti({ particleCount: 70, spread: 120, origin: { y: 0.3 }, colors: ["#2563eb", "#10b981", "#f59e0b", "#8b5cf6"] }), 400);
    return () => clearTimeout(t);
  }, []);

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    await downloadCertificateFromElement("learner-course-certificate", `Certificate - ${course?.title || 'Completion'}.pdf`);
    setDownloading(false);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="card p-8 text-center border-emerald-200 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3">
            <Award size={36} className="text-emerald-600" />
          </div>
          <h2 className="font-heading font-bold text-2xl text-slate-900 mb-1">Congratulations!</h2>
          <p className="text-slate-500 text-sm mb-6">
            You've completed <span className="font-semibold text-slate-900">{course?.title}</span> and earned a certificate worth <span className="font-bold text-emerald-600">{course?.cpd_hours || 2} CPD hours</span>.
          </p>

          {/* High-Fidelity Certificate Preview Card */}
          <div className="flex justify-center mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-[#FCFBF7] shadow-inner p-2">
            <div className="overflow-x-auto max-w-full">
              <div style={{ width: "1050px", transform: "scale(0.72)", transformOrigin: "top center", height: "540px" }}>
                <CertificateTemplate
                  id="learner-course-certificate"
                  learnerName={learnerName || "Jane Smith"}
                  courseTitle={course?.title || "Safeguarding Children"}
                  organisationName={organisationName || "CareConnect Demo Authority"}
                  organisationLogo={organisationLogo}
                  issueDate={new Date()}
                  level={course?.level || "Advanced"}
                  category={course?.category || "Mandatory"}
                  cpdHours={course?.cpd_hours || 2}
                  certNumber={certId}
                />
              </div>
            </div>
          </div>

          {/* Status row */}
          <div className="grid grid-cols-3 gap-3 mb-6 max-w-2xl mx-auto">
            <div className="bg-emerald-50 rounded-xl p-3">
              <CheckCircle2 size={16} className="text-emerald-600 mx-auto mb-1" />
              <p className="text-xs font-semibold text-emerald-700">CPD Hours Added</p>
              <p className="text-[10px] text-emerald-600">{course?.cpd_hours || 2} hours</p>
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
            onClick={handleDownload}
            disabled={downloading}
            className="h-11 px-8 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-500 inline-flex items-center gap-2 transition-colors disabled:opacity-60 shadow-sm"
          >
            {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            {downloading ? "Generating PDF…" : "Download Certificate"}
          </button>
          <p className="text-xs text-slate-400 mt-3">
            Your certificate has been saved to your CPD record. You can re-download it anytime from CPD Hub.
          </p>
        </div>
      </div>
    </div>
  );
}