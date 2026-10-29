import { MapPin, Mail, Phone, Globe, Briefcase, Calendar, Languages, Star } from "lucide-react";
import { LEVEL_SYSTEM, fmt, yearsFrom } from "@/lib/passportData";

const SPECIALISM_COLORS = [
  "bg-blue-50 text-blue-700 border-blue-200",
  "bg-violet-50 text-violet-700 border-violet-200",
  "bg-emerald-50 text-emerald-700 border-emerald-200",
  "bg-amber-50 text-amber-700 border-amber-200",
  "bg-pink-50 text-pink-700 border-pink-200",
  "bg-indigo-50 text-indigo-700 border-indigo-200",
];

export default function PassportOverview({ profile = {} }) {
  const years = yearsFrom(profile?.startDate);
  const levelCfg = LEVEL_SYSTEM.find(l => l.name === profile?.level) || LEVEL_SYSTEM[0];

  const languages = Array.isArray(profile?.languages) && profile.languages.length > 0
    ? profile.languages
    : ["English"];

  const specialisms = Array.isArray(profile?.specialisms) && profile.specialisms.length > 0
    ? profile.specialisms
    : ["Safeguarding & Child Protection", "Care Practice Standards", "Continuous Professional Development"];

  const cpdHours = profile?.cpdHours || 0;
  const complianceScore = profile?.complianceScore ?? 100;
  const skillsScore = profile?.skillsScore || 0;

  const cpdTarget = 30; // 30 CPD hours target per year
  const cpdPct = Math.min(100, Math.round((cpdHours / cpdTarget) * 100));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-fade-in">
      {/* Left Column: Bio & Details */}
      <div className="lg:col-span-2 space-y-4">
        {/* Professional Summary */}
        <div className="card p-5 bg-white">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Professional Practice Summary
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            {profile?.bio ||
              `${profile?.name || "Practitioner"} is a committed social care professional at ${
                profile?.organisation || "AAF CareConnect"
              }, actively participating in continuous training and maintaining full regulatory compliance standards.`}
          </p>
        </div>

        {/* Personal Details */}
        <div className="card p-5 bg-white">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
            Professional Credentials & Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: Briefcase, label: "Role Title", value: profile?.role || "Social Care Practitioner" },
              { icon: Globe, label: "Organisation / Agency", value: profile?.organisation || "AAF CareConnect" },
              { icon: Calendar, label: "Registered Since", value: fmt(profile?.startDate) },
              { icon: Star, label: "Experience Logged", value: years > 0 ? `${years} year${years > 1 ? "s" : ""}` : "First Year" },
              { icon: Mail, label: "Verified Email", value: profile?.email || "—" },
              { icon: Phone, label: "Contact Phone", value: profile?.phone && profile.phone !== "—" ? profile.phone : "Provided on File" },
              { icon: MapPin, label: "Primary Jurisdiction", value: profile?.location || "United Kingdom" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon size={14} className="text-slate-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                  <p className="text-sm font-semibold text-slate-800 truncate">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div className="card p-5 bg-white">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Languages size={14} className="text-slate-500" /> Professional Working Languages
          </h3>
          <div className="flex flex-wrap gap-2">
            {languages.map(l => (
              <span key={l} className="text-xs font-semibold bg-slate-100 text-slate-700 rounded-full px-3 py-1 border border-slate-200">
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Specialisms, Level & Quick Stats */}
      <div className="space-y-4">
        {/* Specialisms */}
        <div className="card p-5 bg-white">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Core Practice Specialisms
          </h3>
          <div className="space-y-2">
            {specialisms.map((s, i) => (
              <div
                key={s}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold ${
                  SPECIALISM_COLORS[i % SPECIALISM_COLORS.length]
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Level card */}
        <div className="card p-5 bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 shadow-sm">
          <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-3">
            Professional Tier Standing
          </h3>
          <div className="text-center py-2">
            <p className="text-4xl mb-1">{levelCfg.icon}</p>
            <p className="font-heading font-bold text-amber-900 text-lg">
              {profile?.level || "Bronze Learner"}
            </p>
            <p className="text-xs text-amber-700 mt-1 font-medium">
              {profile?.levelProgress || 0}% progress toward {profile?.nextLevel || "Mastery"}
            </p>
          </div>
          <div className="h-2 bg-amber-200/80 rounded-full overflow-hidden mt-3">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-1000"
              style={{ width: `${profile?.levelProgress || 0}%` }}
            />
          </div>
          <p className="text-[10px] text-amber-700 mt-2 text-center font-medium">
            {profile?.pointsToNext || 0} points needed to level up
          </p>
        </div>

        {/* Quick stats */}
        <div className="card p-5 bg-white">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Key Performance Metrics
          </h3>
          <div className="space-y-3">
            {[
              {
                label: "Annual CPD Target (30h)",
                value: `${cpdHours}h`,
                pct: cpdPct,
                color: "bg-indigo-600",
              },
              {
                label: "Live Ofsted Compliance",
                value: `${complianceScore}%`,
                pct: complianceScore,
                color: complianceScore >= 90 ? "bg-emerald-600" : complianceScore >= 75 ? "bg-blue-600" : "bg-amber-500",
              },
              {
                label: "Skills Competency Rating",
                value: `${skillsScore}%`,
                pct: skillsScore,
                color: "bg-violet-600",
              },
            ].map(s => (
              <div key={s.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">{s.label}</span>
                  <span className="font-bold text-slate-800">{s.value}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${s.color} rounded-full transition-all duration-700`}
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}