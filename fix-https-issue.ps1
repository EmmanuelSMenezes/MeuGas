Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CORRIGINDO PROBLEMA DE HTTPS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$microservices = @(
    "MS_Authentication",
    "MS_Consumer",
    "MS_Partner",
    "MS_Catalog",
    "MS_Order",
    "MS_Billing",
    "MS_Logistics",
    "MS_Communication",
    "MS_Report",
    "MS_Storage",
    "MS_Reputation",
    "MS_Offer"
)

Write-Host ">> Corrigindo Program.cs de todos os microserviços..." -ForegroundColor Yellow
Write-Host "   Removendo HTTPS e usando apenas HTTP na porta 80" -ForegroundColor Gray
Write-Host ""

foreach ($ms in $microservices) {
    $programPath = "$ms\WebApi\Program.cs"
    
    if (Test-Path $programPath) {
        Write-Host "   Corrigindo $ms..." -ForegroundColor Gray
        
        $content = Get-Content $programPath -Raw
        
        # Substituir a linha que configura URLs para usar apenas HTTP na porta 80
        $content = $content -replace '\.UseUrls\([^)]+\)', '.UseUrls("http://0.0.0.0:80")'
        
        Set-Content -Path $programPath -Value $content -NoNewline
        
        Write-Host "   [OK] $ms corrigido!" -ForegroundColor Green
    } else {
        Write-Host "   [AVISO] $programPath não encontrado!" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  CORREÇÃO CONCLUÍDA!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host ">> Parando containers..." -ForegroundColor Yellow
docker compose down

Write-Host ""
Write-Host ">> Reconstruindo imagens..." -ForegroundColor Yellow
docker compose build

Write-Host ""
Write-Host ">> Iniciando containers..." -ForegroundColor Yellow
docker compose up -d

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  SERVIÇOS REINICIADOS!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host ">> Aguardando 10 segundos para os serviços iniciarem..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host ">> Status dos containers:" -ForegroundColor Cyan
docker compose ps

Write-Host ""
Write-Host ">> Verificando logs do MS_Authentication:" -ForegroundColor Cyan
docker compose logs ms-authentication --tail=20

