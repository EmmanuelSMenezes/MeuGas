@echo off
echo ========================================
echo   PAM - BUILD DOCKER IMAGES
echo ========================================
echo.

docker compose build --parallel

echo.
echo ========================================
echo   BUILD COMPLETO!
echo ========================================
pause
