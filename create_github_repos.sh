#!/bin/bash

# Script para criar repositórios no GitHub usando GitHub CLI
# Execute este script ANTES do upload_pam_repos.sh

GITHUB_USER="EmmanuelSMenezes"

# Lista de repositórios para criar
repos=(
    "PAM_MS_Authentication"
    "PAM_MS_Billing"
    "PAM_MS_Catalog"
    "PAM_MS_Communication"
    "PAM_MS_Consumer"
    "PAM_MS_Logistics"
    "PAM_MS_Offer"
    "PAM_MS_Order"
    "PAM_MS_Partner"
    "PAM_MS_Report"
    "PAM_MS_Reputation"
    "PAM_MS_Storage"
    "PAM_AdminWeb"
    "PAM_PartnerWeb"
    "PAM_ConsumerMobile"
    "PAM_APK_Delivery"
)

echo "🚀 Criando repositórios no GitHub..."

# Verificar se GitHub CLI está instalada
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) não está instalada."
    echo "📋 Instale com: winget install GitHub.cli"
    echo "📋 Ou crie os repositórios manualmente em: https://github.com/new"
    echo ""
    echo "📝 Lista de repositórios para criar:"
    for repo in "${repos[@]}"; do
        echo "   - $repo"
    done
    exit 1
fi

# Verificar se está logado
if ! gh auth status &> /dev/null; then
    echo "❌ Não está logado no GitHub CLI."
    echo "📋 Execute: gh auth login"
    exit 1
fi

# Criar cada repositório
for repo in "${repos[@]}"; do
    echo "📦 Criando repositório: $repo"
    
    if gh repo create "$repo" --public --description "PAM - Plataforma de Agendamento de Manutenção"; then
        echo "✅ $repo criado com sucesso!"
    else
        echo "⚠️  Erro ao criar $repo (pode já existir)"
    fi
done

echo ""
echo "🎉 Processo de criação concluído!"
echo "📋 Agora você pode executar: ./upload_pam_repos.sh"
