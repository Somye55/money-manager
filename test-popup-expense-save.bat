@echo off
echo Testing popup expense saving functionality...
echo.

echo 1. Building and installing the app...
cd client
call npm run build
call npx cap sync android
call npx cap run android

echo.
echo 2. Check the Android logs for debugging:
echo    - Look for "OverlayService" logs
echo    - Look for "NotificationListenerPlugin" logs  
echo    - Look for "SMSContext" logs in browser console
echo    - Look for "DataContext" logs in browser console

echo.
echo 3. To test manually:
echo    - Trigger a notification popup
echo    - Select a category
echo    - Click "Save Expense"
echo    - Check if expense appears in the app

echo.
echo 4. Common issues to check:
echo    - User authentication status
echo    - Category mapping
echo    - Amount parsing
echo    - Database permissions
echo    - Network connectivity

pause