Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RECONSTRUINDO SERVICOS COM TWILIO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Servicos que usam Twilio
$services = @(
    "ms-authentication",
    "ms-communication",
    "ms-consumer",
    "ms-logistics"
)

$successCount = 0
$errorCount = 0

foreach ($service in $services) {
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  Reconstruindo: $service" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    
    try {
        docker compose build --no-cache $service 2>&1 | Out-Host
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   [OK] $service reconstruido com sucesso!" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host "   [ERRO] Falha ao reconstruir $service" -ForegroundColor Red
            $errorCount++
        }
    }
    catch {
        Write-Host "   [ERRO] $($_.Exception.Message)" -ForegroundColor Red
        $errorCount++
    }
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RESUMO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Servicos reconstruidos: $successCount de $($services.Count)" -ForegroundColor $(if ($successCount -eq $services.Count) { "Green" } else { "Yellow" })
Write-Host ""

if ($successCount -eq $services.Count) {
    Write-Host "Iniciando todos os containers..." -ForegroundColor Yellow
    docker compose up -d 2>&1 | Out-Host
    
    Write-Host ""
    Write-Host "Aguardando 30 segundos para os servicos iniciarem..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30
    
    Write-Host ""
    Write-Host "Status dos containers:" -ForegroundColor Cyan
    docker compose ps 2>&1 | Out-Host
}

