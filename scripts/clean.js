import fs from 'fs';
import path from 'path';

console.log('\n🧹 Starting CareConnect Cleanup...\n');

const dirsToClean = [
  'node_modules',
  'dist',
  'server/node_modules',
  'server/dist',
  'server/coverage'
];

dirsToClean.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    try {
      console.log(`> Removing ${dir}...`);
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`✅ Removed ${dir}`);
    } catch (err) {
      console.error(`❌ Failed to remove ${dir}: ${err.message}`);
    }
  } else {
    console.log(`ℹ️  Skipped ${dir} (Not found)`);
  }
});

console.log('\n✅ Cleanup completed successfully!\n');
