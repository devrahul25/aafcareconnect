import React, { useState } from "react";
import { Search, CreditCard, Settings, ArrowUpCircle, PauseCircle, RefreshCw, FileText } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

const MOCK_SUBSCRIPTIONS = [
  { id: "1", org: "Eserve Social Care", plan: "Enterprise", billing: "Annual", renewal: "12 Oct 2027", status: "Active", seatsUsed: 1450, seatsTotal: 2000, storageUsed: "125 GB", storageTotal: "500 GB" },
  { id: "2", org: "Horizon Fostering", plan: "Professional", billing: "Monthly", renewal: "05 Aug 2026", status: "Active", seatsUsed: 320, seatsTotal: 500, storageUsed: "45 GB", storageTotal: "100 GB" },
  { id: "3", org: "Oakwood Care Homes", plan: "Standard", billing: "Monthly", renewal: "20 Jul 2026", status: "Past Due", seatsUsed: 85, seatsTotal: 100, storageUsed: "12 GB", storageTotal: "20 GB" },
  { id: "4", org: "Pinnacle Support", plan: "Enterprise", billing: "Annual", renewal: "01 Jan 2027", status: "Active", seatsUsed: 600, seatsTotal: 1000, storageUsed: "80 GB", storageTotal: "500 GB" },
];

export default function Subscriptions() {
  const [search, setSearch] = useState("");

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1440px] mx-auto">
      <PageHeader 
        title="Subscriptions" 
        subtitle="Manage organisation subscriptions, billing, and resource limits"
      />

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search subscriptions..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="h-9 px-4 text-sm font-semibold bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors">
            <Settings size={14} /> Plan Settings
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/50 text-slate-500 font-medium">
              <tr>
                <th className="px-4 py-3 font-medium">Organisation</th>
                <th className="px-4 py-3 font-medium">Plan</th>
                <th className="px-4 py-3 font-medium">Billing Cycle</th>
                <th className="px-4 py-3 font-medium">Renewal Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Seats (Used)</th>
                <th className="px-4 py-3 font-medium">Storage (Used)</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_SUBSCRIPTIONS.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-semibold text-slate-900">{sub.org}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <CreditCard size={14} className="text-slate-400" />
                      <span className="text-slate-700 font-medium">{sub.plan}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{sub.billing}</td>
                  <td className="px-4 py-3 text-slate-600">{sub.renewal}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      sub.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    } border`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden w-20">
                        <div 
                          className={`h-full rounded-full ${sub.seatsUsed / sub.seatsTotal > 0.8 ? 'bg-amber-500' : 'bg-blue-500'}`} 
                          style={{ width: `${(sub.seatsUsed / sub.seatsTotal) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
                        {sub.seatsUsed} / {sub.seatsTotal}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
                        {sub.storageUsed} / {sub.storageTotal}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="text-slate-400 hover:text-emerald-600 p-1.5 rounded transition-colors" title="Upgrade Plan">
                        <ArrowUpCircle size={16} />
                      </button>
                      <button className="text-slate-400 hover:text-amber-600 p-1.5 rounded transition-colors" title="Suspend Plan">
                        <PauseCircle size={16} />
                      </button>
                      <button className="text-slate-400 hover:text-blue-600 p-1.5 rounded transition-colors" title="Renew Subscription">
                        <RefreshCw size={16} />
                      </button>
                      <button className="text-slate-400 hover:text-slate-900 p-1.5 rounded transition-colors" title="View Payment History">
                        <FileText size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
