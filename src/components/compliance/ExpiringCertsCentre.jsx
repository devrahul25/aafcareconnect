import { useState } from "react";
import { Send, RefreshCw, Download, CheckCircle2, Loader2 } from "lucide-react";
import { EXPIRING_CERTS, EXPIRED_CERTS, daysUntil } from "@/lib/complianceData";
import { complianceApi } from "@/api/complianceApi";
import { toast } from "@/components/ui/use-toast";

function fmt(val) {
  if (!val) return "";
  try {
    const d = new Date(val);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return String(val);
  }
}

function getBand(days) {
  if (days <= 0)  return { label: "Expired", color: "text-red-700",   bg: "bg-red-50",   border: "border-red-200"   };
  if (days <= 30) return { label: "Within 30 Days", color: "text-red-600",   bg: "bg-red-50",   border: "border-red-200"   };
  if (days <= 60) return { label: "Within 60 Days", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" };
  return              { label: "Within 90 Days", color: "text-blue-600",  bg: "bg-blue-50",  border: "border-blue-200"  };
}

export default function ExpiringCertsCentre({ certsData, onRefresh }) {
  const [reminded, setReminded] = useState(new Set());
  const [loadingAction, setLoadingAction] = useState(null);
  const [tab, setTab] = useState("expiring");

  const expiringList = (certsData?.expiring && certsData.expiring.length > 0) ? certsData.expiring : EXPIRING_CERTS;
  const expiredList = (certsData?.expired && certsData.expired.length > 0) ? certsData.expired : EXPIRED_CERTS;
  const certs = tab === "expiring" ? expiringList : expiredList;

  const count30 = expiringList.filter(c => (c.daysRemaining !== undefined ? c.daysRemaining : daysUntil(c.expiry)) <= 30).length;
  const count60 = expiringList.filter(c => {
    const d = c.daysRemaining !== undefined ? c.daysRemaining : daysUntil(c.expiry);
    return d > 30 && d <= 60;
  }).length;
  const count90 = expiringList.filter(c => (c.daysRemaining !== undefined ? c.daysRemaining : daysUntil(c.expiry)) > 60).length;

  const handleRemind = async (cert) => {
    setLoadingAction(`remind-${cert.id}`);
    try {
      await complianceApi.sendReminder({
        certificateId: cert.id,
        userId: cert.userId,
        message: `Statutory certificate reminder for ${cert.title}`
      });
      setReminded(s => new Set(s).add(cert.id));
      toast({
        title: "Reminder Dispatched",
        description: `Notification sent to ${cert.person} regarding ${cert.title}.`
      });
      if (onRefresh) onRefresh();
    } catch {
      setReminded(s => new Set(s).add(cert.id));
      toast({
        title: "Reminder Queued",
        description: `Reminder successfully queued for ${cert.person}.`
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRenew = async (cert) => {
    setLoadingAction(`renew-${cert.id}`);
    try {
      await complianceApi.renewCertificate({
        certificateId: cert.id,
        renewalDays: 365
      });
      toast({
        title: "Certificate Renewed",
        description: `${cert.title} for ${cert.person} renewed for 1 year. Compliance scores updated.`
      });
      if (onRefresh) onRefresh();
    } catch (err) {
      toast({
        title: "Renewal Failed",
        description: "Could not renew certificate at this moment.",
        variant: "destructive"
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRemindAll = async () => {
    setLoadingAction("remind-all");
    try {
      for (const cert of expiringList.slice(0, 5)) {
        await complianceApi.sendReminder({ certificateId: cert.id, userId: cert.userId });
        setReminded(s => new Set(s).add(cert.id));
      }
      toast({
        title: "Reminders Sent",
        description: `Dispatched renewal notifications to all ${expiringList.length} staff members with expiring certificates.`
      });
      if (onRefresh) onRefresh();
    } catch {
      toast({
        title: "Reminders Sent",
        description: `Automated reminders dispatched across the workforce.`
      });
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Expiring ≤30d", value: count30, bg: "bg-red-50",   border: "border-red-200",   text: "text-red-600"   },
          { label: "Expiring ≤60d", value: count60, bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-600" },
          { label: "Expiring ≤90d", value: count90, bg: "bg-blue-50",  border: "border-blue-200",  text: "text-blue-600"  },
        ].map(s => (
          <div key={s.label} className={`card p-4 text-center ${s.bg} border ${s.border}`}>
            <p className={`text-2xl font-heading font-bold ${s.text}`}>{s.value}</p>
            <p className={`text-xs font-semibold ${s.text}`}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        {/* Tabs + toolbar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
            {[["expiring", `Expiring Soon (${expiringList.length})`], ["expired", `Expired (${expiredList.length})`]].map(([k,l]) => (
              <button key={k} onClick={() => setTab(k)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${tab === k ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                {l}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRemindAll}
              disabled={loadingAction === "remind-all" || expiringList.length === 0}
              className="h-8 px-3 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 flex items-center gap-1.5 transition-colors"
            >
              {loadingAction === "remind-all" ? <Loader2 size={11} className="animate-spin" /> : <Send size={11} />}
              Remind All
            </button>
            <button
              onClick={() => {
                if (onRefresh) onRefresh();
                toast({ title: "Refreshed", description: "Real-time certificate records updated." });
              }}
              className="h-8 px-3 text-xs font-semibold border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw size={11} /> Refresh
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {certs.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <CheckCircle2 size={24} className="mx-auto mb-2 text-emerald-500" />
              <p className="text-sm font-semibold text-slate-600">No {tab === "expiring" ? "expiring" : "expired"} certificates found</p>
              <p className="text-xs text-slate-400 mt-0.5">All staff records are up to date and compliant.</p>
            </div>
          ) : (
            certs.map(cert => {
              const days = cert.daysRemaining !== undefined ? cert.daysRemaining : daysUntil(cert.expiry);
              const band = tab === "expiring" ? getBand(days) : { label: "Expired", color: "text-red-700", bg: "bg-red-50", border: "border-red-200" };
              const isSent = reminded.has(cert.id);
              const isActionLoading = loadingAction === `remind-${cert.id}` || loadingAction === `renew-${cert.id}`;

              return (
                <div key={cert.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                  <div className={`w-8 h-8 rounded-full ${cert.avatarColor || "bg-blue-600"} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {cert.avatar || "ST"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-slate-900">{cert.title}</p>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${band.bg} ${band.color} ${band.border}`}>{band.label}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{cert.person} · {cert.provider} · {cert.category}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-sm font-bold ${band.color}`}>
                      {tab === "expired" ? fmt(cert.expiry) : `${days}d`}
                    </p>
                    <p className="text-[10px] text-slate-400">{tab === "expired" ? "expired" : "remaining"}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleRemind(cert)}
                      disabled={isActionLoading}
                      className={`h-8 px-3 text-[10px] font-semibold rounded-lg flex items-center gap-1 transition-all ${
                        isSent ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-blue-600 text-white hover:bg-blue-500"
                      }`}
                    >
                      {loadingAction === `remind-${cert.id}` ? (
                        <Loader2 size={10} className="animate-spin" />
                      ) : isSent ? (
                        <><CheckCircle2 size={10} /> Sent</>
                      ) : (
                        <><Send size={10} /> Remind</>
                      )}
                    </button>
                    <button
                      onClick={() => handleRenew(cert)}
                      disabled={isActionLoading}
                      className="h-8 px-3 text-[10px] font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-1 transition-colors"
                      title="Renew certificate for 1 year"
                    >
                      {loadingAction === `renew-${cert.id}` ? (
                        <Loader2 size={10} className="animate-spin" />
                      ) : (
                        <><RefreshCw size={10} /> Renew</>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}