import React, { useState, useEffect, useRef } from "react";
import { Search, Plus, Building2, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "@/components/ui/PageHeader";
import { tokenStorage } from "@/api/apiClient";
import EditOrganisationModal from "@/components/admin/EditOrganisationModal";

export default function Organisations() {
  const [search, setSearch] = useState("");
  const [organisations, setOrganisations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetch('/api/v1/organizations', {
      headers: {
        'Authorization': `Bearer ${tokenStorage.getAccessToken()}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrganisations(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch organisations:", err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this organisation and all its users? This action cannot be undone.")) return;
    
    try {
      const res = await fetch(`/api/v1/organizations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${tokenStorage.getAccessToken()}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setOrganisations(prev => prev.filter(org => org.id !== id));
      } else {
        alert(data.error || 'Failed to delete organisation');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while deleting.');
    }
  };

  const handleEditSave = (updatedOrg) => {
    setOrganisations(prev => prev.map(org => org.id === updatedOrg.id ? { ...org, ...updatedOrg } : org));
  };

  const filteredOrgs = organisations.filter(org => 
    org.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-[1440px] mx-auto">
      <PageHeader 
        title="Organisations" 
        subtitle="Manage all registered organisations on the platform"
        actions={
          <Link to="/superadmin/organisations/create" className="h-9 px-4 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-2 transition-colors">
            <Plus size={16} /> New Organisation
          </Link>
        }
      />

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search organisations..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/50 text-slate-500 font-medium">
                <tr>
                  <th className="px-4 py-3 font-medium">Organisation Name</th>
                  <th className="px-4 py-3 font-medium">Subscription</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Learners</th>
                  <th className="px-4 py-3 font-medium text-right">Staff</th>
                  <th className="px-4 py-3 font-medium">Admin Email</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrgs.map((org) => {
                  const sub = org.subscriptions?.[0];
                  const admin = org.users?.[0];
                  
                  return (
                    <tr key={org.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                            {org.logo_url ? <img src={org.logo_url} alt="" className="w-full h-full object-cover rounded-lg" /> : <Building2 size={14} />}
                          </div>
                          <div className="flex flex-col">
                            <Link to={`/superadmin/organisations/${org.id}`} className="font-bold text-slate-900 hover:text-blue-600 hover:underline transition-colors">{org.name}</Link>
                            <span className="text-[11px] text-slate-500 font-medium">ID: ORG-{org.id.substring(0, 6).toUpperCase()}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{sub?.plan || "N/A"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          org.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          org.status === 'TRIAL' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-red-50 text-red-700 border-red-200'
                        } border`}>
                          {org.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-right font-medium">{sub?.max_learners || 0}</td>
                      <td className="px-4 py-3 text-slate-600 text-right font-medium">{sub?.max_staff || 0}</td>
                      <td className="px-4 py-3 text-slate-600 text-xs">{admin?.email || "No Admin"}</td>
                      <td className="px-4 py-3 text-right relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdown(activeDropdown === org.id ? null : org.id);
                          }}
                          className="text-slate-400 hover:text-blue-600 p-1 rounded transition-colors"
                        >
                          <MoreHorizontal size={16} />
                        </button>
                        
                        {activeDropdown === org.id && (
                          <div 
                            ref={dropdownRef}
                            className="absolute right-8 top-10 w-48 bg-white rounded-lg shadow-lg border border-slate-100 z-10 py-1 text-left animate-in fade-in zoom-in-95 duration-100"
                          >
                            <button 
                              onClick={() => {
                                setSelectedOrg(org);
                                setEditModalOpen(true);
                                setActiveDropdown(null);
                              }}
                              className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Edit size={14} className="text-slate-400" />
                              Edit Organisation
                            </button>
                            <button 
                              onClick={() => {
                                handleDelete(org.id);
                                setActiveDropdown(null);
                              }}
                              className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 size={14} className="text-red-400" />
                              Delete Organisation
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filteredOrgs.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                      No organisations found. Create one to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      <EditOrganisationModal 
        isOpen={editModalOpen} 
        onClose={() => setEditModalOpen(false)} 
        org={selectedOrg}
        onSave={handleEditSave}
      />
    </div>
  );
}
