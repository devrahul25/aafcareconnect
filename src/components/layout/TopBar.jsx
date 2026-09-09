import { useState } from "react";
import { Bell, Search, Building2, Users, Library } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";

export default function TopBar({ user, title, actions }) {
  const [searchFocused, setSearchFocused] = useState(false);
  const isSuperAdmin = user?.role === "super_admin";

  const { data: orgResponse } = useQuery({
    queryKey: ['organization', user?.organization_id],
    queryFn: () => apiClient.get(`/organizations/${user?.organization_id}`).then(res => res.data),
    enabled: !!user?.organization_id && !isSuperAdmin,
  });
  const organization = isSuperAdmin ? null : orgResponse?.data;

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-20">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="relative w-64 hidden md:block">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search platform..."
            className="w-full h-8 pl-9 pr-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400 transition-all"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
          />
          {searchFocused && (
            <div className="absolute top-10 left-0 w-80 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden z-50">
              <div className="p-2 border-b border-slate-100 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Organisations
              </div>
              <Link to="/superadmin/organisations" className="flex items-center gap-2 p-3 hover:bg-slate-50 transition-colors">
                <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center text-blue-600"><Building2 size={12}/></div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">Oakwood Care Homes</div>
                  <div className="text-[10px] text-slate-500">Organisation • 120 Users</div>
                </div>
              </Link>
              <div className="p-2 border-y border-slate-100 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Users
              </div>
              <Link to="/superadmin/users" className="flex items-center gap-2 p-3 hover:bg-slate-50 transition-colors">
                <div className="w-6 h-6 rounded bg-emerald-100 flex items-center justify-center text-emerald-600"><Users size={12}/></div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">Sarah Jenkins</div>
                  <div className="text-[10px] text-slate-500">Learner • Oakwood Care Homes</div>
                </div>
              </Link>
              <div className="p-2 border-y border-slate-100 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Courses
              </div>
              <Link to="/superadmin/course-library" className="flex items-center gap-2 p-3 hover:bg-slate-50 transition-colors">
                <div className="w-6 h-6 rounded bg-violet-100 flex items-center justify-center text-violet-600"><Library size={12}/></div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">Safeguarding Level 2</div>
                  <div className="text-[10px] text-slate-500">Master Template • Active</div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {actions}
        <button className="relative w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
        </button>
        {user && (
          <div className="flex items-center gap-2 ml-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm border border-slate-200 overflow-hidden ${
              isSuperAdmin ? 'bg-slate-900 text-white' : 'bg-white text-blue-600'
            }`}>
              {!isSuperAdmin && organization?.logo_url ? (
                <img src={organization.logo_url} alt="Logo" className="w-full h-full object-contain p-0.5" />
              ) : (
                (user.full_name || (isSuperAdmin ? "SA" : "U")).charAt(0).toUpperCase()
              )}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-slate-800 leading-tight">{user.full_name || "User"}</p>
              <p className="text-[10px] text-slate-400 capitalize leading-tight">{user.role?.replace(/_/g, ' ') || "Admin"}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}