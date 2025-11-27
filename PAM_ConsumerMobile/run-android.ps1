Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║           RODANDO APP MEUGAS NO ANDROID                        ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

Write-Host "`n📦 Verificando dependências..." -ForegroundColor Yellow
if (!(Test-Path "node_modules")) {
    Write-Host "   Instalando dependências..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "`n❌ Erro ao instalar dependências!" -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n✅ Dependências OK!" -ForegroundColor Green

Write-Host "`n🔍 Verificando dispositivos Android..." -ForegroundColor Yellow
adb devices

Write-Host "`n🚀 Iniciando Expo..." -ForegroundColor Cyan
Write-Host "`n   INSTRUÇÕES:" -ForegroundColor Yellow
Write-Host "   - O Metro Bundler será iniciado" -ForegroundColor White
Write-Host "   - O app será aberto automaticamente no Android" -ForegroundColor White
Write-Host "   - Aguarde o build do JavaScript..." -ForegroundColor White
Write-Host "`n   Comandos úteis:" -ForegroundColor Yellow
Write-Host "   - Pressione 'r' para recarregar" -ForegroundColor Gray
Write-Host "   - Pressione 'q' para sair" -ForegroundColor Gray
Write-Host "`n"

npx expo start --android

