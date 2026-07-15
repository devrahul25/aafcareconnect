import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

const DefaultFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-slate-50 z-50">
    <div className="w-8 h-8 border-[3px] border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
  </div>
);

const Forbidden = () => (
  <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slate-50 min-h-[50vh] rounded-xl border border-slate-200 m-8">
    <h2 className="text-3xl font-bold text-slate-900 mb-2">403 Forbidden</h2>
    <p className="text-slate-500 mb-6 max-w-md">
      You do not have the required permissions to access this page. Please contact your administrator if you believe this is an error.
    </p>
    <button
      onClick={() => window.history.back()}
      className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
    >
      Go Back
    </button>
  </div>
);

/**
 * Protects a route requiring the user to be authenticated AND have a specific permission.
 * If resource/action are omitted, it only requires authentication.
 */
export default function PermissionRoute({ 
  resource, 
  action, 
  children, 
  fallback = <DefaultFallback />, 
  unauthenticatedElement = <Navigate to="/login" replace />
}) {
  const { isAuthenticated, isLoadingAuth, authChecked, authError, checkUserAuth, hasPermission } = useAuth();

  useEffect(() => {
    if (!authChecked && !isLoadingAuth && checkUserAuth) {
      checkUserAuth();
    }
  }, [authChecked, isLoadingAuth, checkUserAuth]);

  if (isLoadingAuth || !authChecked) {
    return fallback;
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    }
    return unauthenticatedElement;
  }

  if (!isAuthenticated) {
    return unauthenticatedElement;
  }

  // If specific permissions are requested, validate them
  if (resource && action) {
    if (!hasPermission(resource, action)) {
      return <Forbidden />;
    }
  }

  return children ? children : <Outlet />;
}
