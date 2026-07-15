import React, { useState, useEffect } from 'react';
import { apiClient } from '@/api/apiClient';
import { Loader2, BookOpen, Search, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AssignedCoursesTab({ staffId }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // For assigning new course
  const [showAssign, setShowAssign] = useState(false);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, [staffId]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/course-enrolments?user_id=${staffId}`);
      setCourses(res.data.data);
    } catch (err) {
      toast.error('Failed to load assigned courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableCourses = async () => {
    try {
      const res = await apiClient.get('/courses?limit=100');
      const assignedIds = courses.map(c => c.course_id);
      setAvailableCourses(res.data.data.filter(c => !assignedIds.includes(c.id)));
    } catch (err) {
      toast.error('Failed to fetch available courses');
    }
  };

  const handleAssignClick = () => {
    setShowAssign(true);
    fetchAvailableCourses();
  };

  const assignCourse = async (courseId) => {
    try {
      setAssigning(true);
      await apiClient.post('/course-enrolments', { user_id: staffId, course_id: courseId });
      toast.success('Course assigned');
      setShowAssign(false);
      fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to assign course');
    } finally {
      setAssigning(false);
    }
  };

  const unassignCourse = async (enrolmentId) => {
    if (!window.confirm('Are you sure you want to unassign this course? Progress will be lost.')) return;
    try {
      await apiClient.delete(`/course-enrolments/${enrolmentId}`);
      toast.success('Course unassigned');
      fetchCourses();
    } catch (err) {
      toast.error('Failed to unassign course');
    }
  };

  const filtered = courses.filter(c => 
    c.course?.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-900">Assigned Courses</h2>
        <button 
          onClick={handleAssignClick}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          <Plus size={16} /> Assign Course
        </button>
      </div>

      {showAssign && (
        <div className="mb-6 p-4 border border-blue-100 bg-blue-50 rounded-xl">
          <h3 className="font-bold text-slate-900 mb-4">Assign New Course</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto">
            {availableCourses.map(course => (
              <div key={course.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <BookOpen size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{course.title}</p>
                    <p className="text-xs text-slate-500 line-clamp-1">{course.description || 'No description'}</p>
                  </div>
                </div>
                <button
                  onClick={() => assignCourse(course.id)}
                  disabled={assigning}
                  className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-500 disabled:opacity-50 ml-2 whitespace-nowrap"
                >
                  Assign
                </button>
              </div>
            ))}
            {availableCourses.length === 0 && (
              <div className="col-span-full py-4 text-center text-sm text-slate-500">
                No new courses available to assign.
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-end">
            <button 
              onClick={() => setShowAssign(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Search assigned courses..."
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
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-900">No courses found</h3>
              <p className="text-slate-500 text-sm">This staff member has not been assigned any courses yet.</p>
            </div>
          ) : (
            filtered.map(enrolment => (
              <div key={enrolment.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  {enrolment.course?.thumbnail_url ? (
                    <img src={enrolment.course.thumbnail_url} alt="Course" className="w-16 h-12 object-cover rounded-lg" />
                  ) : (
                    <div className="w-16 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700">
                      <BookOpen size={20} />
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-slate-900">{enrolment.course?.title || 'Unknown Course'}</div>
                    <div className="text-sm text-slate-500">
                      Enrolled: {new Date(enrolment.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-slate-700">{enrolment.progress_percent}%</span>
                    <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden mt-1">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${enrolment.progress_percent}%` }}
                      />
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                    enrolment.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                    enrolment.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-700' :
                    enrolment.status === 'FAILED' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {enrolment.status.replace('_', ' ')}
                    <button 
                      onClick={() => unassignCourse(enrolment.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2"
                      title="Unassign Course"
                    >
                      <Trash2 size={16} />
                    </button>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
