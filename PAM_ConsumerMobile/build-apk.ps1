Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  GERANDO APK DO APP MEUGAS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`nPreparando build do APK..." -ForegroundColor Yellow

Write-Host "`nVerificando Android SDK..." -ForegroundColor Yellow
if ($env:ANDROID_HOME) {
    Write-Host "ANDROID_HOME encontrado: $env:ANDROID_HOME" -ForegroundColor Green

    Write-Host "`nGerando projeto Android nativo..." -ForegroundColor Yellow
    npx expo prebuild --platform android --clean

    if ($LASTEXITCODE -eq 0) {
        Write-Host "`nProjeto Android gerado!" -ForegroundColor Green

        Write-Host "`nCompilando APK..." -ForegroundColor Yellow
        cd android
        .\gradlew assembleRelease

        if ($LASTEXITCODE -eq 0) {
            Write-Host "`nAPK GERADO COM SUCESSO!" -ForegroundColor Green
            Write-Host "`nLocalizacao do APK:" -ForegroundColor Cyan
            Write-Host "android\app\build\outputs\apk\release\app-release.apk" -ForegroundColor White

            Copy-Item "app\build\outputs\apk\release\app-release.apk" "..\meugas-app.apk" -Force
            Write-Host "`nAPK copiado para: meugas-app.apk" -ForegroundColor Green

            Write-Host "`nCOMO INSTALAR:" -ForegroundColor Yellow
            Write-Host "1. Transfira o arquivo meugas-app.apk para seu celular" -ForegroundColor White
            Write-Host "2. Abra o arquivo no celular" -ForegroundColor White
            Write-Host "3. Permita instalacao de fontes desconhecidas" -ForegroundColor White
            Write-Host "4. Instale o app!" -ForegroundColor White
        } else {
            Write-Host "`nErro ao compilar APK!" -ForegroundColor Red
        }

        cd ..
    } else {
        Write-Host "`nErro ao gerar projeto Android!" -ForegroundColor Red
    }
} else {
    Write-Host "ANDROID_HOME nao configurado" -ForegroundColor Yellow
    Write-Host "`nUsando EAS Build (nuvem)..." -ForegroundColor Cyan

    Write-Host "`nVoce precisara fazer login no Expo:" -ForegroundColor Yellow
    Write-Host "- Se nao tiver conta, crie em: https://expo.dev" -ForegroundColor Gray
    Write-Host "- Use a conta: esmenezes (ja configurada no app.json)" -ForegroundColor Gray

    Write-Host "`nIniciando build com EAS..." -ForegroundColor Cyan
    npx eas-cli build --platform android --profile development --local

    if ($LASTEXITCODE -ne 0) {
        Write-Host "`nBuild local falhou, tentando build na nuvem..." -ForegroundColor Yellow
        npx eas-cli build --platform android --profile development

        Write-Host "`nO APK sera gerado na nuvem e voce recebera um link para download!" -ForegroundColor Green
    }
}

Write-Host "`nProcesso concluido!" -ForegroundColor Green

