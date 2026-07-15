import React from 'react';
import { useAuth } from '@/lib/AuthContext';

/**
 * Conditionally renders children if the current user has the required permission.
 * 
 * @param {Object} props
 * @param {string} props.resource - The resource name (e.g. 'users', 'courses', 'reports')
 * @param {string} props.action - The action name (e.g. 'create', 'read', 'update', 'delete', 'manage')
 * @param {React.ReactNode} props.children - The elements to render if permitted
 * @param {React.ReactNode} [props.fallback] - The element to render if NOT permitted (default: null)
 */
export default function RequirePermission({ resource, action, children, fallback = null }) {
  const { hasPermission } = useAuth();
  
  if (hasPermission(resource, action)) {
    return <>{children}</>;
  }

  return fallback ? <>{fallback}</> : null;
}
