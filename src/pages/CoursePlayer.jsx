import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";
import CourseSidebar from "@/components/course/CourseSidebar";
import CourseTopBar from "@/components/course/CourseTopBar";
import LessonContent from "@/components/course/LessonContent";
import CardAssessment from "@/components/course/CardAssessment";
import CertificateScreen from "@/components/course/CertificateScreen";
import LearningPanel from "@/components/course/LearningPanel";
import { useAuth } from "@/lib/AuthContext";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function CoursePlayer() {
  const { user } = useAuth();
  const { courseId } = useParams();
  const navigate = useNavigate();
  const learnerName = user?.full_name || "Foster Carer";

  // 1. Fetch Enrolment & Course Data securely
  const { data: enrolmentData, isLoading, error } = useQuery({
    queryKey: ['learner-course', courseId],
    queryFn: () => apiClient.get(`/course-enrolments/course/${courseId}/learner-view`).then(res => res.data.data),
    retry: false,
    onError: (err) => {
      const errorData = err.response?.data?.error;
      const errorMsg = typeof errorData === 'string' ? errorData : errorData?.message || "You don't have access to this course.";
      toast({
        title: "Access Denied",
        description: errorMsg,
        variant: "destructive"
      });
      navigate('/learning-hub/my-learning');
    }
  });

  // 2. Transform the fetched data into the structure expected by the Player
  const transformedCourse = useMemo(() => {
    if (!enrolmentData?.course) return null;
    
    const course = enrolmentData.course;
    
    const modules = course.sections?.map(section => {
      // Flatten all lesson types into a single array and sort by sort_order
      let lessons = [];
      
      const processItems = (items, type) => {
        if (!items) return;
        items.forEach(item => {
          lessons.push({
            ...item,
            id: item.id,
            title: item.title,
            type: type, // 'VIDEO', 'DOCUMENT', 'RICH_TEXT', 'QUIZ'
            // For UI compatibility, map 'QUIZ' to 'assessment'
            uiType: type === 'QUIZ' ? 'assessment' : type,
            duration: item.duration_secs ? `${Math.round(item.duration_secs / 60)} min` : '5 min'
          });
        });
      };

      processItems(section.videos, 'VIDEO');
      processItems(section.documents, 'DOCUMENT');
      processItems(section.rich_text_lessons, 'RICH_TEXT');
      
      // Handle Quizzes specifically to map questions and answers
      if (section.quizzes) {
          section.quizzes.forEach(quiz => {
              const formattedQuestions = (quiz.questions || []).map(q => ({
                  q: q.question,
                  options: q.answers.map(a => a.text),
                  correct: q.answers.findIndex(a => a.is_correct),
                  explanation: q.explanation || "No explanation provided."
              }));

              lessons.push({
                  ...quiz,
                  id: quiz.id,
                  title: quiz.title,
                  type: 'QUIZ',
                  uiType: 'assessment',
                  questions: formattedQuestions,
                  duration: quiz.time_limit ? `${quiz.time_limit} min` : '5 min'
              });
          });
      }

      lessons.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

      return {
        id: section.id,
        title: section.title,
        lessons
      };
    }) || [];

    return { ...course, modules };
  }, [enrolmentData]);

  const allLessons = useMemo(() => {
    if (!transformedCourse) return [];
    return transformedCourse.modules.flatMap((m, mi) => 
      m.lessons.map((l, li) => ({ ...l, _mi: mi, _li: li }))
    );
  }, [transformedCourse]);

  // 3. Local State Management
  const [currentModuleIdx, setCurrentModuleIdx] = useState(0);
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [passedCourse, setPassedCourse] = useState(false);
  const [panel, setPanel] = useState({ notes: "", learned: "", practice: "" });

  // Initialize completed lessons from backend data on load
  useEffect(() => {
    if (enrolmentData?.lesson_progress) {
      const completedIds = enrolmentData.lesson_progress
        .filter(p => p.status === 'COMPLETED')
        .map(p => p.lesson_id);
      setCompletedLessons(new Set(completedIds));
      
      if (enrolmentData.status === 'COMPLETED') {
        setPassedCourse(true);
      }
    }
  }, [enrolmentData]);

  // 4. API Mutations for Progress
  const updateProgressMutation = useMutation({
    mutationFn: (data) => apiClient.post(`/course-enrolments/course/${courseId}/lesson-progress`, data)
  });

  const syncOverallProgressMutation = useMutation({
    mutationFn: (percent) => apiClient.post(`/course-enrolments/${enrolmentData.id}/progress`, { progress_percent: percent })
  });

  const completeCourseMutation = useMutation({
    mutationFn: (score) => apiClient.post(`/course-enrolments/${enrolmentData.id}/complete`, { score }),
    onSuccess: () => {
      setPassedCourse(true);
      toast({ title: "Congratulations!", description: "You have completed the course and earned your certificate." });
    }
  });

  // Render Loading / Error
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }
  
  if (!transformedCourse || error) {
    return null; // Handled by onError redirect
  }

  // --- Derived State & Handlers ---
  const module = transformedCourse.modules[currentModuleIdx] || { title: "", lessons: [] };
  const lesson = module.lessons[currentLessonIdx] || null;
  const totalLessons = allLessons.length || 1; // avoid division by zero
  const progressPercent = passedCourse ? 100 : Math.min(100, Math.round((completedLessons.size / totalLessons) * 100));

  const parseMin = (d) => parseInt(String(d).replace(/[^\d]/g, ""), 10) || 0;
  const remainingMin = allLessons
    .filter((l) => !completedLessons.has(l.id))
    .reduce((n, l) => n + parseMin(l.duration), 0);
  const estimatedTime = remainingMin >= 60 ? `${Math.floor(remainingMin / 60)}h ${remainingMin % 60}m` : `${remainingMin} min`;

  const goToNextIncomplete = () => {
    const next = allLessons.find((l) => !completedLessons.has(l.id));
    if (!next) return;
    selectLesson(next._mi, next._li);
  };

  const selectLesson = (mi, li) => {
    setCurrentModuleIdx(mi);
    setCurrentLessonIdx(li);
  };

  const markComplete = () => {
    if (!lesson) return;
    
    // Optimistic UI Update
    const newSet = new Set(completedLessons).add(lesson.id);
    setCompletedLessons(newSet);
    
    const newProgress = Math.min(100, Math.round((newSet.size / totalLessons) * 100));

    // Sync to backend
    updateProgressMutation.mutate({
      lesson_id: lesson.id,
      lesson_type: lesson.type,
      status: 'COMPLETED'
    });
    
    if (enrolmentData?.id) {
      syncOverallProgressMutation.mutate(newProgress);
    }

    if (newSet.size >= totalLessons) {
      setPassedCourse(true);
      if (enrolmentData?.id) {
        completeCourseMutation.mutate(100);
      }
    }
  };

  const goPrev = () => {
    let mi = currentModuleIdx, li = currentLessonIdx - 1;
    if (li < 0) {
      mi = mi - 1;
      if (mi < 0) return;
      li = transformedCourse.modules[mi].lessons.length - 1;
    }
    selectLesson(mi, li);
  };

  const goNext = () => {
    let mi = currentModuleIdx, li = currentLessonIdx + 1;
    if (li >= module.lessons.length) {
      mi = mi + 1;
      if (mi >= transformedCourse.modules.length) return;
      li = 0;
    }
    selectLesson(mi, li);
  };

  const isFirst = currentModuleIdx === 0 && currentLessonIdx === 0;
  const isLast = currentModuleIdx === transformedCourse.modules.length - 1 && currentLessonIdx === module.lessons.length - 1;

  const onPassAssessment = async (score = 100) => {
    // Mark all lessons complete + update progress
    const newSet = new Set(allLessons.map((l) => l.id));
    setCompletedLessons(newSet);
    setPassedCourse(true);
    
    if (lesson) {
        updateProgressMutation.mutate({
            lesson_id: lesson.id,
            lesson_type: lesson.type,
            status: 'COMPLETED',
            quiz_score: score
        });
    }

    if (enrolmentData?.id) {
      syncOverallProgressMutation.mutate(100);
      completeCourseMutation.mutate(score);
    }
  };

  // Right panel (notes / journal / resources) for every non-assessment lesson
  const showRightPanel = lesson?.uiType !== "assessment";

  // Render the main content based on lesson type
  const renderMain = () => {
    if (!lesson) return <div className="p-8">No content available for this lesson.</div>;
    
    if (lesson.uiType === "assessment") {
      if (passedCourse) return (
        <CertificateScreen
          course={transformedCourse}
          learnerName={learnerName}
          organisationName={enrolmentData?.organization?.name || user?.organization?.name || "CareConnect Demo Authority"}
          organisationLogo={enrolmentData?.organization?.logo_url || user?.organization?.logo_url}
        />
      );
      return (
        <CardAssessment
          questions={lesson.questions || []}
          passMark={lesson.pass_mark || transformedCourse.pass_mark || 80}
          courseTitle={transformedCourse.title}
          onPass={onPassAssessment}
        />
      );
    }
    return (
      <LessonContent
        lesson={lesson}
        onPrev={goPrev}
        onNext={goNext}
        isFirst={isFirst}
        isLast={isLast}
        isCompleted={completedLessons.has(lesson.id) || passedCourse}
      />
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <CourseSidebar
        course={transformedCourse}
        currentModuleIdx={currentModuleIdx}
        currentLessonIdx={currentLessonIdx}
        completedLessons={completedLessons}
        onSelect={selectLesson}
        onContinue={goToNextIncomplete}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <CourseTopBar
          courseTitle={transformedCourse.title}
          moduleTitle={module.title}
          lessonTitle={lesson?.title}
          progressPercent={progressPercent}
          estimatedTime={estimatedTime}
          isFirst={isFirst}
          isLast={isLast}
          isCompleted={lesson ? (completedLessons.has(lesson.id) || passedCourse) : false}
          onPrev={goPrev}
          onNext={goNext}
          onMarkComplete={markComplete}
        />
        <div className="flex flex-1 overflow-hidden">
          <div className="flex flex-1 min-w-0 overflow-hidden">{renderMain()}</div>
          {showRightPanel && (
            <LearningPanel lesson={lesson} panel={panel} setPanel={setPanel} />
          )}
        </div>
      </div>
    </div>
  );
}