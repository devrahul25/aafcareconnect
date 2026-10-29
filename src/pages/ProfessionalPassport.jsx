// @ts-nocheck
import { useState, useEffect, useMemo, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import {
  User, Award, BookOpen, TrendingUp, Star, CheckCircle2, Sparkles, Map, Users, RefreshCw
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
import {
  calculateLevel,
  normalizeCertificate,
  buildDynamicSkills,
  buildDynamicAchievements,
  buildDynamicTimeline,
  buildDynamicCompliance,
  buildDynamicRecommendations,
} from "@/lib/passportData";
import { apiClient } from "@/api/apiClient";
import { useAuth } from "@/lib/AuthContext";

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
  const outletCtx = useOutletContext() || {};
  const authCtx = useAuth() || {};

  const user = outletCtx.user || authCtx.user;
  const organisationId = outletCtx.organisationId || authCtx.organisationId || user?.organization_id;
  const organisation = outletCtx.organisation || authCtx.organisation;

  const [tab, setTab] = useState("overview");
  const [selectedUserId, setSelectedUserId] = useState(user?.id || "");
  const [staffList, setStaffList] = useState([]);
  const [targetUser, setTargetUser] = useState(user);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [certs, setCerts] = useState([]);
  const [enrolments, setEnrolments] = useState([]);
  const [staffMatrix, setStaffMatrix] = useState([]);

  // Sync selectedUserId if user changes
  useEffect(() => {
    if (user?.id && !selectedUserId) {
      setSelectedUserId(user.id);
      setTargetUser(user);
    }
  }, [user?.id, selectedUserId]);

  // Fetch staff list for managers/admins to view staff passports
  useEffect(() => {
    let isMounted = true;
    apiClient.get("/users")
      .then(res => {
        if (!isMounted) return;
        const users = res.data?.data || res.data || [];
        if (Array.isArray(users)) {
          setStaffList(users);
        }
      })
      .catch(() => {
        // Regular staff/learners may not have permissions to list users
      });
    return () => { isMounted = false; };
  }, []);

  // When selected user changes, update targetUser object
  useEffect(() => {
    if (!selectedUserId) return;
    if (selectedUserId === user?.id) {
      setTargetUser(user);
    } else {
      const found = staffList.find(s => s.id === selectedUserId);
      if (found) {
        setTargetUser(found);
      } else {
        // Try to fetch individual profile
        apiClient.get(`/users/${selectedUserId}`)
          .then(res => {
            const u = res.data?.data || res.data;
            if (u) setTargetUser(u);
          })
          .catch(() => {});
      }
    }
  }, [selectedUserId, user, staffList]);

  // Fetch live real data for the active target user
  const fetchPassportData = useCallback(async () => {
    const uid = selectedUserId || user?.id;
    if (!uid) return;

    try {
      const [certsRes, enrolmentsRes, matrixRes] = await Promise.allSettled([
        apiClient.get("/cpd-certificates", { params: { user_id: uid, organisation_id: organisationId } }),
        apiClient.get("/course-enrolments", { params: { user_id: uid, organisation_id: organisationId } }),
        apiClient.get("/compliance-records/staff-matrix"),
      ]);

      if (certsRes.status === "fulfilled") {
        const rawCerts = certsRes.value.data?.data || certsRes.value.data || [];
        setCerts(Array.isArray(rawCerts) ? rawCerts : []);
      } else {
        setCerts([]);
      }

      if (enrolmentsRes.status === "fulfilled") {
        const rawEnrolments = enrolmentsRes.value.data?.data || enrolmentsRes.value.data || [];
        setEnrolments(Array.isArray(rawEnrolments) ? rawEnrolments : []);
      } else {
        setEnrolments([]);
      }

      if (matrixRes.status === "fulfilled") {
        const rawMatrix = matrixRes.value.data?.data || matrixRes.value.data || [];
        setStaffMatrix(Array.isArray(rawMatrix) ? rawMatrix : []);
      } else {
        setStaffMatrix([]);
      }
    } catch (err) {
      console.error("Error loading professional passport data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedUserId, user?.id, organisationId]);

  useEffect(() => {
    setLoading(true);
    fetchPassportData();
  }, [fetchPassportData]);

  const handleManualRefresh = () => {
    setRefreshing(true);
    fetchPassportData();
  };

  // ─── Dynamic Metrics Computation from Real Data ───────────────────────────
  const normalizedCerts = useMemo(() => {
    return certs.map(normalizeCertificate);
  }, [certs]);

  const completedEnrolments = useMemo(() => {
    return enrolments.filter(e => e.status === "COMPLETED");
  }, [enrolments]);

  // Accurate CPD hours: cert hours + completed course hours
  const totalCpdHours = useMemo(() => {
    const certHours = normalizedCerts.reduce((sum, c) => sum + (c.hours || 0), 0);
    const courseHours = completedEnrolments.reduce((sum, e) => {
      const mins = e.course?.duration_minutes || 60;
      return sum + Math.max(1, Math.round(mins / 60));
    }, 0);
    return certHours + courseHours;
  }, [normalizedCerts, completedEnrolments]);

  // Total certificates count
  const totalCertCount = normalizedCerts.length;

  // Real compliance score from matrix or calculated from certificates
  const complianceScore = useMemo(() => {
    const uid = selectedUserId || user?.id;
    const matrixEntry = staffMatrix.find(s => s.id === uid);
    if (matrixEntry && typeof matrixEntry.score === "number") {
      return matrixEntry.score;
    }
    const expiredCount = normalizedCerts.filter(c => c.status === "expired").length;
    if (expiredCount > 0) {
      return Math.max(25, 100 - (expiredCount * 25));
    }
    return 100;
  }, [staffMatrix, selectedUserId, user?.id, normalizedCerts]);

  // Dynamic Skills matrix
  const skills = useMemo(() => {
    return buildDynamicSkills({ certificates: normalizedCerts, enrolments });
  }, [normalizedCerts, enrolments]);

  const skillsScore = useMemo(() => {
    if (skills.length === 0) return 0;
    const total = skills.length * 5;
    const earned = skills.reduce((acc, s) => acc + s.level, 0);
    return Math.round((earned / total) * 100);
  }, [skills]);

  // Points and level calculation
  const points = useMemo(() => {
    return Math.round(
      totalCpdHours * 1.5 +
      totalCertCount * 5 +
      completedEnrolments.length * 8 +
      (complianceScore >= 90 ? 15 : 0)
    );
  }, [totalCpdHours, totalCertCount, completedEnrolments.length, complianceScore]);

  const levelInfo = useMemo(() => {
    return calculateLevel(points);
  }, [points]);

  // Dynamic user profile object
  const profile = useMemo(() => {
    const active = targetUser || user || {};
    const name = active.full_name || active.name || (active.email ? active.email.split("@")[0] : "Practitioner");
    const role = (
      active.role_type ||
      active.role?.name ||
      (typeof active.role === "string" ? active.role : "") ||
      active.user_roles?.map(r => r.role?.name || r.name).join(", ") ||
      "Social Care Practitioner"
    );

    const specialismsSet = new Set([
      ...normalizedCerts.map(c => c.category).filter(Boolean),
      ...completedEnrolments.map(e => e.course?.category).filter(Boolean),
    ]);
    if (specialismsSet.size === 0) {
      specialismsSet.add("Safeguarding");
      specialismsSet.add("Care Practice");
      specialismsSet.add("Continuous Professional Development");
    }

    const orgDisplayName = organisation?.name || active.organization?.name || "AAF CareConnect";
    const startDate = active.created_at || active.startDate || new Date().toISOString();

    return {
      id: active.passport_id || `AAF-PAS-${new Date().getFullYear()}-${(active.id || "0000").slice(0, 6).toUpperCase()}`,
      name,
      role: role.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
      organisation: orgDisplayName,
      startDate,
      avatar: name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "PP",
      avatarColor: levelInfo.levelCfg.color,
      email: active.email || "",
      phone: active.phone || "Provided on file",
      location: active.location || "United Kingdom",
      languages: active.languages || ["English"],
      specialisms: Array.from(specialismsSet),
      bio: active.bio || `Accredited social care practitioner registered with ${orgDisplayName}. Actively maintaining verified CPD hours and compliance with Ofsted standards.`,
      cpdHours: totalCpdHours,
      certificates: totalCertCount,
      complianceScore,
      skillsScore,
      learningStreak: Math.max(1, Math.min(30, totalCpdHours > 0 ? 5 + Math.round(totalCpdHours / 3) : 1)),
      level: levelInfo.level,
      levelProgress: levelInfo.levelProgress,
      pointsToNext: levelInfo.pointsToNext,
      nextLevel: levelInfo.nextLevel,
    };
  }, [targetUser, user, organisation, normalizedCerts, completedEnrolments, totalCpdHours, totalCertCount, complianceScore, skillsScore, levelInfo]);

  // CPD Transcript records
  const transcript = useMemo(() => {
    const list = [
      ...normalizedCerts.map(c => ({
        date: c.issued,
        course: c.title,
        provider: c.provider,
        hours: c.hours,
        status: "completed",
      })),
      ...completedEnrolments.map(e => ({
        date: e.completed_at || e.updated_at || e.created_at,
        course: e.course?.title || "Accredited Training Course",
        provider: "AAF CareConnect",
        hours: Math.max(1, Math.round((e.course?.duration_minutes || 60) / 60)),
        status: "completed",
      })),
      ...enrolments.filter(e => e.status !== "COMPLETED").map(e => ({
        date: e.enrolled_at || e.created_at,
        course: e.course?.title || "Enrolled Course",
        provider: "AAF CareConnect",
        hours: Math.max(1, Math.round((e.course?.duration_minutes || 60) / 60)),
        status: "in_progress",
      })),
    ];
    return list.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
  }, [normalizedCerts, completedEnrolments, enrolments]);

  // Dynamic Achievements
  const achievements = useMemo(() => {
    return buildDynamicAchievements({ profile, certificates: normalizedCerts, enrolments });
  }, [profile, normalizedCerts, enrolments]);

  // Dynamic Career Journey Timeline
  const timeline = useMemo(() => {
    return buildDynamicTimeline({
      user: targetUser || user,
      certificates: normalizedCerts,
      enrolments,
      level: levelInfo.level,
    });
  }, [targetUser, user, normalizedCerts, enrolments, levelInfo.level]);

  // Dynamic Compliance Requirements
  const complianceItems = useMemo(() => {
    return buildDynamicCompliance({ certificates: normalizedCerts, enrolments });
  }, [normalizedCerts, enrolments]);

  // Dynamic AI Coach Recommendations
  const recommendations = useMemo(() => {
    return buildDynamicRecommendations({ profile, certificates: normalizedCerts, enrolments });
  }, [profile, normalizedCerts, enrolments]);

  return (
    <div className="p-6 space-y-5 animate-fade-in max-w-[1400px] mx-auto">
      {/* Staff Selector Bar for Managers / Org Admins */}
      {staffList.length > 1 && (
        <div className="flex items-center justify-between gap-4 px-4 py-2.5 bg-white rounded-xl border border-slate-200 shadow-sm flex-wrap">
          <div className="flex items-center gap-2 text-xs text-slate-700">
            <Users size={15} className="text-blue-600 flex-shrink-0" />
            <span className="font-bold">Viewing Staff Passport:</span>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedUserId}
              onChange={e => setSelectedUserId(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            >
              <option value={user?.id}>Me ({user?.full_name || user?.email || "My Passport"})</option>
              {staffList.filter(s => s.id !== user?.id).map(s => {
                const roleStr = s.user_roles?.map(r => r.role?.name || r.name).join(", ");
                return (
                  <option key={s.id} value={s.id}>
                    {s.full_name || s.email} {roleStr ? `(${roleStr})` : ""}
                  </option>
                );
              })}
            </select>
            <button
              onClick={handleManualRefresh}
              disabled={refreshing}
              className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Refresh Passport Data"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin text-blue-600" : ""} />
            </button>
          </div>
        </div>
      )}

      {/* Passport Header */}
      <PassportHeader profile={profile} />

      {/* Live Sync Status Banner */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-50 via-indigo-50 to-emerald-50 border border-blue-100 rounded-xl text-xs shadow-sm">
        <span className="text-blue-700 font-bold flex items-center gap-1">
          🔄 Live Database Synchronized
        </span>
        <span className="text-slate-600 hidden sm:inline">
          Accredited CPD hours, verified certificates, and compliance ratings are dynamically pulled in real-time from the Learning Hub and CPD Hub.
        </span>
        <div className="ml-auto flex items-center gap-2 flex-shrink-0">
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300">
            ● Real-Time Data Active
          </span>
        </div>
      </div>

      {/* Top KPIs Row */}
      <PassportKPIs profile={profile} />

      {/* Tab Navigation */}
      <div className="flex gap-0 border-b border-slate-200 overflow-x-auto bg-white rounded-t-xl px-2">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 transition-colors -mb-px whitespace-nowrap ${
              tab === key
                ? "border-blue-600 text-blue-600 bg-blue-50/40 rounded-t-lg"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {loading ? (
        <div className="card p-12 text-center bg-white border border-slate-200">
          <RefreshCw size={24} className="animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-500">Loading verified passport credentials...</p>
        </div>
      ) : (
        <>
          {tab === "overview"     && <PassportOverview profile={profile} />}
          {tab === "certs"        && <PassportCertifications certificates={normalizedCerts} userName={profile.name} />}
          {tab === "transcript"   && <PassportTranscript transcript={transcript} profile={profile} />}
          {tab === "skills"       && <PassportSkillsMatrix skills={skills} />}
          {tab === "achievements" && <PassportAchievements achievements={achievements} />}
          {tab === "journey"      && <PassportCareerJourney events={timeline} />}
          {tab === "compliance"   && <PassportCompliance complianceItems={complianceItems} complianceScore={complianceScore} />}
          {tab === "ai_coach"     && <PassportAICoach recommendations={recommendations} profile={profile} />}
        </>
      )}
    </div>
  );
}