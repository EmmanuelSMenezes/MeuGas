Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  REINICIANDO DOCKER E FAZENDO BUILD" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Parar Docker Desktop
Write-Host ">> Parando Docker Desktop..." -ForegroundColor Yellow
Get-Process "Docker Desktop" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 5

# Iniciar Docker Desktop
Write-Host ">> Iniciando Docker Desktop..." -ForegroundColor Yellow
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"

# Aguardar Docker iniciar
Write-Host ">> Aguardando Docker iniciar (até 120 segundos)..." -ForegroundColor Yellow
$timeout = 120
$elapsed = 0
$dockerReady = $false

while ($elapsed -lt $timeout) {
    try {
        $result = docker ps 2>&1
        if ($LASTEXITCODE -eq 0) {
            $dockerReady = $true
            Write-Host "   [OK] Docker está pronto!" -ForegroundColor Green
            break
        }
    } catch {
        # Ignorar erros
    }
    
    Start-Sleep -Seconds 5
    $elapsed += 5
    Write-Host "   Aguardando... ($elapsed/$timeout segundos)" -ForegroundColor Gray
}

if (-not $dockerReady) {
    Write-Host "   [ERRO] Docker não iniciou no tempo esperado!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host ">> Fazendo build dos serviços (SEM --no-cache e SEM --parallel)..." -ForegroundColor Yellow
Write-Host "   Isso vai usar o cache do Docker e construir um serviço por vez" -ForegroundColor Gray
Write-Host "   para evitar sobrecarga do sistema." -ForegroundColor Gray
Write-Host ""

# Build sem --no-cache e sem --parallel para usar cache e reduzir carga
docker compose build

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  BUILD CONCLUÍDO COM SUCESSO!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
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
    Write-Host ""
    Write-Host "[ERRO] Falha no build!" -ForegroundColor Red
    exit 1
}

