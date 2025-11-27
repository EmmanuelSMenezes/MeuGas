# Script simplificado para iniciar todos os serviços PAM
# Autor: Emmanuel Menezes
# Data: 2025-11-03

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PAM - INICIANDO TODOS OS SERVIÇOS" -ForegroundColor Cyan
Write-Host "  Portas: Range 9000" -ForegroundColor Cyan
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

Write-Host "🚀 INICIANDO MICROSERVIÇOS .NET..." -ForegroundColor Green
Write-Host ""

foreach ($ms in $microservices) {
    Write-Host "▶️  Iniciando $($ms.Name) na porta $($ms.Port)..." -ForegroundColor Cyan
    
    if (Test-Path "$($ms.Dir)/WebApi") {
        # Criar comando de start
        $command = "cd '$($ms.Dir)/WebApi'; `$env:ASPNETCORE_URLS='http://localhost:$($ms.Port)'; dotnet run --configuration Release"
        
        # Iniciar em nova janela do PowerShell
        Start-Process powershell -ArgumentList "-NoExit", "-Command", $command -WindowStyle Minimized
        
        Write-Host "   ✅ Iniciado em nova janela (porta $($ms.Port))" -ForegroundColor Green
        Start-Sleep -Seconds 1
    } else {
        Write-Host "   ❌ Diretório não encontrado: $($ms.Dir)/WebApi" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🌐 INICIANDO APLICAÇÕES WEB..." -ForegroundColor Green
Write-Host ""

foreach ($app in $webApps) {
    Write-Host "▶️  Iniciando $($app.Name) na porta $($app.Port)..." -ForegroundColor Cyan
    
    if (Test-Path $app.Dir) {
        # Criar comando de start
        $command = "cd '$($app.Dir)'; yarn dev"
        
        # Iniciar em nova janela do PowerShell
        Start-Process powershell -ArgumentList "-NoExit", "-Command", $command -WindowStyle Minimized
        
        Write-Host "   ✅ Iniciado em nova janela (porta $($app.Port))" -ForegroundColor Green
        Start-Sleep -Seconds 1
    } else {
        Write-Host "   ❌ Diretório não encontrado: $($app.Dir)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✅ TODOS OS SERVIÇOS FORAM INICIADOS!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "⏳ Aguardando serviços iniciarem (30 segundos)..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

Write-Host ""
Write-Host "🔍 Executando Health Check..." -ForegroundColor Cyan
Write-Host ""

# Executar health check
& .\health-check.ps1
