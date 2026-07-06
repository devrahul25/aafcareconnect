// @ts-nocheck
import { useState } from "react";
import { Search, QrCode, CheckCircle2, XCircle, Shield, Clock, Award, AlertTriangle } from "lucide-react";
import { CERTS, fmt, daysUntil } from "@/lib/cpdData";

function VerificationResult({ cert }) {
  if (!cert) return null;
  const days = daysUntil(cert.expiry);
  const isValid = cert.status !== "expired";

  return (
    <div className={`rounded-2xl border-2 overflow-hidden animate-fade-in ${isValid ? "border-emerald-200" : "border-red-200"}`}>
      {/* Status bar */}
      <div className={`px-5 py-3 flex items-center gap-2 ${isValid ? "bg-emerald-600" : "bg-red-600"}`}>
        {isValid ? <CheckCircle2 size={16} className="text-white" /> : <XCircle size={16} className="text-white" />}
        <span className="text-sm font-bold text-white">
          {isValid ? "✓ Certificate Verified & Valid" : "✗ Certificate Expired — Not Valid"}
        </span>
      </div>

      <div className="p-5 bg-white space-y-4">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl ${cert.color} flex items-center justify-center text-white font-bold text-sm`}>
            {cert.avatar}
          </div>
          <div>
            <h3 className="font-bold text-slate-900">{cert.title}</h3>
            <p className="text-sm text-slate-500">{cert.person} · {cert.provider}</p>
          </div>
          {cert.verified && (
            <div className="ml-auto flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1">
              <Shield size={11} />
              Manager Verified
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Certificate ID", value: cert.certId, mono: true },
            { label: "CPD Hours", value: `${cert.hours} hours` },
            { label: "Category", value: cert.category },
            { label: "Date Issued", value: fmt(cert.issued) },
            { label: "Valid Until", value: fmt(cert.expiry), highlight: !isValid },
            { label: "Days Remaining", value: days > 0 ? `${days} days` : "Expired", highlight: !isValid },
          ].map(s => (
            <div key={s.label} className="bg-slate-50 rounded-xl p-3">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
              <p className={`text-xs font-semibold mt-0.5 ${s.mono ? "font-mono text-[10px]" : ""} ${s.highlight ? "text-red-600" : "text-slate-800"}`}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        <div className={`flex items-center gap-2 p-3 rounded-xl text-xs ${isValid ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
          {isValid ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
          <span>
            {isValid
              ? "This certificate is authentic, current and meets Ofsted compliance requirements."
              : "This certificate has expired. Please contact the certificate holder to arrange renewal."}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CertificateVerificationPortal() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const [mode, setMode] = useState("id"); // id | qr

  const handleSearch = () => {
    const found = CERTS.find(c =>
      c.certId.toLowerCase() === query.trim().toLowerCase() ||
      c.title.toLowerCase().includes(query.trim().toLowerCase())
    );
    setResult(found || null);
    setSearched(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fade-in">
      <div className="card p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <Shield size={18} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Certificate Verification Portal</h3>
            <p className="text-xs text-slate-500">Verify any AAF CareConnect™ certificate for Ofsted, Regulation 44 or inspection purposes</p>
          </div>
        </div>

        {/* Mode tabs */}
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-5">
          {[["id","Certificate ID / Name", Search],["qr","QR Code Lookup", QrCode]].map(([key, label, Icon]) => (
            <button key={key} onClick={() => setMode(key)}
              className={`flex-1 h-8 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${mode === key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
              <Icon size={12} /> {label}
            </button>
          ))}
        </div>

        {mode === "id" && (
          <div className="space-y-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={e => { setQuery(e.target.value); setSearched(false); }}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                placeholder="Enter Certificate ID (e.g. AAF-SG2-A4E9F1) or course title…"
                className="w-full h-11 pl-10 pr-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button onClick={handleSearch} className="w-full h-10 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors">
              Verify Certificate
            </button>

            {/* Sample IDs */}
            <div>
              <p className="text-[10px] text-slate-400 mb-1.5">Try a sample certificate ID:</p>
              <div className="flex flex-wrap gap-1.5">
                {CERTS.slice(0, 5).map(c => (
                  <button key={c.certId} onClick={() => { setQuery(c.certId); setSearched(false); }}
                    className="text-[10px] font-mono font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded px-2 py-0.5 transition-colors">
                    {c.certId}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {mode === "qr" && (
          <div className="text-center py-8 space-y-3">
            <div className="w-20 h-20 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center">
              <QrCode size={36} className="text-slate-400" />
            </div>
            <p className="text-sm text-slate-600 font-medium">QR Scanner</p>
            <p className="text-xs text-slate-400">Point your device camera at a certificate QR code to verify instantly</p>
            <button className="h-9 px-5 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors mx-auto flex items-center gap-2">
              <QrCode size={13} /> Open Camera Scanner
            </button>
          </div>
        )}
      </div>

      {/* Result */}
      {searched && mode === "id" && (
        result
          ? <VerificationResult cert={result} />
          : (
            <div className="card p-6 text-center">
              <XCircle size={28} className="text-red-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-900">Certificate Not Found</p>
              <p className="text-xs text-slate-500 mt-1">No matching certificate found for "<span className="font-medium">{query}</span>". Please check the ID and try again.</p>
            </div>
          )
      )}

      {/* Trust indicators */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Shield, label: "Ofsted-aligned", desc: "Meets NMS requirements" },
          { icon: Award,  label: "CPD Accredited", desc: "All certificates verified" },
          { icon: Clock,  label: "Real-time",       desc: "Live validity checks" },
        ].map(t => {
          const Icon = t.icon;
          return (
            <div key={t.label} className="card p-3 text-center">
              <Icon size={16} className="text-blue-600 mx-auto mb-1.5" />
              <p className="text-xs font-bold text-slate-700">{t.label}</p>
              <p className="text-[10px] text-slate-400">{t.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}