Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TESTE DE BUILD DE UM ÚNICO SERVIÇO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Testar build do MS_Authentication
Write-Host ">> Testando build do MS_Authentication..." -ForegroundColor Yellow
Write-Host ""

docker compose build ms-authentication

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  BUILD CONCLUÍDO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

