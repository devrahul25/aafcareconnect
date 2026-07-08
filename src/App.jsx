import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import PageNotFound from "./lib/PageNotFound";
import { AuthProvider, useAuth } from "@/lib/AuthContext";

import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "@/components/ProtectedRoute";

// Layout
import AppLayout from "@/components/layout/AppLayout";

// Pages
import Dashboard from "@/pages/Dashboard";
import LearningHub from "@/pages/LearningHub";
import CPDHub from "@/pages/CPDHub";
import CourseBuilder from "@/pages/CourseBuilder";
import Administration from "@/pages/Administration";
import CoursePlayer from "@/pages/CoursePlayer";
import ProfessionalPassport from "@/pages/ProfessionalPassport";
import ComplianceHub from "@/pages/ComplianceHub";

// Super Admin Pages
import SAOrganisations from "@/pages/superadmin/Organisations";
import SAOrganisationWorkspace from "@/pages/superadmin/OrganisationWorkspace";
import SAPlatformUsers from "@/pages/superadmin/PlatformUsers";
import SACourseLibrary from "@/pages/superadmin/CourseLibrary";
import SASubscriptions from "@/pages/superadmin/Subscriptions";
import SAReportsAnalytics from "@/pages/superadmin/ReportsAnalytics";
import SAAuditLogs from "@/pages/superadmin/AuditLogs";
import SAPlatformSettings from "@/pages/superadmin/PlatformSettings";
import SANotifications from "@/pages/superadmin/Notifications";

// Org Admin Pages
import OALearners from "@/pages/orgadmin/Learners";
import OAStaff from "@/pages/orgadmin/Staff";
import OAReports from "@/pages/orgadmin/Reports";
import OAOrganisationSettings from "@/pages/orgadmin/OrganisationSettings";
import OANotifications from "@/pages/orgadmin/Notifications";

// Manager Pages
import MgrLearners from "./pages/manager/MyLearners";
import MgrProgress from "./pages/manager/LearningProgress";
import MgrAssignments from "./pages/manager/CourseAssignments";
import MgrCompliance from "./pages/manager/ComplianceHub";
import MgrCertificates from "./pages/manager/Certificates";
import MgrDocuments from "./pages/manager/Documents";
import MgrReports from "./pages/manager/Reports";
import MgrNotifications from "./pages/manager/Notifications";

// Trainer Pages
import TrainerCourses from "./pages/trainer/MyCourses";
import TrainerLessons from "./pages/trainer/Lessons";
import TrainerQuizzes from "./pages/trainer/QuizzesAssessments";
import TrainerAnalytics from "./pages/trainer/CourseAnalytics";
import TrainerResources from "./pages/trainer/Resources";
import TrainerDrafts from "./pages/trainer/DraftCourses";
import TrainerPublished from "./pages/trainer/PublishedCourses";
import TrainerNotifications from "./pages/trainer/Notifications";

// Learner Pages
import LearnerMyLearning from "./pages/learner/MyLearning";
import LearnerAssessments from "./pages/learner/Assessments";
import LearnerCertificates from "./pages/learner/Certificates";
import LearnerCPDRecord from "./pages/learner/CPDRecord";
import LearnerNotifications from "./pages/learner/Notifications";
import LearnerMyProfile from "./pages/learner/MyProfile";

// Auth pages
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";

const AuthenticatedApp = () => {
  const { isLoadingAuth, hasRole } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-[3px] border-slate-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route path="/learning-hub/course/:courseId" element={<CoursePlayer />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/learning-hub" element={<LearningHub />} />
          <Route path="/cpd-certificates" element={<CPDHub />} />
          <Route path="/course-builder" element={<CourseBuilder />} />
          <Route path="/admin" element={<Administration />} />
          <Route path="/professional-passport" element={<ProfessionalPassport />} />
          <Route path="/compliance-hub" element={<ComplianceHub />} />
          
          {/* Org Admin Routes */}
          <Route path="/orgadmin/learners" element={<OALearners />} />
          <Route path="/orgadmin/staff" element={<OAStaff />} />
          <Route path="/orgadmin/reports" element={<OAReports />} />
          <Route path="/orgadmin/settings" element={<ProtectedRoute requiredLevel={4}><OAOrganisationSettings /></ProtectedRoute>} />
          <Route path="/orgadmin/notifications" element={<ProtectedRoute requiredLevel={4}><OANotifications /></ProtectedRoute>} />

          {/* Manager / Supervisor Routes (Level 3+) */}
          <Route path="/manager/learners" element={<ProtectedRoute requiredLevel={3}><MgrLearners /></ProtectedRoute>} />
          <Route path="/manager/progress" element={<ProtectedRoute requiredLevel={3}><MgrProgress /></ProtectedRoute>} />
          <Route path="/manager/assignments" element={<ProtectedRoute requiredLevel={3}><MgrAssignments /></ProtectedRoute>} />
          <Route path="/manager/compliance" element={<ProtectedRoute requiredLevel={3}><MgrCompliance /></ProtectedRoute>} />
          <Route path="/manager/certificates" element={<ProtectedRoute requiredLevel={3}><MgrCertificates /></ProtectedRoute>} />
          <Route path="/manager/documents" element={<ProtectedRoute requiredLevel={3}><MgrDocuments /></ProtectedRoute>} />
          <Route path="/manager/reports" element={<ProtectedRoute requiredLevel={3}><MgrReports /></ProtectedRoute>} />
          <Route path="/manager/notifications" element={<ProtectedRoute requiredLevel={3}><MgrNotifications /></ProtectedRoute>} />

          {/* Trainer Routes (Level 2+) */}
          <Route path="/trainer/courses" element={<ProtectedRoute requiredLevel={2}><TrainerCourses /></ProtectedRoute>} />
          <Route path="/trainer/lessons" element={<ProtectedRoute requiredLevel={2}><TrainerLessons /></ProtectedRoute>} />
          <Route path="/trainer/quizzes" element={<ProtectedRoute requiredLevel={2}><TrainerQuizzes /></ProtectedRoute>} />
          <Route path="/trainer/analytics" element={<ProtectedRoute requiredLevel={2}><TrainerAnalytics /></ProtectedRoute>} />
          <Route path="/trainer/resources" element={<ProtectedRoute requiredLevel={2}><TrainerResources /></ProtectedRoute>} />
          <Route path="/trainer/drafts" element={<ProtectedRoute requiredLevel={2}><TrainerDrafts /></ProtectedRoute>} />
          <Route path="/trainer/published" element={<ProtectedRoute requiredLevel={2}><TrainerPublished /></ProtectedRoute>} />
          <Route path="/trainer/notifications" element={<ProtectedRoute requiredLevel={2}><TrainerNotifications /></ProtectedRoute>} />

          {/* Learner Routes (Level 1+) */}
          <Route path="/learner/learning" element={<ProtectedRoute requiredLevel={1}><LearnerMyLearning /></ProtectedRoute>} />
          <Route path="/learner/assessments" element={<ProtectedRoute requiredLevel={1}><LearnerAssessments /></ProtectedRoute>} />
          <Route path="/learner/certificates" element={<ProtectedRoute requiredLevel={1}><LearnerCertificates /></ProtectedRoute>} />
          <Route path="/learner/cpd" element={<ProtectedRoute requiredLevel={1}><LearnerCPDRecord /></ProtectedRoute>} />
          <Route path="/learner/notifications" element={<ProtectedRoute requiredLevel={1}><LearnerNotifications /></ProtectedRoute>} />
          <Route path="/learner/profile" element={<ProtectedRoute requiredLevel={1}><LearnerMyProfile /></ProtectedRoute>} />

          {/* Super Admin Routes (Level 5) */}
          <Route path="/superadmin/organisations" element={<ProtectedRoute requiredLevel={5}><SAOrganisations /></ProtectedRoute>} />
          <Route path="/superadmin/organisations/:orgId/*" element={<ProtectedRoute requiredLevel={5}><SAOrganisationWorkspace /></ProtectedRoute>} />
          <Route path="/superadmin/users" element={<SAPlatformUsers />} />
          <Route path="/superadmin/course-library" element={<SACourseLibrary />} />
          <Route path="/superadmin/subscriptions" element={<SASubscriptions />} />
          <Route path="/superadmin/reports" element={<SAReportsAnalytics />} />
          <Route path="/superadmin/audit-logs" element={<SAAuditLogs />} />
          <Route path="/superadmin/settings" element={<SAPlatformSettings />} />
          <Route path="/superadmin/notifications" element={<SANotifications />} />
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;