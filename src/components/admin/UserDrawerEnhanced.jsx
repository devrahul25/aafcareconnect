import { X, Mail, Shield, Award, BookOpen, TrendingUp, Send, Download, ExternalLink, RefreshCw, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { getProfessionalLevel, fmt, daysUntil } from "@/lib/platformStore";
import AuditLog from "@/components/admin/AuditLog";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";
import toast from "react-hot-toast";

const RISK_CFG = {
  low:    { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", label: "Low Risk"    },
  medium: { bg: "bg-amber-50",  text: "text-amber-700",   border: "border-amber-200",   label: "Medium Risk" },
  high:   { bg: "bg-red-50",    text: "text-red-700",     border: "border-red-200",     label: "High Risk"   },
};

const ROLE_BADGE = {
  administrator: "badge-violet", manager: "badge-blue", learner: "badge-slate",
  trainer: "badge-green", responsible_individual: "badge-red",
};
const ROLE_LABELS = {
  administrator: "Administrator", manager: "Manager", learner: "Learner",
  trainer: "Trainer", responsible_individual: "Resp. Individual",
};

export default function UserDrawerEnhanced({ user, onClose }) {
  const [innerTab, setInnerTab] = useState("overview");

  const queryClient = useQueryClient();
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const { data: certs = [] } = useQuery({
    queryKey: ['compliance-records', user?.id],
    queryFn: () => apiClient.get(`/compliance-records?userId=${user.id}`).then(res => res.data.data || []),
    enabled: !!user?.id
  });

  const { data: enrolments = [], refetch: refetchEnrolments } = useQuery({
    queryKey: ['course-enrolments', user?.id],
    queryFn: () => apiClient.get(`/course-enrolments?userId=${user.id}`).then(res => res.data.data || []),
    enabled: !!user?.id
  });

  const { data: allCourses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: () => apiClient.get('/courses').then(res => res.data.data || [])
  });

  const assignCourseMutation = useMutation({
    mutationFn: (courseId) => apiClient.post('/course-enrolments', { user_id: user.id, course_id: courseId }),
    onSuccess: () => {
      toast.success("Course assigned successfully");
      setIsAssigning(false);
      refetchEnrolments();
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "Failed to assign course");
    }
  });

  if (!user) return null;

  const handleAssignCourse = () => {
    if (!selectedCourseId) return;
    assignCourseMutation.mutate(selectedCourseId);
  };

  const auditEntries = []; // Backend endpoint missing for now
  
  const complianceReasons = certs.filter(c => c.status === 'expired').map(c => `${c.title} has expired.`);
  if (complianceReasons.length === 0) complianceReasons.push("All mandatory training is up to date.");

  const level = getProfessionalLevel(user);
  const risk = RISK_CFG[user.riskLevel] || RISK_CFG.low;

  const scoreColor = user.complianceScore >= 90 ? "text-emerald-600" : user.complianceScore >= 75 ? "text-amber-600" : "text-red-600";
  const circumference = 2 * Math.PI * 28;
  const dashOffset = circumference * (1 - user.complianceScore / 100);

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-lg bg-white shadow-2xl flex flex-col animate-slide-in overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 to-blue-950 p-5 flex items-start justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl ${user.avatarColor} flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0`}>
              {user.avatar}
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg text-white">{user.name}</h2>
              <p className="text-blue-300 text-sm">{user.role}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${risk.bg} ${risk.text} ${risk.border}`}>{risk.label}</span>
                <span className="text-[9px] font-mono text-slate-500">{user.passportId}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 flex-shrink-0">
            <X size={14} />
          </button>
        </div>

        {/* Score strip */}
        <div className="bg-white border-b border-slate-100 px-5 py-3 flex items-center gap-4">
          <svg className="w-14 h-14 -rotate-90 flex-shrink-0" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" fill="none" stroke="#f1f5f9" strokeWidth="7" />
            <circle cx="32" cy="32" r="28" fill="none" strokeWidth="7" strokeLinecap="round"
              stroke={user.complianceScore >= 90 ? "#10b981" : user.complianceScore >= 75 ? "#f59e0b" : "#ef4444"}
              strokeDasharray={circumference} strokeDashoffset={dashOffset}
              style={{ transition: "stroke-dashoffset 1s ease" }}
            />
          </svg>
          <div className="flex-1">
            <p className={`text-2xl font-heading font-bold ${scoreColor}`}>{user.complianceScore}%</p>
            <p className="text-xs text-slate-500">Compliance Score · <span className="text-[10px] text-emerald-600 font-semibold">⚡ Live Data</span></p>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs text-slate-500 flex-shrink-0">
            <span>📜 {user.certificates} certs</span>
            <span>⏰ {user.cpdHours}h CPD</span>
            <span>✅ {user.mandatoryPct}% mandatory</span>
            <span className="font-semibold">{level.icon} {level.name}</span>
          </div>
        </div>

        {/* Inner tabs */}
        <div className="flex border-b border-slate-100 flex-shrink-0 overflow-x-auto">
          {[["overview","Overview"],["courses","Courses"],["certs","Certificates"],["compliance","Compliance"],["activity","Activity"]].map(([k,l]) => (
            <button key={k} onClick={() => setInnerTab(k)}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px whitespace-nowrap transition-colors ${innerTab === k ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
              {l}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {innerTab === "overview" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "CPD Hours", value: user.cpdHours+"h", icon: Award, bg: "bg-indigo-50", text: "text-indigo-700" },
                  { label: "Certificates", value: user.certificates, icon: Shield, bg: "bg-blue-50", text: "text-blue-700" },
                  { label: "Skills Score", value: user.skillsScore+"%", icon: TrendingUp, bg: "bg-violet-50", text: "text-violet-700" },
                  { label: "Renewals Due", value: user.renewalsDue, icon: RefreshCw, bg: "bg-amber-50", text: "text-amber-700" },
                ].map(s => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className={`rounded-xl p-3 ${s.bg} text-center`}>
                      <Icon size={16} className={`${s.text} mx-auto mb-1`} />
                      <p className={`text-lg font-bold ${s.text}`}>{s.value}</p>
                      <p className="text-[10px] text-slate-500">{s.label}</p>
                    </div>
                  );
                })}
              </div>
              <div className="bg-slate-50 rounded-xl p-3 space-y-1.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Contact</p>
                <div className="flex items-center gap-2 text-xs text-slate-600"><Mail size={12} className="text-slate-400" />{user.email}</div>
                <div className="flex items-center gap-2 text-xs text-slate-600"><Clock size={12} className="text-slate-400" />Last active: {user.lastActivity}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Compliance Summary</p>
                {complianceReasons.map((r, i) => (
                  <p key={i} className="text-xs text-slate-700 py-1 border-b border-slate-100 last:border-0">{r}</p>
                ))}
              </div>
            </>
          )}

          {innerTab === "courses" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-blue-600 font-bold">⚡ Assigned Training</span>
                <button 
                  onClick={() => setIsAssigning(!isAssigning)}
                  className="text-xs font-semibold bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  {isAssigning ? 'Cancel' : '+ Assign New'}
                </button>
              </div>

              {isAssigning && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
                  <p className="text-xs font-bold text-slate-700 mb-2">Select a course to assign:</p>
                  <select 
                    className="w-full text-sm border-slate-200 rounded-lg mb-3 p-2 focus:ring-blue-500 focus:border-blue-500"
                    value={selectedCourseId}
                    onChange={e => setSelectedCourseId(e.target.value)}
                  >
                    <option value="">-- Choose Course --</option>
                    {allCourses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                  <button 
                    onClick={handleAssignCourse}
                    disabled={!selectedCourseId || assignCourseMutation.isPending}
                    className="w-full h-8 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {assignCourseMutation.isPending ? 'Assigning...' : 'Assign Course'}
                  </button>
                </div>
              )}

              {enrolments.length === 0 && !isAssigning && <p className="text-xs text-slate-400 text-center py-4">No courses assigned</p>}
              
              <div className="space-y-2">
                {enrolments.map(enrolment => (
                  <div key={enrolment.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden">
                      {enrolment.course?.thumbnail_url ? (
                        <img src={enrolment.course.thumbnail_url} className="w-full h-full object-cover" />
                      ) : (
                        <BookOpen className="w-5 h-5 m-2.5 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{enrolment.course?.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          enrolment.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                          enrolment.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {enrolment.status}
                        </span>
                        {enrolment.status === 'IN_PROGRESS' && (
                          <span className="text-[10px] text-slate-500">{enrolment.progress_percent}%</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {innerTab === "certs" && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold">
                <span>🔄 Synced with CPD Hub & Compliance Hub</span>
              </div>
              {certs.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No certificates on record</p>}
              {certs.map(c => {
                const days = daysUntil(c.expiry);
                return (
                  <div key={c.id} className={`flex items-center gap-3 p-3 rounded-xl border ${c.status === "expired" ? "bg-red-50 border-red-200" : c.status === "expiring_soon" ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"}`}>
                    {c.status === "expired" ? <Clock size={13} className="text-red-500 flex-shrink-0" />
                      : c.status === "expiring_soon" ? <AlertTriangle size={13} className="text-amber-500 flex-shrink-0" />
                      : <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{c.title}</p>
                      <p className="text-[10px] text-slate-500">{c.provider} · {fmt(c.expiry)}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-[10px] font-bold ${c.status === "expired" ? "text-red-600" : c.status === "expiring_soon" ? "text-amber-600" : "text-emerald-600"}`}>
                        {c.status === "expired" ? "Expired" : `${days}d`}
                      </p>
                      {c.mandatory && <span className="text-[8px] text-red-500 font-bold">Mandatory</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {innerTab === "compliance" && (
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-[10px] text-blue-600 font-bold">
                <span>⚡ Synced with Compliance Hub</span>
              </div>
              <div className="space-y-2">
                {complianceReasons.map((r, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-3 text-xs text-slate-700">{r}</div>
                ))}
              </div>
              {user.riskLevel !== "low" && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-xs font-bold text-red-700 mb-2">⚠️ Why is this staff member at risk?</p>
                  {user.riskLevel === "high" && (
                    <p className="text-xs text-red-600">
                      {user.name} is HIGH RISK because mandatory certificates have expired.
                      This creates a compliance gap that affects placement approvals and Ofsted readiness.
                      Immediate renewal action is required.
                    </p>
                  )}
                  {user.riskLevel === "medium" && (
                    <p className="text-xs text-amber-700">
                      {user.name} is MEDIUM RISK due to upcoming certificate expiries and incomplete mandatory training.
                      Action required within 30 days to prevent escalation to high risk.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {innerTab === "activity" && (
            <div>
              <AuditLog userId={user.id} limit={10} />
              {auditEntries.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No activity logged yet</p>}
            </div>
          )}
        </div>

        {/* Actions footer */}
        <div className="border-t border-slate-100 p-4 space-y-2 flex-shrink-0">
          <div className="grid grid-cols-3 gap-2">
            <Link to="/professional-passport">
              <button className="w-full h-8 text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 flex items-center justify-center gap-1 transition-colors">
                <ExternalLink size={10} /> Passport
              </button>
            </Link>
            <Link to="/compliance-hub">
              <button className="w-full h-8 text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 flex items-center justify-center gap-1 transition-colors">
                <Shield size={10} /> Compliance
              </button>
            </Link>
            <button className="h-8 text-[10px] font-semibold bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 flex items-center justify-center gap-1 transition-colors">
              <Download size={10} /> Report
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => { setInnerTab("courses"); setIsAssigning(true); }} className="h-8 text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100 flex items-center justify-center gap-1 transition-colors">
              <BookOpen size={10} /> Assign Course
            </button>
            <button className="h-8 text-[10px] font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 flex items-center justify-center gap-1 transition-colors">
              <Send size={10} /> Send Reminder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}