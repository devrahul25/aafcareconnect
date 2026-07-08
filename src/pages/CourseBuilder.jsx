import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  PenTool, Plus, Play, FileText, HelpCircle, Settings,
  CheckCircle2, Trash2, GripVertical, X, Upload,
  Eye, Save, Users, Clock, Award, ArrowRight, ChevronRight,
  Zap, BarChart3, Edit3, Lock, AlertTriangle, Star,
  Tag, FolderOpen, RefreshCw, Pencil, ChevronDown
} from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { apiClient } from "@/api/apiClient";
import { toast } from "sonner";
import StatusBadge from "@/components/ui/StatusBadge";
import PageHeader from "@/components/ui/PageHeader";
import KpiCard from "@/components/ui/KpiCard";

const BLOCK_TYPES = [
  { type: "VIDEO", icon: Play, label: "Video Lesson", desc: "Upload or embed a training video", bg: "bg-blue-50", color: "text-blue-600" },
  { type: "DOCUMENT", icon: FileText, label: "Document", desc: "Upload a PDF, policy or reading material", bg: "bg-emerald-50", color: "text-emerald-600" },
  { type: "QUIZ", icon: HelpCircle, label: "Quiz", desc: "Multiple-choice knowledge assessment", bg: "bg-violet-50", color: "text-violet-600" },
  { type: "RICH_TEXT", icon: Edit3, label: "Rich Text", desc: "Written lesson, tips or summary notes", bg: "bg-amber-50", color: "text-amber-600" },
];

const BLOCK_DEFAULTS = {
  VIDEO: { duration: "0:00", icon: Play, bg: "bg-blue-50", color: "text-blue-600" },
  DOCUMENT: { duration: "5 min read", icon: FileText, bg: "bg-emerald-50", color: "text-emerald-600" },
  QUIZ: { duration: "10 min", icon: HelpCircle, bg: "bg-violet-50", color: "text-violet-600" },
  RICH_TEXT: { duration: "3 min read", icon: Edit3, bg: "bg-amber-50", color: "text-amber-600" },
};

const LEVEL_CLS = {
  FOUNDATION: "bg-emerald-50 text-emerald-700",
  INTERMEDIATE: "bg-amber-50 text-amber-700",
  ADVANCED: "bg-red-50 text-red-700"
};

// ─── Category Manager Modal ───────────────────────────────────────────────────
function CategoryManagerModal({ categories, onClose, onSaved }) {
  const [list, setList]             = useState(categories || []);
  const [newName, setNewName]       = useState("");
  const [editingIdx, setEditingIdx] = useState(null);
  const [editName, setEditName]     = useState("");
  const [courseCounts, setCourseCounts] = useState({});
  const [saving, setSaving]         = useState(false);
  const [deleting, setDeleting]     = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // category name to confirm

  // Fetch course-counts for all categories once on open
  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient.get("/courses");
        const courses = res.data.data || [];
        const counts = {};
        courses.forEach(c => {
          if (c.category) counts[c.category] = (counts[c.category] || 0) + 1;
        });
        setCourseCounts(counts);
      } catch { /* non-critical */ }
    })();
  }, []);

  const refreshCategories = async () => {
    const res = await apiClient.get("/courses/categories");
    const cats = res.data.data || res.data || [];
    setList(cats);
    return cats;
  };

  const handleAdd = async () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    if (list.includes(trimmed)) { toast.error("Category already exists"); return; }
    // Adding a category means creating a dummy placeholder course with that category
    // — instead we just optimistically add it to the local list and let it show
    // in the dropdown. It persists to DB when admin creates their first course with it.
    setList(prev => [...prev, trimmed].sort());
    setNewName("");
    toast.success(`Category "${trimmed}" added`);
    onSaved([...list, trimmed].sort());
  };

  const handleStartRename = (idx) => {
    setEditingIdx(idx);
    setEditName(list[idx]);
  };

  const handleRename = async (oldName) => {
    const trimmed = editName.trim();
    if (!trimmed || trimmed === oldName) { setEditingIdx(null); return; }
    if (list.includes(trimmed)) { toast.error("That name already exists"); return; }
    try {
      setSaving(true);
      await apiClient.patch("/courses/categories/rename", { old_name: oldName, new_name: trimmed });
      const updated = list.map(c => c === oldName ? trimmed : c).sort();
      setList(updated);
      setEditingIdx(null);
      setCourseCounts(prev => {
        const next = { ...prev };
        next[trimmed] = next[oldName] || 0;
        delete next[oldName];
        return next;
      });
      toast.success(`Renamed "${oldName}" → "${trimmed}"`);
      onSaved(updated);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to rename category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (name) => {
    const count = courseCounts[name] || 0;
    if (count > 0) {
      toast.error(`Cannot delete "${name}" — ${count} course${count > 1 ? "s are" : " is"} still assigned to it. Reassign them first.`, { duration: 5000 });
      setConfirmDelete(null);
      return;
    }
    try {
      setDeleting(name);
      await apiClient.delete(`/courses/categories/${encodeURIComponent(name)}`);
      const updated = list.filter(c => c !== name);
      setList(updated);
      setConfirmDelete(null);
      toast.success(`Category "${name}" deleted`);
      onSaved(updated);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete category");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
              <Tag size={15} className="text-violet-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Manage Categories</h2>
              <p className="text-[11px] text-slate-400">{list.length} categories</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 flex items-center justify-center transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Add new */}
        <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/60">
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2 block">Add New Category</label>
          <div className="flex gap-2">
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAdd()}
              placeholder="e.g. Mental Health"
              className="flex-1 h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
              maxLength={100}
            />
            <button
              onClick={handleAdd}
              disabled={!newName.trim()}
              className="h-9 px-4 text-xs font-semibold bg-violet-600 text-white rounded-lg hover:bg-violet-500 disabled:opacity-40 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Category list */}
        <div className="overflow-y-auto flex-1 px-6 py-3 space-y-1">
          {list.map((cat, idx) => {
            const count = courseCounts[cat] || 0;
            const isRenaming = editingIdx === idx;
            const isDeleting = deleting === cat;
            const isConfirming = confirmDelete === cat;

            return (
              <div key={cat} className={`rounded-xl border transition-all ${isRenaming ? "border-violet-300 bg-violet-50/50" : "border-slate-100 bg-white hover:border-slate-200"}`}>
                {isRenaming ? (
                  <div className="flex items-center gap-2 p-3">
                    <input
                      autoFocus
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") handleRename(cat); if (e.key === "Escape") setEditingIdx(null); }}
                      className="flex-1 h-8 px-2 text-sm border border-violet-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
                      maxLength={100}
                    />
                    <button onClick={() => handleRename(cat)} disabled={saving} className="h-8 px-3 text-xs font-semibold bg-violet-600 text-white rounded-lg hover:bg-violet-500 disabled:opacity-50 transition-colors">
                      {saving ? "…" : "Save"}
                    </button>
                    <button onClick={() => setEditingIdx(null)} className="h-8 px-2 text-xs text-slate-400 hover:text-slate-700 transition-colors">Cancel</button>
                  </div>
                ) : isConfirming ? (
                  <div className="p-3">
                    <p className="text-xs text-red-700 font-medium mb-2">
                      {count > 0
                        ? `⚠ Cannot delete — ${count} course${count > 1 ? "s" : ""} assigned. Reassign first.`
                        : `Delete "${cat}"? This cannot be undone.`}
                    </p>
                    <div className="flex gap-2">
                      {count === 0 && (
                        <button onClick={() => handleDelete(cat)} disabled={isDeleting} className="h-7 px-3 text-xs font-semibold bg-red-600 text-white rounded-lg hover:bg-red-500 disabled:opacity-50 transition-colors">
                          {isDeleting ? "Deleting…" : "Confirm Delete"}
                        </button>
                      )}
                      <button onClick={() => setConfirmDelete(null)} className="h-7 px-3 text-xs text-slate-500 hover:text-slate-700 transition-colors">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-3 py-2.5 group">
                    <div className="w-6 h-6 rounded-md bg-violet-50 flex items-center justify-center flex-shrink-0">
                      <FolderOpen size={12} className="text-violet-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{cat}</p>
                      <p className="text-[11px] text-slate-400">{count > 0 ? `${count} course${count > 1 ? "s" : ""}` : "No courses yet"}</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleStartRename(idx)} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors" title="Rename">
                        <Pencil size={12} />
                      </button>
                      <button onClick={() => setConfirmDelete(cat)} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors" title="Delete">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {list.length === 0 && (
            <div className="py-8 text-center text-slate-400">
              <Tag size={24} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No categories yet</p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/40 rounded-b-2xl">
          <p className="text-[11px] text-slate-400">
            💡 Categories with courses cannot be deleted — reassign courses first.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Category Select Dropdown ─────────────────────────────────────────────────
function CategorySelect({ value, onChange, orgId }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [manageOpen, setManageOpen] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/courses/categories");
      setCategories(res.data.data || res.data || []);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  return (
    <>
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <div className="relative">
            <select
              value={value || ""}
              onChange={e => onChange(e.target.value)}
              disabled={loading}
              className="w-full h-9 pl-3 pr-8 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none disabled:opacity-50 cursor-pointer"
            >
              <option value="" disabled>
                {loading ? "Loading categories…" : "Select a category"}
              </option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <button
          type="button"
          onClick={() => setManageOpen(true)}
          className="h-9 px-3 text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200 rounded-lg hover:bg-violet-100 flex items-center gap-1.5 transition-colors flex-shrink-0"
          title="Add or manage categories"
        >
          <Tag size={12} />
          Manage
        </button>
      </div>

      {manageOpen && (
        <CategoryManagerModal
          categories={categories}
          onClose={() => setManageOpen(false)}
          onSaved={(updated) => {
            setCategories(updated);
            // If current value was deleted from the list, keep it but show warning
          }}
        />
      )}
    </>
  );
}


export default function CourseBuilder() {
  const { user } = /** @type {any} */ (useOutletContext() || {});
  const [view, setView] = useState("list");
  const [activeCourse, setActiveCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      
      // MOCK INTERCEPT
      if (['super_admin', 'org_admin', 'manager', 'trainer'].includes(user?.role)) {
        setCourses([
          { id: "1", title: "Safeguarding Children Level 2", status: "PUBLISHED", category: "Safeguarding", updated_at: new Date().toISOString() },
          { id: "2", title: "First Aid in Social Care", status: "DRAFT", category: "Health & Safety", updated_at: new Date().toISOString() }
        ]);
        return;
      }

      const params = user?.organization_id ? { organisation_id: user.organization_id } : {};
      const response = await apiClient.get("/courses", { params });
      setCourses(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleCourseUpdated = () => {
    fetchCourses();
    setView("list");
    setActiveCourse(null);
  };

  if (view === "editor") {
    return <Editor course={activeCourse} onBack={handleCourseUpdated} onCancel={() => { setView("list"); setActiveCourse(null); }} user={user} />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const published = courses.filter(c => c.status === "PUBLISHED").length;

  return (
    <div className="p-6 space-y-5 animate-fade-in max-w-[1400px] mx-auto">
      <PageHeader
        title="Course Builder"
        subtitle="Create, manage and publish training courses"
        actions={
          <button onClick={() => { setActiveCourse({ id: 0, title: "Untitled Course", status: "draft", sections: 0 }); setView("editor"); }}
            className="h-9 px-4 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-2 transition-colors">
            <Plus size={14} /> New Course
          </button>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="My Courses" value={courses.length} icon={PenTool} iconBg="bg-violet-600" />
        <KpiCard title="Published" value={published} icon={CheckCircle2} iconBg="bg-emerald-600" />
        <KpiCard title="Total Sections" value={courses.reduce((s, c) => s + (c.sections?.length || 0), 0)} icon={Users} iconBg="bg-blue-600" />
        <KpiCard title="Draft Courses" value={courses.filter(c => c.status === "DRAFT").length} icon={Award} iconBg="bg-indigo-600" />
      </div>

      {/* Draft alert */}
      {courses.filter(c => c.status === "DRAFT").length > 0 && (
        <div className="card border-l-4 border-l-amber-400 bg-amber-50/40 p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle size={16} className="text-amber-600 flex-shrink-0" />
            <p className="text-sm font-semibold text-slate-900">
              {courses.filter(c => c.status === "DRAFT").length} course{courses.filter(c => c.status === "DRAFT").length > 1 ? "s are" : "is"} in draft — learners can't access them until published.
            </p>
          </div>
          <button onClick={() => { setActiveCourse(courses.find(c => c.status === "DRAFT")); setView("editor"); }}
            className="h-8 px-3 text-xs font-semibold bg-amber-500 text-white rounded-lg hover:bg-amber-400 flex items-center gap-1.5 transition-colors flex-shrink-0">
            Review & Publish
          </button>
        </div>
      )}

      {/* Course grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map(course => (
          <CourseCard key={course.id} course={course} onEdit={() => { setActiveCourse(course); setView("editor"); }} />
        ))}
        {/* New course tile */}
        <button onClick={() => { setActiveCourse(null); setView("editor"); }}
          className="card card-hover border-2 border-dashed border-slate-200 p-8 flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-blue-600 hover:border-blue-300 transition-all cursor-pointer">
          <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center">
            <Plus size={22} />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold">Create New Course</p>
            <p className="text-xs text-slate-400 mt-0.5">Video, PDF, quiz and text blocks</p>
          </div>
        </button>
      </div>
    </div>
  );
}

function CourseCard({ course, onEdit }) {
  const sectionsCount = course.sections?.length || 0;
  const updatedDate = new Date(course.updated_at).toLocaleDateString();

  return (
    <div className="card card-hover p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <StatusBadge status={course.status} />
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${LEVEL_CLS[course.level] || LEVEL_CLS.FOUNDATION}`}>
              {course.level || "Foundation"}
            </span>
          </div>
          <h3 className="font-heading font-bold text-slate-900 text-base leading-snug">{course.title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {course.category || "Uncategorized"} · {sectionsCount} sections · Updated {updatedDate}
          </p>
        </div>
        <button onClick={onEdit} className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white transition-colors flex-shrink-0">
          <Edit3 size={15} />
        </button>
      </div>

      {course.status === "DRAFT" && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-center gap-2">
          <Lock size={13} className="text-amber-600 flex-shrink-0" />
          <p className="text-xs text-amber-700 font-medium">Draft — not visible to learners. Complete all sections then publish.</p>
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <button onClick={onEdit} className="flex-1 h-8 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors">
          <Edit3 size={12} /> Edit
        </button>
        {course.status === "DRAFT" && (
          <button onClick={onEdit} className="flex-1 h-8 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 flex items-center justify-center gap-1.5 transition-colors">
            <CheckCircle2 size={12} /> Publish
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Full-page course editor with full functionality ─────────────────────────
function Editor({ course, onBack, onCancel, user }) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("content");
  const [courseData, setCourseData] = useState(course || {});
  const [sections, setSections] = useState([]);
  const [addingSection, setAddingSection] = useState(false);
  const [editingSection, setEditingSection] = useState(null);

  useEffect(() => {
    if (course?.id) {
      fetchCourseDetails();
    }
  }, [course]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/courses/${course.id}`);
      const fetchedCourse = response.data.data;
      setCourseData(fetchedCourse);
      setSections(fetchedCourse.sections || []);
    } catch (error) {
      console.error("Failed to fetch course:", error);
      toast.error("Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  const saveCourse = async () => {
    try {
      setSaving(true);
      const payload = {
        title: courseData.title || "Untitled Course",
        description: courseData.description || "",
        category: courseData.category || "General",
        level: courseData.level || "FOUNDATION",
        duration_minutes: parseInt(courseData.duration_minutes) || 60,
        pass_mark: parseInt(courseData.pass_mark) || 75,
        certificate_enabled: courseData.certificate_enabled !== false,
        allow_retake: courseData.allow_retake !== false,
        mandatory: courseData.mandatory || false,
        target_roles: courseData.target_roles || [],
        organisation_id: user?.organization_id,
      };

      let response;
      if (courseData.id) {
        response = await apiClient.patch(`/courses/${courseData.id}`, payload);
        toast.success("Course updated successfully");
      } else {
        response = await apiClient.post("/courses", payload);
        setCourseData(response.data.data);
        toast.success("Course created successfully");
      }

      if (!courseData.id) {
        // Reload with the new ID
        fetchCourseDetails();
      }
    } catch (error) {
      console.error("Failed to save course:", error);
      toast.error("Failed to save course");
    } finally {
      setSaving(false);
    }
  };

  const publishCourse = async () => {
    if (!courseData.id) {
      toast.error("Please save the course first");
      return;
    }

    try {
      setSaving(true);
      await apiClient.patch(`/courses/${courseData.id}`, { status: "PUBLISHED" });
      toast.success("Course published successfully!");
      onBack();
    } catch (error) {
      console.error("Failed to publish course:", error);
      toast.error("Failed to publish course");
    } finally {
      setSaving(false);
    }
  };

  const addSection = async (type) => {
    if (!courseData.id) {
      toast.error("Please save the course first before adding sections");
      return;
    }

    try {
      const response = await apiClient.post(`/courses/${courseData.id}/sections`, {
        title: `New ${type.charAt(0) + type.slice(1).toLowerCase()} Section`,
        type: type,
        sort_order: sections.length,
      });

      const newSection = response.data.data;
      setSections([...sections, newSection]);
      setEditingSection(newSection);
      setAddingSection(false);
      toast.success("Section added");
    } catch (error) {
      console.error("Failed to add section:", error);
      toast.error("Failed to add section");
    }
  };

  const deleteSection = async (sectionId) => {
    if (!window.confirm("Delete this section?")) return;

    try {
      await apiClient.delete(`/courses/${courseData.id}/sections/${sectionId}`);
      setSections(sections.filter(s => s.id !== sectionId));
      toast.success("Section deleted");
    } catch (error) {
      console.error("Failed to delete section:", error);
      toast.error("Failed to delete section");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-fade-in bg-slate-50">
      {/* Editor top bar */}
      <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 z-10">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onCancel} className="text-xs font-semibold text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors flex-shrink-0">
            ← Courses
          </button>
          <span className="text-slate-200">/</span>
          <span className="text-sm font-semibold text-slate-900 truncate">
            {courseData.title || "New Course"}
          </span>
          <StatusBadge status={courseData.status || "DRAFT"} size="xs" />
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {courseData.status === "DRAFT" || !courseData.status ? (
            <>
              <button onClick={saveCourse} disabled={saving} className="h-8 px-3 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-1.5 transition-colors disabled:opacity-50">
                <Save size={13} /> {saving ? "Saving..." : "Save"}
              </button>
              <button onClick={publishCourse} disabled={saving || !courseData.id} className="h-8 px-3 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 flex items-center gap-1.5 transition-colors disabled:opacity-50">
                <CheckCircle2 size={13} /> Publish
              </button>
            </>
          ) : (
            <button onClick={saveCourse} disabled={saving} className="h-8 px-3 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-1.5 transition-colors disabled:opacity-50">
              <Save size={13} /> {saving ? "Saving..." : "Save Changes"}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-100 px-6">
        <div className="flex gap-0">
          {[["content", "Content"], ["settings", "Settings"], ["preview", "Preview"]].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors -mb-px ${tab === key ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {tab === "content" && (
          <div className="max-w-4xl mx-auto p-6 space-y-4">
            {/* Title & Description */}
            <div className="card p-5 space-y-3">
              <div>
                <label className="field-label">Course Title *</label>
                <input
                  value={courseData.title || ""}
                  onChange={e => setCourseData({ ...courseData, title: e.target.value })}
                  className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter course title"
                />
              </div>
              <div>
                <label className="field-label">Description</label>
                <textarea
                  value={courseData.description || ""}
                  onChange={e => setCourseData({ ...courseData, description: e.target.value })}
                  className="w-full h-20 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief course description"
                />
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-slate-900">Course Content</h3>
                <span className="text-xs text-slate-500">{sections.length} sections</span>
              </div>

              {sections.map((section, i) => {
                const def = BLOCK_DEFAULTS[section.type] || {};
                const Icon = def.icon || PenTool;

                return (
                  <div key={section.id}>
                    <div className="card p-4 flex items-center gap-3 group">
                      <GripVertical size={14} className="text-slate-300 cursor-grab flex-shrink-0" />
                      <span className="text-[11px] font-bold text-slate-300 w-5 flex-shrink-0 text-center">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className={`w-9 h-9 rounded-xl ${def.bg || "bg-slate-100"} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={15} className={def.color || "text-slate-500"} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800">{section.title}</p>
                        <p className="text-xs text-slate-400">{section.type}</p>
                      </div>
                      <button
                        onClick={() => setEditingSection(section)}
                        className="h-8 px-3 text-xs font-semibold bg-slate-100 text-slate-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors">
                        Edit
                      </button>
                      <button
                        onClick={() => deleteSection(section.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {editingSection?.id === section.id && (
                      <SectionEditor
                        courseId={courseData.id}
                        section={section}
                        onClose={() => setEditingSection(null)}
                        onUpdate={(updated) => {
                          setSections(sections.map(s => s.id === updated.id ? updated : s));
                          setEditingSection(null);
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add Section */}
            {!addingSection ? (
              <button
                onClick={() => setAddingSection(true)}
                disabled={!courseData.id}
                className="w-full p-4 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-blue-300 hover:text-blue-500 transition-all text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <Plus size={16} /> Add Section
              </button>
            ) : (
              <div className="card p-5">
                <p className="field-label mb-3">Choose Section Type</p>
                <div className="grid grid-cols-2 gap-3">
                  {BLOCK_TYPES.map(({ type, icon: Icon, label, desc, bg, color }) => (
                    <button
                      key={type}
                      onClick={() => addSection(type)}
                      className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-left group">
                      <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={16} className={color} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-700 group-hover:text-blue-700">{label}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <button onClick={() => setAddingSection(false)} className="mt-3 text-xs text-slate-400 hover:text-slate-600 transition-colors">
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}

        {tab === "settings" && (
          <div className="max-w-2xl mx-auto p-6 space-y-4">
            <div className="card p-5 space-y-4">
              <h3 className="font-heading font-bold text-slate-900">Course Settings</h3>

              {/* Category — full width row with manage button */}
              <div>
                <label className="field-label mb-1.5 block">Category *</label>
                <CategorySelect
                  value={courseData.category || ""}
                  onChange={(val) => setCourseData({ ...courseData, category: val })}
                  orgId={user?.organization_id}
                />
                {!courseData.category && (
                  <p className="text-[11px] text-amber-600 mt-1">⚠ Please select a category — it determines how this course appears in filters.</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="field-label">Level</label>
                  <select
                    value={courseData.level || "FOUNDATION"}
                    onChange={e => setCourseData({ ...courseData, level: e.target.value })}
                    className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="FOUNDATION">Foundation</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="field-label">Pass Mark (%)</label>
                  <input
                    type="number"
                    value={courseData.pass_mark || 75}
                    onChange={e => setCourseData({ ...courseData, pass_mark: parseInt(e.target.value) })}
                    className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="field-label">Duration (minutes)</label>
                  <input
                    type="number"
                    value={courseData.duration_minutes || 60}
                    onChange={e => setCourseData({ ...courseData, duration_minutes: parseInt(e.target.value) })}
                    className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-3 pt-2">
                {/* Switch 1: Certificates */}
                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100/50 hover:bg-slate-100/30 transition-colors">
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Auto-generate Certificate</p>
                    <p className="text-[10px] text-slate-400">Issue a completion certificate on passing this course</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCourseData({ ...courseData, certificate_enabled: courseData.certificate_enabled === false ? true : false })}
                    className={`w-9 h-5 rounded-full relative transition-colors duration-200 focus:outline-none ${courseData.certificate_enabled !== false ? "bg-blue-600" : "bg-slate-200"}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${courseData.certificate_enabled !== false ? "right-0.5" : "left-0.5"}`} />
                  </button>
                </div>

                {/* Switch 2: Mandatory */}
                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100/50 hover:bg-slate-100/30 transition-colors">
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Mandatory Course</p>
                    <p className="text-[10px] text-slate-400">Enforce this course as compulsory for target roles</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCourseData({ ...courseData, mandatory: !courseData.mandatory })}
                    className={`w-9 h-5 rounded-full relative transition-colors duration-200 focus:outline-none ${courseData.mandatory ? "bg-blue-600" : "bg-slate-200"}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${courseData.mandatory ? "right-0.5" : "left-0.5"}`} />
                  </button>
                </div>

                {/* Switch 3: Retakes */}
                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100/50 hover:bg-slate-100/30 transition-colors">
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Allow Retakes</p>
                    <p className="text-[10px] text-slate-400">Permit learners to retake assessments upon failure</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCourseData({ ...courseData, allow_retake: courseData.allow_retake === false ? true : false })}
                    className={`w-9 h-5 rounded-full relative transition-colors duration-200 focus:outline-none ${courseData.allow_retake !== false ? "bg-blue-600" : "bg-slate-200"}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${courseData.allow_retake !== false ? "right-0.5" : "left-0.5"}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "preview" && (
          <div className="max-w-xl mx-auto p-6 space-y-4">
            <div className="card overflow-hidden bg-white shadow-sm border border-slate-100 rounded-2xl">
              <div className="h-36 bg-gradient-to-br from-blue-600 to-indigo-700 flex flex-col items-center justify-center p-6 text-white relative">
                <p className="font-heading font-bold text-xl text-center leading-snug">{courseData.title || "Untitled Course"}</p>
                <p className="text-xs text-blue-100 mt-2">{courseData.category || "Uncategorized"} · {courseData.level || "FOUNDATION"}</p>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">{sections.length} sections</span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-500">Estimated {courseData.duration_minutes || 60} minutes</span>
                  {courseData.mandatory && (
                    <>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700">Mandatory</span>
                    </>
                  )}
                </div>
                {sections.map((section, i) => {
                  const def = BLOCK_DEFAULTS[section.type] || {};
                  const Icon = def.icon || PenTool;
                  return (
                    <div key={section.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-xs font-bold text-slate-400 w-5 text-center">{String(i + 1).padStart(2, "0")}</span>
                      <div className={`w-8 h-8 rounded-lg ${def.bg || "bg-slate-100"} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={14} className={def.color || "text-slate-500"} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{section.title}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{section.type}</p>
                      </div>
                    </div>
                  );
                })}
                {sections.length === 0 && <p className="text-sm text-slate-400 text-center py-8">No sections yet — add some content in the Content tab</p>}
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

// ─── Section Editor Component with File Upload & Rich Text ───────────────────
function SectionEditor({ courseId, section, onClose, onUpdate }) {
  const [title, setTitle] = useState(section.title);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Video fields
  const [videoFile, setVideoFile] = useState(null);
  const [videoData, setVideoData] = useState(section.videos?.[0] || {});

  // Document fields
  const [documentFile, setDocumentFile] = useState(null);
  const [documentData, setDocumentData] = useState(section.documents?.[0] || {});

  // Rich text
  const [richTextContent, setRichTextContent] = useState(section.rich_text_lessons?.[0]?.content || "");

  // Quiz
  const [quizData, setQuizData] = useState(section.quizzes?.[0] || { title: "", pass_mark: 80, questions: [] });
  const [editingQuestion, setEditingQuestion] = useState(null);

  const updateSection = async () => {
    try {
      setSaving(true);
      await apiClient.patch(`/courses/${courseId}/sections/${section.id}`, { title });

      // Handle content based on section type
      if (section.type === "VIDEO" && videoFile) {
        await uploadVideo();
      } else if (section.type === "DOCUMENT" && documentFile) {
        await uploadDocument();
      } else if (section.type === "RICH_TEXT") {
        await saveRichText();
      } else if (section.type === "QUIZ") {
        await saveQuiz();
      }

      // Fetch updated section
      const response = await apiClient.get(`/courses/${courseId}`);
      const updatedSection = response.data.data.sections.find(s => s.id === section.id);
      onUpdate(updatedSection);
      toast.success("Section updated");
    } catch (error) {
      console.error("Failed to update section:", error);
      toast.error("Failed to update section");
    } finally {
      setSaving(false);
    }
  };

  const uploadVideo = async () => {
    try {
      setUploading(true);

      // Get upload URL
      const uploadResponse = await apiClient.post("/storage/upload-url", {
        filename: videoFile.name,
        contentType: videoFile.type,
        folder: "videos"
      });

      const { uploadUrl, key, cloudfrontUrl } = uploadResponse.data.data;

      // Upload to S3
      await fetch(uploadUrl, {
        method: "PUT",
        body: videoFile,
        headers: { "Content-Type": videoFile.type }
      });

      // Save video metadata
      if (section.videos?.[0]?.id) {
        await apiClient.patch(
          `/courses/${courseId}/sections/${section.id}/videos/${section.videos[0].id}`,
          { ...videoData, s3_key: key, cloudfront_url: cloudfrontUrl }
        );
      } else {
        await apiClient.post(`/courses/${courseId}/sections/${section.id}/videos`, {
          title: videoData.title || title,
          s3_key: key,
          cloudfront_url: cloudfrontUrl,
          sort_order: 0
        });
      }

      toast.success("Video uploaded");
    } catch (error) {
      console.error("Failed to upload video:", error);
      toast.error("Failed to upload video");
    } finally {
      setUploading(false);
    }
  };

  const uploadDocument = async () => {
    try {
      setUploading(true);

      // Get upload URL
      const uploadResponse = await apiClient.post("/storage/upload-url", {
        filename: documentFile.name,
        contentType: documentFile.type,
        folder: "documents"
      });

      const { uploadUrl, key } = uploadResponse.data.data;

      // Upload to S3
      await fetch(uploadUrl, {
        method: "PUT",
        body: documentFile,
        headers: { "Content-Type": documentFile.type }
      });

      // Save document metadata
      if (section.documents?.[0]?.id) {
        await apiClient.patch(
          `/courses/${courseId}/sections/${section.id}/documents/${section.documents[0].id}`,
          { ...documentData, s3_key: key, file_type: documentFile.type }
        );
      } else {
        await apiClient.post(`/courses/${courseId}/sections/${section.id}/documents`, {
          title: documentData.title || title,
          s3_key: key,
          file_type: documentFile.type,
          file_size: documentFile.size,
          sort_order: 0
        });
      }

      toast.success("Document uploaded");
    } catch (error) {
      console.error("Failed to upload document:", error);
      toast.error("Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  const saveRichText = async () => {
    try {
      if (section.rich_text_lessons?.[0]?.id) {
        await apiClient.patch(
          `/courses/${courseId}/sections/${section.id}/rich-text/${section.rich_text_lessons[0].id}`,
          { title, content: richTextContent }
        );
      } else {
        await apiClient.post(`/courses/${courseId}/sections/${section.id}/rich-text`, {
          title,
          content: richTextContent,
          sort_order: 0
        });
      }
    } catch (error) {
      console.error("Failed to save rich text:", error);
      throw error;
    }
  };

  const saveQuiz = async () => {
    try {
      let quizId = section.quizzes?.[0]?.id;

      if (quizId) {
        await apiClient.patch(
          `/courses/${courseId}/sections/${section.id}/quizzes/${quizId}`,
          { title: quizData.title || title, pass_mark: quizData.pass_mark }
        );
      } else {
        const response = await apiClient.post(`/courses/${courseId}/sections/${section.id}/quizzes`, {
          title: quizData.title || title,
          pass_mark: quizData.pass_mark,
          sort_order: 0
        });
        quizId = response.data.data.id;
      }

      // Save questions (simplified - in real app, handle updates/deletes)
      for (const question of quizData.questions) {
        if (!question.id) {
          const qResponse = await apiClient.post(`/courses/quizzes/${quizId}/questions`, {
            question: question.text,
            explanation: question.explanation,
            sort_order: question.sort_order || 0
          });

          for (const answer of question.answers) {
            await apiClient.post(`/courses/quizzes/${quizId}/questions/${qResponse.data.data.id}/answers`, {
              text: answer.text,
              is_correct: answer.is_correct,
              sort_order: answer.sort_order || 0
            });
          }
        }
      }
    } catch (error) {
      console.error("Failed to save quiz:", error);
      throw error;
    }
  };

  const addQuestion = () => {
    setEditingQuestion({
      text: "",
      explanation: "",
      answers: [
        { text: "", is_correct: true },
        { text: "", is_correct: false },
        { text: "", is_correct: false },
        { text: "", is_correct: false }
      ]
    });
  };

  const saveQuestion = () => {
    if (!editingQuestion.text.trim()) {
      toast.error("Question text is required");
      return;
    }

    setQuizData({
      ...quizData,
      questions: [...quizData.questions, { ...editingQuestion, sort_order: quizData.questions.length }]
    });
    setEditingQuestion(null);
  };

  return (
    <div className="card p-5 mt-2 space-y-4 bg-slate-50 border-2 border-blue-200">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-slate-900">Edit Section</h4>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <X size={18} />
        </button>
      </div>

      <div>
        <label className="field-label">Section Title</label>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* VIDEO */}
      {section.type === "VIDEO" && (
        <div className="space-y-3">
          <div>
            <label className="field-label">Video File</label>
            <input
              type="file"
              accept="video/*"
              onChange={e => setVideoFile(e.target.files?.[0])}
              className="w-full text-sm"
            />
            {section.videos?.[0]?.cloudfront_url && (
              <p className="text-xs text-slate-500 mt-1">Current: {section.videos[0].title}</p>
            )}
          </div>
          <div>
            <label className="field-label">Video Title</label>
            <input
              value={videoData.title || ""}
              onChange={e => setVideoData({ ...videoData, title: e.target.value })}
              className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Video title"
            />
          </div>
        </div>
      )}

      {/* DOCUMENT */}
      {section.type === "DOCUMENT" && (
        <div className="space-y-3">
          <div>
            <label className="field-label">Document File (PDF)</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={e => setDocumentFile(e.target.files?.[0])}
              className="w-full text-sm"
            />
            {section.documents?.[0]?.s3_key && (
              <p className="text-xs text-slate-500 mt-1">Current: {section.documents[0].title}</p>
            )}
          </div>
          <div>
            <label className="field-label">Document Title</label>
            <input
              value={documentData.title || ""}
              onChange={e => setDocumentData({ ...documentData, title: e.target.value })}
              className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Document title"
            />
          </div>
        </div>
      )}

      {/* RICH TEXT */}
      {section.type === "RICH_TEXT" && (
        <div>
          <label className="field-label">Content</label>
          <ReactQuill
            theme="snow"
            value={richTextContent}
            onChange={setRichTextContent}
            className="bg-white rounded-lg"
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link"],
                ["clean"]
              ]
            }}
          />
        </div>
      )}

      {/* QUIZ */}
      {section.type === "QUIZ" && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">Quiz Title</label>
              <input
                value={quizData.title || ""}
                onChange={e => setQuizData({ ...quizData, title: e.target.value })}
                className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Quiz title"
              />
            </div>
            <div>
              <label className="field-label">Pass Mark (%)</label>
              <input
                type="number"
                value={quizData.pass_mark || 80}
                onChange={e => setQuizData({ ...quizData, pass_mark: parseInt(e.target.value) })}
                className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="field-label mb-0">Questions ({quizData.questions.length})</label>
              <button onClick={addQuestion} className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                <Plus size={14} className="inline" /> Add Question
              </button>
            </div>

            {quizData.questions.map((q, i) => (
              <div key={i} className="p-3 bg-white rounded-lg border">
                <p className="text-sm font-medium text-slate-700">{i + 1}. {q.text}</p>
                <div className="mt-2 space-y-1">
                  {q.answers.map((a, ai) => (
                    <div key={ai} className="flex items-center gap-2 text-xs">
                      <span className={a.is_correct ? "text-emerald-600" : "text-slate-400"}>
                        {a.is_correct ? "✓" : "○"}
                      </span>
                      <span className={a.is_correct ? "font-medium" : ""}>{a.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Add Question Form */}
          {editingQuestion && (
            <div className="p-4 bg-white border-2 border-blue-200 rounded-lg space-y-3">
              <div>
                <label className="field-label">Question Text</label>
                <input
                  value={editingQuestion.text}
                  onChange={e => setEditingQuestion({ ...editingQuestion, text: e.target.value })}
                  className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter question"
                />
              </div>
              <div>
                <label className="field-label">Answers (check the correct one)</label>
                {editingQuestion.answers.map((answer, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <input
                      type="radio"
                      name="correct"
                      checked={answer.is_correct}
                      onChange={() => {
                        const newAnswers = editingQuestion.answers.map((a, ai) => ({
                          ...a,
                          is_correct: ai === i
                        }));
                        setEditingQuestion({ ...editingQuestion, answers: newAnswers });
                      }}
                    />
                    <input
                      value={answer.text}
                      onChange={e => {
                        const newAnswers = [...editingQuestion.answers];
                        newAnswers[i].text = e.target.value;
                        setEditingQuestion({ ...editingQuestion, answers: newAnswers });
                      }}
                      className="flex-1 h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Answer ${i + 1}`}
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="field-label">Explanation (optional)</label>
                <textarea
                  value={editingQuestion.explanation || ""}
                  onChange={e => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
                  className="w-full h-16 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Explain the correct answer"
                />
              </div>
              <div className="flex gap-2">
                <button onClick={saveQuestion} className="h-8 px-3 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500">
                  Add Question
                </button>
                <button onClick={() => setEditingQuestion(null)} className="h-8 px-3 text-xs font-semibold bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <button
          onClick={updateSection}
          disabled={saving || uploading}
          className="h-9 px-4 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-2 transition-colors disabled:opacity-50">
          {saving || uploading ? (
            <>
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
              {uploading ? "Uploading..." : "Saving..."}
            </>
          ) : (
            <>
              <Save size={14} /> Save Section
            </>
          )}
        </button>
        <button onClick={onClose} className="h-9 px-4 text-sm font-semibold bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300">
          Cancel
        </button>
      </div>
    </div>
  );
}