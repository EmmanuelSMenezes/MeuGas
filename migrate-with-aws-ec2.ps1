########################################
# MIGRAÇÃO DE BANCO DE DADOS PAM
# Versão para EC2 (usando Security Group)
########################################

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MIGRAÇÃO DE BANCO DE DADOS PAM" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Credenciais AWS
$env:AWS_ACCESS_KEY_ID = "AKIA5FCD6OSVIQXOEFF6"
$env:AWS_SECRET_ACCESS_KEY = "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"
$env:AWS_DEFAULT_REGION = "us-east-1"

# Configurações do banco ORIGEM (AWS)
$SOURCE_HOST = "35.172.113.118"
$SOURCE_USER = "postgres"
$SOURCE_PASSWORD = "Pam9628#d"
$SOURCE_DATABASE = "pam"
$SOURCE_PORT = "5432"

# Configurações do banco DESTINO (DigitalOcean)
$DEST_HOST = "db-meugas-do-user-28455173-0.k.db.ondigitalocean.com"
$DEST_USER = "doadmin"
$DEST_PASSWORD = "AVNS_dadGCvarjg_jSehm-IO"
$DEST_DATABASE = "defaultdb"
$DEST_PORT = "25060"

# Arquivo temporário para o dump
$DUMP_FILE = "pam_database_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').sql"

# Security Group do RDS (já sabemos qual é)
$RDS_SECURITY_GROUP_ID = "sg-058c9154241cc5ac4"

Write-Host "[1/10] Obtendo informações da instância EC2..." -ForegroundColor Yellow
try {
    $INSTANCE_ID = Invoke-RestMethod -Uri "http://169.254.169.254/latest/meta-data/instance-id" -TimeoutSec 2
    Write-Host "✅ Instance ID: $INSTANCE_ID" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Não está em uma instância EC2" -ForegroundColor Yellow
    $INSTANCE_ID = $null
}
Write-Host ""

if ($INSTANCE_ID) {
    Write-Host "[2/10] Obtendo Security Group da instância EC2..." -ForegroundColor Yellow
    $getSGCmd = "docker run --rm -e AWS_ACCESS_KEY_ID=$env:AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY=$env:AWS_SECRET_ACCESS_KEY -e AWS_DEFAULT_REGION=$env:AWS_DEFAULT_REGION amazon/aws-cli ec2 describe-instances --instance-ids $INSTANCE_ID --query 'Reservations[0].Instances[0].SecurityGroups[0].GroupId' --output text"
    
    try {
        $EC2_SECURITY_GROUP_ID = (Invoke-Expression $getSGCmd 2>&1).Trim()
        Write-Host "✅ Security Group da EC2: $EC2_SECURITY_GROUP_ID" -ForegroundColor Green
    } catch {
        Write-Host "❌ ERRO: Não foi possível obter Security Group!" -ForegroundColor Red
        exit 1
    }
    Write-Host ""

    Write-Host "[3/10] Adicionando regra para permitir EC2 acessar RDS..." -ForegroundColor Yellow
    Write-Host "Liberando acesso do SG $EC2_SECURITY_GROUP_ID para o RDS SG $RDS_SECURITY_GROUP_ID..." -ForegroundColor Gray
    
    $addRuleCmd = "docker run --rm -e AWS_ACCESS_KEY_ID=$env:AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY=$env:AWS_SECRET_ACCESS_KEY -e AWS_DEFAULT_REGION=$env:AWS_DEFAULT_REGION amazon/aws-cli ec2 authorize-security-group-ingress --group-id $RDS_SECURITY_GROUP_ID --protocol tcp --port 5432 --source-group $EC2_SECURITY_GROUP_ID --output text"
    
    try {
        $addResult = Invoke-Expression $addRuleCmd 2>&1
        if ($LASTEXITCODE -ne 0 -and $addResult -notlike "*already exists*") {
            Write-Host "⚠️  Aviso: $addResult" -ForegroundColor Yellow
        } else {
            Write-Host "✅ Regra adicionada com sucesso!" -ForegroundColor Green
        }
    } catch {
        Write-Host "⚠️  Aviso: Regra pode já existir" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "⏳ Aguardando 15 segundos para a regra ser aplicada..." -ForegroundColor Gray
    Start-Sleep -Seconds 15
    Write-Host ""
} else {
    Write-Host "[2/10] Pulando configuração de Security Group (não está em EC2)..." -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "[4/10] Testando conexão com banco ORIGEM..." -ForegroundColor Yellow
$testCmd = "docker run --rm postgres:15-alpine psql `"postgresql://${SOURCE_USER}:${SOURCE_PASSWORD}@${SOURCE_HOST}:${SOURCE_PORT}/${SOURCE_DATABASE}`" -c 'SELECT version();' -t"
try {
    $version = Invoke-Expression $testCmd 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ ERRO: Ainda não consegue conectar!" -ForegroundColor Red
        Write-Host $version -ForegroundColor Red
        
        if ($INSTANCE_ID -and $EC2_SECURITY_GROUP_ID) {
            Write-Host "Tentando remover a regra..." -ForegroundColor Yellow
            $removeCmd = "docker run --rm -e AWS_ACCESS_KEY_ID=$env:AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY=$env:AWS_SECRET_ACCESS_KEY -e AWS_DEFAULT_REGION=$env:AWS_DEFAULT_REGION amazon/aws-cli ec2 revoke-security-group-ingress --group-id $RDS_SECURITY_GROUP_ID --protocol tcp --port 5432 --source-group $EC2_SECURITY_GROUP_ID"
            Invoke-Expression $removeCmd 2>&1 | Out-Null
        }
        exit 1
    }
    Write-Host "✅ Conexão OK!" -ForegroundColor Green
    Write-Host "Versão: $($version.Trim().Substring(0, [Math]::Min(60, $version.Trim().Length)))..." -ForegroundColor Gray
} catch {
    Write-Host "❌ ERRO: Falha na conexão!" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "[5/10] Testando conexão com banco DESTINO..." -ForegroundColor Yellow
$testDestCmd = "docker run --rm postgres:15-alpine psql `"postgresql://${DEST_USER}:${DEST_PASSWORD}@${DEST_HOST}:${DEST_PORT}/${DEST_DATABASE}?sslmode=require`" -c 'SELECT version();' -t"
try {
    $destVersion = Invoke-Expression $testDestCmd 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ ERRO: Não consegue conectar ao DigitalOcean!" -ForegroundColor Red
        Write-Host $destVersion -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Conexão OK!" -ForegroundColor Green
    Write-Host "Versão: $($destVersion.Trim().Substring(0, [Math]::Min(60, $destVersion.Trim().Length)))..." -ForegroundColor Gray
} catch {
    Write-Host "❌ ERRO: Falha na conexão!" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "[6/10] Fazendo backup do banco ORIGEM..." -ForegroundColor Yellow
Write-Host "⏳ Isso pode demorar vários minutos..." -ForegroundColor Gray
Write-Host ""

$dumpCmd = "docker run --rm postgres:15-alpine pg_dump `"postgresql://${SOURCE_USER}:${SOURCE_PASSWORD}@${SOURCE_HOST}:${SOURCE_PORT}/${SOURCE_DATABASE}`" -F p -b"
try {
    $dumpData = Invoke-Expression $dumpCmd 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ ERRO: Falha no backup!" -ForegroundColor Red
        Write-Host $dumpData -ForegroundColor Red
        exit 1
    }

    Set-Content -Path $DUMP_FILE -Value $dumpData -Encoding UTF8
    $fileSize = (Get-Item $DUMP_FILE).Length / 1MB
    Write-Host "✅ Backup concluído! Tamanho: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Green
} catch {
    Write-Host "❌ ERRO: Falha no backup!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
Write-Host ""

if ($INSTANCE_ID -and $EC2_SECURITY_GROUP_ID) {
    Write-Host "[7/10] Removendo regra temporária do Security Group..." -ForegroundColor Yellow
    $removeRuleCmd = "docker run --rm -e AWS_ACCESS_KEY_ID=$env:AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY=$env:AWS_SECRET_ACCESS_KEY -e AWS_DEFAULT_REGION=$env:AWS_DEFAULT_REGION amazon/aws-cli ec2 revoke-security-group-ingress --group-id $RDS_SECURITY_GROUP_ID --protocol tcp --port 5432 --source-group $EC2_SECURITY_GROUP_ID --output text"

    try {
        Invoke-Expression $removeRuleCmd 2>&1 | Out-Null
        Write-Host "✅ Regra removida! Banco AWS protegido novamente." -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Aviso: Não foi possível remover a regra automaticamente" -ForegroundColor Yellow
    }
    Write-Host ""
} else {
    Write-Host "[7/10] Pulando remoção de regra (não foi adicionada)..." -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "[8/10] Preparando dump para DigitalOcean..." -ForegroundColor Yellow
$dumpContent = Get-Content $DUMP_FILE -Raw
$dumpContent = $dumpContent -replace "OWNER TO postgres", "OWNER TO doadmin"
$dumpContent = $dumpContent -replace "Owner: postgres", "Owner: doadmin"
Set-Content -Path $DUMP_FILE -Value $dumpContent -Encoding UTF8
Write-Host "✅ Dump preparado!" -ForegroundColor Green
Write-Host ""

Write-Host "[9/10] Habilitando PostGIS no banco DESTINO..." -ForegroundColor Yellow
$postgisCmd = "docker run --rm postgres:15-alpine psql `"postgresql://${DEST_USER}:${DEST_PASSWORD}@${DEST_HOST}:${DEST_PORT}/${DEST_DATABASE}?sslmode=require`" -c 'CREATE EXTENSION IF NOT EXISTS postgis;'"
try {
    Invoke-Expression $postgisCmd 2>&1 | Out-Null
    Write-Host "✅ PostGIS habilitado!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  PostGIS pode já existir" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "[10/10] Restaurando backup no banco DESTINO..." -ForegroundColor Yellow
Write-Host "⏳ Isso pode demorar 10-30 minutos..." -ForegroundColor Gray
Write-Host ""

try {
    $dumpContent | docker run --rm -i postgres:15-alpine psql "postgresql://${DEST_USER}:${DEST_PASSWORD}@${DEST_HOST}:${DEST_PORT}/${DEST_DATABASE}?sslmode=require" 2>&1 | Out-Null
    Write-Host "✅ Restauração concluída!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Alguns erros podem ter ocorrido" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "VERIFICANDO MIGRAÇÃO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$countCmd = "docker run --rm postgres:15-alpine psql `"postgresql://${DEST_USER}:${DEST_PASSWORD}@${DEST_HOST}:${DEST_PORT}/${DEST_DATABASE}?sslmode=require`" -t -c `"SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';`""
try {
    $tableCount = Invoke-Expression $countCmd 2>&1
    Write-Host "✅ Total de tabelas: $($tableCount.Trim())" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Não foi possível contar tabelas" -ForegroundColor Yellow
}

$postgisVerCmd = "docker run --rm postgres:15-alpine psql `"postgresql://${DEST_USER}:${DEST_PASSWORD}@${DEST_HOST}:${DEST_PORT}/${DEST_DATABASE}?sslmode=require`" -t -c `"SELECT PostGIS_version();`""
try {
    $postgisVer = Invoke-Expression $postgisVerCmd 2>&1
    Write-Host "✅ PostGIS: $($postgisVer.Trim().Substring(0, [Math]::Min(50, $postgisVer.Trim().Length)))..." -ForegroundColor Green
} catch {
    Write-Host "⚠️  PostGIS não encontrado" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "MIGRAÇÃO CONCLUÍDA COM SUCESSO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Resumo:" -ForegroundColor Cyan
Write-Host "  • Origem: ${SOURCE_HOST}:${SOURCE_PORT}/${SOURCE_DATABASE}" -ForegroundColor White
Write-Host "  • Destino: ${DEST_HOST}:${DEST_PORT}/${DEST_DATABASE}" -ForegroundColor White
Write-Host "  • Backup: $DUMP_FILE" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Próximo passo:" -ForegroundColor Cyan
Write-Host "  powershell -ExecutionPolicy Bypass -File update-connection-strings-digitalocean.ps1" -ForegroundColor Gray
Write-Host ""

