import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Play, CheckCircle2, Layout, BookOpen, HelpCircle, Award, Settings, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";
import { toast } from "@/components/ui/use-toast";

import CourseInfoTab from "./CourseInfoTab";
import CurriculumBuilder from "./CurriculumBuilder";
import QuizBuilder from "./QuizBuilder";
import CertificateSettings from "./CertificateSettings";

export default function CourseBuilder() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = courseId === 'new';

  const [activeTab, setActiveTab] = useState("info");
  const [saveStatus, setSaveStatus] = useState("saved"); // 'saved', 'saving', 'error'

  // Fetch course data if not new
  const { data: response, isLoading } = useQuery({
    queryKey: ['template', courseId],
    queryFn: () => apiClient.get(`/templates/${courseId}`).then(res => res.data),
    enabled: !isNew
  });

  const courseData = response?.data || null;

  // Mutation for creating draft
  const createMutation = useMutation({
    mutationFn: (data) => apiClient.post('/templates', data).then(res => res.data),
    onSuccess: (res) => {
      queryClient.setQueryData(['template', res.data.id], res);
      navigate(`/superadmin/course-builder/${res.data.id}`, { replace: true });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to initialize course", variant: "destructive" });
    }
  });

  // Automatically create a draft if 'new'
  useEffect(() => {
    if (isNew && !createMutation.isPending && !createMutation.isSuccess) {
      createMutation.mutate({
        title: "Untitled Template",
        category: "General",
        description: "",
      });
    }
  }, [isNew]);

  // Publish mutation
  const publishMutation = useMutation({
    mutationFn: () => apiClient.post(`/templates/${courseId}/publish`),
    onSuccess: () => {
      toast({ title: "Success", description: "Template published platform-wide!" });
      queryClient.invalidateQueries(['template', courseId]);
      queryClient.invalidateQueries(['templates']);
      navigate('/superadmin/course-library');
    },
    onError: (error) => {
      toast({ 
        title: "Validation Error", 
        description: error.response?.data?.error || "Failed to publish template", 
        variant: "destructive" 
      });
    }
  });

  if (isNew || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
          <p className="text-slate-500 font-medium">Initializing Course Builder...</p>
        </div>
      </div>
    );
  }

  if (!courseData) return null;

  const TABS = [
    { id: "info", label: "Course Info", icon: Layout },
    { id: "curriculum", label: "Curriculum", icon: BookOpen },
    { id: "quiz", label: "Assessments", icon: HelpCircle },
    { id: "certificate", label: "Certificate", icon: Award },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/superadmin/course-library')}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-bold text-slate-900 text-lg leading-tight">{courseData.title || 'Untitled Course'}</h1>
            <div className="flex items-center gap-2 text-xs font-medium mt-0.5">
              <span className={`px-2 py-0.5 rounded-full ${
                courseData.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {courseData.status}
              </span>
              <span className="text-slate-300">•</span>
              <span className={`flex items-center gap-1 ${
                saveStatus === 'saved' ? 'text-emerald-600' : 
                saveStatus === 'error' ? 'text-red-500' : 'text-slate-500'
              }`}>
                {saveStatus === 'saved' ? <CheckCircle2 size={12} /> : 
                 saveStatus === 'saving' ? <Loader2 size={12} className="animate-spin" /> : null}
                {saveStatus === 'saved' ? 'All changes saved' : 
                 saveStatus === 'saving' ? 'Saving changes...' : 'Failed to save'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="h-9 px-4 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2 transition-colors">
            <Play size={16} /> Preview
          </button>
          <button 
            onClick={() => publishMutation.mutate()}
            disabled={publishMutation.isPending || courseData.status === 'PUBLISHED'}
            className="h-9 px-5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {publishMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : 'Publish Template'}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Tabs */}
        <div className="w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col p-4">
          <div className="space-y-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <tab.icon size={18} className={activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content Panel */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-4xl mx-auto pb-20">
            {activeTab === 'info' && (
              <CourseInfoTab course={courseData} setSaveStatus={setSaveStatus} />
            )}
            {activeTab === 'curriculum' && (
              <CurriculumBuilder course={courseData} setSaveStatus={setSaveStatus} />
            )}
            {activeTab === 'quiz' && (
              <QuizBuilder course={courseData} setSaveStatus={setSaveStatus} />
            )}
            {activeTab === 'certificate' && (
              <CertificateSettings course={courseData} setSaveStatus={setSaveStatus} />
            )}
            {activeTab === 'settings' && (
              <div className="card p-8 text-center text-slate-500">
                Advanced settings coming soon...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
