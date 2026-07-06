import { User, UserRole, Role } from '@prisma/client';

type UserWithRoles = User & {
  user_roles?: (UserRole & { role: Role })[];
};

export class AuthSerializer {
  /**
   * Serializes the user object to strictly match the React frontend's expected format.
   * - Converts organization_id to organisation_id
   * - Flattens user_roles into a single role_type string
   * - Scrubs internal data like firebase_uid
   */
  static serializeUser(user: UserWithRoles | null) {
    if (!user) return null;

    // Determine primary role from Prisma relation if included
    let role_type = 'user';
    if (user.user_roles && user.user_roles.length > 0) {
      role_type = user.user_roles[0].role?.name || 'user';
    }

    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      avatar_url: user.avatar_url,
      phone: user.phone,
      status: user.status,
      email_verified: user.email_verified,
      organisation_id: user.organization_id, // Mapping US to UK spelling
      role_type,
    };
  }

  /**
   * Standardizes success responses
   */
  static success<T>(data: T, message?: string) {
    return {
      success: true,
      message,
      data,
    };
  }
}
