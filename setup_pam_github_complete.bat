@echo off
setlocal enabledelayedexpansion

echo ========================================
echo    PAM - Setup Completo GitHub
echo ========================================
echo.

set GITHUB_USER=EmmanuelSMenezes

REM Verificar se o token existe
if not exist "github_token.txt" (
    echo ❌ Token do GitHub não encontrado!
    echo.
    echo 📋 Para criar um token de acesso pessoal:
    echo    1. Vá para: https://github.com/settings/tokens
    echo    2. Clique em "Generate new token" ^> "Generate new token (classic)"
    echo    3. Selecione os escopos: repo, delete_repo
    echo    4. Copie o token gerado
    echo    5. Cole o token no arquivo 'github_token.txt' nesta pasta
    echo.
    echo 💡 Exemplo de conteúdo do arquivo github_token.txt:
    echo    ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    echo.
    pause
    exit /b 1
)

REM Ler o token
set /p GITHUB_TOKEN=<github_token.txt

echo 🔑 Token do GitHub carregado
echo 👤 Usuário: %GITHUB_USER%
echo.

REM Lista de repositórios
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

echo 🏗️  ETAPA 1: Criando repositórios no GitHub...
echo.

for /L %%i in (0,1,15) do (
    for /f "tokens=2 delims==" %%b in ("!repos[%%i]!") do (
        set repo_name=%%b
        echo 📦 Criando repositório: !repo_name!
        
        REM Criar repositório via API do GitHub
        curl -s -X POST ^
            -H "Authorization: token %GITHUB_TOKEN%" ^
            -H "Accept: application/vnd.github.v3+json" ^
            -d "{\"name\":\"!repo_name!\",\"description\":\"PAM - Plataforma de Agendamento de Manutenção\",\"private\":false}" ^
            https://api.github.com/user/repos > nul
        
        if !errorlevel! equ 0 (
            echo ✅ !repo_name! criado
        ) else (
            echo ⚠️  !repo_name! ^(pode já existir^)
        )
    )
)

echo.
echo 📤 ETAPA 2: Fazendo upload dos códigos...
echo.

for /L %%i in (0,1,15) do (
    for /f "tokens=1,2 delims==" %%a in ("!repos[%%i]!") do (
        set local_dir=%%a
        set repo_name=%%b
        
        echo 🚀 Processando !local_dir! -^> !repo_name!
        
        if exist "!local_dir!" (
            cd "!local_dir!"
            
            REM Limpar git existente se houver
            if exist ".git" (
                rmdir /s /q ".git" 2>nul
            )
            
            REM Inicializar repositório
            git init > nul 2>&1
            git add . > nul 2>&1
            git commit -m "Initial commit - PAM Project" > nul 2>&1
            git branch -M main > nul 2>&1
            git remote add origin https://github.com/!GITHUB_USER!/!repo_name!.git > nul 2>&1
            
            REM Push com autenticação via token
            git push -u origin main > nul 2>&1
            
            if !errorlevel! equ 0 (
                echo ✅ !repo_name! enviado com sucesso!
            ) else (
                echo ❌ Erro ao enviar !repo_name!
            )
            
            cd ..
        ) else (
            echo ❌ Diretório !local_dir! não encontrado
        )
        echo.
    )
)

echo.
echo 🎉 PROCESSO CONCLUÍDO!
echo.
echo 📋 Repositórios criados:
for /L %%i in (0,1,15) do (
    for /f "tokens=2 delims==" %%b in ("!repos[%%i]!") do (
        echo    ✅ https://github.com/!GITHUB_USER!/%%b
    )
)

echo.
echo 🔒 IMPORTANTE: Remova o arquivo github_token.txt após o uso por segurança!
pause
