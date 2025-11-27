#!/usr/bin/env pwsh

Write-Host "=== Reduzindo recursos e réplicas ===" -ForegroundColor Cyan

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
    
    # Reduzir réplicas de 2 para 1
    $content = $content -replace 'replicas: 2', 'replicas: 1'
    
    # Reduzir requests de memória de 256Mi para 128Mi
    $content = $content -replace 'memory: "256Mi"', 'memory: "128Mi"'
    
    # Reduzir limits de memória de 512Mi para 256Mi
    $content = $content -replace 'memory: "512Mi"', 'memory: "256Mi"'
    
    # Reduzir requests de CPU de 100m para 50m
    $content = $content -replace 'cpu: "100m"', 'cpu: "50m"'
    
    # Reduzir limits de CPU de 500m para 250m
    $content = $content -replace 'cpu: "500m"', 'cpu: "250m"'
    
    Set-Content -Path $file -Value $content -Encoding UTF8
    Write-Host "OK: $file" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== CONCLUIDO ===" -ForegroundColor Green
Write-Host "Recursos e réplicas reduzidos!" -ForegroundColor Green

