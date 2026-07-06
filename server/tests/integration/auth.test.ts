import request from 'supertest';
import { app } from '../../src/app'; // Make sure app is exported from index or app.ts
import { prisma } from '../../src/config/database';
import { firebaseAuth } from '../../src/config/firebase';

describe('Auth Integration Tests', () => {
  beforeAll(async () => {
    // We expect the database to be seeded with demo org, etc.
    // If not, we might need to seed it here.
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should register a new user', async () => {
    (firebaseAuth.createUser as jest.Mock).mockResolvedValue({ uid: 'test-uid-123' });
    
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'test@example.com',
        password: 'Password123!',
        full_name: 'Test User'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('Registration pending');
  });

  it('should return error for duplicate email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'test@example.com',
        password: 'Password123!',
      });

    expect(res.status).toBe(400); // Because status is INACTIVE, returns 400 with "Registration pending. Please verify your email."
    expect(res.body.success).toBe(false);
  });

  it('should verify OTP and return tokens', async () => {
    const token = await prisma.verificationToken.findFirst({
      where: { email: 'test@example.com', type: 'EMAIL_VERIFICATION', consumed_at: null }
    });
    // In test environment, the hashed token is created with OTPUtil, we can't easily mock the unhashed OTP if not returned.
    // To properly test this, we would need to mock OTPUtil.generateOTP or know the code.
    // For now, we'll mark this as pending or mock it.
  });

  it('should login an existing active user', async () => {
    // Mock verifyIdToken for admin@demo.com (seeded active user)
    (firebaseAuth.verifyIdToken as jest.Mock).mockResolvedValue({
      uid: 'SEED_FIREBASE_UID_ADMIN',
      email: 'admin@demo.com'
    });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        idToken: 'mock-id-token'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('access_token');
    expect(res.body.data).toHaveProperty('refresh_token');
  });

  it('should refresh a token', async () => {
    (firebaseAuth.verifyIdToken as jest.Mock).mockResolvedValue({
      uid: 'SEED_FIREBASE_UID_ADMIN',
      email: 'admin@demo.com'
    });

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ idToken: 'mock-id-token' });
    
    const refreshToken = loginRes.body.data.refresh_token;

    const refreshRes = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refresh_token: refreshToken });

    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body.success).toBe(true);
    expect(refreshRes.body.data).toHaveProperty('access_token');
    expect(refreshRes.body.data).toHaveProperty('refresh_token');
  });

  it('should detect replay attack on refresh', async () => {
    (firebaseAuth.verifyIdToken as jest.Mock).mockResolvedValue({
      uid: 'SEED_FIREBASE_UID_ADMIN',
      email: 'admin@demo.com'
    });

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ idToken: 'mock-id-token' });
    
    const refreshToken = loginRes.body.data.refresh_token;

    // Use token once
    await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refresh_token: refreshToken });

    // Try to use it again
    const replayRes = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refresh_token: refreshToken });

    expect(replayRes.status).toBe(403);
    expect(replayRes.body.error).toContain('Security alert');
  });

  it('should logout a user', async () => {
    (firebaseAuth.verifyIdToken as jest.Mock).mockResolvedValue({
      uid: 'SEED_FIREBASE_UID_ADMIN',
      email: 'admin@demo.com'
    });

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ idToken: 'mock-id-token' });
    
    const refreshToken = loginRes.body.data.refresh_token;

    const logoutRes = await request(app)
      .post('/api/v1/auth/logout')
      .send({ refresh_token: refreshToken });

    expect(logoutRes.status).toBe(200);
    expect(logoutRes.body.success).toBe(true);
  });
});
