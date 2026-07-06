Write-Host "Starting development servers..." -ForegroundColor Cyan
Write-Host ""

# Kill existing processes
Write-Host "Cleaning up existing processes..." -ForegroundColor Yellow

# Kill processes on ports 3001 and 5173
$ports = @(3001, 5173, 5174)
foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connections) {
        $connections | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object {
            Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue
        }
    }
}

Write-Host "Cleanup complete" -ForegroundColor Green
Write-Host ""

# Wait for file locks to be released
Write-Host "Waiting for file locks to be released..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
Write-Host ""

Write-Host "Starting servers with concurrently..." -ForegroundColor Cyan
Write-Host ""

# Start the servers
Set-Location $PSScriptRoot\..
npm run dev:both
