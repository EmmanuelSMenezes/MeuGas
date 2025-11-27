# PAM - Setup Completo GitHub
param(
    [string]$GitHubToken = ""
)

$GitHubUser = "EmmanuelSMenezes"

Write-Host "========================================"
Write-Host "    PAM - Setup Completo GitHub"
Write-Host "========================================"
Write-Host ""

# Verificar token
if (-not $GitHubToken) {
    if (Test-Path "github_token.txt") {
        $GitHubToken = Get-Content "github_token.txt" -Raw
        $GitHubToken = $GitHubToken.Trim()
        Write-Host "Token carregado do arquivo github_token.txt"
    } else {
        Write-Host "Token do GitHub necessario!"
        Write-Host "Crie o arquivo 'github_token.txt' com o token"
        exit 1
    }
}

Write-Host "Usuario: $GitHubUser"
Write-Host ""

# Lista de repositorios
$repositories = @{
    "MS_Authentication" = "PAM_MS_Authentication"
    "MS_Billing" = "PAM_MS_Billing"
    "MS_Catalog" = "PAM_MS_Catalog"
    "MS_Communication" = "PAM_MS_Communication"
    "MS_Consumer" = "PAM_MS_Consumer"
    "MS_Logistics" = "PAM_MS_Logistics"
    "MS_Offer" = "PAM_MS_Offer"
    "MS_Order" = "PAM_MS_Order"
    "MS_Partner" = "PAM_MS_Partner"
    "MS_Report" = "PAM_MS_Report"
    "MS_Reputation" = "PAM_MS_Reputation"
    "MS_Storage" = "PAM_MS_Storage"
    "PAM_AdminWeb" = "PAM_AdminWeb"
    "PAM_PartnerWeb" = "PAM_PartnerWeb"
    "PAM_ConsumerMobile" = "PAM_ConsumerMobile"
    "APK_Delivery" = "PAM_APK_Delivery"
}

# Headers para API do GitHub
$headers = @{
    "Authorization" = "token $GitHubToken"
    "Accept" = "application/vnd.github.v3+json"
    "User-Agent" = "PAM-Setup-Script"
}

Write-Host "ETAPA 1: Criando repositorios no GitHub..."
Write-Host ""

foreach ($repo in $repositories.GetEnumerator()) {
    $repoName = $repo.Value
    Write-Host "Criando repositorio: $repoName"

    $body = @{
        name = $repoName
        description = "PAM - Plataforma de Agendamento de Manutencao"
        private = $false
        auto_init = $false
    } | ConvertTo-Json

    try {
        Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $headers -Body $body -ContentType "application/json" | Out-Null
        Write-Host "OK - $repoName criado com sucesso!"
    }
    catch {
        if ($_.Exception.Response.StatusCode -eq 422) {
            Write-Host "AVISO - $repoName ja existe"
        } else {
            Write-Host "ERRO - Erro ao criar $repoName : $($_.Exception.Message)"
        }
    }
}

Write-Host ""
Write-Host "ETAPA 2: Fazendo upload dos codigos..."
Write-Host ""

foreach ($repo in $repositories.GetEnumerator()) {
    $localDir = $repo.Key
    $repoName = $repo.Value

    Write-Host "Processando $localDir -> $repoName"

    if (Test-Path $localDir) {
        Push-Location $localDir

        try {
            # Limpar git existente se houver
            if (Test-Path ".git") {
                Remove-Item ".git" -Recurse -Force -ErrorAction SilentlyContinue
            }

            # Configurar Git com token para autenticacao
            $remoteUrl = "https://$($GitHubToken)@github.com/$GitHubUser/$repoName.git"

            # Inicializar repositorio
            git init | Out-Null
            git add . | Out-Null
            git commit -m "Initial commit - PAM Project" | Out-Null
            git branch -M main | Out-Null
            git remote add origin $remoteUrl | Out-Null

            # Push
            $pushResult = git push -u origin main 2>&1

            if ($LASTEXITCODE -eq 0) {
                Write-Host "OK - $repoName enviado com sucesso!"
            } else {
                Write-Host "ERRO - Erro ao enviar $repoName"
                Write-Host "Detalhes: $pushResult"
            }
        }
        catch {
            Write-Host "ERRO - Erro ao processar $localDir : $($_.Exception.Message)"
        }
        finally {
            Pop-Location
        }
    } else {
        Write-Host "ERRO - Diretorio $localDir nao encontrado"
    }
    Write-Host ""
}

Write-Host ""
Write-Host "PROCESSO CONCLUIDO!"
Write-Host ""
Write-Host "Repositorios criados:"
foreach ($repo in $repositories.GetEnumerator()) {
    $repoName = $repo.Value
    Write-Host "   https://github.com/$GitHubUser/$repoName"
}

Write-Host ""
Write-Host "IMPORTANTE: Mantenha seu token seguro!"
