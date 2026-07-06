// @ts-nocheck
import { useEffect, useState } from "react";
import { Clock, Award, CheckCircle2, TrendingUp, Flame, Star } from "lucide-react";
import { PASSPORT_PROFILE, LEVEL_SYSTEM } from "@/lib/passportData";

function AnimKpi({ icon: Icon, bg, label, value, sub, isText }) {
  const [displayed, setDisplayed] = useState(0);
  const target = typeof value === "number" ? value : 0;

  useEffect(() => {
    if (typeof value !== "number") return;
    let cur = 0;
    const step = Math.ceil(target / 30);
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      setDisplayed(cur);
      if (cur >= target) clearInterval(t);
    }, 35);
    return () => clearInterval(t);
  }, [target]);

  return (
    <div className="card p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <p className="text-2xl font-heading font-bold text-slate-900">
        {typeof value === "number" ? displayed : value}
      </p>
      <p className="text-xs font-bold text-slate-700 mt-0.5">{label}</p>
      {sub && <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function PassportKPIs({ profile = PASSPORT_PROFILE }) {
  const levelCfg = LEVEL_SYSTEM.find(l => l.name === profile.level) || LEVEL_SYSTEM[2];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <AnimKpi icon={Clock}        bg="bg-indigo-600"  label="CPD Hours"        value={profile.cpdHours}         sub="Total earned" />
      <AnimKpi icon={Award}        bg="bg-blue-600"    label="Certificates"     value={profile.certificates}     sub="Earned to date" />
      <AnimKpi icon={CheckCircle2} bg="bg-emerald-600" label="Compliance Score" value={null} sub={`${profile.complianceScore}%`} />
      <AnimKpi icon={TrendingUp}   bg="bg-violet-600"  label="Skills Score"     value={null} sub={`${profile.skillsScore}%`} />
      <AnimKpi icon={Flame}        bg="bg-orange-500"  label="Learning Streak"  value={profile.learningStreak}   sub="Days active" />
      <div className="card p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
            <Star size={18} className="text-white" />
          </div>
        </div>
        <p className="text-sm font-heading font-bold text-slate-900">{levelCfg.icon} {profile.level}</p>
        <p className="text-[10px] text-slate-400 mt-1">Professional Level</p>
        <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full bg-gradient-to-r ${levelCfg.color} rounded-full`} style={{ width: `${profile.levelProgress}%` }} />
        </div>
      </div>
    </div>
  );
}