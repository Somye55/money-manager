@echo off
echo ========================================
echo Testing Server Connection
echo ========================================
echo.
echo Testing if server is accessible at http://10.5.48.113:3000
echo.

cd server

:: Start server temporarily
echo Starting server...
start "Test Server" cmd /k "npm run dev"

timeout /t 5 /nobreak >nul

echo.
echo Testing connection...
curl -X POST http://10.5.48.113:3000/api/ocr/parse -H "Content-Type: application/json" -d "{\"text\":\"Test transaction Rs 100\"}"

echo.
echo.
echo If you see a JSON response above, the server is working!
echo If you see "Connection refused" or timeout, check:
echo   1. Server is running (check the Test Server window)
echo   2. Windows Firewall (run setup-firewall.bat as admin)
echo   3. Your antivirus isn't blocking the connection
echo.
pause
