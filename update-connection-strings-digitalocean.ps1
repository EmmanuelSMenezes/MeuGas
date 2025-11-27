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
$errorCount = 0

foreach ($file in $appsettingsFiles) {
    $fullPath = Join-Path $PSScriptRoot $file
    
    if (Test-Path $fullPath) {
        Write-Host "Atualizando: $file" -ForegroundColor Yellow
        
        try {
            # Ler conteúdo do arquivo
            $content = Get-Content $fullPath -Raw
            
            # Substituir connection string antiga pela nova
            $newContent = $content -replace [regex]::Escape($OLD_CONNECTION_STRING), $NEW_CONNECTION_STRING
            
            # Verificar se houve mudança
            if ($content -ne $newContent) {
                # Salvar arquivo atualizado
                Set-Content -Path $fullPath -Value $newContent -NoNewline
                Write-Host "  ✅ Atualizado!" -ForegroundColor Green
                $updatedCount++
            } else {
                Write-Host "  ⚠️  Nenhuma alteração necessária" -ForegroundColor Gray
            }
        } catch {
            Write-Host "  ❌ ERRO: $($_.Exception.Message)" -ForegroundColor Red
            $errorCount++
        }
    } else {
        Write-Host "  ⚠️  Arquivo não encontrado: $file" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "RESUMO DA ATUALIZAÇÃO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Arquivos atualizados: $updatedCount" -ForegroundColor Green
Write-Host "❌ Erros: $errorCount" -ForegroundColor $(if ($errorCount -gt 0) { "Red" } else { "Green" })
Write-Host ""

if ($updatedCount -gt 0) {
    Write-Host "🔧 Próximos passos:" -ForegroundColor Cyan
    Write-Host "  1. Reconstruir os containers dos microserviços atualizados" -ForegroundColor White
    Write-Host "  2. Reiniciar os serviços" -ForegroundColor White
    Write-Host "  3. Testar a conexão com o novo banco" -ForegroundColor White
    Write-Host ""
    Write-Host "Comando para reconstruir e reiniciar:" -ForegroundColor Yellow
    Write-Host "  docker compose down" -ForegroundColor Gray
    Write-Host "  docker compose up -d --build" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Green
Write-Host "ATUALIZAÇÃO CONCLUÍDA!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Nova Connection String:" -ForegroundColor Cyan
Write-Host $NEW_CONNECTION_STRING -ForegroundColor White
Write-Host ""

