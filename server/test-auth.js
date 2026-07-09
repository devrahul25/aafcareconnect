const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({
    where: { email: 'admin@demo.com' },
    include: { user_sessions: true }
  });
  
  if (!user || user.user_sessions.length === 0) return console.log("User or session not found");
  
  const session = user.user_sessions[0];
  
  const payload = {
    sub: user.id,
    email: user.email,
    org: user.organization_id,
    sid: session.family_id,
    session_version: user.session_version,
  };
  
  const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-for-dev-only-min-32-chars';
  const token = jwt.sign(payload, secret, { expiresIn: '15m' });
  console.log(token);
}

main().catch(console.error).finally(() => prisma.$disconnect());
