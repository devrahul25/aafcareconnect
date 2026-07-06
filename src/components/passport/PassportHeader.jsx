import { Shield, Share2, Download, Link2, MapPin, Mail, Phone, Star } from "lucide-react";
import { PASSPORT_PROFILE, LEVEL_SYSTEM } from "@/lib/passportData";
import { jsPDF } from "jspdf";

function LevelBadge({ level }) {
  const cfg = LEVEL_SYSTEM.find(l => l.name === level) || LEVEL_SYSTEM[2];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.border} ${cfg.textColor}`}>
      <span>{cfg.icon}</span> {cfg.name}
    </span>
  );
}

export default function PassportHeader({ profile = PASSPORT_PROFILE, onDownload = undefined }) {
  const levelCfg = LEVEL_SYSTEM.find(l => l.name === profile.level) || LEVEL_SYSTEM[2];

  const handleDownload = () => {
    if (onDownload) { onDownload(); return; }
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    doc.setFillColor(15, 23, 42); doc.rect(0, 0, 210, 297, "F");
    doc.setFillColor(37, 99, 235); doc.roundedRect(15, 15, 180, 40, 4, 4, "F");
    doc.setTextColor(255,255,255); doc.setFont("helvetica","bold"); doc.setFontSize(18);
    doc.text("AAF CareConnect™ — Professional Passport", 105, 30, { align:"center" });
    doc.setFontSize(10); doc.setFont("helvetica","normal");
    doc.text(`${profile.id}  ·  Generated ${new Date().toLocaleDateString("en-GB")}`, 105, 42, { align:"center" });
    doc.setFillColor(255,255,255); doc.roundedRect(15, 62, 180, 50, 4, 4, "F");
    doc.setTextColor(15,23,42); doc.setFont("helvetica","bold"); doc.setFontSize(16);
    doc.text(profile.name, 70, 80);
    doc.setFontSize(11); doc.setFont("helvetica","normal"); doc.setTextColor(100,116,139);
    doc.text(`${profile.role}  ·  ${profile.organisation}`, 70, 89);
    doc.text(`${profile.level}  ·  CPD Hours: ${profile.cpdHours}h  ·  Compliance: ${profile.complianceScore}%`, 70, 98);
    doc.save(`Professional_Passport_${profile.name.replace(" ","_")}.pdf`);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950" />
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #2563eb 0%, transparent 50%), radial-gradient(circle at 80% 20%, #7c3aed 0%, transparent 40%)" }} />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-600/5 -translate-x-16 -translate-y-32" />

      <div className="relative z-10 p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${levelCfg.color} flex items-center justify-center text-white font-heading font-bold text-3xl shadow-xl shadow-black/30`}>
              {profile.avatar}
            </div>
            {/* Verified ring */}
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
              <Shield size={12} className="text-white" />
            </div>
          </div>

          {/* Identity */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">AAF CareConnect™ Professional Passport</p>
            </div>
            <h1 className="font-heading font-bold text-3xl text-white mb-1">{profile.name}</h1>
            <p className="text-blue-200 font-semibold text-lg mb-2">{profile.role}</p>
            <p className="text-slate-400 text-sm mb-3">{profile.organisation}</p>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <LevelBadge level={profile.level} />
              <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-800/60 border border-slate-700 rounded-full px-2.5 py-1">
                {profile.id}
              </span>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1"><Mail size={11} /> {profile.email}</span>
              <span className="flex items-center gap-1"><Phone size={11} /> {profile.phone}</span>
              <span className="flex items-center gap-1"><MapPin size={11} /> {profile.location}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            <button onClick={handleDownload} className="h-9 px-4 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center gap-2 transition-colors">
              <Download size={13} /> Download PDF
            </button>
            <button className="h-9 px-4 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-xl flex items-center gap-2 transition-colors border border-white/10">
              <Share2 size={13} /> Share Passport
            </button>
            <button className="h-9 px-4 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-xl flex items-center gap-2 transition-colors border border-white/10">
              <Link2 size={13} /> Verification Link
            </button>
          </div>
        </div>

        {/* Level progress bar */}
        <div className="mt-6 bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{levelCfg.icon}</span>
              <span className="text-sm font-bold text-white">{profile.level}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">{profile.pointsToNext} points to </span>
              <span className="text-xs font-bold text-blue-400">{profile.nextLevel}</span>
            </div>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${levelCfg.color} rounded-full transition-all duration-1000`}
              style={{ width: `${profile.levelProgress}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-1">{profile.levelProgress}% complete</p>
        </div>
      </div>
    </div>
  );
}