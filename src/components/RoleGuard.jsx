import { useAuth } from '@/lib/AuthContext';

/**
 * RoleGuard — conditionally renders children based on the user's role level.
 *
 * @param {string}      minRole   - Minimum role required (learner|trainer|manager|org_admin|super_admin)
 * @param {ReactNode}   children  - Content to show when role requirement is met
 * @param {ReactNode}   fallback  - Optional content to show when access is denied (default: null)
 *
 * Usage:
 *   <RoleGuard minRole="manager">
 *     <ManagementPanel />
 *   </RoleGuard>
 *
 *   <RoleGuard minRole="trainer" fallback={<p>Access denied</p>}>
 *     <CourseBuilder />
 *   </RoleGuard>
 */
export default function RoleGuard({ minRole, children, fallback = null }) {
  const { hasRole } = useAuth();

  if (!hasRole(minRole)) {
    return fallback;
  }

  return children;
}
