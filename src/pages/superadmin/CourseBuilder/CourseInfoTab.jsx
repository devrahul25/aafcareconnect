import React, { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";
import debounce from "lodash/debounce";
import { UploadCloud, Image as ImageIcon } from "lucide-react";

export default function CourseInfoTab({ course, setSaveStatus }) {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: course.title || "",
    description: course.description || "",
    thumbnail_url: course.thumbnail_url || "",
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


  // Debounce the mutation call to prevent spamming the backend
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce((data) => {
      updateMutation.mutate(data);
    }, 1000),
    [course.id]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    setSaveStatus("saving");
    debouncedSave(newFormData);
  };

  const handleMockImageUpload = () => {
    const url = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
    const newFormData = { ...formData, thumbnail_url: url };
    setFormData(newFormData);
    setSaveStatus("saving");
    debouncedSave(newFormData);
  };


  return (
    <div className="space-y-8 animate-fade-in relative">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Course Information</h2>
        <p className="text-sm text-slate-500 mt-1">Provide the foundational details for your platform template.</p>
      </div>

      <div className="card p-6 space-y-6 shadow-sm border border-slate-200">
        
        {/* Course Thumbnail */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-700">Course Thumbnail</label>
          <div className="flex items-start gap-6">
            <div className="w-64 h-36 bg-slate-100 rounded-xl border border-slate-200 overflow-hidden relative flex-shrink-0 flex items-center justify-center">
              {formData.thumbnail_url ? (
                <img src={formData.thumbnail_url} alt="Course Cover" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400">
                  <ImageIcon size={32} className="mb-2 opacity-50" />
                  <span className="text-xs font-medium">No Image</span>
                </div>
              )}
            </div>
            <div className="space-y-3">
              <p className="text-sm text-slate-500 leading-relaxed">
                Upload a high-quality image to represent this course. Recommended size is 1200x675 pixels (16:9 ratio).
              </p>
              <button 
                onClick={handleMockImageUpload}
                className="h-9 px-4 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2 transition-colors"
              >
                <UploadCloud size={16} /> Choose Image
              </button>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700">Course Title</label>
          <input 
            type="text" 
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Safeguarding Children Level 2"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-slate-900"
          />
        </div>


        {/* Description */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700">Course Description</label>
          <textarea 
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe what learners will achieve by taking this course..."
            rows={5}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-y"
          />
        </div>
      </div>
    </div>
  );
}
