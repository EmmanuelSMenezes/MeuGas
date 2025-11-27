$registry = "registry.digitalocean.com/botpaporegistry"

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

Write-Host "=== Construindo Microservicos ===" -ForegroundColor Cyan

foreach ($ms in $microservices) {
    $imageName = $ms.ToLower() -replace "_", "-"
    Write-Host "`nConstruindo $ms -> $imageName..." -ForegroundColor Yellow

    docker build -t "${registry}/${imageName}:latest" -f "$ms/Dockerfile" $ms
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "OK: $ms" -ForegroundColor Green
    } else {
        Write-Host "ERRO: $ms" -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n=== Construindo Web Apps ===" -ForegroundColor Cyan

# Admin Web
Write-Host "`nConstruindo Admin Web..." -ForegroundColor Yellow
Set-Location PAM_AdminWeb
npm run build
if ($LASTEXITCODE -eq 0) {
    Set-Location ..
    docker build -t "$registry/admin-web:latest" -f PAM_AdminWeb/Dockerfile PAM_AdminWeb
    if ($LASTEXITCODE -eq 0) {
        Write-Host "OK: Admin Web" -ForegroundColor Green
    } else {
        Write-Host "ERRO: Admin Web Docker" -ForegroundColor Red
        Set-Location ..
        exit 1
    }
} else {
    Write-Host "ERRO: Admin Web Build" -ForegroundColor Red
    Set-Location ..
    exit 1
}

# Partner Web
Write-Host "`nConstruindo Partner Web..." -ForegroundColor Yellow
Set-Location PAM_PartnerWeb
npm run build
if ($LASTEXITCODE -eq 0) {
    Set-Location ..
    docker build -t "$registry/partner-web:latest" -f PAM_PartnerWeb/Dockerfile PAM_PartnerWeb
    if ($LASTEXITCODE -eq 0) {
        Write-Host "OK: Partner Web" -ForegroundColor Green
    } else {
        Write-Host "ERRO: Partner Web Docker" -ForegroundColor Red
        Set-Location ..
        exit 1
    }
} else {
    Write-Host "ERRO: Partner Web Build" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Write-Host "`n=== Fazendo Push para Registry ===" -ForegroundColor Cyan

foreach ($ms in $microservices) {
    $imageName = $ms.ToLower() -replace "_", "-"
    Write-Host "`nPush $imageName..." -ForegroundColor Yellow
    docker push "${registry}/${imageName}:latest"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "OK: $imageName" -ForegroundColor Green
    } else {
        Write-Host "ERRO: $imageName" -ForegroundColor Red
    }
}

Write-Host "`nPush admin-web..." -ForegroundColor Yellow
docker push "$registry/admin-web:latest"

Write-Host "`nPush partner-web..." -ForegroundColor Yellow
docker push "$registry/partner-web:latest"

Write-Host "`n=== CONCLUIDO ===" -ForegroundColor Green
Write-Host "Todas as imagens foram construidas e enviadas para o registry!" -ForegroundColor Green

