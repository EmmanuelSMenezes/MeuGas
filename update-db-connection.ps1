########################################
# ATUALIZAR CONNECTION STRINGS
# Para usar o banco DigitalOcean
########################################

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "ATUALIZAR CONNECTION STRINGS - DIGITALOCEAN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Nova connection string (DigitalOcean com SSL)
$NEW_CONNECTION_STRING = 'Host=db-meugas-do-user-28455173-0.k.db.ondigitalocean.com;Port=25060;Username=doadmin;Password=AVNS_dadGCvarjg_jSehm-IO;Database=defaultdb;SSL Mode=Require;Trust Server Certificate=true;'

# Connection string antiga (AWS)
$OLD_CONNECTION_STRING = 'Host=35.172.113.118;Username=postgres;Password=Pam9628#d;Database=pam;'

# Lista de arquivos appsettings.Development.json a serem atualizados
$appsettingsFiles = @(
    "MS_Authentication\WebApi\appsettings.Development.json",
    "MS_Billing\WebApi\appsettings.Development.json",
    "MS_Catalog\WebApi\appsettings.Development.json",
    "MS_Communication\WebApi\appsettings.Development.json",
    "MS_Consumer\WebApi\appsettings.Development.json",
    "MS_Logistics\WebApi\appsettings.Development.json",
    "MS_Offer\WebApi\appsettings.Development.json",
    "MS_Order\WebApi\appsettings.Development.json",
    "MS_Partner\WebApi\appsettings.Development.json",
    "MS_Report\WebApi\appsettings.Development.json",
    "MS_Reputation\WebApi\appsettings.Development.json",
    "MS_Storage\WebApi\appsettings.Development.json"
)

$updatedCount = 0

foreach ($file in $appsettingsFiles) {
    if (Test-Path $file) {
        Write-Host "Atualizando: $file" -ForegroundColor Yellow
        
        # Ler o conteúdo do arquivo
        $content = Get-Content $file -Raw
        
        # Substituir a connection string antiga pela nova
        $newContent = $content -replace [regex]::Escape($OLD_CONNECTION_STRING), $NEW_CONNECTION_STRING
        
        # Salvar o arquivo atualizado
        Set-Content -Path $file -Value $newContent -Encoding UTF8
        
        Write-Host "  ✓ Atualizado com sucesso!" -ForegroundColor Green
        $updatedCount++
    } else {
        Write-Host "  ✗ Arquivo não encontrado: $file" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "ATUALIZACAO CONCLUIDA!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Arquivos atualizados: $updatedCount de $($appsettingsFiles.Count)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Nova Connection String:" -ForegroundColor Cyan
Write-Host $NEW_CONNECTION_STRING -ForegroundColor White
Write-Host ""
Write-Host "Proximos passos:" -ForegroundColor Yellow
Write-Host "1. Rebuild dos containers:" -ForegroundColor White
Write-Host "   docker-compose up -d --build" -ForegroundColor Gray
Write-Host ""

