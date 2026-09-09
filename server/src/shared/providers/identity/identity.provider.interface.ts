export interface IIdentityProvider {
  /**
   * Creates a new user in the Identity Provider
   * @param email The user's email address
   * @param password The user's raw password
   * @returns The unique Identity Provider ID (e.g. Firebase UID)
   */
  createUser(email: string, password?: string): Promise<string>;

  /**
   * Deletes a user from the Identity Provider (e.g. for rollback)
   * @param uid The unique Identity Provider ID
   */
  deleteUser(uid: string): Promise<void>;

  /**
   * Deletes a user from the Identity Provider by their email
   * @param email The user's email address
   */
  deleteUserByEmail(email: string): Promise<void>;

  /**
   * Verifies an ID token from the client
   * @param token The JWT ID token
   * @param checkRevoked Whether to check if the token has been revoked by checking Firebase servers
   * @returns The decoded token payload containing at least the uid
   */
  verifyToken(token: string, checkRevoked?: boolean): Promise<{ uid: string; email?: string }>;

  /**
   * Updates a user's password
   * @param uid The unique Identity Provider ID
   * @param newPassword The new raw password
   * @param email Optional email to locate the user if UID is outdated or missing
   * @returns The resolved UID in the identity provider
   */
  updatePassword(uid: string, newPassword: string, email?: string): Promise<string>;
}
