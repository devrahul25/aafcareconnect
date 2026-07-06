import { Bell, Search } from "lucide-react";

export default function TopBar({ user, title, actions }) {
  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-20">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="relative w-56 hidden md:block">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search..."
            className="w-full h-8 pl-9 pr-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400"
          />
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
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              {(user.full_name || "U").charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-slate-800 leading-tight">{user.full_name || "User"}</p>
              <p className="text-[10px] text-slate-400 capitalize leading-tight">{user.role || "Admin"}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}