// @ts-nocheck
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Award, Plus, Upload, Search, AlertTriangle, CheckCircle2,
  Clock, Download, X, Send, TrendingUp, Shield,
  Users, Sparkles, BookOpen, Bell, QrCode, Map, Star
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import CertificateCard from "@/components/cpd/CertificateCard";
import CertificateViewer from "@/components/cpd/CertificateViewer";
import CPDTimeline from "@/components/cpd/CPDTimeline";
import AICoachCPD from "@/components/cpd/AICoachCPD";
import SkillsMatrix from "@/components/cpd/SkillsMatrix";
import ProfessionalPassport from "@/components/cpd/ProfessionalPassport";
import ManagerComplianceDashboard from "@/components/cpd/ManagerComplianceDashboard";
import CertificateVerificationPortal from "@/components/cpd/CertificateVerificationPortal";
import RenewalReminders from "@/components/cpd/RenewalReminders";
import { CERTS, PEOPLE, CATS, daysUntil, fmt } from "@/lib/cpdData";

// ─── Animated KPI Card ───────────────────────────────────────────────────────
function AnimatedKpiCard({ title = undefined, value = undefined, sub = undefined, icon: Icon = undefined, bg = undefined, trend = undefined, trendUp = undefined }) {
  const [displayed, setDisplayed] = useState(0);
  const target = typeof value === "number" ? value : 0;

  useEffect(() => {
    if (typeof value !== "number") return;
    let start = 0;
    const step = Math.ceil(target / 24);
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setDisplayed(start);
      if (start >= target) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className="card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
          <Icon size={18} className="text-white" />
        </div>
        {trend && (
          <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${trendUp !== false ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-heading font-bold text-slate-900">
        {typeof value === "number" ? displayed : value}
      </p>
      <p className="text-xs font-semibold text-slate-600 mt-0.5">{title}</p>
      {sub && <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Upload Modal ────────────────────────────────────────────────────────────
function UploadModal({ onClose }) {
  const [step, setStep] = useState(1);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-slate-900">Upload Certificate</h2>
            <div className="flex items-center gap-1.5 mt-1.5">
              {[1,2].map(s => <div key={s} className={`h-1.5 w-8 rounded-full transition-colors ${step >= s ? "bg-blue-600" : "bg-slate-200"}`} />)}
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors"><X size={15}/></button>
        </div>
        {step === 1 ? (
          <div className="p-6 space-y-4">
            <div>
              <label className="field-label">Certificate Title *</label>
              <input placeholder="e.g. Safeguarding Level 2" className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="field-label">Person *</label>
                <select className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700">
                  <option value="">Select…</option>
                  {PEOPLE.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Category</label>
                <select className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700">
                  {CATS.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="field-label">Provider *</label>
                <input placeholder="Issuing organisation" className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
              </div>
              <div>
                <label className="field-label">CPD Hours</label>
                <input type="number" placeholder="0" className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="field-label">Issue Date *</label>
                <input type="date" className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
              <div>
                <label className="field-label">Expiry Date</label>
                <input type="date" className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={onClose} className="flex-1 h-9 text-sm font-semibold border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={() => setStep(2)} className="flex-1 h-9 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors">Next: Upload File →</button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-blue-300 transition-colors cursor-pointer">
              <Upload size={24} className="mx-auto text-slate-300 mb-2"/>
              <p className="text-sm text-slate-500">Drop certificate file here</p>
              <p className="text-xs text-slate-400 mt-1">or <span className="text-blue-600 font-semibold">browse files</span></p>
              <p className="text-[10px] text-slate-300 mt-2">PDF, JPG, PNG · Max 10MB</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 h-9 text-sm font-semibold border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">← Back</button>
              <button onClick={onClose} className="flex-1 h-9 text-sm font-semibold bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-colors flex items-center justify-center gap-2">
                <CheckCircle2 size={13}/> Save Certificate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
const TABS = [
  { key: "certificates", label: "Certificates",       icon: Award          },
  { key: "passport",     label: "Professional Passport", icon: Shield      },
  { key: "timeline",     label: "CPD Timeline",       icon: TrendingUp     },
  { key: "skills",       label: "Skills Matrix",      icon: Map            },
  { key: "ai_coach",     label: "AI Coach",           icon: Sparkles       },
  { key: "manager",      label: "Manager Analytics",  icon: Users          },
  { key: "reminders",    label: "Renewals",           icon: Bell           },
  { key: "verify",       label: "Verify",             icon: QrCode         },
];

export default function CPDHub() {
  const { user } = /** @type {any} */ (useOutletContext() || {});
  const [tab,        setTab]        = useState("certificates");
  const [statusFil,  setStatusFil]  = useState("all");
  const [personFil,  setPersonFil]  = useState("all");
  const [catFil,     setCatFil]     = useState("All");
  const [search,     setSearch]     = useState("");
  const [viewMode,   setViewMode]   = useState("grid"); // grid | list
  const [uploadOpen, setUploadOpen] = useState(false);
  const [viewing,    setViewing]    = useState(null);

  const valid      = CERTS.filter(c => c.status === "valid").length;
  const expSoon    = CERTS.filter(c => c.status === "expiring_soon").length;
  const expired    = CERTS.filter(c => c.status === "expired").length;
  const totalHrs   = CERTS.reduce((s, c) => s + c.hours, 0);
  const unverified = CERTS.filter(c => !c.verified).length;

  const filtered = CERTS.filter(c => {
    const ms  = c.title.toLowerCase().includes(search.toLowerCase()) || c.person.toLowerCase().includes(search.toLowerCase());
    const mst = statusFil === "all" || c.status === statusFil;
    const mp  = personFil === "all" || c.person === personFil;
    const mc  = catFil === "All" || c.category === catFil;
    return ms && mst && mp && mc;
  });

  return (
    <div className="p-6 space-y-5 animate-fade-in max-w-[1400px] mx-auto">
      {/* Platform sync banner */}
      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-violet-50 border border-blue-100 rounded-xl text-xs">
        <span className="text-blue-600 font-bold">🔄 Auto Updated</span>
        <span className="text-slate-500">Certificates, CPD hours and compliance scores update automatically when courses are completed in Learning Hub.</span>
        <span className="ml-auto text-[10px] font-bold text-violet-600 flex-shrink-0">Synced with Passport & Compliance Hub</span>
      </div>

      <PageHeader
        title="Professional Development Centre"
        subtitle="Enterprise CPD management, skills tracking and compliance analytics for Ofsted-regulated fostering agencies"
        actions={
          <div className="flex gap-2">
            <button className="h-9 px-4 text-sm font-semibold bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors">
              <Download size={14}/> Export Report
            </button>
            <button onClick={() => setUploadOpen(true)} className="h-9 px-4 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-2 transition-colors">
              <Upload size={14}/> Upload Certificate
            </button>
          </div>
        }
      />

      {/* ── Animated KPI Dashboard ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatedKpiCard title="Valid Certificates"   value={valid}       sub="Active & compliant"          icon={CheckCircle2} bg="bg-emerald-600" trend="+2 this month" trendUp />
        <AnimatedKpiCard title="Expiring Soon"        value={expSoon}     sub="Within 90 days"              icon={Clock}        bg="bg-amber-500" />
        <AnimatedKpiCard title="Expired"              value={expired}     sub="Renewal required"            icon={AlertTriangle} bg="bg-red-600" />
        <AnimatedKpiCard title="Total CPD Hours"      value={totalHrs}    sub="Across all learners"         icon={Award}        bg="bg-indigo-600" trend="+18h" trendUp />
      </div>

      {/* Action banners */}
      <div className="space-y-2">
        {expired > 0 && (
          <div className="card border-l-4 border-l-red-500 bg-red-50/40 p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle size={16} className="text-red-600 flex-shrink-0"/>
              <div>
                <p className="text-sm font-semibold text-slate-900">{expired} certificates have expired — urgent renewal required</p>
                <p className="text-xs text-slate-500 mt-0.5">These affect active compliance obligations and Ofsted registration status.</p>
              </div>
            </div>
            <button onClick={() => { setTab("certificates"); setStatusFil("expired"); }} className="h-8 px-3 text-xs font-semibold bg-red-600 text-white rounded-lg hover:bg-red-500 flex items-center gap-1.5 transition-colors flex-shrink-0">
              View Expired
            </button>
          </div>
        )}
        {expSoon > 0 && (
          <div className="card border-l-4 border-l-amber-400 bg-amber-50/40 p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-amber-600 flex-shrink-0"/>
              <div>
                <p className="text-sm font-semibold text-slate-900">{expSoon} certificates expiring within 90 days</p>
                <p className="text-xs text-slate-500 mt-0.5">Remind learners now to prevent compliance gaps before inspection.</p>
              </div>
            </div>
            <button onClick={() => setTab("reminders")} className="h-8 px-3 text-xs font-semibold bg-amber-500 text-white rounded-lg hover:bg-amber-400 flex items-center gap-1.5 transition-colors flex-shrink-0">
              <Send size={12}/> Manage Reminders
            </button>
          </div>
        )}
        {unverified > 0 && (
          <div className="card border-l-4 border-l-blue-500 bg-blue-50/30 p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Shield size={16} className="text-blue-600 flex-shrink-0"/>
              <p className="text-sm font-semibold text-slate-900">{unverified} certificates awaiting manager verification</p>
            </div>
            <button className="h-8 px-3 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-1.5 transition-colors flex-shrink-0">
              Verify Now
            </button>
          </div>
        )}
      </div>

      {/* ── Tab Navigation ── */}
      <div className="flex gap-0 border-b border-slate-200 overflow-x-auto">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors -mb-px whitespace-nowrap ${
              tab === key ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
            }`}>
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>

      {/* ── Certificates Tab ── */}
      {tab === "certificates" && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-5 animate-fade-in">
          {/* Filter sidebar */}
          <div className="space-y-4">
            <div className="card p-4 space-y-1.5">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Status</p>
              {[["all","All Certificates",CERTS.length],["valid","Valid",valid],["expiring_soon","Expiring Soon",expSoon],["expired","Expired",expired]].map(([key,label,count]) => (
                <button key={key} onClick={() => setStatusFil(key)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${statusFil === key ? "bg-blue-600 text-white" : "hover:bg-slate-50 text-slate-700"}`}>
                  <span>{label}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${statusFil === key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>{count}</span>
                </button>
              ))}
            </div>
            <div className="card p-4 space-y-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Person</p>
              <button onClick={() => setPersonFil("all")} className={`w-full flex items-center px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${personFil === "all" ? "bg-blue-600 text-white" : "hover:bg-slate-50 text-slate-700"}`}>All People</button>
              {PEOPLE.map(p => (
                <button key={p} onClick={() => setPersonFil(p)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${personFil === p ? "bg-blue-600 text-white" : "hover:bg-slate-50 text-slate-700"}`}>{p}</button>
              ))}
            </div>
            <div className="card p-4 space-y-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Category</p>
              {CATS.map(c => (
                <button key={c} onClick={() => setCatFil(c)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${catFil === c ? "bg-blue-600 text-white" : "hover:bg-slate-50 text-slate-700"}`}>{c}</button>
              ))}
            </div>
          </div>

          {/* Certificate grid */}
          <div className="xl:col-span-3 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search certificates or people…"
                  className="w-full h-9 pl-9 pr-3 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"/>
              </div>
              <span className="text-xs text-slate-400 font-medium whitespace-nowrap">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
            </div>

            {filtered.length === 0 ? (
              <div className="card py-16 text-center text-slate-400">
                <Award size={36} className="mx-auto mb-2 opacity-30"/>
                <p className="text-sm">No certificates match your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filtered.map(cert => (
                  <CertificateCard key={cert.id} cert={cert} onView={setViewing} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "passport"  && <ProfessionalPassport userName={user?.full_name || "Emma Clarke"} />}
      {tab === "timeline"  && <CPDTimeline />}
      {tab === "skills"    && <SkillsMatrix />}
      {tab === "ai_coach"  && <AICoachCPD />}
      {tab === "manager"   && <ManagerComplianceDashboard />}
      {tab === "reminders" && <RenewalReminders />}
      {tab === "verify"    && <CertificateVerificationPortal />}

      {uploadOpen && <UploadModal onClose={() => setUploadOpen(false)} />}
      {viewing    && <CertificateViewer cert={viewing} onClose={() => setViewing(null)} />}
    </div>
  );
}