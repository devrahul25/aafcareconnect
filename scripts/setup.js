import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('\n🚀 Starting CareConnect Setup...\n');

const runCommand = (command, cwd = process.cwd()) => {
  try {
    console.log(`> Running: ${command}`);
    execSync(command, { stdio: 'inherit', cwd });
  } catch (error) {
    console.error(`\n❌ Command failed: ${command}\n`);
    process.exit(1);
  }
};

const serverDir = path.join(process.cwd(), 'server');
const envPath = path.join(serverDir, '.env');
const envExamplePath = path.join(serverDir, '.env.example');

// 1. Check and copy .env
console.log('📄 Checking environment variables...');
if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env from .env.example in server directory.');
    console.log('⚠️  Please review server/.env and add your secrets before starting the app.\n');
  } else {
    console.log('⚠️  No .env.example found. Skipping .env creation.');
  }
} else {
  console.log('✅ .env already exists.');
}

// 2. Install dependencies
console.log('\n📦 Installing dependencies...');
runCommand('npm run install:all');

// 3. Database setup
console.log('\n🗄️  Setting up the database...');
runCommand('npm run migrate --prefix server');
runCommand('npm run seed --prefix server');

console.log('\n✅ Setup completed successfully!');
console.log('\nYou can now start the application with:');
console.log('  npm run dev\n');
