Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  OTIMIZANDO DOCKERFILES" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$microservices = @(
    "MS_Authentication",
    "MS_Consumer",
    "MS_Partner",
    "MS_Catalog",
    "MS_Order",
    "MS_Billing",
    "MS_Logistics",
    "MS_Communication",
    "MS_Report",
    "MS_Storage",
    "MS_Reputation",
    "MS_Offer"
)

foreach ($ms in $microservices) {
    $dockerfilePath = "$ms\Dockerfile"
    
    if (Test-Path $dockerfilePath) {
        Write-Host ">> Otimizando $ms..." -ForegroundColor Yellow
        
        $content = Get-Content $dockerfilePath -Raw
        
        # Remove --self-contained true -r linux-x64 para acelerar o build
        $content = $content -replace '--self-contained true -r linux-x64', ''
        
        Set-Content -Path $dockerfilePath -Value $content -NoNewline
        
        Write-Host "   [OK] $ms otimizado!" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  DOCKERFILES OTIMIZADOS!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Agora o build será MUITO mais rápido!" -ForegroundColor Cyan
Write-Host "Execute: docker compose build --parallel" -ForegroundColor Yellow

