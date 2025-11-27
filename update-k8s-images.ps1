#!/usr/bin/env pwsh

Write-Host "=== Atualizando imagens do Kubernetes para usar o Registry ===" -ForegroundColor Cyan

$registry = "registry.digitalocean.com/botpaporegistry"

$files = @(
    "k8s/06-microservices.yaml",
    "k8s/07-microservices-part2.yaml",
    "k8s/08-microservices-part3.yaml",
    "k8s/09-microservices-part4.yaml",
    "k8s/10-web-apps.yaml"
)

foreach ($file in $files) {
    Write-Host "Atualizando $file..." -ForegroundColor Yellow
    
    $content = Get-Content $file -Raw
    
    # Substituir image: pam/ms-* por registry.digitalocean.com/botpaporegistry/ms-*
    $content = $content -replace 'image: pam/ms-', "image: $registry/ms-"
    
    # Substituir image: pam/admin-web por registry.digitalocean.com/botpaporegistry/admin-web
    $content = $content -replace 'image: pam/admin-web', "image: $registry/admin-web"
    
    # Substituir image: pam/partner-web por registry.digitalocean.com/botpaporegistry/partner-web
    $content = $content -replace 'image: pam/partner-web', "image: $registry/partner-web"
    
    # Substituir imagePullPolicy: Never por imagePullPolicy: Always
    $content = $content -replace 'imagePullPolicy: Never', 'imagePullPolicy: Always'
    
    Set-Content -Path $file -Value $content -Encoding UTF8
    Write-Host "OK: $file" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== CONCLUIDO ===" -ForegroundColor Green
Write-Host "Todos os manifestos foram atualizados para usar o registry!" -ForegroundColor Green

