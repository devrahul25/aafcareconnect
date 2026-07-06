import { useState, useMemo, useEffect } from "react";
import { COURSE, ASSESSMENT_QUESTIONS } from "@/lib/courseData";
import CourseSidebar from "@/components/course/CourseSidebar";
import CourseTopBar from "@/components/course/CourseTopBar";
import LessonContent from "@/components/course/LessonContent";
import CardAssessment from "@/components/course/CardAssessment";
import CertificateScreen from "@/components/course/CertificateScreen";
import LearningPanel from "@/components/course/LearningPanel";
import { base44 } from "@/api/base44Client";

export default function CoursePlayer() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);
  const learnerName = user?.full_name || "Foster Carer";

  const allLessons = useMemo(
    () => COURSE.modules.flatMap((m, mi) => m.lessons.map((l) => ({ ...l, _mi: mi, _li: l._li ?? m.lessons.indexOf(l) }))),
    []
  );

  const [currentModuleIdx, setCurrentModuleIdx] = useState(0);
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [passedCourse, setPassedCourse] = useState(false);
  const [panel, setPanel] = useState({ notes: "", learned: "", practice: "" });

  const module = COURSE.modules[currentModuleIdx];
  const lesson = module.lessons[currentLessonIdx];
  const totalLessons = allLessons.length;
  const progressPercent = Math.round((completedLessons.size / totalLessons) * 100);

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
    setCompletedLessons((s) => new Set(s).add(lesson.id));
  };

  const goPrev = () => {
    // Walk backwards across module/lesson indices
    let mi = currentModuleIdx, li = currentLessonIdx - 1;
    if (li < 0) {
      mi = mi - 1;
      if (mi < 0) return;
      li = COURSE.modules[mi].lessons.length - 1;
    }
    selectLesson(mi, li);
  };

  const goNext = () => {
    let mi = currentModuleIdx, li = currentLessonIdx + 1;
    if (li >= module.lessons.length) {
      mi = mi + 1;
      if (mi >= COURSE.modules.length) return;
      li = 0;
    }
    selectLesson(mi, li);
  };

  const isFirst = currentModuleIdx === 0 && currentLessonIdx === 0;
  const isLast = currentModuleIdx === COURSE.modules.length - 1 && currentLessonIdx === module.lessons.length - 1;

  const onPassAssessment = async () => {
    // Mark all lessons complete + create CPD record + update progress
    setCompletedLessons(new Set(allLessons.map((l) => l.id)));
    setPassedCourse(true);
    try {
      await base44.entities.CPDCertificate.create({
        user_id: user?.id,
        organisation_id: user?.organisation_id,
        title: COURSE.title,
        provider: "AAF CareConnect",
        issue_date: new Date().toISOString().slice(0, 10),
        expiry_date: new Date(Date.now() + 365 * 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        cpd_hours: COURSE.cpd_hours,
        category: COURSE.category,
        status: "valid",
        verified: true,
      });
    } catch (e) {
      // non-fatal — certificate screen still shown; record optional
      console.warn("CPD record save failed:", e?.message || e);
    }
  };

  // Right panel (notes / journal / resources) for every non-assessment lesson
  const showRightPanel = lesson.type !== "assessment";

  // Render the main content based on lesson type
  const renderMain = () => {
    if (lesson.type === "assessment") {
      if (passedCourse) return <CertificateScreen course={COURSE} learnerName={learnerName} />;
      return (
        <CardAssessment
          questions={ASSESSMENT_QUESTIONS}
          passMark={COURSE.pass_mark}
          courseTitle={COURSE.title}
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
        course={COURSE}
        currentModuleIdx={currentModuleIdx}
        currentLessonIdx={currentLessonIdx}
        completedLessons={completedLessons}
        onSelect={selectLesson}
        onContinue={goToNextIncomplete}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <CourseTopBar
          courseTitle={COURSE.title}
          moduleTitle={module.title}
          lessonTitle={lesson.title}
          progressPercent={progressPercent}
          estimatedTime={estimatedTime}
          isFirst={isFirst}
          isLast={isLast}
          isCompleted={completedLessons.has(lesson.id) || passedCourse}
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