@echo off
echo ===================================================
echo   Starting GlobeTrotter Travel Planning Platform   
echo ===================================================

echo [1/2] Launching Backend API on port 5000...
start "GlobeTrotter Backend" cmd /k "cd /d %~dp0backend && npm install && npm run seed && npm start"

echo [2/2] Launching Frontend on port 5173...
start "GlobeTrotter Frontend" cmd /k "cd /d %~dp0frontend && npm install && npm run dev"

echo.
echo ===================================================
echo   Both servers launched!
echo   Open http://localhost:5173 in your browser
echo ===================================================
