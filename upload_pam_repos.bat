@echo off
setlocal enabledelayedexpansion

set GITHUB_USER=EmmanuelSMenezes

echo 🚀 Iniciando upload dos repositórios PAM para GitHub...
echo.

REM Lista de repositórios (diretório local = nome no GitHub)
set "repos[0]=MS_Authentication=PAM_MS_Authentication"
set "repos[1]=MS_Billing=PAM_MS_Billing"
set "repos[2]=MS_Catalog=PAM_MS_Catalog"
set "repos[3]=MS_Communication=PAM_MS_Communication"
set "repos[4]=MS_Consumer=PAM_MS_Consumer"
set "repos[5]=MS_Logistics=PAM_MS_Logistics"
set "repos[6]=MS_Offer=PAM_MS_Offer"
set "repos[7]=MS_Order=PAM_MS_Order"
set "repos[8]=MS_Partner=PAM_MS_Partner"
set "repos[9]=MS_Report=PAM_MS_Report"
set "repos[10]=MS_Reputation=PAM_MS_Reputation"
set "repos[11]=MS_Storage=PAM_MS_Storage"
set "repos[12]=PAM_AdminWeb=PAM_AdminWeb"
set "repos[13]=PAM_PartnerWeb=PAM_PartnerWeb"
set "repos[14]=PAM_ConsumerMobile=PAM_ConsumerMobile"
set "repos[15]=APK_Delivery=PAM_APK_Delivery"

set repo_count=16

for /L %%i in (0,1,15) do (
    for /f "tokens=1,2 delims==" %%a in ("!repos[%%i]!") do (
        set local_dir=%%a
        set repo_name=%%b
        
        echo 🚀 Processando !local_dir! -^> !repo_name!
        
        if exist "!local_dir!" (
            cd "!local_dir!"
            
            REM Verificar se já é um repositório git
            if exist ".git" (
                echo ⚠️  Repositório Git já existe em !local_dir!
                echo 🔄 Adicionando remote e fazendo push...
                git remote remove origin 2>nul
            ) else (
                echo 📦 Inicializando repositório Git...
                git init
            )
            
            echo 📁 Adicionando arquivos...
            git add .
            
            echo 💾 Fazendo commit...
            git commit -m "Initial commit - PAM Microservice" 2>nul
            
            echo 🔗 Adicionando remote origin...
            git remote add origin https://github.com/!GITHUB_USER!/!repo_name!.git
            
            echo 🌿 Configurando branch main...
            git branch -M main
            
            echo 📤 Fazendo push para GitHub...
            git push -u origin main
            
            if !errorlevel! equ 0 (
                echo ✅ !repo_name! enviado com sucesso!
            ) else (
                echo ❌ Erro ao enviar !repo_name!
                echo ⚠️  Verifique se o repositório existe no GitHub: https://github.com/!GITHUB_USER!/!repo_name!
            )
            
            cd ..
            echo.
        ) else (
            echo ❌ Diretório !local_dir! não encontrado
            echo.
        )
    )
)

echo 🎉 Processo concluído!
echo.
echo 📋 Repositórios que deveriam ter sido criados:
for /L %%i in (0,1,15) do (
    for /f "tokens=2 delims==" %%b in ("!repos[%%i]!") do (
        echo    - https://github.com/!GITHUB_USER!/%%b
    )
)

pause
