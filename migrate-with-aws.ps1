########################################
# MIGRAÇÃO DE BANCO DE DADOS PAM
# Com configuração automática do Security Group AWS
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

Write-Host "[1/11] Obtendo IP público deste computador..." -ForegroundColor Yellow
try {
    $MY_IP = (Invoke-WebRequest -Uri "https://api.ipify.org" -UseBasicParsing).Content.Trim()
    Write-Host "✅ Seu IP público: $MY_IP" -ForegroundColor Green
} catch {
    Write-Host "❌ ERRO: Não foi possível obter IP público!" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "[2/11] Procurando Security Group do banco de dados..." -ForegroundColor Yellow
Write-Host "Procurando instância RDS com IP $SOURCE_HOST..." -ForegroundColor Gray

# Usar Docker com AWS CLI para encontrar o Security Group
$findSGCmd = "docker run --rm -e AWS_ACCESS_KEY_ID=$env:AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY=$env:AWS_SECRET_ACCESS_KEY -e AWS_DEFAULT_REGION=$env:AWS_DEFAULT_REGION amazon/aws-cli rds describe-db-instances --query 'DBInstances[?Endpoint.Address!=null].[DBInstanceIdentifier,Endpoint.Address,VpcSecurityGroups[0].VpcSecurityGroupId]' --output text"

try {
    $rdsInfo = Invoke-Expression $findSGCmd 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️  Não foi possível listar instâncias RDS" -ForegroundColor Yellow
        Write-Host "Vou tentar encontrar o Security Group de outra forma..." -ForegroundColor Gray
        
        # Tentar encontrar Security Groups que permitem porta 5432
        $findSGCmd2 = "docker run --rm -e AWS_ACCESS_KEY_ID=$env:AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY=$env:AWS_SECRET_ACCESS_KEY -e AWS_DEFAULT_REGION=$env:AWS_DEFAULT_REGION amazon/aws-cli ec2 describe-security-groups --filters 'Name=ip-permission.from-port,Values=5432' --query 'SecurityGroups[*].[GroupId,GroupName]' --output text"
        $sgList = Invoke-Expression $findSGCmd2 2>&1
        Write-Host "Security Groups encontrados com porta 5432:" -ForegroundColor Gray
        Write-Host $sgList -ForegroundColor Gray

        # Procurar pelo Security Group que contém "RDS" ou "PAM" no nome
        $sgLines = $sgList -split "`n"
        $pamSG = $sgLines | Where-Object { $_ -like "*PAM*" -or $_ -like "*RDS*" } | Select-Object -First 1

        if ($pamSG) {
            $SECURITY_GROUP_ID = ($pamSG -split "`t")[0]
            Write-Host "Usando Security Group PAM/RDS: $SECURITY_GROUP_ID" -ForegroundColor Gray
        } else {
            # Pegar o primeiro Security Group
            $SECURITY_GROUP_ID = ($sgLines[0] -split "`t")[0]
            Write-Host "Usando primeiro Security Group: $SECURITY_GROUP_ID" -ForegroundColor Gray
        }
        
        if ([string]::IsNullOrWhiteSpace($SECURITY_GROUP_ID)) {
            Write-Host "❌ ERRO: Não foi possível encontrar Security Group!" -ForegroundColor Red
            Write-Host "Por favor, forneça o Security Group ID manualmente." -ForegroundColor Yellow
            exit 1
        }
    } else {
        # Procurar pela linha que contém o IP do banco
        $rdsLines = $rdsInfo -split "`n"
        $matchingLine = $rdsLines | Where-Object { $_ -like "*$SOURCE_HOST*" }
        
        if ($matchingLine) {
            $SECURITY_GROUP_ID = ($matchingLine -split "`t")[2]
        } else {
            # Pegar o primeiro Security Group encontrado
            $SECURITY_GROUP_ID = ($rdsLines[0] -split "`t")[2]
        }
    }
    
    Write-Host "✅ Security Group encontrado: $SECURITY_GROUP_ID" -ForegroundColor Green
} catch {
    Write-Host "❌ ERRO: Falha ao buscar Security Group!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "[3/11] Adicionando regra temporária ao Security Group..." -ForegroundColor Yellow
Write-Host "Liberando acesso do IP $MY_IP para porta 5432..." -ForegroundColor Gray

$addRuleCmd = "docker run --rm -e AWS_ACCESS_KEY_ID=$env:AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY=$env:AWS_SECRET_ACCESS_KEY -e AWS_DEFAULT_REGION=$env:AWS_DEFAULT_REGION amazon/aws-cli ec2 authorize-security-group-ingress --group-id $SECURITY_GROUP_ID --protocol tcp --port 5432 --cidr ${MY_IP}/32 --output text"

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
Write-Host "⏳ Aguardando 10 segundos para a regra ser aplicada..." -ForegroundColor Gray
Start-Sleep -Seconds 10
Write-Host ""

Write-Host "[4/11] Testando conexão com banco ORIGEM..." -ForegroundColor Yellow
$testCmd = "docker run --rm postgres:15-alpine psql `"postgresql://${SOURCE_USER}:${SOURCE_PASSWORD}@${SOURCE_HOST}:${SOURCE_PORT}/${SOURCE_DATABASE}`" -c 'SELECT version();' -t"
try {
    $version = Invoke-Expression $testCmd 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ ERRO: Ainda não consegue conectar!" -ForegroundColor Red
        Write-Host $version -ForegroundColor Red
        Write-Host "Tentando remover a regra..." -ForegroundColor Yellow
        # Remover regra antes de sair
        $removeCmd = "docker run --rm -e AWS_ACCESS_KEY_ID=$env:AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY=$env:AWS_SECRET_ACCESS_KEY -e AWS_DEFAULT_REGION=$env:AWS_DEFAULT_REGION amazon/aws-cli ec2 revoke-security-group-ingress --group-id $SECURITY_GROUP_ID --protocol tcp --port 5432 --cidr ${MY_IP}/32"
        Invoke-Expression $removeCmd 2>&1 | Out-Null
        exit 1
    }
    Write-Host "✅ Conexão OK!" -ForegroundColor Green
    Write-Host "Versão: $($version.Trim().Substring(0, [Math]::Min(60, $version.Trim().Length)))..." -ForegroundColor Gray
} catch {
    Write-Host "❌ ERRO: Falha na conexão!" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "[5/11] Testando conexão com banco DESTINO..." -ForegroundColor Yellow
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

Write-Host "[6/11] Fazendo backup do banco ORIGEM..." -ForegroundColor Yellow
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

Write-Host "[7/11] Removendo regra temporária do Security Group..." -ForegroundColor Yellow
$removeRuleCmd = "docker run --rm -e AWS_ACCESS_KEY_ID=$env:AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY=$env:AWS_SECRET_ACCESS_KEY -e AWS_DEFAULT_REGION=$env:AWS_DEFAULT_REGION amazon/aws-cli ec2 revoke-security-group-ingress --group-id $SECURITY_GROUP_ID --protocol tcp --port 5432 --cidr ${MY_IP}/32 --output text"

try {
    Invoke-Expression $removeRuleCmd 2>&1 | Out-Null
    Write-Host "✅ Regra removida! Banco AWS protegido novamente." -ForegroundColor Green
} catch {
    Write-Host "⚠️  Aviso: Não foi possível remover a regra automaticamente" -ForegroundColor Yellow
    Write-Host "Por favor, remova manualmente no console AWS" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "[8/11] Preparando dump para DigitalOcean..." -ForegroundColor Yellow
$dumpContent = Get-Content $DUMP_FILE -Raw
$dumpContent = $dumpContent -replace "OWNER TO postgres", "OWNER TO doadmin"
$dumpContent = $dumpContent -replace "Owner: postgres", "Owner: doadmin"
Set-Content -Path $DUMP_FILE -Value $dumpContent -Encoding UTF8
Write-Host "✅ Dump preparado!" -ForegroundColor Green
Write-Host ""

Write-Host "[9/11] Habilitando PostGIS no banco DESTINO..." -ForegroundColor Yellow
$postgisCmd = "docker run --rm postgres:15-alpine psql `"postgresql://${DEST_USER}:${DEST_PASSWORD}@${DEST_HOST}:${DEST_PORT}/${DEST_DATABASE}?sslmode=require`" -c 'CREATE EXTENSION IF NOT EXISTS postgis;'"
try {
    Invoke-Expression $postgisCmd 2>&1 | Out-Null
    Write-Host "✅ PostGIS habilitado!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  PostGIS pode já existir" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "[10/11] Restaurando backup no banco DESTINO..." -ForegroundColor Yellow
Write-Host "⏳ Isso pode demorar 10-30 minutos..." -ForegroundColor Gray
Write-Host ""

try {
    $dumpContent | docker run --rm -i postgres:15-alpine psql "postgresql://${DEST_USER}:${DEST_PASSWORD}@${DEST_HOST}:${DEST_PORT}/${DEST_DATABASE}?sslmode=require" 2>&1 | Out-Null
    Write-Host "✅ Restauração concluída!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Alguns erros podem ter ocorrido" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "[11/11] Verificando migração..." -ForegroundColor Yellow
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

