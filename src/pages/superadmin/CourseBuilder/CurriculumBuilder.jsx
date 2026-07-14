import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus, GripVertical, FileText, Video, HelpCircle, Trash2, Edit2, LayoutTemplate } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";

import VideoModuleUI from "./Modules/VideoModuleUI";
import DocumentModuleUI from "./Modules/DocumentModuleUI";
import QuizModuleUI from "./Modules/QuizModuleUI";
import AssignmentModuleUI from "./Modules/AssignmentModuleUI";

export default function CurriculumBuilder({ course, setSaveStatus }) {
  const queryClient = useQueryClient();
  const [sections, setSections] = useState(course.sections || []);

  useEffect(() => {
    setSections(course.sections || []);
  }, [course.sections]);

  const reorderMutation = useMutation({
    mutationFn: (newSections) => apiClient.post(`/templates/${course.id}/sections/reorder`, {
      sections: newSections.map((s, index) => ({ id: s.id, sort_order: index }))
    }),
    onMutate: () => setSaveStatus("saving"),
    onSuccess: () => {
      setSaveStatus("saved");
      queryClient.invalidateQueries({ queryKey: ['template', course.id] });
    },
    onError: () => setSaveStatus("error")
  });

  const addModuleMutation = useMutation({
    mutationFn: (type) => apiClient.post(`/templates/${course.id}/sections`, {
      title: `New ${type.charAt(0) + type.slice(1).toLowerCase().replace('_', ' ')}`,
      type: type
    }).then(res => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['template', course.id] })
  });

  const deleteModuleMutation = useMutation({
    mutationFn: (sectionId) => apiClient.delete(`/templates/${course.id}/sections/${sectionId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['template', course.id] })
  });

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setSections(items);
    reorderMutation.mutate(items);
  };

  const handleAddModule = (type) => {
    addModuleMutation.mutate(type);
  };

  const handleDeleteModule = (id) => {
    if (confirm('Are you sure you want to delete this module and all its content?')) {
      deleteModuleMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Curriculum</h2>
          <p className="text-sm text-slate-500 mt-1">Organize your course into modules and lessons.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleAddModule('VIDEO')}
            disabled={addModuleMutation.isPending}
            className="h-9 px-3 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Video size={14} /> Video
          </button>
          <button 
            onClick={() => handleAddModule('DOCUMENT')}
            disabled={addModuleMutation.isPending}
            className="h-9 px-3 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <FileText size={14} /> Document
          </button>
          <button 
            onClick={() => handleAddModule('QUIZ')}
            disabled={addModuleMutation.isPending}
            className="h-9 px-3 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <HelpCircle size={14} /> Quiz
          </button>
          <button 
            onClick={() => handleAddModule('RICH_TEXT')}
            disabled={addModuleMutation.isPending}
            className="h-9 px-3 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus size={14} /> Rich Text
          </button>
        </div>
      </div>

      {sections.length === 0 ? (
        <div className="card p-12 flex flex-col items-center justify-center text-center border-dashed border-2 border-slate-200">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <LayoutTemplate size={24} />
          </div>
          <h3 className="text-base font-semibold text-slate-900">No curriculum yet</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mb-6">Start building your course by adding modules, then fill them with lessons, videos, and quizzes.</p>
          <div className="flex gap-2 justify-center">
            <button onClick={() => handleAddModule('VIDEO')} className="h-9 px-4 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2 transition-colors">
              <Video size={16} /> Add Video
            </button>
            <button onClick={() => handleAddModule('DOCUMENT')} className="h-9 px-4 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2 transition-colors">
              <FileText size={16} /> Add Document
            </button>
            <button onClick={() => handleAddModule('QUIZ')} className="h-9 px-4 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2 transition-colors">
              <HelpCircle size={16} /> Add Quiz
            </button>
            <button onClick={() => handleAddModule('RICH_TEXT')} className="h-9 px-4 text-sm font-semibold text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 flex items-center gap-2 transition-colors">
              <Plus size={16} /> Add Rich Text
            </button>
          </div>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="modules">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {sections.map((section, index) => (
                  <Draggable key={section.id} draggableId={section.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`card p-0 overflow-hidden shadow-sm border border-slate-200 bg-white transition-all ${
                          snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500/50 scale-[1.02]' : ''
                        }`}
                      >
                        {/* Module Header */}
                        <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between group">
                          <div className="flex items-center gap-3">
                            <div 
                              {...provided.dragHandleProps}
                              className="text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing p-1"
                            >
                              <GripVertical size={16} />
                            </div>
                            <h3 className="font-semibold text-slate-900 text-sm">Module {index + 1}: {section.title}</h3>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="text-slate-400 hover:text-blue-600 p-1.5 hover:bg-blue-50 rounded transition-colors" title="Edit Module Name">
                              <Edit2 size={14} />
                            </button>
                            <button 
                              onClick={() => handleDeleteModule(section.id)}
                              className="text-slate-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded transition-colors" 
                              title="Delete Module"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Module Content */}
                        {/* Module Content Specific UI */}
                        {section.type === 'VIDEO' && <VideoModuleUI section={section} courseId={course.id} />}
                        {section.type === 'DOCUMENT' && <DocumentModuleUI section={section} courseId={course.id} />}
                        {section.type === 'QUIZ' && <QuizModuleUI section={section} courseId={course.id} />}
                        {section.type === 'RICH_TEXT' && <AssignmentModuleUI section={section} courseId={course.id} />}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
}
