@echo off
echo ========================================
echo   PAM - INICIANDO CONTAINERS
echo ========================================
echo.

docker compose up -d

echo.
echo Aguardando servicos iniciarem...
timeout /t 30 /nobreak

echo.
echo ========================================
echo   VERIFICANDO STATUS
echo ========================================
echo.

docker compose ps

echo.
echo ========================================
echo   SERVICOS DISPONIVEIS:
echo ========================================
echo.
echo   MS_Authentication:  http://localhost:9001
echo   MS_Consumer:        http://localhost:9002
echo   MS_Partner:         http://localhost:9003
echo   MS_Catalog:         http://localhost:9004
echo   MS_Order:           http://localhost:9005
echo   MS_Billing:         http://localhost:9006
echo   MS_Logistics:       http://localhost:9007
echo   MS_Communication:   http://localhost:9008
echo   MS_Report:          http://localhost:9009
echo   MS_Storage:         http://localhost:9010
echo   MS_Reputation:      http://localhost:9011
echo   MS_Offer:           http://localhost:9012
echo   Admin Web:          http://localhost:9026
echo   Partner Web:        http://localhost:9028
echo.
echo ========================================
pause
