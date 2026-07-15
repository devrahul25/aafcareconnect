import React, { useState, useEffect } from 'react';
import { apiClient } from '@/api/apiClient';
import { Loader2, User, Search, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AssignedLearnersTab({ staffId }) {
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // For assigning new learner modal/dropdown
  const [showAssign, setShowAssign] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    fetchLearners();
  }, [staffId]);

  const fetchLearners = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/users/${staffId}/assigned-learners`);
      setLearners(res.data.data);
    } catch (err) {
      toast.error('Failed to load assigned learners');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      // Just fetch all users in org (could be filtered by role=learner)
      const res = await apiClient.get('/users?limit=100');
      // Filter out already assigned and the staff member themselves
      const assignedIds = learners.map(l => l.id);
      setAvailableUsers(res.data.data.filter(u => !assignedIds.includes(u.id) && u.id !== staffId));
    } catch (err) {
      toast.error('Failed to fetch available users');
    }
  };

  const handleAssignClick = () => {
    setShowAssign(true);
    fetchAvailableUsers();
  };

  const assignLearner = async (learnerId) => {
    try {
      setAssigning(true);
      await apiClient.post(`/users/${staffId}/assigned-learners`, { learner_id: learnerId });
      toast.success('Learner assigned');
      setShowAssign(false);
      fetchLearners();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to assign learner');
    } finally {
      setAssigning(false);
    }
  };

  const unassignLearner = async (learnerId) => {
    if (!window.confirm('Are you sure you want to unassign this learner?')) return;
    try {
      await apiClient.delete(`/users/${staffId}/assigned-learners/${learnerId}`);
      toast.success('Learner unassigned');
      fetchLearners();
    } catch (err) {
      toast.error('Failed to unassign learner');
    }
  };

  const filtered = learners.filter(l => 
    l.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    l.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-900">Assigned Learners</h2>
        <button 
          onClick={handleAssignClick}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          <Plus size={16} /> Assign Learner
        </button>
      </div>

      {showAssign && (
        <div className="mb-6 p-4 border border-blue-100 bg-blue-50 rounded-xl">
          <h3 className="font-bold text-slate-900 mb-4">Assign New Learner</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-60 overflow-y-auto">
            {availableUsers.map(user => (
              <div key={user.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-xs font-bold">
                    {user.full_name?.charAt(0)}
                  </div>
                  <div className="text-sm font-medium text-slate-900 truncate max-w-[120px]" title={user.full_name}>
                    {user.full_name}
                  </div>
                </div>
                <button
                  onClick={() => assignLearner(user.id)}
                  disabled={assigning}
                  className="text-blue-600 hover:text-blue-800 text-sm font-bold"
                >
                  Assign
                </button>
              </div>
            ))}
            {availableUsers.length === 0 && (
              <div className="col-span-3 text-slate-500 text-sm text-center py-4">No available users to assign.</div>
            )}
          </div>
          <button 
            onClick={() => setShowAssign(false)}
            className="mt-4 px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Search assigned learners..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl">
              <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-900">No learners found</h3>
              <p className="text-slate-500 text-sm">Assign a learner to see them listed here.</p>
            </div>
          ) : (
            filtered.map(learner => (
              <div key={learner.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                    {learner.full_name?.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{learner.full_name}</div>
                    <div className="text-sm text-slate-500">{learner.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-2.5 py-1 text-xs font-bold bg-slate-100 text-slate-600 rounded-full">
                    Assigned: {new Date(learner.assigned_at).toLocaleDateString()}
                  </span>
                  <button 
                    onClick={() => unassignLearner(learner.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Unassign"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
