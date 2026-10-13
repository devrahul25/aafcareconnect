import React, { useState, useEffect, useMemo } from "react";
import { 
  Search, Filter, MoreHorizontal, Loader2, Check, 
  X, Building2, Shield, RotateCcw, ChevronDown, UserX, UserCheck 
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { apiClient } from "@/api/apiClient";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";

const formatRoleName = (roleName) => {
  if (!roleName) return 'User';
  switch (roleName.toLowerCase()) {
    case 'super_admin': return 'Super Admin';
    case 'org_admin': return 'Org Admin';
    case 'manager': return 'Manager';
    case 'trainer': return 'Trainer';
    case 'learner': return 'Learner';
    case 'user': return 'User';
    default:
      return roleName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
};

const getUserRoleKey = (u) => {
  return u.user_roles?.[0]?.role?.name || 'User';
};

const isSuperAdminUser = (u) => {
  const roleName = u.user_roles?.[0]?.role?.name?.toLowerCase();
  return u.email === 'admin@demo.com' || 
         roleName === 'super_admin' || 
         u.full_name?.toLowerCase().includes('super admin');
};

export default function PlatformUsers() {
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedOrg, setSelectedOrg] = useState("all");
  const [users, setUsers] = useState([]);
  const [organisations, setOrganisations] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersRes, orgsRes, rolesRes] = await Promise.allSettled([
          apiClient.get('/users'),
          apiClient.get('/organizations'),
          apiClient.get('/roles')
        ]);

        if (usersRes.status === 'fulfilled') {
          setUsers(usersRes.value.data?.data || []);
        }
        if (orgsRes.status === 'fulfilled') {
          setOrganisations(orgsRes.value.data?.data || []);
        }
        if (rolesRes.status === 'fulfilled') {
          setRoles(rolesRes.value.data?.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch platform users and metadata:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const refreshUsers = async () => {
    try {
      const res = await apiClient.get('/users');
      setUsers(res.data.data || []);
    } catch (err) {
      console.error("Failed to refresh users:", err);
    }
  };

  const toggleUserStatus = async (user) => {
    try {
      const newStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
      await apiClient.patch(`/users/${user.id}/status`, { status: newStatus });
      toast({ title: "Success", description: `User status changed to ${newStatus}` });
      refreshUsers();
    } catch (err) {
      toast({ title: "Error", description: "Failed to update user status", variant: "destructive" });
    }
  };

  // Derive unique real roles from both database roles and current user records
  const availableRoles = useMemo(() => {
    const roleMap = new Map();
    // Default system roles to always make available
    const standardRoles = ['org_admin', 'manager', 'trainer', 'learner', 'User'];
    standardRoles.forEach(r => {
      roleMap.set(r.toLowerCase(), { key: r, label: formatRoleName(r) });
    });

    roles.forEach(r => {
      if (r.name) {
        roleMap.set(r.name.toLowerCase(), { key: r.name, label: formatRoleName(r.name) });
      }
    });

    users.forEach(u => {
      const roleKey = getUserRoleKey(u);
      if (!roleMap.has(roleKey.toLowerCase())) {
        roleMap.set(roleKey.toLowerCase(), { key: roleKey, label: formatRoleName(roleKey) });
      }
    });

    return Array.from(roleMap.values());
  }, [roles, users]);

  // Derive unique real organisations from both API and user records
  const availableOrgs = useMemo(() => {
    const orgMap = new Map();
    organisations.forEach(org => {
      if (org.id && org.name) {
        orgMap.set(org.id, { id: org.id, name: org.name });
      }
    });

    users.forEach(u => {
      if (u.organization?.id && u.organization?.name) {
        orgMap.set(u.organization.id, { id: u.organization.id, name: u.organization.name });
      } else if (u.organization?.name) {
        orgMap.set(u.organization.name, { id: u.organization.name, name: u.organization.name });
      }
    });

    return Array.from(orgMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [organisations, users]);

  // Real-time filtering based on search, selectedRole, and selectedOrg
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // 1. Search Query (Name, Email, or Organisation Name)
      if (search.trim()) {
        const query = search.trim().toLowerCase();
        const matchName = user.full_name?.toLowerCase().includes(query);
        const matchEmail = user.email?.toLowerCase().includes(query);
        const matchOrg = user.organization?.name?.toLowerCase().includes(query);
        if (!matchName && !matchEmail && !matchOrg) return false;
      }

      // 2. Role Filter
      if (selectedRole !== "all") {
        const userRole = getUserRoleKey(user).toLowerCase();
        if (userRole !== selectedRole.toLowerCase()) return false;
      }

      // 3. Organisation Filter
      if (selectedOrg !== "all") {
        const userOrgId = user.organization_id || user.organization?.id;
        const userOrgName = user.organization?.name?.toLowerCase();
        const matchesOrgId = userOrgId && userOrgId === selectedOrg;
        const matchesOrgName = userOrgName && userOrgName === selectedOrg.toLowerCase();
        if (!matchesOrgId && !matchesOrgName) return false;
      }

      return true;
    });
  }, [users, search, selectedRole, selectedOrg]);

  const selectedRoleLabel = useMemo(() => {
    if (selectedRole === "all") return null;
    const found = availableRoles.find(r => r.key.toLowerCase() === selectedRole.toLowerCase());
    return found ? found.label : formatRoleName(selectedRole);
  }, [selectedRole, availableRoles]);

  const selectedOrgLabel = useMemo(() => {
    if (selectedOrg === "all") return null;
    const found = availableOrgs.find(o => o.id === selectedOrg || o.name.toLowerCase() === selectedOrg.toLowerCase());
    return found ? found.name : selectedOrg;
  }, [selectedOrg, availableOrgs]);

  const isFiltered = search.trim() !== "" || selectedRole !== "all" || selectedOrg !== "all";

  const clearAllFilters = () => {
    setSearch("");
    setSelectedRole("all");
    setSelectedOrg("all");
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1440px] mx-auto">
      <PageHeader 
        title="Platform Users" 
        subtitle="View and manage all user accounts across the entire platform"
      />

      <div className="card p-0 overflow-hidden">
        {/* Search and Filters Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by name, email, or org..."
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200/60 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button 
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200 transition-colors"
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Role Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className={`h-9 px-3 text-sm font-medium rounded-lg flex items-center gap-2 border transition-colors ${
                    selectedRole !== 'all' 
                      ? 'bg-blue-50 border-blue-200 text-blue-700 font-semibold shadow-xs' 
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Filter size={14} className={selectedRole !== 'all' ? 'text-blue-600' : 'text-slate-400'} />
                  <span>{selectedRole !== 'all' ? `Role: ${selectedRoleLabel}` : 'Role Filter'}</span>
                  <ChevronDown size={14} className={selectedRole !== 'all' ? 'text-blue-500' : 'text-slate-400'} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-1 bg-white shadow-lg border border-slate-100 rounded-xl">
                <div className="px-2 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Filter by Role
                </div>
                <div className="h-px bg-slate-100 my-1" />
                <DropdownMenuItem 
                  onClick={() => setSelectedRole("all")}
                  className={`flex items-center justify-between cursor-pointer px-2.5 py-2 rounded-lg text-sm ${
                    selectedRole === "all" ? "bg-blue-50 font-semibold text-blue-700" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>All Roles</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-400">({users.length})</span>
                    {selectedRole === "all" && <Check size={14} className="text-blue-600" />}
                  </div>
                </DropdownMenuItem>

                {availableRoles.map(r => {
                  const count = users.filter(u => getUserRoleKey(u).toLowerCase() === r.key.toLowerCase()).length;
                  const isSelected = selectedRole.toLowerCase() === r.key.toLowerCase();
                  return (
                    <DropdownMenuItem 
                      key={r.key} 
                      onClick={() => setSelectedRole(r.key)}
                      className={`flex items-center justify-between cursor-pointer px-2.5 py-2 rounded-lg text-sm ${
                        isSelected ? "bg-blue-50 font-semibold text-blue-700" : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span>{r.label}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-400">({count})</span>
                        {isSelected && <Check size={14} className="text-blue-600" />}
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Organisation Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className={`h-9 px-3 text-sm font-medium rounded-lg flex items-center gap-2 border transition-colors ${
                    selectedOrg !== 'all' 
                      ? 'bg-blue-50 border-blue-200 text-blue-700 font-semibold shadow-xs' 
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Building2 size={14} className={selectedOrg !== 'all' ? 'text-blue-600' : 'text-slate-400'} />
                  <span className="max-w-[170px] truncate">
                    {selectedOrg !== 'all' ? `Org: ${selectedOrgLabel}` : 'Org Filter'}
                  </span>
                  <ChevronDown size={14} className={selectedOrg !== 'all' ? 'text-blue-500' : 'text-slate-400'} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-1 max-h-72 overflow-y-auto bg-white shadow-lg border border-slate-100 rounded-xl">
                <div className="px-2 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Filter by Organisation
                </div>
                <div className="h-px bg-slate-100 my-1" />
                <DropdownMenuItem 
                  onClick={() => setSelectedOrg("all")}
                  className={`flex items-center justify-between cursor-pointer px-2.5 py-2 rounded-lg text-sm ${
                    selectedOrg === "all" ? "bg-blue-50 font-semibold text-blue-700" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>All Organisations</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-400">({users.length})</span>
                    {selectedOrg === "all" && <Check size={14} className="text-blue-600" />}
                  </div>
                </DropdownMenuItem>

                {availableOrgs.map(org => {
                  const count = users.filter(u => 
                    (u.organization_id && u.organization_id === org.id) || 
                    (u.organization?.id && u.organization?.id === org.id) || 
                    (u.organization?.name && u.organization?.name.toLowerCase() === org.name.toLowerCase())
                  ).length;
                  const isSelected = selectedOrg === org.id || selectedOrg.toLowerCase() === org.name.toLowerCase();
                  return (
                    <DropdownMenuItem 
                      key={org.id} 
                      onClick={() => setSelectedOrg(org.id)}
                      className={`flex items-center justify-between cursor-pointer px-2.5 py-2 rounded-lg text-sm ${
                        isSelected ? "bg-blue-50 font-semibold text-blue-700" : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span className="truncate max-w-[175px]" title={org.name}>
                        {org.name}
                      </span>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="text-xs text-slate-400">({count})</span>
                        {isSelected && <Check size={14} className="text-blue-600" />}
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Clear All Filters Button */}
            {isFiltered && (
              <button 
                onClick={clearAllFilters}
                className="h-9 px-3 text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-lg flex items-center gap-1.5 transition-colors"
                title="Reset all filters"
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Filters Pill Bar */}
        {isFiltered && (
          <div className="px-4 py-2.5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between text-xs gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-500">Active Filters:</span>
              {search && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs">
                  <span>Search: <strong>"{search}"</strong></span>
                  <button onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-600 ml-0.5">
                    <X size={12} />
                  </button>
                </span>
              )}
              {selectedRole !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-800 font-medium shadow-2xs">
                  <span>Role: <strong>{selectedRoleLabel}</strong></span>
                  <button onClick={() => setSelectedRole("all")} className="text-blue-400 hover:text-blue-700 ml-0.5">
                    <X size={12} />
                  </button>
                </span>
              )}
              {selectedOrg !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-800 font-medium shadow-2xs">
                  <span>Org: <strong>{selectedOrgLabel}</strong></span>
                  <button onClick={() => setSelectedOrg("all")} className="text-blue-400 hover:text-blue-700 ml-0.5">
                    <X size={12} />
                  </button>
                </span>
              )}
            </div>

            <div className="text-slate-500 font-medium">
              Showing <strong>{filteredUsers.length}</strong> of <strong>{users.length}</strong> users
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/50 text-slate-500 font-medium">
              <tr>
                <th className="px-4 py-3 font-medium">User Name</th>
                <th className="px-4 py-3 font-medium">Organisation</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Last Login</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center text-slate-500">
                    <div className="max-w-sm mx-auto space-y-2">
                      <p className="font-semibold text-slate-800 text-base">No users found</p>
                      <p className="text-xs text-slate-400">
                        No user accounts match the current filter and search criteria.
                      </p>
                      {isFiltered && (
                        <div className="pt-2">
                          <button 
                            onClick={clearAllFilters}
                            className="px-3.5 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors inline-flex items-center gap-1.5"
                          >
                            <RotateCcw size={12} /> Clear all filters
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                        {u.full_name ? u.full_name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : u.email.substring(0,2).toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-900">{u.full_name || 'No Name'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{u.organization?.name || '-'}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                      {formatRoleName(u.user_roles?.[0]?.role?.name)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      u.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                      u.status === 'PENDING_APPROVAL' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    } border`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {u.last_login_at ? formatDistanceToNow(new Date(u.last_login_at), { addSuffix: true }) : 'Never'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end">
                      {isSuperAdminUser(u) ? (
                        <span 
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200/80 rounded-md"
                          title="Root Super Admin account cannot be suspended"
                        >
                          <Shield size={12} className="text-blue-600" />
                          Protected
                        </span>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button 
                              className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none" 
                              title="Actions"
                            >
                              <MoreHorizontal size={16} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44 p-1 bg-white shadow-lg border border-slate-100 rounded-xl">
                            <DropdownMenuItem 
                              onClick={() => toggleUserStatus(u)}
                              className={u.status === 'ACTIVE' 
                                ? "cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 focus:text-red-700 focus:bg-red-50 data-[highlighted]:text-red-700 data-[highlighted]:bg-red-50 font-medium px-2.5 py-2 rounded-lg"
                                : "cursor-pointer text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 focus:text-emerald-700 focus:bg-emerald-50 data-[highlighted]:text-emerald-700 data-[highlighted]:bg-emerald-50 font-medium px-2.5 py-2 rounded-lg"
                              }
                            >
                              {u.status === 'ACTIVE' ? (
                                <>
                                  <UserX size={15} className="text-red-500" />
                                  <span>Suspend User</span>
                                </>
                              ) : (
                                <>
                                  <UserCheck size={15} className="text-emerald-500" />
                                  <span>Activate User</span>
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
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
