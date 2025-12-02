@echo off
echo ====================================
echo 90-DAY HABIT TRACKER - QUICK START
echo ====================================
echo.

echo [1/2] Starting Backend Server...
cd backend
start cmd /k "npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo [2/2] Starting Frontend Application...
cd ../frontend
start cmd /k "npm start"

echo.
echo ====================================
echo ✅ Application Starting!
echo ====================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to close this window...
pause >nul
