#!/usr/bin/env pwsh
# Script para fazer push das imagens para um registry

param(
    [Parameter(Mandatory=$true)]
    [string]$Registry = "registry.digitalocean.com/seu-registry"
)

Write-Host "📤 Fazendo push das imagens para $Registry" -ForegroundColor Cyan

# Lista de serviços
$services = @(
    "ms-authentication",
    "ms-billing",
    "ms-catalog",
    "ms-communication",
    "ms-consumer",
    "ms-logistics",
    "ms-offer",
    "ms-order",
    "ms-partner",
    "ms-report",
    "ms-reputation",
    "ms-storage",
    "admin-web",
    "partner-web"
)

foreach ($service in $services) {
    Write-Host "`n📦 Processando $service..." -ForegroundColor Yellow
    
    # Tag para o registry
    $localImage = "pam/${service}:latest"
    $remoteImage = "${Registry}/${service}:latest"
    
    Write-Host "  🏷️  Tagging: $localImage -> $remoteImage" -ForegroundColor Cyan
    docker tag $localImage $remoteImage
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ❌ Erro ao fazer tag de $service" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "  📤 Pushing: $remoteImage" -ForegroundColor Cyan
    docker push $remoteImage
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ $service enviado com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Erro ao fazer push de $service" -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n✅ Todas as imagens foram enviadas para $Registry!" -ForegroundColor Green
Write-Host "`n📝 Próximo passo: Atualizar os manifestos Kubernetes para usar $Registry" -ForegroundColor Yellow
Write-Host "   Substitua 'imagePullPolicy: Never' por 'imagePullPolicy: Always'" -ForegroundColor Yellow
Write-Host "   Substitua 'image: pam/<service>:latest' por 'image: $Registry/<service>:latest'" -ForegroundColor Yellow

