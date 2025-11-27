Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PAM - INICIANDO DOCKER E BUILD" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se Docker Desktop está rodando
Write-Host ">> Verificando Docker Desktop..." -ForegroundColor Yellow

$dockerRunning = $false
try {
    docker ps 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        $dockerRunning = $true
        Write-Host "   [OK] Docker Desktop está rodando!" -ForegroundColor Green
    }
} catch {
    $dockerRunning = $false
}

if (-not $dockerRunning) {
    Write-Host "   [!] Docker Desktop não está rodando" -ForegroundColor Yellow
    Write-Host ""
    Write-Host ">> Iniciando Docker Desktop..." -ForegroundColor Yellow
    
    # Tentar iniciar Docker Desktop
    $dockerPath = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    
    if (Test-Path $dockerPath) {
        Start-Process $dockerPath
        Write-Host "   Docker Desktop iniciado!" -ForegroundColor Green
        Write-Host ""
        Write-Host ">> Aguardando Docker Desktop ficar pronto..." -ForegroundColor Yellow
        
        # Aguardar até Docker estar pronto (máximo 2 minutos)
        $timeout = 120
        $elapsed = 0
        $ready = $false
        
        while ($elapsed -lt $timeout -and -not $ready) {
            Start-Sleep -Seconds 5
            $elapsed += 5
            
            try {
                docker ps 2>&1 | Out-Null
                if ($LASTEXITCODE -eq 0) {
                    $ready = $true
                    Write-Host "   [OK] Docker Desktop está pronto!" -ForegroundColor Green
                }
            } catch {
                Write-Host "   Aguardando... ($elapsed segundos)" -ForegroundColor Gray
            }
        }
        
        if (-not $ready) {
            Write-Host ""
            Write-Host "========================================" -ForegroundColor Red
            Write-Host "  TIMEOUT!" -ForegroundColor Red
            Write-Host "========================================" -ForegroundColor Red
            Write-Host ""
            Write-Host "Docker Desktop demorou muito para iniciar." -ForegroundColor Yellow
            Write-Host "Por favor, aguarde o Docker Desktop iniciar completamente e execute novamente." -ForegroundColor Yellow
            exit 1
        }
    } else {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Red
        Write-Host "  ERRO: Docker Desktop não encontrado!" -ForegroundColor Red
        Write-Host "========================================" -ForegroundColor Red
        Write-Host ""
        Write-Host "Por favor, instale o Docker Desktop:" -ForegroundColor Yellow
        Write-Host "https://www.docker.com/products/docker-desktop" -ForegroundColor Cyan
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  INICIANDO BUILD DAS IMAGENS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Build com Docker Compose
Write-Host ">> Executando: docker compose build --parallel" -ForegroundColor Yellow
Write-Host "   (Isso pode levar 10-20 minutos na primeira vez)" -ForegroundColor Gray
Write-Host ""

docker compose build --parallel

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  BUILD COMPLETO COM SUCESSO!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host ">> Iniciando containers..." -ForegroundColor Yellow
    Write-Host ""
    
    docker compose up -d
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  TODOS OS SERVICOS INICIADOS!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Aguardando servicos ficarem prontos..." -ForegroundColor Yellow
        Start-Sleep -Seconds 30
        Write-Host ""
        
        # Mostrar status
        docker compose ps
        
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "  SERVICOS DISPONIVEIS:" -ForegroundColor Cyan
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "  MS_Authentication:  http://localhost:9001" -ForegroundColor White
        Write-Host "  MS_Consumer:        http://localhost:9002" -ForegroundColor White
        Write-Host "  MS_Partner:         http://localhost:9003" -ForegroundColor White
        Write-Host "  MS_Catalog:         http://localhost:9004" -ForegroundColor White
        Write-Host "  MS_Order:           http://localhost:9005" -ForegroundColor White
        Write-Host "  MS_Billing:         http://localhost:9006" -ForegroundColor White
        Write-Host "  MS_Logistics:       http://localhost:9007" -ForegroundColor White
        Write-Host "  MS_Communication:   http://localhost:9008" -ForegroundColor White
        Write-Host "  MS_Report:          http://localhost:9009" -ForegroundColor White
        Write-Host "  MS_Storage:         http://localhost:9010" -ForegroundColor White
        Write-Host "  MS_Reputation:      http://localhost:9011" -ForegroundColor White
        Write-Host "  MS_Offer:           http://localhost:9012" -ForegroundColor White
        Write-Host ""
        Write-Host "  Admin Web:          http://localhost:9026" -ForegroundColor Cyan
        Write-Host "  Partner Web:        http://localhost:9028" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "  API Swagger:        http://localhost:9001/swagger" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
    }
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  ERRO NO BUILD!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Verifique os logs acima para detalhes do erro." -ForegroundColor Yellow
}

