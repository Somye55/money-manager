@echo off
echo Adding firewall rule for Node.js server on port 3000...
netsh advfirewall firewall add rule name="Node.js Server Port 3000" dir=in action=allow protocol=TCP localport=3000
echo.
echo Firewall rule added successfully!
echo Your Android device can now connect to http://10.5.48.113:3000
pause
