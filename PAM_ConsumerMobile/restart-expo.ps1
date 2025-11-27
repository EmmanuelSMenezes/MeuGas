Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  REINICIANDO EXPO DO ZERO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`n🧹 Matando processos Node..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object { 
    $_.Path -like "*PAM_ConsumerMobile*" -or 
    $_.MainWindowTitle -like "*Expo*" 
} | Stop-Process -Force -ErrorAction SilentlyContinue

Start-Sleep -Seconds 2

Write-Host "`n🗑️ Limpando caches..." -ForegroundColor Yellow

if (Test-Path ".expo") {
    Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
    Write-Host "✅ .expo removido" -ForegroundColor Green
}

if (Test-Path "node_modules\.cache") {
    Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
    Write-Host "✅ node_modules\.cache removido" -ForegroundColor Green
}

Write-Host "`n🚀 Iniciando Expo com cache limpo..." -ForegroundColor Yellow
Write-Host "⏳ Aguarde o QR Code aparecer..." -ForegroundColor Cyan
Write-Host ""

npx expo start --clear --android

