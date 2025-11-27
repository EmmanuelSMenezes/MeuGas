# Script para testar um unico servico
# Autor: Emmanuel Menezes

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TESTANDO MS_Authentication" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$serviceName = "MS_Authentication"
$port = 9001

Write-Host ">> Fazendo build do $serviceName..." -ForegroundColor Yellow
cd $serviceName

# Restaurar dependencias
Write-Host "   Restaurando dependencias..." -ForegroundColor Gray
dotnet restore

# Build
Write-Host "   Compilando..." -ForegroundColor Gray
dotnet build --configuration Release

Write-Host ""
Write-Host ">> Iniciando servico na porta $port..." -ForegroundColor Yellow
cd WebApi

# Iniciar servico
$env:ASPNETCORE_URLS = "http://localhost:$port"
dotnet run --no-build --configuration Release
