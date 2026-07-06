import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useAuth } from "@/lib/AuthContext";

export default function AppLayout() {
  const { user, organisationId, organisation } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar user={user} collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar user={user} organisation={organisation} />
        <main className="flex-1 overflow-y-auto">
          <Outlet context={{ user, organisationId, organisation }} />
        </main>
      </div>
    </div>
  );
}