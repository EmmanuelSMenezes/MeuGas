Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  BUILD SEQUENCIAL DOS SERVIÇOS PAM" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Este script vai construir os serviços um por vez" -ForegroundColor Gray
Write-Host "para evitar sobrecarga do sistema." -ForegroundColor Gray
Write-Host ""

$services = @(
    "ms-authentication",
    "ms-consumer",
    "ms-partner",
    "ms-catalog",
    "ms-order",
    "ms-billing",
    "ms-logistics",
    "ms-communication",
    "ms-report",
    "ms-storage",
    "ms-reputation",
    "ms-offer",
    "admin-web",
    "partner-web"
)

$totalServices = $services.Count
$currentService = 0
$failedServices = @()

foreach ($service in $services) {
    $currentService++
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host "  [$currentService/$totalServices] Construindo $service..." -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Yellow
    
    docker compose build $service
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   [OK] $service construído com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "   [ERRO] Falha ao construir $service!" -ForegroundColor Red
        $failedServices += $service
    }
    
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RESUMO DO BUILD" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($failedServices.Count -eq 0) {
    Write-Host "[OK] Todos os $totalServices serviços foram construídos com sucesso!" -ForegroundColor Green
    Write-Host ""
    
    Write-Host ">> Iniciando todos os containers..." -ForegroundColor Yellow
    docker compose up -d
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  TODOS OS SERVIÇOS INICIADOS!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        
        Write-Host ">> Status dos containers:" -ForegroundColor Cyan
        docker compose ps
        
        Write-Host ""
        Write-Host ">> URLs dos serviços:" -ForegroundColor Cyan
        Write-Host "   MS_Authentication:  http://localhost:9001" -ForegroundColor White
        Write-Host "   MS_Consumer:        http://localhost:9002" -ForegroundColor White
        Write-Host "   MS_Partner:         http://localhost:9003" -ForegroundColor White
        Write-Host "   MS_Catalog:         http://localhost:9004" -ForegroundColor White
        Write-Host "   MS_Order:           http://localhost:9005" -ForegroundColor White
        Write-Host "   MS_Billing:         http://localhost:9006" -ForegroundColor White
        Write-Host "   MS_Logistics:       http://localhost:9007" -ForegroundColor White
        Write-Host "   MS_Communication:   http://localhost:9008" -ForegroundColor White
        Write-Host "   MS_Report:          http://localhost:9009" -ForegroundColor White
        Write-Host "   MS_Storage:         http://localhost:9010" -ForegroundColor White
        Write-Host "   MS_Reputation:      http://localhost:9011" -ForegroundColor White
        Write-Host "   MS_Offer:           http://localhost:9012" -ForegroundColor White
        Write-Host ""
        Write-Host "   Admin Web:          http://localhost:9026" -ForegroundColor White
        Write-Host "   Partner Web:        http://localhost:9028" -ForegroundColor White
        Write-Host ""
        Write-Host "   API Swagger:        http://localhost:9001/swagger" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "[ERRO] Falha ao iniciar os containers!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "[ERRO] $($failedServices.Count) serviço(s) falharam no build:" -ForegroundColor Red
    foreach ($service in $failedServices) {
        Write-Host "   - $service" -ForegroundColor Red
    }
    Write-Host ""
    exit 1
}

