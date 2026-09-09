import { IIdentityProvider } from './identity.provider.interface';
import { firebaseAuth } from '../../../config/firebase';
import { logger } from '../../../config/logger';

export class FirebaseAdminService implements IIdentityProvider {
  async createUser(email: string, password?: string): Promise<string> {
    try {
      const userRecord = await firebaseAuth.createUser({
        email,
        password, // If no password is provided, Firebase assigns a random one or prevents password login
        emailVerified: false,
      });
      return userRecord.uid;
    } catch (error: any) {
      logger.error('Firebase createUser failed', error);
      throw error;
    }
  }

  async deleteUser(uid: string): Promise<void> {
    try {
      await firebaseAuth.deleteUser(uid);
    } catch (error: any) {
      logger.error(`Firebase deleteUser failed for uid: ${uid}`, error);
      throw error;
    }
  }

  async deleteUserByEmail(email: string): Promise<void> {
    try {
      const user = await firebaseAuth.getUserByEmail(email);
      await firebaseAuth.deleteUser(user.uid);
    } catch (error: any) {
      if (error.code !== 'auth/user-not-found') {
        logger.error(`Firebase deleteUserByEmail failed for email: ${email}`, error);
        throw error;
      }
    }
  }

  async verifyToken(token: string, checkRevoked: boolean = false): Promise<{ uid: string; email?: string }> {
    try {
      const decodedToken = await firebaseAuth.verifyIdToken(token, checkRevoked);
      return {
        uid: decodedToken.uid,
        email: decodedToken.email,
      };
    } catch (error: any) {
      if (error.code === 'auth/id-token-revoked') {
        logger.warn('Revoked Firebase ID Token used');
        throw new Error('Invalid or expired identity token'); // Generic mapped
      }
      logger.error('Firebase verifyToken failed', error);
      throw new Error('Invalid or expired identity token');
    }
  }

  async updatePassword(uid: string, newPassword: string, email?: string): Promise<string> {
    try {
      if (uid) {
        await firebaseAuth.updateUser(uid, {
          password: newPassword,
        });
        return uid;
      }
    } catch (error: any) {
      if (error.code !== 'auth/user-not-found') {
        logger.error(`Firebase updatePassword failed for uid: ${uid}`, error);
        throw error;
      }
      logger.warn(`Firebase user not found with UID ${uid}. Attempting recovery by email: ${email}`);
    }

    if (email) {
      try {
        const userRecord = await firebaseAuth.getUserByEmail(email);
        await firebaseAuth.updateUser(userRecord.uid, {
          password: newPassword,
        });
        return userRecord.uid;
      } catch (emailErr: any) {
        if (emailErr.code === 'auth/user-not-found') {
          throw new Error('User account does not exist. Please contact Super Admin.');
        }
        logger.error(`Firebase lookup failed for ${email}:`, emailErr);
        throw emailErr;
      }
    }

    throw new Error('User account does not exist. Please contact Super Admin.');
  }
}
