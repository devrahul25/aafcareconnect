import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  User, Award, BookOpen, TrendingUp, Star, CheckCircle2, Sparkles, Map
} from "lucide-react";
import PassportHeader from "@/components/passport/PassportHeader";
import PassportKPIs from "@/components/passport/PassportKPIs";
import PassportOverview from "@/components/passport/PassportOverview";
import PassportCertifications from "@/components/passport/PassportCertifications";
import PassportTranscript from "@/components/passport/PassportTranscript";
import PassportSkillsMatrix from "@/components/passport/PassportSkillsMatrix";
import PassportAchievements from "@/components/passport/PassportAchievements";
import PassportCareerJourney from "@/components/passport/PassportCareerJourney";
import PassportCompliance from "@/components/passport/PassportCompliance";
import PassportAICoach from "@/components/passport/PassportAICoach";
import { PASSPORT_PROFILE } from "@/lib/passportData";
import { getCPDCertificatesForUser } from "@/lib/orgData";

const TABS = [
  { key: "overview",     label: "Overview",       icon: User         },
  { key: "certs",        label: "Certifications", icon: Award        },
  { key: "transcript",   label: "CPD Transcript", icon: BookOpen     },
  { key: "skills",       label: "Skills Matrix",  icon: Map          },
  { key: "achievements", label: "Achievements",   icon: Star         },
  { key: "journey",      label: "Career Journey", icon: TrendingUp   },
  { key: "compliance",   label: "Compliance",     icon: CheckCircle2 },
  { key: "ai_coach",     label: "AI Coach",       icon: Sparkles     },
];

export default function ProfessionalPassport() {
  const { user, organisationId } = /** @type {any} */ (useOutletContext() || {});
  const [tab, setTab] = useState("overview");
  const [liveStats, setLiveStats] = useState(null);

  useEffect(() => {
    if (!organisationId || !user?.id) return;
    getCPDCertificatesForUser(organisationId, user.id)
      .then(certs => {
        setLiveStats({
          cpdHours:        certs.reduce((s, c) => s + (c.cpd_hours || 0), 0),
          certificates:    certs.length,
          complianceScore: 0, // derive from ComplianceRecord when available
          skillsScore:     0,
        });
      })
      .catch(() => {});
  }, [organisationId, user?.id]);

  const profile = {
    ...PASSPORT_PROFILE,
    ...(user?.full_name ? {
      name:   user.full_name,
      avatar: user.full_name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase(),
    } : {}),
    ...(liveStats ?? {}),
  };

  return (
    <div className="p-6 space-y-5 animate-fade-in max-w-[1400px] mx-auto">
      <PassportHeader profile={profile} />

      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-50 to-blue-50 border border-violet-100 rounded-xl text-xs">
        <span className="text-violet-600 font-bold">🔄 Auto Updated</span>
        <span className="text-slate-500">CPD hours, certificates and compliance scores update automatically from Learning Hub, CPD Hub and Compliance Hub.</span>
        <span className="ml-auto text-[10px] font-bold text-blue-600 flex-shrink-0">
          {organisationId ? "⚡ Live Data" : "⚠ Demo Mode"}
        </span>
      </div>

      <PassportKPIs profile={profile} />

      <div className="flex gap-0 border-b border-slate-200 overflow-x-auto">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors -mb-px whitespace-nowrap ${
              tab === key ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>

      {tab === "overview"     && <PassportOverview profile={profile} />}
      {tab === "certs"        && <PassportCertifications />}
      {tab === "transcript"   && <PassportTranscript />}
      {tab === "skills"       && <PassportSkillsMatrix />}
      {tab === "achievements" && <PassportAchievements />}
      {tab === "journey"      && <PassportCareerJourney />}
      {tab === "compliance"   && <PassportCompliance />}
      {tab === "ai_coach"     && <PassportAICoach />}
    </div>
  );
}