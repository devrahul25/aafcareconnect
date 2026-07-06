import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import PageNotFound from "./lib/PageNotFound";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import UserNotRegisteredError from "@/components/UserNotRegisteredError";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "@/components/ProtectedRoute";

// Layout
import AppLayout from "@/components/layout/AppLayout";

// Pages
import Dashboard      from "@/pages/Dashboard";
import LearningHub    from "@/pages/LearningHub";
import CPDHub         from "@/pages/CPDHub";
import CourseBuilder  from "@/pages/CourseBuilder";
import Administration        from "@/pages/Administration";
import CoursePlayer          from "@/pages/CoursePlayer";
import ProfessionalPassport  from "@/pages/ProfessionalPassport";
import ComplianceHub         from "@/pages/ComplianceHub";

// Auth pages
import Login          from "@/pages/Login";
import Register       from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword  from "@/pages/ResetPassword";

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const location = useLocation();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-[3px] border-slate-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (authError) {
    if (authError.type === "user_not_registered") return <UserNotRegisteredError />;
    if (authError.type === "auth_required") {
      const isAuthRoute = ["/login", "/register", "/forgot-password", "/reset-password"].includes(
        location.pathname
      );
      if (!isAuthRoute) {
        return <Navigate to="/login" replace />;
      }
    }
  }

  return (
    <Routes>
      <Route path="/login"          element={<Login />} />
      <Route path="/register"       element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route path="/learning-hub/course/:courseId" element={<CoursePlayer />} />
        <Route element={<AppLayout />}>
          <Route path="/"               element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard"           element={<Dashboard />} />
          <Route path="/learning-hub"        element={<LearningHub />} />
          <Route path="/cpd-certificates"    element={<CPDHub />} />
          <Route path="/course-builder"      element={<CourseBuilder />} />
          <Route path="/admin"                   element={<Administration />} />
          <Route path="/professional-passport"   element={<ProfessionalPassport />} />
          <Route path="/compliance-hub"          element={<ComplianceHub />} />
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