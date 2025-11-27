Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PAM - CORRIGINDO DOCKERFILES E BUILD" -ForegroundColor Cyan
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

# Corrigir Dockerfiles dos microserviços
foreach ($ms in $microservices) {
    $dockerfilePath = ".\$ms\Dockerfile"
    
    if (Test-Path $dockerfilePath) {
        Write-Host ">> Corrigindo Dockerfile de $ms..." -ForegroundColor Yellow
        
        $content = Get-Content $dockerfilePath -Raw
        
        # Remover variáveis de template e simplificar
        $content = $content -replace 'ENV ASPNETCORE_ENVIRONMENT=____cfg_aspnetcore_environment____', 'ENV ASPNETCORE_ENVIRONMENT=Development'
        $content = $content -replace 'ENV ASPNETCORE_URLS=https://\+:____cfg_https_port____;http://\+:____cfg_http_port____', 'ENV ASPNETCORE_URLS=http://+:80'
        $content = $content -replace 'ENV ASPNETCORE_Kestrel__Certificates__Default__Path=____cfg_certificate_path____', ''
        $content = $content -replace 'ENV ASPNETCORE_Kestrel__Certificates__Default__Password=____cfg_certificate_password____', ''
        
        # Remover linhas de echo
        $content = $content -replace 'RUN echo \$ASPNETCORE_ENVIRONMENT', ''
        $content = $content -replace 'RUN echo \$ASPNETCORE_URLS', ''
        $content = $content -replace 'RUN echo \$ASPNETCORE_Kestrel__Certificates__Default__Path', ''
        $content = $content -replace 'RUN echo \$ASPNETCORE_Kestrel__Certificates__Default__Password', ''
        
        # Remover linhas vazias múltiplas
        $content = $content -replace '(\r?\n){3,}', "`r`n`r`n"
        
        Set-Content $dockerfilePath $content -NoNewline
        
        Write-Host "   [OK] Dockerfile corrigido!" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  INICIANDO BUILD DAS IMAGENS DOCKER" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Build com Docker Compose
Write-Host ">> Executando: docker compose build --parallel" -ForegroundColor Yellow
Write-Host ""

docker compose build --parallel

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  BUILD COMPLETO COM SUCESSO!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Próximo passo: Execute 'docker compose up -d' para iniciar os containers" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  ERRO NO BUILD!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Verifique os logs acima para detalhes do erro." -ForegroundColor Yellow
}

