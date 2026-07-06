import { prisma } from '../src/config/database';
import { firebaseAuth } from '../src/config/firebase';

// Mock Firebase Admin Auth globally for all tests
jest.mock('../src/config/firebase', () => ({
  firebaseAuth: {
    createUser: jest.fn(),
    deleteUser: jest.fn(),
    getUserByEmail: jest.fn(),
    verifyIdToken: jest.fn(),
    updateUser: jest.fn(),
  },
}));

afterAll(async () => {
  await prisma.$disconnect();
});
