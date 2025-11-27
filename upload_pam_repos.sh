#!/bin/bash

GITHUB_USER="EmmanuelSMenezes"

declare -A repos=(
    # Microserviços
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

    # Aplicações Web
    ["PAM_AdminWeb"]="PAM_AdminWeb"
    ["PAM_PartnerWeb"]="PAM_PartnerWeb"

    # Aplicações Mobile
    ["PAM_ConsumerMobile"]="PAM_ConsumerMobile"
    ["APK_Delivery"]="PAM_APK_Delivery"
)

for local_dir in "${!repos[@]}"; do
    repo_name="${repos[$local_dir]}"
    
    if [ -d "$local_dir" ]; then
        echo "🚀 Processando $local_dir -> $repo_name"
        
        cd "$local_dir"
        
        git init
        git add .
        git commit -m "Initial commit - PAM Microservice"
        git remote add origin "https://github.com/$GITHUB_USER/$repo_name.git"
        git branch -M main
        git push -u origin main
        
        cd ..
        echo "✅ $repo_name enviado!"
    else
        echo "❌ $local_dir não encontrado"
    fi
done

echo "🎉 Todos os repositórios foram processados!"