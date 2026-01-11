@echo off
echo ========================================
echo 🔧 Granting Overlay Permission
echo ========================================
echo.

echo Granting SYSTEM_ALERT_WINDOW permission...
adb shell appops set com.moneymanager.app SYSTEM_ALERT_WINDOW allow

echo.
echo Verifying permission...
adb shell appops get com.moneymanager.app SYSTEM_ALERT_WINDOW

echo.
echo ========================================
echo ✅ Permission granted!
echo ========================================
echo.
echo Now share a screenshot again to test.
echo.
pause
