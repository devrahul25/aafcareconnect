import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, Award, PenTool,
  FileText, Shield, Users, Briefcase, Home, Bot, BarChart3,
  Settings, ChevronLeft, ChevronRight, LogOut, Lock
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

const PHASE1 = [
  { icon: LayoutDashboard, label: "Dashboard",         path: "/dashboard"        },
  { icon: BookOpen,        label: "Learning Hub",      path: "/learning-hub"     },
  { icon: Award,           label: "CPD & Certificates",path: "/cpd-certificates" },
  { icon: PenTool,         label: "Course Builder",       path: "/course-builder"          },
  { icon: Briefcase,       label: "Pro Passport",     path: "/professional-passport" },
  { icon: Shield,          label: "Compliance Hub",   path: "/compliance-hub"        },
  { icon: Settings,        label: "Administration",   path: "/admin"                 },
];

const COMING_SOON = [
  { icon: FileText,   label: "Form F Hub"      },
  { icon: Users,      label: "Recruitment CRM" },
  { icon: Home,       label: "Placement Hub"   },
  { icon: BarChart3,  label: "Analytics"       },
  { icon: Bot,        label: "AI Assistant"    },
];

export default function Sidebar({ user, collapsed, setCollapsed }) {
  const location = useLocation();
  const { logout } = useAuth();
  return (
    <aside className={`sidebar flex flex-col h-screen sticky top-0 flex-shrink-0 transition-all duration-200 ${collapsed ? "w-[60px]" : "w-[220px]"} z-30`}>
      {/* Logo */}
      <div className={`flex items-center h-16 px-4 flex-shrink-0 border-b border-white/5 ${collapsed ? "justify-center" : "gap-3"}`}>
        <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-[11px] font-heading">AAF</span>
        </div>
        {!collapsed && (
          <div>
            <p className="text-white font-heading font-bold text-sm leading-tight">AAF</p>
            <p className="text-blue-400 font-heading font-bold text-sm leading-tight">CareConnect™</p>
          </div>
        )}
      </div>

      {/* User chip */}
      {!collapsed && user && (
        <div className="px-3 py-2.5 border-b border-white/5">
          <div className="flex items-center gap-2.5 bg-white/5 rounded-lg px-2.5 py-2">
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
              {(user.full_name || "U").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-slate-200 text-xs font-semibold truncate leading-tight">{user.full_name || "User"}</p>
              <p className="text-slate-500 text-[10px] truncate capitalize leading-tight">{user.role || "Administrator"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2">
        {!collapsed && <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 px-2 pb-1.5">Platform</p>}
        {PHASE1.map(({ icon: Icon, label, path }) => {
          const active = location.pathname === path || location.pathname.startsWith(path + "/");
          return (
            <Link key={path} to={path} title={collapsed ? label : undefined}
              className={`sidebar-item flex items-center h-9 rounded-lg px-2.5 gap-2.5 text-sm font-medium ${active ? "active" : ""}`}>
              <Icon size={16} className="flex-shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}

        {!collapsed && <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 px-2 pt-4 pb-1.5">Coming in Phase 2+</p>}
        {collapsed && <div className="my-2 border-t border-white/5" />}
        {COMING_SOON.map(({ icon: Icon, label }) => (
          <div key={label} title={collapsed ? label : undefined}
            className="sidebar-item flex items-center h-9 rounded-lg px-2.5 gap-2.5 text-sm font-medium opacity-40 cursor-not-allowed select-none">
            <Icon size={16} className="flex-shrink-0" />
            {!collapsed && <><span className="truncate flex-1">{label}</span><Lock size={10} className="text-slate-600 flex-shrink-0" /></>}
          </div>
        ))}
      </nav>

      {/* Sign out */}
      <div className="border-t border-white/5 px-2 py-2">
        <button onClick={() => logout()} title={collapsed ? "Sign Out" : undefined}
          className="sidebar-item flex items-center w-full h-9 rounded-lg px-2.5 gap-2.5 text-sm font-medium">
          <LogOut size={16} className="flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-300 hover:text-white z-10 transition-colors">
        {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
      </button>
    </aside>
  );
}