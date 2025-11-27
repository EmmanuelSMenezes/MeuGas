# Script para verificar saúde de todos os serviços PAM
# Autor: Emmanuel Menezes
# Data: 2025-11-03

$ErrorActionPreference = "Continue"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PAM - HEALTH CHECK" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configurações dos serviços - Portas no range 9000
$services = @(
    @{ Name = "MS_Authentication"; Port = 9001; Type = "API" }
    @{ Name = "MS_Consumer"; Port = 9002; Type = "API" }
    @{ Name = "MS_Partner"; Port = 9003; Type = "API" }
    @{ Name = "MS_Catalog"; Port = 9004; Type = "API" }
    @{ Name = "MS_Order"; Port = 9005; Type = "API" }
    @{ Name = "MS_Billing"; Port = 9006; Type = "API" }
    @{ Name = "MS_Logistics"; Port = 9007; Type = "API" }
    @{ Name = "MS_Communication"; Port = 9008; Type = "API" }
    @{ Name = "MS_Report"; Port = 9009; Type = "API" }
    @{ Name = "MS_Storage"; Port = 9010; Type = "API" }
    @{ Name = "MS_Reputation"; Port = 9011; Type = "API" }
    @{ Name = "MS_Offer"; Port = 9012; Type = "API" }
    @{ Name = "PAM_AdminWeb"; Port = 9026; Type = "WEB" }
    @{ Name = "PAM_PartnerWeb"; Port = 9028; Type = "WEB" }
)

$healthyCount = 0
$unhealthyCount = 0
$results = @()

foreach ($service in $services) {
    Write-Host "🔍 Verificando $($service.Name)..." -ForegroundColor Cyan
    
    $status = @{
        Name = $service.Name
        Port = $service.Port
        Type = $service.Type
        PortOpen = $false
        HttpResponding = $false
        HealthEndpoint = $false
        Status = "❌ OFFLINE"
        Color = "Red"
    }
    
    # Verificar se a porta está aberta
    try {
        $connection = Get-NetTCPConnection -LocalPort $service.Port -ErrorAction SilentlyContinue
        if ($connection) {
            $status.PortOpen = $true
            Write-Host "  ✅ Porta $($service.Port) está aberta" -ForegroundColor Green
        } else {
            Write-Host "  ❌ Porta $($service.Port) não está em uso" -ForegroundColor Red
        }
    }
    catch {
        Write-Host "  ❌ Erro ao verificar porta: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # Verificar se responde HTTP
    if ($status.PortOpen) {
        try {
            $url = "http://localhost:$($service.Port)"
            $response = Invoke-WebRequest -Uri $url -TimeoutSec 5 -UseBasicParsing -ErrorAction SilentlyContinue
            
            if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 404) {
                $status.HttpResponding = $true
                Write-Host "  ✅ Servidor HTTP respondendo" -ForegroundColor Green
            }
        }
        catch {
            Write-Host "  ⚠️  Servidor HTTP não respondeu" -ForegroundColor Yellow
        }
    }
    
    # Verificar endpoint de health (apenas para APIs)
    if ($service.Type -eq "API" -and $status.PortOpen) {
        try {
            $healthUrl = "http://localhost:$($service.Port)/health"
            $healthResponse = Invoke-WebRequest -Uri $healthUrl -TimeoutSec 5 -UseBasicParsing -ErrorAction SilentlyContinue
            
            if ($healthResponse.StatusCode -eq 200) {
                $status.HealthEndpoint = $true
                Write-Host "  ✅ Health endpoint OK" -ForegroundColor Green
            }
        }
        catch {
            Write-Host "  ⚠️  Health endpoint não disponível" -ForegroundColor Yellow
        }
    }
    
    # Determinar status final
    if ($service.Type -eq "API") {
        if ($status.PortOpen -and $status.HttpResponding -and $status.HealthEndpoint) {
            $status.Status = "✅ HEALTHY"
            $status.Color = "Green"
            $healthyCount++
        } elseif ($status.PortOpen -and $status.HttpResponding) {
            $status.Status = "⚠️  DEGRADED"
            $status.Color = "Yellow"
            $unhealthyCount++
        } else {
            $status.Status = "❌ OFFLINE"
            $status.Color = "Red"
            $unhealthyCount++
        }
    } else {
        # Para aplicações web
        if ($status.PortOpen -and $status.HttpResponding) {
            $status.Status = "✅ ONLINE"
            $status.Color = "Green"
            $healthyCount++
        } else {
            $status.Status = "❌ OFFLINE"
            $status.Color = "Red"
            $unhealthyCount++
        }
    }
    
    Write-Host "  Status: $($status.Status)" -ForegroundColor $status.Color
    Write-Host ""
    
    $results += $status
}

# ========================================
# RESUMO FINAL
# ========================================
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  📊 RESUMO DO HEALTH CHECK" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "🔧 MICROSERVIÇOS .NET:" -ForegroundColor White
Write-Host ""
foreach ($result in ($results | Where-Object { $_.Type -eq "API" })) {
    Write-Host "  $($result.Status) $($result.Name) - http://localhost:$($result.Port)" -ForegroundColor $result.Color
}

Write-Host ""
Write-Host "🌐 APLICAÇÕES WEB:" -ForegroundColor White
Write-Host ""
foreach ($result in ($results | Where-Object { $_.Type -eq "WEB" })) {
    Write-Host "  $($result.Status) $($result.Name) - http://localhost:$($result.Port)" -ForegroundColor $result.Color
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  ✅ Serviços Saudáveis: $healthyCount" -ForegroundColor Green
Write-Host "  ❌ Serviços com Problemas: $unhealthyCount" -ForegroundColor Red
Write-Host ""

$totalServices = $services.Count
$healthPercentage = [math]::Round(($healthyCount / $totalServices) * 100, 2)

if ($healthPercentage -eq 100) {
    Write-Host "  🎉 SISTEMA 100% OPERACIONAL!" -ForegroundColor Green
} elseif ($healthPercentage -ge 80) {
    Write-Host "  ⚠️  Sistema parcialmente operacional ($healthPercentage%)" -ForegroundColor Yellow
} else {
    Write-Host "  ❌ Sistema com problemas críticos ($healthPercentage%)" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 LINKS ÚTEIS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  📊 Admin Dashboard: http://localhost:9026" -ForegroundColor White
Write-Host "  🏢 Partner Portal: http://localhost:9028" -ForegroundColor White
Write-Host "  📖 API Docs (Auth): http://localhost:9001/swagger" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
