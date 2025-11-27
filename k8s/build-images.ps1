#!/usr/bin/env pwsh
# Script para construir todas as imagens Docker para Kubernetes

Write-Host "🔨 Construindo imagens Docker para Kubernetes..." -ForegroundColor Cyan

# Microserviços .NET
$microservices = @(
    "MS_Authentication",
    "MS_Billing",
    "MS_Catalog",
    "MS_Communication",
    "MS_Consumer",
    "MS_Logistics",
    "MS_Offer",
    "MS_Order",
    "MS_Partner",
    "MS_Report",
    "MS_Reputation",
    "MS_Storage"
)

foreach ($ms in $microservices) {
    $imageName = $ms.ToLower().Replace("_", "-")
    Write-Host "`n📦 Construindo $imageName..." -ForegroundColor Yellow
    
    docker build -t "pam/$imageName:latest" -f "$ms/WebApi/Dockerfile" "$ms"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ $imageName construído com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro ao construir $imageName" -ForegroundColor Red
        exit 1
    }
}

# Admin Web
Write-Host "`n📦 Construindo admin-web..." -ForegroundColor Yellow
Set-Location PAM_AdminWeb
npm run build
if ($LASTEXITCODE -eq 0) {
    Set-Location ..
    docker build -t "pam/admin-web:latest" -f "PAM_AdminWeb/Dockerfile" "PAM_AdminWeb"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ admin-web construído com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro ao construir admin-web" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ Erro ao fazer build do Next.js (admin-web)" -ForegroundColor Red
    Set-Location ..
    exit 1
}

# Partner Web
Write-Host "`n📦 Construindo partner-web..." -ForegroundColor Yellow
Set-Location PAM_PartnerWeb
npm run build
if ($LASTEXITCODE -eq 0) {
    Set-Location ..
    docker build -t "pam/partner-web:latest" -f "PAM_PartnerWeb/Dockerfile" "PAM_PartnerWeb"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ partner-web construído com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro ao construir partner-web" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ Erro ao fazer build do Next.js (partner-web)" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Write-Host "`n✅ Todas as imagens foram construídas com sucesso!" -ForegroundColor Green
Write-Host "`n📋 Imagens criadas:" -ForegroundColor Cyan
docker images | Select-String "pam/"

