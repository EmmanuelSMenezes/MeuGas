#!/usr/bin/env pwsh
# Script para restaurar o backup do banco de dados no pod PostgreSQL

Write-Host "🔄 Restaurando banco de dados no PostgreSQL (Kubernetes)" -ForegroundColor Cyan

# Configurar kubectl
$env:KUBECONFIG = "$PSScriptRoot\..\k8s-1-33-1-do-5-sfo3-1763495906297-kubeconfig.yaml"

# Verificar se o backup existe
$backupFile = "$PSScriptRoot\..\pam_backup_final.sql"
if (-not (Test-Path $backupFile)) {
    Write-Host "❌ Arquivo de backup não encontrado: $backupFile" -ForegroundColor Red
    exit 1
}

# Aguardar o pod do PostgreSQL estar pronto
Write-Host "`n⏳ Aguardando pod do PostgreSQL ficar pronto..." -ForegroundColor Yellow
kubectl wait --for=condition=ready pod -l app=postgres -n pam --timeout=300s

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Pod do PostgreSQL não ficou pronto" -ForegroundColor Red
    exit 1
}

# Obter nome do pod
$podName = kubectl get pod -l app=postgres -n pam -o jsonpath='{.items[0].metadata.name}'
Write-Host "`n📦 Pod PostgreSQL: $podName" -ForegroundColor Cyan

# Criar extensão uuid-ossp
Write-Host "`n🔧 Criando extensão uuid-ossp..." -ForegroundColor Yellow
kubectl exec -n pam $podName -- psql -U postgres -d pam -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\" SCHEMA public;"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Extensão uuid-ossp criada!" -ForegroundColor Green
} else {
    Write-Host "⚠️ Aviso: Erro ao criar extensão uuid-ossp (pode já existir)" -ForegroundColor Yellow
}

# Copiar backup para o pod
Write-Host "`n📤 Copiando backup para o pod..." -ForegroundColor Yellow
kubectl cp $backupFile "pam/${podName}:/tmp/backup.sql"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao copiar backup para o pod" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Backup copiado!" -ForegroundColor Green

# Restaurar backup
Write-Host "`n🔄 Restaurando backup..." -ForegroundColor Yellow
kubectl exec -n pam $podName -- psql -U postgres -d pam -f /tmp/backup.sql

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backup restaurado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "⚠️ Houve alguns erros durante a restauração (verifique os logs acima)" -ForegroundColor Yellow
}

# Verificar dados
Write-Host "`n🔍 Verificando dados restaurados..." -ForegroundColor Yellow
kubectl exec -n pam $podName -- psql -U postgres -d pam -t -c "SELECT table_schema, count(*) as tables FROM information_schema.tables WHERE table_schema NOT IN ('pg_catalog', 'information_schema') GROUP BY table_schema ORDER BY table_schema;"

Write-Host "`n✅ Restauração concluída!" -ForegroundColor Green

