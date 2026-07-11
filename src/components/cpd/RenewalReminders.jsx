import { useState } from "react";
import { Bell, CheckCircle2, Send, BellRing } from "lucide-react";
import { CERTS, fmt, daysUntil } from "@/lib/cpdData";

const REMINDER_THRESHOLDS = [
  { days: 90, label: "90-day notice",  color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-200"   },
  { days: 60, label: "60-day notice",  color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-200" },
  { days: 30, label: "30-day reminder",color: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-200"  },
  { days: 7,  label: "7-day final",    color: "text-red-600",    bg: "bg-red-50",    border: "border-red-200"    },
  { days: 0,  label: "Expired",        color: "text-red-700",    bg: "bg-red-100",   border: "border-red-300"    },
];

function getThreshold(days) {
  if (days < 0) return REMINDER_THRESHOLDS[4];
  if (days <= 7) return REMINDER_THRESHOLDS[3];
  if (days <= 30) return REMINDER_THRESHOLDS[2];
  if (days <= 60) return REMINDER_THRESHOLDS[1];
  return REMINDER_THRESHOLDS[0];
}

export default function RenewalReminders() {
  const [sent, setSent] = useState(new Set());

  const needsRenewal = CERTS
    .filter(c => {
      const d = daysUntil(c.expiry);
      return d <= 90;
    })
    .sort((a, b) => daysUntil(a.expiry) - daysUntil(b.expiry));

  const handleSend = (id) => setSent(s => new Set(s).add(id));
  const handleBulk = () => setSent(new Set(needsRenewal.map(c => c.id)));

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="card p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0">
            <BellRing size={18} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Automated Renewal Reminder System</h3>
            <p className="text-xs text-slate-600">
              AAF CareConnect™ automatically sends reminders at <strong>90, 60, 30 and 7 days</strong> before expiry, plus an expired alert. All reminders are logged and audit-ready for Ofsted inspection.
            </p>
          </div>
          <button
            onClick={handleBulk}
            className="h-8 px-3 text-xs font-semibold bg-amber-500 text-white rounded-lg hover:bg-amber-400 flex items-center gap-1.5 transition-colors flex-shrink-0"
          >
            <Send size={11} /> Remind All
          </button>
        </div>
      </div>

      {/* Reminder schedule visual */}
      <div className="card p-5">
        <h4 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">Reminder Schedule</h4>
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {REMINDER_THRESHOLDS.map((t, i) => (
            <div key={t.days} className="flex items-center gap-1 flex-shrink-0">
              <div className={`rounded-lg px-3 py-2 text-center ${t.bg} border ${t.border}`}>
                <p className={`text-lg font-heading font-bold ${t.color}`}>{t.days === 0 ? "0" : t.days}</p>
                <p className="text-[9px] font-semibold text-slate-500">days</p>
                <p className={`text-[9px] font-bold ${t.color} mt-0.5`}>{t.label}</p>
              </div>
              {i < REMINDER_THRESHOLDS.length - 1 && (
                <div className="w-8 h-px bg-slate-200 flex-shrink-0 mx-1" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming & overdue */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900">Certificates Requiring Renewal Action</h4>
          <span className="text-xs text-slate-400">{needsRenewal.length} certificates</span>
        </div>

        {needsRenewal.length === 0 && (
          <div className="p-8 text-center text-slate-400">
            <CheckCircle2 size={28} className="mx-auto mb-2 text-emerald-400" />
            <p className="text-sm font-medium">All certificates are current — no renewals needed</p>
          </div>
        )}

        <div className="divide-y divide-slate-50">
          {needsRenewal.map(cert => {
            const days = daysUntil(cert.expiry);
            const t = getThreshold(days);
            const isSent = sent.has(cert.id);
            return (
              <div key={cert.id} className="flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors">
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full ${cert.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                  {cert.avatar}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs font-bold text-slate-900 truncate">{cert.title}</p>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${t.bg} ${t.color} border ${t.border}`}>
                      {t.label}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">{cert.person} · expires {fmt(cert.expiry)}</p>
                </div>

                {/* Days indicator */}
                <div className={`text-right flex-shrink-0 ${t.color}`}>
                  <p className="text-sm font-bold">{days < 0 ? "Expired" : `${days}d`}</p>
                  <p className="text-[9px] text-slate-400">remaining</p>
                </div>

                {/* Action */}
                <button
                  onClick={() => handleSend(cert.id)}
                  className={`h-8 px-3 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all flex-shrink-0 ${
                    isSent
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-default"
                      : "bg-blue-600 text-white hover:bg-blue-500"
                  }`}
                >
                  {isSent ? <><CheckCircle2 size={10} /> Sent</> : <><Send size={10} /> Remind</>}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reminder log */}
      <div className="card p-5">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Recent Reminder Log</h4>
        <div className="space-y-2">
          {[
            { name: "Mark Thompson",  cert: "Mental Health Awareness",         type: "7-day final",    date: "Today at 09:00",     status: "delivered" },
            { name: "James Okafor",   cert: "Child Sexual Exploitation (CSE)", type: "30-day reminder", date: "2 days ago at 09:00", status: "delivered" },
            { name: "James Okafor",   cert: "Paediatric First Aid",            type: "Expired alert",  date: "9 months ago",       status: "delivered" },
            { name: "Claire Nguyen",  cert: "Looked After Children (LAC)",     type: "Expired alert",  date: "2 years ago",        status: "bounced"   },
          ].map((log, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50">
              <Bell size={12} className="text-slate-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-700"><span className="font-semibold">{log.name}</span> — {log.cert}</p>
                <p className="text-[10px] text-slate-400">{log.type} · {log.date}</p>
              </div>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                log.status === "delivered" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
              }`}>
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}