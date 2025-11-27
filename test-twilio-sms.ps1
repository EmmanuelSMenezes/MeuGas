Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TESTE DE SMS TWILIO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Credenciais do Twilio (do appsettings.Development.json)
$accountSid = "ACe5cb2fffe4ef894ab63a275f8e431a75"
$authToken = "d56135ec81910d78e9727c58cc6d39d5"
$fromNumber = "+13853968548"
$toNumber = "+5511973892831"

Write-Host "`nCredenciais Twilio:" -ForegroundColor Yellow
Write-Host "Account SID: $accountSid" -ForegroundColor White
Write-Host "From Number: $fromNumber" -ForegroundColor White
Write-Host "To Number: $toNumber" -ForegroundColor White

Write-Host "`n1. Testando credenciais Twilio..." -ForegroundColor Cyan

# Criar credenciais Base64
$pair = "${accountSid}:${authToken}"
$bytes = [System.Text.Encoding]::ASCII.GetBytes($pair)
$base64 = [System.Convert]::ToBase64String($bytes)

# Testar se a conta existe
Write-Host "`nVerificando conta Twilio..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Basic $base64"
    }
    
    $accountUrl = "https://api.twilio.com/2010-04-01/Accounts/$accountSid.json"
    $accountResponse = Invoke-RestMethod -Uri $accountUrl -Method Get -Headers $headers
    
    Write-Host "Conta Twilio encontrada!" -ForegroundColor Green
    Write-Host "Status: $($accountResponse.status)" -ForegroundColor White
    Write-Host "Friendly Name: $($accountResponse.friendly_name)" -ForegroundColor White
    Write-Host "Type: $($accountResponse.type)" -ForegroundColor White
} catch {
    Write-Host "Erro ao verificar conta Twilio!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host "`nDetalhes do erro:" -ForegroundColor Yellow
    Write-Host $_.ErrorDetails.Message -ForegroundColor Red
    exit 1
}

Write-Host "`n2. Verificando numero de telefone..." -ForegroundColor Cyan
try {
    $phoneUrl = "https://api.twilio.com/2010-04-01/Accounts/$accountSid/IncomingPhoneNumbers.json"
    $phoneResponse = Invoke-RestMethod -Uri $phoneUrl -Method Get -Headers $headers
    
    Write-Host "Numeros disponiveis:" -ForegroundColor Green
    foreach ($phone in $phoneResponse.incoming_phone_numbers) {
        Write-Host "  - $($phone.phone_number) ($($phone.friendly_name))" -ForegroundColor White
    }
} catch {
    Write-Host "Erro ao verificar numeros!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host "`n3. Enviando SMS de teste..." -ForegroundColor Cyan
try {
    $smsUrl = "https://api.twilio.com/2010-04-01/Accounts/$accountSid/Messages.json"
    
    $body = @{
        From = $fromNumber
        To = $toNumber
        Body = "Teste MeuGas - Seu codigo de verificacao e: 123456"
    }
    
    Write-Host "`nEnviando SMS para $toNumber..." -ForegroundColor Yellow
    $smsResponse = Invoke-RestMethod -Uri $smsUrl -Method Post -Headers $headers -Body $body
    
    Write-Host "`nSMS ENVIADO COM SUCESSO!" -ForegroundColor Green
    Write-Host "SID: $($smsResponse.sid)" -ForegroundColor White
    Write-Host "Status: $($smsResponse.status)" -ForegroundColor White
    Write-Host "From: $($smsResponse.from)" -ForegroundColor White
    Write-Host "To: $($smsResponse.to)" -ForegroundColor White
    Write-Host "Body: $($smsResponse.body)" -ForegroundColor White
    Write-Host "Price: $($smsResponse.price) $($smsResponse.price_unit)" -ForegroundColor White
    Write-Host "Date Created: $($smsResponse.date_created)" -ForegroundColor White
    
    if ($smsResponse.error_code) {
        Write-Host "`nERRO NO ENVIO:" -ForegroundColor Red
        Write-Host "Error Code: $($smsResponse.error_code)" -ForegroundColor Red
        Write-Host "Error Message: $($smsResponse.error_message)" -ForegroundColor Red
    }
} catch {
    Write-Host "`nERRO AO ENVIAR SMS!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host "`nDetalhes do erro:" -ForegroundColor Yellow
    if ($_.ErrorDetails.Message) {
        $errorJson = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "Code: $($errorJson.code)" -ForegroundColor Red
        Write-Host "Message: $($errorJson.message)" -ForegroundColor Red
        Write-Host "More Info: $($errorJson.more_info)" -ForegroundColor Red
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  TESTE CONCLUIDO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

