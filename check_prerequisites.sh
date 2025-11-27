#!/bin/bash

echo "🔍 Verificando pré-requisitos para upload dos repositórios PAM..."
echo ""

# Verificar Git
echo "📋 Verificando Git..."
if command -v git &> /dev/null; then
    echo "✅ Git instalado: $(git --version)"
    
    # Verificar configuração do Git
    git_user=$(git config --global user.name)
    git_email=$(git config --global user.email)
    
    if [ -n "$git_user" ] && [ -n "$git_email" ]; then
        echo "✅ Git configurado: $git_user <$git_email>"
    else
        echo "⚠️  Git não está totalmente configurado"
        echo "   Execute: git config --global user.name 'Seu Nome'"
        echo "   Execute: git config --global user.email 'seu@email.com'"
    fi
else
    echo "❌ Git não está instalado"
fi

echo ""

# Verificar GitHub CLI
echo "📋 Verificando GitHub CLI..."
if command -v gh &> /dev/null; then
    echo "✅ GitHub CLI instalado: $(gh --version | head -n1)"
    
    if gh auth status &> /dev/null; then
        echo "✅ Logado no GitHub CLI"
    else
        echo "⚠️  Não está logado no GitHub CLI"
        echo "   Execute: gh auth login"
    fi
else
    echo "⚠️  GitHub CLI não está instalado (opcional)"
    echo "   Instale com: winget install GitHub.cli"
fi

echo ""

# Verificar diretórios
echo "📋 Verificando diretórios dos projetos..."
declare -A repos=(
    ["MS_Authentication"]="PAM_MS_Authentication"
    ["MS_Billing"]="PAM_MS_Billing"
    ["MS_Catalog"]="PAM_MS_Catalog"
    ["MS_Communication"]="PAM_MS_Communication"
    ["MS_Consumer"]="PAM_MS_Consumer"
    ["MS_Logistics"]="PAM_MS_Logistics"
    ["MS_Offer"]="PAM_MS_Offer"
    ["MS_Order"]="PAM_MS_Order"
    ["MS_Partner"]="PAM_MS_Partner"
    ["MS_Report"]="PAM_MS_Report"
    ["MS_Reputation"]="PAM_MS_Reputation"
    ["MS_Storage"]="PAM_MS_Storage"
    ["PAM_AdminWeb"]="PAM_AdminWeb"
    ["PAM_PartnerWeb"]="PAM_PartnerWeb"
    ["PAM_ConsumerMobile"]="PAM_ConsumerMobile"
    ["APK_Delivery"]="PAM_APK_Delivery"
)

found_dirs=0
total_dirs=${#repos[@]}

for local_dir in "${!repos[@]}"; do
    if [ -d "$local_dir" ]; then
        echo "✅ $local_dir encontrado"
        ((found_dirs++))
    else
        echo "❌ $local_dir não encontrado"
    fi
done

echo ""
echo "📊 Resumo: $found_dirs/$total_dirs diretórios encontrados"

echo ""
echo "🚀 Próximos passos:"
echo "1. Se GitHub CLI estiver instalado: ./create_github_repos.sh"
echo "2. Ou crie os repositórios manualmente no GitHub"
echo "3. Execute: ./upload_pam_repos.sh"
