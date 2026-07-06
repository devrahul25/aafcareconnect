import { MapPin, Mail, Phone, Globe, Briefcase, Calendar, Languages, Star } from "lucide-react";
import { PASSPORT_PROFILE, yearsFrom } from "@/lib/passportData";

const SPECIALISM_COLORS = [
  "bg-blue-50 text-blue-700 border-blue-200",
  "bg-violet-50 text-violet-700 border-violet-200",
  "bg-emerald-50 text-emerald-700 border-emerald-200",
  "bg-amber-50 text-amber-700 border-amber-200",
  "bg-pink-50 text-pink-700 border-pink-200",
  "bg-indigo-50 text-indigo-700 border-indigo-200",
];

export default function PassportOverview({ profile = PASSPORT_PROFILE }) {
  const years = yearsFrom(profile.startDate);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-fade-in">
      {/* Bio */}
      <div className="lg:col-span-2 space-y-4">
        <div className="card p-5">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Professional Summary</h3>
          <p className="text-sm text-slate-700 leading-relaxed">{profile.bio}</p>
        </div>

        {/* Personal details grid */}
        <div className="card p-5">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Briefcase, label: "Role",             value: profile.role },
              { icon: Globe,     label: "Organisation",     value: profile.organisation },
              { icon: Calendar,  label: "Start Date",       value: new Date(profile.startDate).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" }) },
              { icon: Star,      label: "Years Experience", value: `${years} years` },
              { icon: Mail,      label: "Email",            value: profile.email },
              { icon: Phone,     label: "Phone",            value: profile.phone },
              { icon: MapPin,    label: "Location",         value: profile.location },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon size={13} className="text-slate-500" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                  <p className="text-sm font-semibold text-slate-800">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div className="card p-5">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Languages size={13} /> Languages
          </h3>
          <div className="flex flex-wrap gap-2">
            {profile.languages.map(l => (
              <span key={l} className="text-xs font-semibold bg-slate-100 text-slate-700 rounded-full px-3 py-1">{l}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Specialisms + Level */}
      <div className="space-y-4">
        <div className="card p-5">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Specialisms</h3>
          <div className="space-y-2">
            {profile.specialisms.map((s, i) => (
              <div key={s} className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold ${SPECIALISM_COLORS[i % SPECIALISM_COLORS.length]}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* Level card */}
        <div className="card p-5 bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
          <h3 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-3">Professional Level</h3>
          <div className="text-center py-3">
            <p className="text-4xl mb-2">🥇</p>
            <p className="font-heading font-bold text-amber-800 text-lg">{profile.level}</p>
            <p className="text-xs text-amber-600 mt-1">{profile.levelProgress}% to {profile.nextLevel}</p>
          </div>
          <div className="h-2 bg-amber-200 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full" style={{ width: `${profile.levelProgress}%` }} />
          </div>
          <p className="text-[10px] text-amber-600 mt-2 text-center">{profile.pointsToNext} points needed</p>
        </div>

        {/* Quick stats */}
        <div className="card p-5">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Quick Stats</h3>
          <div className="space-y-3">
            {[
              { label: "Total CPD Hours", value: profile.cpdHours + "h", pct: 95 },
              { label: "Compliance Score", value: profile.complianceScore + "%", pct: profile.complianceScore },
              { label: "Skills Score", value: profile.skillsScore + "%", pct: profile.skillsScore },
            ].map(s => (
              <div key={s.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">{s.label}</span>
                  <span className="font-bold text-slate-800">{s.value}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all duration-700" style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}