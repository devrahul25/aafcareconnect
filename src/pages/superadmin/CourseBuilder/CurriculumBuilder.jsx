import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus, GripVertical, FileText, Video, HelpCircle, Trash2, Edit2, LayoutTemplate, Link as LinkIcon, Download } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";
import CurriculumTree from "./Curriculum/CurriculumTree";
import LessonConfigurator from "./Curriculum/LessonConfigurator";

const LESSON_ICONS = {
  VIDEO: <Video size={14} />,
  DOCUMENT: <FileText size={14} />,
  RICH_TEXT: <FileText size={14} />,
  QUIZ: <HelpCircle size={14} />,
  EXTERNAL_LINK: <LinkIcon size={14} />,
  DOWNLOAD: <Download size={14} />
};

export default function CurriculumBuilder({ course, setSaveStatus }) {
  const queryClient = useQueryClient();
  const [sections, setSections] = useState(course.sections || []);
  
  // UI State
  const [expandedModules, setExpandedModules] = useState({});
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  
  // Configurator State
  const [configuratorOpen, setConfiguratorOpen] = useState(false);
  const [configuratorType, setConfiguratorType] = useState(null);
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);

  useEffect(() => {
    setSections(course.sections || []);
    // Auto-expand all by default
    if (course.sections) {
      const initialExpanded = {};
      course.sections.forEach(s => initialExpanded[s.id] = true);
      setExpandedModules(prev => ({ ...initialExpanded, ...prev }));
    }
  }, [course.sections]);

  const toggleModule = (id) => {
    setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getLessons = (section) => {
    const all = [
      ...(section.videos || []).map(v => ({ ...v, lessonType: 'VIDEO' })),
      ...(section.documents || []).map(d => ({ ...d, lessonType: d.file_type === 'ZIP' ? 'DOWNLOAD' : 'DOCUMENT' })),
      ...(section.rich_text_lessons || []).map(r => ({ ...r, lessonType: r.content?.startsWith('http') ? 'EXTERNAL_LINK' : 'RICH_TEXT' })),
      ...(section.quizzes || []).map(q => ({ ...q, lessonType: 'QUIZ' }))
    ];
    return all.sort((a, b) => a.sort_order - b.sort_order);
  };

  const reorderSectionsMutation = useMutation({
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
    mutationFn: (title) => apiClient.post(`/templates/${course.id}/sections`, {
      title,
      type: 'RICH_TEXT'
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['template', course.id] });
      setIsAddingModule(false);
      setNewModuleTitle("");
    }
  });

  const deleteModuleMutation = useMutation({
    mutationFn: (sectionId) => apiClient.delete(`/templates/${course.id}/sections/${sectionId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['template', course.id] })
  });

  const deleteLessonMutation = useMutation({
    mutationFn: ({ sectionId, lessonId, type }) => {
      let endpoint = '';
      if (type === 'VIDEO') endpoint = 'videos';
      else if (type === 'DOCUMENT' || type === 'DOWNLOAD') endpoint = 'documents';
      else if (type === 'QUIZ') endpoint = 'quizzes';
      else if (type === 'RICH_TEXT' || type === 'EXTERNAL_LINK') endpoint = 'rich-text';
      
      return apiClient.delete(`/templates/${course.id}/sections/${sectionId}/${endpoint}/${lessonId}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['template', course.id] })
  });

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination, type } = result;

    if (type === 'module') {
      const items = Array.from(sections);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      setSections(items);
      reorderSectionsMutation.mutate(items);
    }
  };

  const handleAddModule = () => {
    if (newModuleTitle.trim()) {
      addModuleMutation.mutate(newModuleTitle);
    }
  };

  const openLessonConfigurator = (moduleId, type, lesson = null) => {
    setActiveModuleId(moduleId);
    setConfiguratorType(type);
    setActiveLesson(lesson);
    setConfiguratorOpen(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Curriculum</h2>
            <p className="text-sm text-slate-500 mt-1">Organize your course into modules and lessons.</p>
          </div>
          <button 
            onClick={() => setIsAddingModule(true)}
            className="h-9 px-4 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus size={14} /> Add Module
          </button>
        </div>

        {sections.length === 0 && !isAddingModule ? (
          <div className="card p-12 flex flex-col items-center justify-center text-center border-dashed border-2 border-slate-200">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <LayoutTemplate size={24} />
            </div>
            <h3 className="text-base font-semibold text-slate-900">No curriculum created yet</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mb-6">Build your course by creating modules.</p>
            <button 
              onClick={() => setIsAddingModule(true)} 
              className="h-9 px-4 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
            >
              <Plus size={16} /> Add Module
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="modules" type="module">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                    {sections.map((section, index) => {
                      const lessons = getLessons(section);
                      const totalDuration = lessons.reduce((sum, l) => sum + (l.duration_secs || 0), 0);
                      const isExpanded = expandedModules[section.id];

                      return (
                        <Draggable key={section.id} draggableId={section.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`card p-0 overflow-hidden shadow-sm border border-slate-200 bg-white transition-all ${
                                snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500/50 scale-[1.02]' : ''
                              }`}
                            >
                              <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                  <div 
                                    {...provided.dragHandleProps}
                                    className="text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing p-1"
                                  >
                                    <GripVertical size={16} />
                                  </div>
                                  <button onClick={() => toggleModule(section.id)} className="flex items-center gap-2 text-left">
                                    <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                                      <span className="text-slate-400 font-normal">{isExpanded ? '▼' : '▶'} Module {index + 1}</span> {section.title}
                                    </h3>
                                  </button>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="text-xs text-slate-500 hidden md:flex items-center gap-3">
                                    <span>{lessons.length} Lessons</span>
                                    <span>Estimated Time {Math.round(totalDuration / 60)} mins</span>
                                  </div>
                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                      onClick={() => {
                                        if (confirm('Are you sure you want to delete this module?')) {
                                          deleteModuleMutation.mutate(section.id);
                                        }
                                      }}
                                      className="text-slate-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded transition-colors"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {isExpanded && (
                                <div className="p-4 space-y-3 bg-white">
                                  <Droppable droppableId={`lessons-${section.id}`} type="lesson">
                                    {(provided) => (
                                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                        {lessons.map((lesson, idx) => (
                                          <Draggable key={lesson.id} draggableId={lesson.id} index={idx}>
                                            {(provided) => (
                                              <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50 group hover:bg-slate-100/50 transition-colors"
                                              >
                                                <div className="flex items-center gap-3">
                                                  <div {...provided.dragHandleProps} className="text-slate-300 hover:text-slate-500 cursor-grab p-1">
                                                    <GripVertical size={14} />
                                                  </div>
                                                  <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-slate-800">Lesson {idx + 1}: {lesson.title}</span>
                                                    <div className="flex items-center gap-2 mt-1">
                                                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                                        {LESSON_ICONS[lesson.lessonType]} {lesson.lessonType.replace('_', ' ')}
                                                      </span>
                                                      {lesson.duration_secs && (
                                                        <span className="text-[10px] text-slate-400">· {Math.round(lesson.duration_secs / 60)} mins</span>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                  <button onClick={() => openLessonConfigurator(section.id, lesson.lessonType, lesson)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded">
                                                    <Edit2 size={14} />
                                                  </button>
                                                  <button 
                                                    onClick={() => {
                                                      if(confirm('Delete this lesson?')) {
                                                        deleteLessonMutation.mutate({ sectionId: section.id, lessonId: lesson.id, type: lesson.lessonType });
                                                      }
                                                    }}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 rounded"
                                                  >
                                                    <Trash2 size={14} />
                                                  </button>
                                                </div>
                                              </div>
                                            )}
                                          </Draggable>
                                        ))}
                                        {provided.placeholder}
                                      </div>
                                    )}
                                  </Droppable>

                                  <div className="mt-4 pt-2 border-t border-slate-100">
                                    <div className="flex flex-wrap gap-2">
                                      <button onClick={() => openLessonConfigurator(section.id, 'VIDEO')} className="text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors"><Video size={12}/> Video</button>
                                      <button onClick={() => openLessonConfigurator(section.id, 'DOCUMENT')} className="text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors"><FileText size={12}/> Document</button>
                                      <button onClick={() => openLessonConfigurator(section.id, 'RICH_TEXT')} className="text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors"><FileText size={12}/> Rich Text</button>
                                      <button onClick={() => openLessonConfigurator(section.id, 'QUIZ')} className="text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors"><HelpCircle size={12}/> Quiz</button>
                                      <button onClick={() => openLessonConfigurator(section.id, 'EXTERNAL_LINK')} className="text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors"><LinkIcon size={12}/> External Link</button>
                                      <button onClick={() => openLessonConfigurator(section.id, 'DOWNLOAD')} className="text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors"><Download size={12}/> Download Resource</button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            
            {/* Add Module Inline Form */}
            {isAddingModule && (
              <div className="card p-4 border border-blue-200 bg-blue-50/30">
                <h3 className="text-sm font-semibold text-slate-800 mb-3">Create New Module</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 mb-1 block">Module Title</label>
                    <input 
                      type="text" 
                      value={newModuleTitle}
                      onChange={e => setNewModuleTitle(e.target.value)}
                      placeholder="e.g. Introduction to Safeguarding"
                      className="w-full text-sm p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setIsAddingModule(false)} className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                    <button onClick={handleAddModule} disabled={!newModuleTitle.trim()} className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">Create Module</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="lg:col-span-1">
        <CurriculumTree sections={sections} getLessons={getLessons} />
      </div>

      {configuratorOpen && (
        <LessonConfigurator 
          isOpen={configuratorOpen} 
          onClose={() => setConfiguratorOpen(false)}
          courseId={course.id}
          sectionId={activeModuleId}
          type={configuratorType}
          lesson={activeLesson}
          onSuccess={() => {
            setConfiguratorOpen(false);
            queryClient.invalidateQueries({ queryKey: ['template', course.id] });
          }}
        />
      )}
    </div>
  );
}
