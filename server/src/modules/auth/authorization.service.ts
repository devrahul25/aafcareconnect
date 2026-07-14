import { AuthenticatedRequest } from './auth.middleware';
import { permissionService } from './permission.service';

export class AuthorizationService {
  /**
   * Fast edge check for permissions using the pre-resolved Set on the request context.
   * Falls back to async resolution if permissions aren't on the request.
   */
  async can(req: AuthenticatedRequest, resource: string, action: string): Promise<boolean> {
    if (req.permissions) {

      if (req.permissions.has('admin:manage')) return true; // Org Admin bypass
      return req.permissions.has(`${resource}:${action}`);
    }
    // Fallback to service if req context wasn't fully hydrated
    return this.hasPermission(req.user.id, resource, action);
  }

  /**
   * Async check delegating to PermissionService directly.
   */
  async hasPermission(userId: string, resource: string, action: string): Promise<boolean> {
    return permissionService.hasPermission(userId, resource, action);
  }

  /**
   * Checks if the user is the owner of a given resource.
   */
  isOwner(req: AuthenticatedRequest, resourceOwnerId: string): boolean {
    return req.user.id === resourceOwnerId;
  }

  /**
   * Checks if a resource belongs to the user's organization.
   */
  belongsToOrganization(req: AuthenticatedRequest, resourceOrganizationId: string): boolean {
    return req.user.organization_id === resourceOrganizationId;
  }
}

export const authorizationService = new AuthorizationService();
