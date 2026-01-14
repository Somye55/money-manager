@echo off
echo ========================================
echo Testing Groq Server Connection
echo ========================================
echo.

echo Testing server health endpoint...
curl -s http://localhost:3000/health
echo.
echo.

echo Testing Groq OCR endpoint...
curl -X POST http://localhost:3000/api/ocr/parse -H "Content-Type: application/json" -d "{\"text\":\"Paid Rs.500 to Zomato\"}"
echo.
echo.

echo ========================================
echo If you see JSON responses above, server is working!
echo ========================================
pause
