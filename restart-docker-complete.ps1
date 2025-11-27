Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  REINICIO COMPLETO DO DOCKER" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Passo 1: Parar todos os processos Docker
Write-Host ">> Parando todos os processos Docker..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like '*docker*'} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 10

# Passo 2: Iniciar Docker Desktop
Write-Host ">> Iniciando Docker Desktop..." -ForegroundColor Yellow
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
Start-Sleep -Seconds 20

# Passo 3: Aguardar Docker ficar pronto (até 3 minutos)
Write-Host ">> Aguardando Docker ficar pronto..." -ForegroundColor Yellow
$maxAttempts = 36  # 36 * 5 = 180 segundos = 3 minutos
$attempt = 0
$dockerReady = $false

while ($attempt -lt $maxAttempts -and -not $dockerReady) {
    $attempt++
    Write-Host "   Tentativa $attempt/$maxAttempts..." -ForegroundColor Gray
    
    try {
        $result = docker info 2>&1
        if ($LASTEXITCODE -eq 0) {
            $dockerReady = $true
            Write-Host "   [OK] Docker está pronto!" -ForegroundColor Green
        }
    } catch {
        # Ignorar erros
    }
    
    if (-not $dockerReady) {
        Start-Sleep -Seconds 5
    }
}

if (-not $dockerReady) {
    Write-Host "   [ERRO] Docker não ficou pronto após 3 minutos!" -ForegroundColor Red
    exit 1
}

# Passo 4: Parar containers antigos
Write-Host "" 
Write-Host ">> Parando containers antigos..." -ForegroundColor Yellow
docker compose down 2>&1 | Out-Null

# Passo 5: Fazer build sequencial
Write-Host ""
Write-Host ">> Iniciando build sequencial..." -ForegroundColor Yellow
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

$failedServices = @()
$successCount = 0

for ($i = 0; $i -lt $services.Length; $i++) {
    $service = $services[$i]
    $num = $i + 1
    
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  [$num/14] Construindo $service..." -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    
    docker compose build $service 2>&1 | Out-Host
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   [OK] $service construído com sucesso!" -ForegroundColor Green
        $successCount++
    } else {
        Write-Host "   [ERRO] Falha ao construir $service!" -ForegroundColor Red
        $failedServices += $service
    }
    
    Write-Host ""
}

# Passo 6: Resumo
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RESUMO DO BUILD" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($failedServices.Count -eq 0) {
    Write-Host "[OK] Todos os $successCount serviços foram construídos com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host ">> Iniciando todos os containers..." -ForegroundColor Yellow
    docker compose up -d
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "[OK] Todos os containers foram iniciados!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Aguarde 30 segundos para os serviços iniciarem completamente..." -ForegroundColor Yellow
        Start-Sleep -Seconds 30
        Write-Host ""
        Write-Host "Status dos containers:" -ForegroundColor Cyan
        docker compose ps
    }
} else {
    Write-Host "[ERRO] $($failedServices.Count) serviço(s) falharam no build:" -ForegroundColor Red
    foreach ($service in $failedServices) {
        Write-Host "   - $service" -ForegroundColor Red
    }
    exit 1
}

