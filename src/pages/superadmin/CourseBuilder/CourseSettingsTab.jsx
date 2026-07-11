import React, { useState, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";
import debounce from "lodash/debounce";
import { Settings, X, Plus, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function CourseSettingsTab({ course, setSaveStatus }) {
  const queryClient = useQueryClient();
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [formData, setFormData] = useState({
    category: course.category || "",
    level: course.level || "FOUNDATION",
    pass_mark: course.pass_mark || "",
    duration_minutes: course.duration_minutes || "",
    mandatory: course.mandatory || false,
    auto_issue: course.auto_issue ?? true, // ?? because default is true
    allow_retake: course.allow_retake ?? true,
  });

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['course-categories'],
    queryFn: async () => {
      const res = await apiClient.get('/templates/categories');
      return res.data?.data || [];
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data) => apiClient.patch(`/templates/${course.id}`, data),
    onMutate: () => {
      setSaveStatus("saving");
    },
    onSuccess: (res) => {
      setSaveStatus("saved");
      queryClient.setQueryData(['template', course.id], res);
    },
    onError: () => {
      setSaveStatus("error");
    }
  });

  const addCategoryMutation = useMutation({
    mutationFn: (name) => apiClient.post('/templates/categories', { name }),
    onSuccess: () => {
      queryClient.invalidateQueries(['course-categories']);
      setNewCategoryName("");
      toast({ title: "Category added", description: "The course category has been created successfully." });
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message || "Failed to add category", variant: "destructive" });
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id) => apiClient.delete(`/templates/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['course-categories']);
      toast({ title: "Category deleted", description: "The course category has been removed." });
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message || "Failed to delete category", variant: "destructive" });
    }
  });

  // Debounce the mutation call to prevent spamming the backend
   
  const debouncedSave = useCallback(
    debounce((data) => {
      // Ensure numbers are properly formatted
      const payload = {
        ...data,
        pass_mark: data.pass_mark !== "" ? Number(data.pass_mark) : null,
        duration_minutes: data.duration_minutes !== "" ? Number(data.duration_minutes) : null,
      };
      updateMutation.mutate(payload);
    }, 1000),
    [course.id]
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    const newFormData = { ...formData, [name]: newValue };
    setFormData(newFormData);
    setSaveStatus("saving");
    debouncedSave(newFormData);
  };

  const handleToggle = (name, checked) => {
    const newFormData = { ...formData, [name]: checked };
    setFormData(newFormData);
    setSaveStatus("saving");
    debouncedSave(newFormData);
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategoryMutation.mutate(newCategoryName.trim());
    }
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      <div className="card p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Course Settings</h3>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Category */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
              <button 
                onClick={() => setIsManageModalOpen(true)}
                className="text-[11px] text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1 uppercase tracking-wide"
              >
                <Settings size={12} /> Manage Options
              </button>
            </div>
            <select 
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={isLoadingCategories}
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all shadow-sm"
            >
              <option value="">Select a category...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Level */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Level</label>
            <select 
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all shadow-sm"
            >
              <option value="FOUNDATION">Foundation</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>

          {/* Pass Mark */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded-sm w-max">Pass Mark (%)</label>
            <input 
              type="number" 
              name="pass_mark"
              value={formData.pass_mark}
              onChange={handleChange}
              placeholder="e.g. 75"
              min="0"
              max="100"
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all shadow-sm text-slate-700 font-medium"
            />
          </div>

          {/* Duration */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Duration (Minutes)</label>
            <input 
              type="number" 
              name="duration_minutes"
              value={formData.duration_minutes}
              onChange={handleChange}
              placeholder="e.g. 60"
              min="1"
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all shadow-sm text-slate-700 font-medium"
            />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          {/* Mandatory Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <h4 className="font-semibold text-slate-800 text-sm">Mandatory for all learners</h4>
              <p className="text-xs text-slate-500 mt-0.5">All enrolled users must complete this course</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="mandatory" checked={formData.mandatory} onChange={e => handleToggle('mandatory', e.target.checked)} className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Auto-generate Certificate Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <h4 className="font-semibold text-slate-800 text-sm">Auto-generate Certificate</h4>
              <p className="text-xs text-slate-500 mt-0.5">Issue a completion certificate on passing</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="auto_issue" checked={formData.auto_issue} onChange={e => handleToggle('auto_issue', e.target.checked)} className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Allow Retakes Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <h4 className="font-semibold text-slate-800 text-sm">Allow retakes</h4>
              <p className="text-xs text-slate-500 mt-0.5">Learners can retake failed assessments</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="allow_retake" checked={formData.allow_retake} onChange={e => handleToggle('allow_retake', e.target.checked)} className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Manage Categories Modal */}
      {isManageModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-900">Manage Course Categories</h3>
              <button 
                onClick={() => setIsManageModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-5 flex-1 overflow-y-auto max-h-[60vh]">
              <div className="flex gap-2 mb-6">
                <input 
                  type="text" 
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="New category name..."
                  className="flex-1 h-9 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                />
                <button 
                  onClick={handleAddCategory}
                  disabled={!newCategoryName.trim() || addCategoryMutation.isPending}
                  className="h-9 px-3 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-1.5"
                >
                  <Plus size={16} /> Add
                </button>
              </div>

              <div className="space-y-2">
                {isLoadingCategories ? (
                  <p className="text-sm text-slate-500 text-center py-4">Loading categories...</p>
                ) : categories.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">No categories defined yet.</p>
                ) : (
                  categories.map((c) => (
                    <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50 group hover:bg-white transition-colors">
                      <span className="text-sm font-medium text-slate-700">{c.name}</span>
                      <button 
                        onClick={() => {
                          if(window.confirm(`Are you sure you want to delete "${c.name}"?`)) {
                            deleteCategoryMutation.mutate(c.id);
                          }
                        }}
                        disabled={deleteCategoryMutation.isPending}
                        className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setIsManageModalOpen(false)}
                className="px-4 py-2 font-semibold text-sm text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
