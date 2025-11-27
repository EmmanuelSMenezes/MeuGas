Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ATUALIZANDO CONFIGURACOES RABBITMQ" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Nova URI do RabbitMQ local
$newRabbitMQUri = "amqp://pam_user:pam_password_2024@rabbitmq:5672/"
$oldRabbitMQUri = "amqp://guest:guest@pam.gasinho.com.br:5672/"

# Arquivos de configuracao que usam RabbitMQ
$configFiles = @(
    "MS_Communication/WebApi/appsettings.Development.json"
)

$successCount = 0
$errorCount = 0

foreach ($file in $configFiles) {
    Write-Host "Atualizando: $file" -ForegroundColor Yellow
    
    try {
        if (Test-Path $file) {
            $content = Get-Content $file -Raw -Encoding UTF8
            
            # Substituir URI do RabbitMQ
            $content = $content -replace [regex]::Escape($oldRabbitMQUri), $newRabbitMQUri
            
            # Salvar arquivo
            $content | Set-Content $file -Encoding UTF8 -NoNewline
            
            Write-Host "   [OK] $file atualizado com sucesso!" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host "   [AVISO] Arquivo nao encontrado: $file" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "   [ERRO] $($_.Exception.Message)" -ForegroundColor Red
        $errorCount++
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RESUMO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Arquivos atualizados: $successCount" -ForegroundColor Green
Write-Host "Erros: $errorCount" -ForegroundColor $(if ($errorCount -eq 0) { "Green" } else { "Red" })
Write-Host ""
Write-Host "Nova URI do RabbitMQ: $newRabbitMQUri" -ForegroundColor Cyan
Write-Host ""
Write-Host "Proximos passos:" -ForegroundColor Yellow
Write-Host "1. Iniciar o RabbitMQ: docker compose up -d rabbitmq" -ForegroundColor White
Write-Host "2. Acessar Management UI: http://localhost:9016" -ForegroundColor White
Write-Host "   Usuario: pam_user" -ForegroundColor White
Write-Host "   Senha: pam_password_2024" -ForegroundColor White
Write-Host "3. Reconstruir MS_Communication: docker compose build ms-communication" -ForegroundColor White
Write-Host "4. Reiniciar MS_Communication: docker compose up -d ms-communication" -ForegroundColor White

