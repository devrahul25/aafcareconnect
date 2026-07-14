import { prisma } from '../../config/database';
import { memoryCache } from '../../shared/providers/cache/memory.cache.service';
import { ICacheProvider } from '../../shared/providers/cache/cache.provider.interface';

export class PermissionService {
  private cache: ICacheProvider;
  private readonly CACHE_TTL = 300; // 5 minutes

  constructor(cacheProvider: ICacheProvider = memoryCache) {
    this.cache = cacheProvider;
  }

  private getCacheKey(userId: string): string {
    return `user_permissions:${userId}`;
  }

  /**
   * Resolve all permissions for a user (direct and via roles).
   */
  async getPermissions(userId: string): Promise<Set<string>> {
    const cacheKey = this.getCacheKey(userId);
    
    const cachedPermissions = await this.cache.get<string[]>(cacheKey);
    if (cachedPermissions) {
      return new Set(cachedPermissions);
    }

    // Cache miss, compute from DB
    const permissions = new Set<string>();

    // 1. Direct user permissions
    const userPerms = await prisma.userPermission.findMany({
      where: { user_id: userId },
      include: { permission: true }
    });
    for (const up of userPerms) {
      permissions.add(`${up.permission.resource}:${up.permission.action}`);
    }

    // 2. Role-based permissions
    const userRoles = await prisma.userRole.findMany({
      where: { user_id: userId },
      include: {
        role: {
          include: {
            permissions: {
              include: { permission: true }
            }
          }
        }
      }
    });

    for (const ur of userRoles) {
      for (const rp of ur.role.permissions) {
        permissions.add(`${rp.permission.resource}:${rp.permission.action}`);
      }
    }

    // Cache as array since Set doesn't serialize gracefully in all cache layers
    await this.cache.set(cacheKey, Array.from(permissions), this.CACHE_TTL);

    return permissions;
  }

  /**
   * Check if a user has a specific permission.
   * `admin:manage` automatically grants access to everything.
   */
  async hasPermission(userId: string, resource: string, action: string): Promise<boolean> {
    const permissions = await this.getPermissions(userId);
    if (permissions.has('admin:manage')) {
      return true;
    }
    return permissions.has(`${resource}:${action}`);
  }

  /**
   * Invalidate the permission cache for a user.
   */
  async invalidatePermissions(userId: string): Promise<void> {
    await this.cache.delete(this.getCacheKey(userId));
  }
}

export const permissionService = new PermissionService();
