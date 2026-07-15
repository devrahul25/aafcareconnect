import React, { useState, useEffect } from 'react';
import { apiClient } from '@/api/apiClient';
import { Loader2, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ActivityLogsTab({ staffId }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, [staffId]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/users/${staffId}/activity`);
      setLogs(res.data.data);
    } catch (err) {
      toast.error('Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-900">Activity Logs</h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {logs.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl">
              <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-900">No recent activity</h3>
              <p className="text-slate-500 text-sm">There are no activity logs recorded for this user yet.</p>
            </div>
          ) : (
            <div className="relative border-l-2 border-slate-200 ml-4 pl-6 pb-4">
              {logs.map((log, idx) => (
                <div key={log.id} className={`relative ${idx !== logs.length - 1 ? 'mb-8' : ''}`}>
                  <div className="absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-sm" />
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-bold text-slate-900">{log.event_type.replace(/_/g, ' ')}</div>
                      <div className="text-xs font-medium text-slate-500">
                        {new Date(log.created_at).toLocaleString()}
                      </div>
                    </div>
                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                      <div className="mt-3 bg-slate-50 p-3 rounded-lg border border-slate-100 overflow-x-auto text-xs text-slate-600 font-mono">
                        <pre>{JSON.stringify(log.metadata, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
