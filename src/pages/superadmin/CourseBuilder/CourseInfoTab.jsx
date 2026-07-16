import React, { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";
import debounce from "lodash/debounce";
import { UploadCloud, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function CourseInfoTab({ course, setSaveStatus }) {
  const queryClient = useQueryClient();
  const fileInputRef = React.useRef(null);
  const [uploadingImage, setUploadingImage] = useState(false);

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
      queryClient.setQueryData(['template', course.id], res.data);
    },
    onError: () => {
      setSaveStatus("error");
    }
  });


  // Debounce the mutation call to prevent spamming the backend
   
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

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "Error", description: "Image size should be less than 2MB", variant: "destructive" });
      return;
    }

    setUploadingImage(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      const newFormData = { ...formData, thumbnail_url: base64String };
      setFormData(newFormData);
      setSaveStatus("saving");
      debouncedSave(newFormData);
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
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
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageUpload} 
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="h-9 px-4 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {uploadingImage ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />} 
                {uploadingImage ? 'Uploading...' : 'Choose Image'}
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
