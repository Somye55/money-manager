@echo off
echo ========================================
echo Windows Firewall Configuration
echo ========================================
echo.
echo This script will allow Node.js to accept connections on port 3000
echo You may need to run this as Administrator
echo.
pause

echo Adding firewall rule for Node.js...
netsh advfirewall firewall add rule name="Node.js OCR Server" dir=in action=allow protocol=TCP localport=3000

if %errorlevel% equ 0 (
    echo.
    echo ✅ Firewall rule added successfully!
    echo Your phone should now be able to connect to the server
) else (
    echo.
    echo ❌ Failed to add firewall rule
    echo Please run this script as Administrator:
    echo Right-click on setup-firewall.bat and select "Run as administrator"
)

echo.
pause
