Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ATUALIZANDO CREDENCIAIS DO TWILIO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Novas credenciais do Twilio
$newAccountSID = "ACe5cb2fffe4ef894ab63a275f8e431a75"
$newAuthToken = "d56135ec81910d78e9727c58cc6d39d5"
$newPhoneNumber = "+13853968548"

# Credenciais antigas (para substituir)
$oldAccountSID = "AC5b8d9e146d5d71745abc3e780b73c5c0"
$oldAuthToken = "59d9f4d33f555ba405bccc3b94abf822"
$oldPhoneNumber = "+15076328239"

# Lista de arquivos para atualizar
$files = @(
    "MS_Authentication\WebApi\appsettings.Development.json",
    "MS_Communication\WebApi\appsettings.Development.json",
    "MS_Consumer\WebApi\appsettings.Development.json",
    "MS_Logistics\WebApi\appsettings.Development.json"
)

$successCount = 0
$errorCount = 0

foreach ($file in $files) {
    Write-Host "Atualizando: $file" -ForegroundColor Yellow
    
    if (Test-Path $file) {
        try {
            $content = Get-Content $file -Raw
            $content = $content -replace $oldAccountSID, $newAccountSID
            $content = $content -replace $oldAuthToken, $newAuthToken
            $content = $content -replace [regex]::Escape($oldPhoneNumber), $newPhoneNumber
            $content | Set-Content $file -NoNewline
            
            Write-Host "   [OK] Atualizado!" -ForegroundColor Green
            $successCount++
        }
        catch {
            Write-Host "   [ERRO] $($_.Exception.Message)" -ForegroundColor Red
            $errorCount++
        }
    }
    else {
        Write-Host "   [AVISO] Arquivo nao encontrado" -ForegroundColor Yellow
        $errorCount++
    }
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "RESUMO: $successCount atualizados, $errorCount erros" -ForegroundColor White
Write-Host ""
Write-Host "NOVAS CREDENCIAIS:" -ForegroundColor Cyan
Write-Host "  Account SID: $newAccountSID" -ForegroundColor White
Write-Host "  Auth Token: $newAuthToken" -ForegroundColor White
Write-Host "  Phone Number: $newPhoneNumber" -ForegroundColor White

