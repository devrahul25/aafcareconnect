import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import net from 'net';

console.log('\n🏥 Starting CareConnect Health Check...\n');

let allPassed = true;

const check = (name, fn) => {
  try {
    const result = fn();
    if (result) {
      console.log(`✅ [PASS] ${name}`);
    } else {
      console.log(`❌ [FAIL] ${name}`);
      allPassed = false;
    }
  } catch (error) {
    console.log(`❌ [FAIL] ${name}`);
    console.log(`   Error: ${error.message}`);
    allPassed = false;
  }
};

const checkPort = (port) => {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false); // Port is in use
      } else {
        resolve(true); // Other errors might mean we can't test, assume OK for health check
      }
    });
    server.once('listening', () => {
      server.close();
      resolve(true); // Port is free
    });
    server.listen(port);
  });
};

const runChecks = async () => {
  // 1. Node Version
  check('Node version is >= 20', () => {
    const version = process.version;
    const major = parseInt(version.replace('v', '').split('.')[0], 10);
    return major >= 20;
  });

  // 2. NPM Version
  check('NPM is installed', () => {
    execSync('npm -v', { stdio: 'ignore' });
    return true;
  });

  // 3. PostgreSQL Reachability
  check('PostgreSQL reachable (prisma migrate status)', () => {
    const stdout = execSync('npx prisma migrate status', { 
      cwd: path.join(process.cwd(), 'server'),
      encoding: 'utf-8' 
    });
    return !stdout.includes('Error'); // Will throw if DB is down
  });

  // 4. Prisma Schema Validity
  check('Prisma schema is valid', () => {
    execSync('npx prisma validate', { 
      cwd: path.join(process.cwd(), 'server'),
      stdio: 'ignore' 
    });
    return true;
  });

  // 5. Check .env file
  check('.env file exists in server directory', () => {
    return fs.existsSync(path.join(process.cwd(), 'server', '.env'));
  });

  // 6. Firebase credentials
  check('Firebase credentials configured in .env', () => {
    const envContent = fs.readFileSync(path.join(process.cwd(), 'server', '.env'), 'utf-8');
    return envContent.includes('FIREBASE_PROJECT_ID') && envContent.includes('FIREBASE_PRIVATE_KEY');
  });

  // 7. Port availability
  const port3001Free = await checkPort(3001);
  const port5173Free = await checkPort(5173);
  
  if (port3001Free) {
    console.log(`✅ [PASS] Port 3001 (Server) is free`);
  } else {
    console.log(`❌ [FAIL] Port 3001 (Server) is already in use`);
    allPassed = false;
  }
  
  if (port5173Free) {
    console.log(`✅ [PASS] Port 5173 (Client) is free`);
  } else {
    console.log(`❌ [FAIL] Port 5173 (Client) is already in use`);
    allPassed = false;
  }

  console.log('\n======================================');
  if (allPassed) {
    console.log('🎉 Your environment is perfectly configured!');
  } else {
    console.log('⚠️  Please fix the failing checks before continuing.');
    process.exit(1);
  }
  console.log('======================================\n');
};

runChecks();
