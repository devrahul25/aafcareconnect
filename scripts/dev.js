import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function startServers() {
    console.log('🔧 Starting development servers...\n');

    try {
        // Kill processes on specific ports and Prisma-related processes
        console.log('📍 Cleaning up existing processes...');
        try {
            if (process.platform === 'win32') {
                // Kill all node.exe, tsx.exe, and vite-related processes
                const processesToKill = ['node.exe', 'tsx.exe'];

                for (const proc of processesToKill) {
                    try {
                        execSync(`taskkill /F /IM ${proc} /T 2>nul`, { stdio: 'ignore' });
                    } catch (e) {
                        // Process not found
                    }
                }

                // Also kill processes by port as backup
                const killPort = (port) => {
                    try {
                        execSync(
                            `powershell -Command "Get-NetTCPConnection -LocalPort ${port} -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }"`,
                            { stdio: 'ignore' }
                        );
                    } catch (e) {
                        // Port not in use
                    }
                };
                killPort(3001); // Backend
                killPort(5173); // Frontend
                killPort(5174); // Frontend alternate
            } else {
                // Unix-based systems
                execSync('pkill -f "node|tsx|vite" || true', { stdio: 'ignore' });
                execSync('lsof -ti:3001 | xargs kill -9 2>/dev/null || true', { stdio: 'ignore' });
                execSync('lsof -ti:5173 | xargs kill -9 2>/dev/null || true', { stdio: 'ignore' });
            }
            console.log('✓ Cleanup complete\n');
        } catch (e) {
            console.log('✓ No processes to clean up\n');
        }

        // Wait longer for Prisma DLL to be released
        console.log('⏳ Waiting for file locks to be released...\n');
        await sleep(3000);

        console.log('🚀 Starting servers with concurrently...\n');

        // Start the servers
        const command = process.platform === 'win32'
            ? 'npm.cmd run dev:both'
            : 'npm run dev:both';

        execSync(command, {
            stdio: 'inherit',
            cwd: dirname(__dirname)
        });

    } catch (error) {
        console.error('❌ Failed to start servers:', error.message);
        process.exit(1);
    }
}

startServers();
