import { useState } from "react";
import { Shield, Share2, Download, Link2, MapPin, Mail, Phone, Check } from "lucide-react";
import { LEVEL_SYSTEM } from "@/lib/passportData";
import { jsPDF } from "jspdf";

function LevelBadge({ level }) {
  const cfg = LEVEL_SYSTEM.find(l => l.name === level) || LEVEL_SYSTEM[0];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.border} ${cfg.textColor}`}>
      <span>{cfg.icon}</span> {cfg.name}
    </span>
  );
}

export default function PassportHeader({ profile = {}, onDownload = undefined }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [shared, setShared] = useState(false);

  const levelCfg = LEVEL_SYSTEM.find(l => l.name === profile?.level) || LEVEL_SYSTEM[0];
  const name = profile?.name || "Practitioner";
  const role = profile?.role || "Social Care Practitioner";
  const org = profile?.organisation || "AAF CareConnect";
  const passportId = profile?.id || "AAF-PAS-LIVE";
  const avatar = profile?.avatar || (name ? name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "PP");

  const handleDownload = () => {
    if (onDownload) { onDownload(); return; }
    try {
      const doc = new jsPDF({ unit: "mm", format: "a4" });

      // Slate Navy Outer Box
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 297, "F");

      // Blue Brand Header
      doc.setFillColor(37, 99, 235);
      doc.roundedRect(15, 15, 180, 42, 4, 4, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("AAF CareConnect™ — Professional Passport", 105, 30, { align: "center" });
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`${passportId}  ·  Generated ${new Date().toLocaleDateString("en-GB")}`, 105, 42, { align: "center" });

      // Profile Card
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(15, 64, 180, 60, 4, 4, "F");

      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text(name, 25, 80);

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      doc.text(`${role}  ·  ${org}`, 25, 90);

      doc.setTextColor(37, 99, 235);
      doc.setFont("helvetica", "bold");
      doc.text(`Level: ${profile?.level || "Bronze Learner"}`, 25, 100);

      doc.setTextColor(100, 116, 139);
      doc.setFont("helvetica", "normal");
      doc.text(`Total CPD Hours: ${profile?.cpdHours || 0} hrs   |   Compliance Rating: ${profile?.complianceScore ?? 100}%`, 25, 110);
      doc.text(`Official Email: ${profile?.email || "Registered on AAF CareConnect"}`, 25, 118);

      // Security verification box
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(15, 132, 180, 40, 4, 4, "F");
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Verification & Compliance Notice", 25, 144);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text("This Professional Passport represents continuous, verified professional development", 25, 153);
      doc.text("and statutory compliance maintained within the AAF CareConnect framework.", 25, 160);
      doc.text(`Digital Verification ID: ${passportId}`, 25, 167);

      doc.save(`Professional_Passport_${name.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error("PDF download failed:", err);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/professional-passport?id=${passportId}`;
    navigator.clipboard?.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }).catch(() => {});
  };

  const handleShare = () => {
    const url = `${window.location.origin}/professional-passport?id=${passportId}`;
    if (navigator.share) {
      navigator.share({
        title: `${name} — Professional Passport`,
        text: `View my accredited continuous professional development passport on AAF CareConnect.`,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url).then(() => {
        setShared(true);
        setTimeout(() => setShared(false), 2500);
      }).catch(() => {});
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-xl">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, #2563eb 0%, transparent 50%), radial-gradient(circle at 80% 20%, #7c3aed 0%, transparent 40%)",
        }}
      />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-600/5 -translate-x-16 -translate-y-32" />

      <div className="relative z-10 p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div
              className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${levelCfg.color} flex items-center justify-center text-white font-heading font-bold text-3xl shadow-xl shadow-black/30 border-2 border-white/20`}
            >
              {avatar}
            </div>
            {/* Verified badge */}
            <div
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center shadow-md"
              title="Verified Ofsted-compliant identity"
            >
              <Shield size={12} className="text-white" />
            </div>
          </div>

          {/* Identity */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                AAF CareConnect™ Professional Passport
              </p>
            </div>
            <h1 className="font-heading font-bold text-3xl text-white mb-1 tracking-tight">{name}</h1>
            <p className="text-blue-200 font-semibold text-lg mb-2">{role}</p>
            <p className="text-slate-400 text-sm mb-3 font-medium">{org}</p>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <LevelBadge level={profile?.level || "Bronze Learner"} />
              <span className="text-[10px] font-mono font-bold text-slate-300 bg-slate-800/80 border border-slate-700 rounded-full px-3 py-1">
                {passportId}
              </span>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-slate-300">
              {profile?.email && (
                <span className="flex items-center gap-1.5"><Mail size={12} className="text-blue-400" /> {profile.email}</span>
              )}
              {profile?.phone && profile.phone !== "—" && (
                <span className="flex items-center gap-1.5"><Phone size={12} className="text-emerald-400" /> {profile.phone}</span>
              )}
              <span className="flex items-center gap-1.5"><MapPin size={12} className="text-amber-400" /> {profile?.location || "United Kingdom"}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 flex-shrink-0 w-full sm:w-auto">
            <button
              onClick={handleDownload}
              className="h-9 px-4 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md shadow-blue-900/30"
            >
              <Download size={13} /> Download Passport PDF
            </button>
            <button
              onClick={handleShare}
              className="h-9 px-4 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-xl flex items-center justify-center gap-2 transition-colors border border-white/10"
            >
              {shared ? <Check size={13} className="text-emerald-400" /> : <Share2 size={13} />}
              {shared ? "Link Copied!" : "Share Passport"}
            </button>
            <button
              onClick={handleCopyLink}
              className="h-9 px-4 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-xl flex items-center justify-center gap-2 transition-colors border border-white/10"
            >
              {copiedLink ? <Check size={13} className="text-emerald-400" /> : <Link2 size={13} />}
              {copiedLink ? "Link Copied!" : "Verification Link"}
            </button>
          </div>
        </div>

        {/* Level progress bar */}
        <div className="mt-6 bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{levelCfg.icon}</span>
              <span className="text-sm font-bold text-white">{profile?.level || "Bronze Learner"}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">{profile?.pointsToNext || 0} points to </span>
              <span className="text-xs font-bold text-blue-400">{profile?.nextLevel || "Mastery"}</span>
            </div>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${levelCfg.color} rounded-full transition-all duration-1000`}
              style={{ width: `${profile?.levelProgress || 0}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5 font-medium">{profile?.levelProgress || 0}% tier progress completed</p>
        </div>
      </div>
    </div>
  );
}