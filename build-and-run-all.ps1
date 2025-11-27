# Script para fazer build e subir todo o sistema PAM
# Autor: Emmanuel Menezes
# Data: 2025-11-03

$ErrorActionPreference = "Continue"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PAM - BUILD E START COMPLETO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configurações - Portas no range 9000
$microservices = @(
    @{ Name = "MS_Authentication"; Port = 9001; Dir = "MS_Authentication" }
    @{ Name = "MS_Consumer"; Port = 9002; Dir = "MS_Consumer" }
    @{ Name = "MS_Partner"; Port = 9003; Dir = "MS_Partner" }
    @{ Name = "MS_Catalog"; Port = 9004; Dir = "MS_Catalog" }
    @{ Name = "MS_Order"; Port = 9005; Dir = "MS_Order" }
    @{ Name = "MS_Billing"; Port = 9006; Dir = "MS_Billing" }
    @{ Name = "MS_Logistics"; Port = 9007; Dir = "MS_Logistics" }
    @{ Name = "MS_Communication"; Port = 9008; Dir = "MS_Communication" }
    @{ Name = "MS_Report"; Port = 9009; Dir = "MS_Report" }
    @{ Name = "MS_Storage"; Port = 9010; Dir = "MS_Storage" }
    @{ Name = "MS_Reputation"; Port = 9011; Dir = "MS_Reputation" }
    @{ Name = "MS_Offer"; Port = 9012; Dir = "MS_Offer" }
)

$webApps = @(
    @{ Name = "PAM_AdminWeb"; Port = 9026; Dir = "PAM_AdminWeb" }
    @{ Name = "PAM_PartnerWeb"; Port = 9028; Dir = "PAM_PartnerWeb" }
)

# Função para verificar se porta está em uso
function Test-PortInUse {
    param([int]$Port)
    $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    return $null -ne $connection
}

# Função para matar processo na porta
function Stop-ProcessOnPort {
    param([int]$Port)
    $process = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
    if ($process) {
        Write-Host "  Parando processo na porta $Port..." -ForegroundColor Yellow
        Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
    }
}

# ========================================
# ETAPA 1: BUILD DOS MICROSERVIÇOS .NET
# ========================================
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ETAPA 1: BUILD MICROSERVIÇOS .NET" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

$buildSuccess = 0
$buildErrors = 0

foreach ($ms in $microservices) {
    Write-Host "🔧 Building $($ms.Name)..." -ForegroundColor Cyan
    
    if (Test-Path $ms.Dir) {
        Push-Location $ms.Dir
        
        try {
            # Restaurar dependências
            Write-Host "  📦 Restaurando dependências..." -ForegroundColor Gray
            dotnet restore --verbosity quiet 2>&1 | Out-Null
            
            # Build
            Write-Host "  🔨 Compilando..." -ForegroundColor Gray
            $buildOutput = dotnet build --configuration Release --no-restore --verbosity quiet 2>&1
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "  ✅ Build concluído com sucesso!" -ForegroundColor Green
                $buildSuccess++
            } else {
                Write-Host "  ❌ Erro no build!" -ForegroundColor Red
                Write-Host $buildOutput -ForegroundColor Red
                $buildErrors++
            }
        }
        catch {
            Write-Host "  ❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
            $buildErrors++
        }
        finally {
            Pop-Location
        }
    } else {
        Write-Host "  ❌ Diretório não encontrado: $($ms.Dir)" -ForegroundColor Red
        $buildErrors++
    }
    
    Write-Host ""
}

Write-Host "📊 Resumo Build Microserviços: ✅ $buildSuccess sucessos | ❌ $buildErrors erros" -ForegroundColor Cyan
Write-Host ""

# ========================================
# ETAPA 2: BUILD DAS APLICAÇÕES WEB
# ========================================
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ETAPA 2: BUILD APLICAÇÕES WEB" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

$webBuildSuccess = 0
$webBuildErrors = 0

foreach ($app in $webApps) {
    Write-Host "🌐 Building $($app.Name)..." -ForegroundColor Cyan
    
    if (Test-Path $app.Dir) {
        Push-Location $app.Dir
        
        try {
            # Verificar se node_modules existe
            if (-not (Test-Path "node_modules")) {
                Write-Host "  📦 Instalando dependências (primeira vez)..." -ForegroundColor Gray
                yarn install --silent 2>&1 | Out-Null
            }
            
            # Build
            Write-Host "  🔨 Compilando Next.js..." -ForegroundColor Gray
            $buildOutput = yarn build 2>&1
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "  ✅ Build concluído com sucesso!" -ForegroundColor Green
                $webBuildSuccess++
            } else {
                Write-Host "  ❌ Erro no build!" -ForegroundColor Red
                Write-Host $buildOutput -ForegroundColor Red
                $webBuildErrors++
            }
        }
        catch {
            Write-Host "  ❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
            $webBuildErrors++
        }
        finally {
            Pop-Location
        }
    } else {
        Write-Host "  ❌ Diretório não encontrado: $($app.Dir)" -ForegroundColor Red
        $webBuildErrors++
    }
    
    Write-Host ""
}

Write-Host "📊 Resumo Build Web Apps: ✅ $webBuildSuccess sucessos | ❌ $webBuildErrors erros" -ForegroundColor Cyan
Write-Host ""

# ========================================
# ETAPA 3: INICIAR MICROSERVIÇOS
# ========================================
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ETAPA 3: INICIANDO MICROSERVIÇOS" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

$runningServices = @()

foreach ($ms in $microservices) {
    Write-Host "🚀 Iniciando $($ms.Name) na porta $($ms.Port)..." -ForegroundColor Cyan
    
    # Verificar e liberar porta se necessário
    if (Test-PortInUse -Port $ms.Port) {
        Stop-ProcessOnPort -Port $ms.Port
    }
    
    if (Test-Path $ms.Dir) {
        Push-Location "$($ms.Dir)/WebApi"

        try {
            # Criar script temporário para iniciar com variável de ambiente
            $startScript = @"
`$env:ASPNETCORE_URLS = "http://localhost:$($ms.Port)"
dotnet run --no-build --configuration Release
"@
            $scriptPath = "start_temp_$($ms.Port).ps1"
            $startScript | Out-File -FilePath $scriptPath -Encoding UTF8

            # Iniciar em background com porta customizada
            Write-Host "  ▶️  Executando dotnet run na porta $($ms.Port)..." -ForegroundColor Gray
            $process = Start-Process -FilePath "powershell" -ArgumentList "-ExecutionPolicy Bypass -File $scriptPath" -PassThru -WindowStyle Hidden

            # Aguardar um pouco para o serviço iniciar
            Start-Sleep -Seconds 5

            # Verificar se o processo ainda está rodando
            if (-not $process.HasExited) {
                Write-Host "  ✅ Serviço iniciado! PID: $($process.Id)" -ForegroundColor Green
                $runningServices += @{
                    Name = $ms.Name
                    Port = $ms.Port
                    PID = $process.Id
                    URL = "http://localhost:$($ms.Port)"
                    Swagger = "http://localhost:$($ms.Port)/swagger"
                }
            } else {
                Write-Host "  ❌ Serviço falhou ao iniciar!" -ForegroundColor Red
            }
        }
        catch {
            Write-Host "  ❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
        }
        finally {
            Pop-Location
        }
    }
    
    Write-Host ""
}

# ========================================
# ETAPA 4: INICIAR APLICAÇÕES WEB
# ========================================
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ETAPA 4: INICIANDO APLICAÇÕES WEB" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

foreach ($app in $webApps) {
    Write-Host "🌐 Iniciando $($app.Name) na porta $($app.Port)..." -ForegroundColor Cyan
    
    # Verificar e liberar porta se necessário
    if (Test-PortInUse -Port $app.Port) {
        Stop-ProcessOnPort -Port $app.Port
    }
    
    if (Test-Path $app.Dir) {
        Push-Location $app.Dir
        
        try {
            # Iniciar em background
            Write-Host "  ▶️  Executando yarn dev..." -ForegroundColor Gray
            $process = Start-Process -FilePath "yarn" -ArgumentList "dev" -PassThru -WindowStyle Hidden
            
            # Aguardar um pouco para o serviço iniciar
            Start-Sleep -Seconds 5
            
            # Verificar se o processo ainda está rodando
            if (-not $process.HasExited) {
                Write-Host "  ✅ Aplicação iniciada! PID: $($process.Id)" -ForegroundColor Green
                $runningServices += @{
                    Name = $app.Name
                    Port = $app.Port
                    PID = $process.Id
                    URL = "http://localhost:$($app.Port)"
                    Swagger = $null
                }
            } else {
                Write-Host "  ❌ Aplicação falhou ao iniciar!" -ForegroundColor Red
            }
        }
        catch {
            Write-Host "  ❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
        }
        finally {
            Pop-Location
        }
    }
    
    Write-Host ""
}

# ========================================
# RESUMO FINAL
# ========================================
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  🎉 SISTEMA PAM INICIADO!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📊 SERVIÇOS RODANDO ($($runningServices.Count)):" -ForegroundColor Green
Write-Host ""

foreach ($service in $runningServices) {
    Write-Host "  🟢 $($service.Name)" -ForegroundColor White
    Write-Host "     URL: $($service.URL)" -ForegroundColor Gray
    if ($service.Swagger) {
        Write-Host "     Swagger: $($service.Swagger)" -ForegroundColor Gray
    }
    Write-Host "     PID: $($service.PID)" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 DICAS:" -ForegroundColor Yellow
Write-Host "  • Para parar todos os serviços, execute: .\stop-all.ps1" -ForegroundColor White
Write-Host "  • Para ver logs, use: Get-Process -Id <PID>" -ForegroundColor White
Write-Host "  • Para health check: Invoke-WebRequest http://localhost:<PORT>/health" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
