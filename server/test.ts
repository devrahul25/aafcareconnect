import { AuthService } from './src/modules/auth/auth.service';
import { prisma } from './src/config/database';
import { Request } from 'express';

async function test() {
  try {
    const authService = new AuthService();
    // This will fail verifying the token with Firebase, but we just want to see the exact error.
    // Wait, if it fails at Firebase verify token, it throws 'Invalid or expired identity token'
    // which the controller handles as 401. Let's mock identityProvider to bypass firebase
    authService['identityProvider'] = {
      verifyToken: async () => ({ email: 'test3@example.com', uid: 'fake_uid_456' }),
    } as any;
    
    // Pass a fake request object since the repository expects one for IP extraction
    const mockReq = { headers: {}, socket: { remoteAddress: '127.0.0.1' } } as unknown as Request;

    const result = await authService.socialLogin('fake-token', mockReq);
    console.log('Success!', result.access_token ? 'Got access token' : 'No token');
  } catch (e) {
    console.error('Error in socialLogin:', e);
  } finally {
    await prisma.$disconnect();
  }
}

test();
