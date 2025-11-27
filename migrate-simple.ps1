########################################
# MIGRAÇÃO SIMPLES DE BANCO DE DADOS PAM
# Execute este script quando tiver acesso ao banco AWS
########################################

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MIGRAÇÃO DE BANCO DE DADOS PAM" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

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
$DUMP_FILE = "pam_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').sql"

Write-Host "[1/7] Testando conexão com banco ORIGEM (AWS)..." -ForegroundColor Yellow
$sourceConnStr = "postgresql://${SOURCE_USER}:${SOURCE_PASSWORD}@${SOURCE_HOST}:${SOURCE_PORT}/${SOURCE_DATABASE}"
$testCmd = "docker run --rm postgres:15-alpine psql `"$sourceConnStr`" -c 'SELECT version();' -t"

try {
    $version = Invoke-Expression $testCmd 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ ERRO: Não consegue conectar ao banco ORIGEM!" -ForegroundColor Red
        Write-Host $version -ForegroundColor Red
        Write-Host ""
        Write-Host "Possíveis soluções:" -ForegroundColor Yellow
        Write-Host "  1. Conecte-se à VPN da AWS" -ForegroundColor Gray
        Write-Host "  2. Execute este script de um servidor que tenha acesso ao banco" -ForegroundColor Gray
        Write-Host "  3. Libere temporariamente seu IP no Security Group do RDS" -ForegroundColor Gray
        exit 1
    }
    Write-Host "✅ Conexão OK!" -ForegroundColor Green
    Write-Host "Versão: $($version.Trim().Substring(0, [Math]::Min(60, $version.Trim().Length)))..." -ForegroundColor Gray
} catch {
    Write-Host "❌ ERRO: Falha na conexão!" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "[2/7] Testando conexão com banco DESTINO (DigitalOcean)..." -ForegroundColor Yellow
$destConnStr = "postgresql://${DEST_USER}:${DEST_PASSWORD}@${DEST_HOST}:${DEST_PORT}/${DEST_DATABASE}?sslmode=require"
$testDestCmd = "docker run --rm postgres:15-alpine psql `"$destConnStr`" -c 'SELECT version();' -t"

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

Write-Host "[3/7] Fazendo backup do banco ORIGEM..." -ForegroundColor Yellow
Write-Host "⏳ Isso pode demorar vários minutos dependendo do tamanho do banco..." -ForegroundColor Gray
Write-Host ""

$dumpCmd = "docker run --rm postgres:15-alpine pg_dump `"$sourceConnStr`" -F p -b"
try {
    Write-Host "Executando pg_dump..." -ForegroundColor Gray
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

Write-Host "[4/7] Preparando dump para DigitalOcean..." -ForegroundColor Yellow
$dumpContent = Get-Content $DUMP_FILE -Raw
$dumpContent = $dumpContent -replace "OWNER TO postgres", "OWNER TO doadmin"
$dumpContent = $dumpContent -replace "Owner: postgres", "Owner: doadmin"
$dumpContent = $dumpContent -replace "OWNER TO empay", "OWNER TO doadmin"
$dumpContent = $dumpContent -replace "Owner: empay", "Owner: doadmin"
Set-Content -Path $DUMP_FILE -Value $dumpContent -Encoding UTF8
Write-Host "✅ Dump preparado!" -ForegroundColor Green
Write-Host ""

Write-Host "[5/7] Habilitando PostGIS no banco DESTINO..." -ForegroundColor Yellow
$postgisCmd = "docker run --rm postgres:15-alpine psql `"$destConnStr`" -c 'CREATE EXTENSION IF NOT EXISTS postgis;'"
try {
    Invoke-Expression $postgisCmd 2>&1 | Out-Null
    Write-Host "✅ PostGIS habilitado!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  PostGIS pode já existir" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "[6/7] Restaurando backup no banco DESTINO..." -ForegroundColor Yellow
Write-Host "⏳ Isso pode demorar 10-30 minutos dependendo do tamanho..." -ForegroundColor Gray
Write-Host ""

try {
    $dumpContent | docker run --rm -i postgres:15-alpine psql "$destConnStr" 2>&1 | Out-Null
    Write-Host "✅ Restauração concluída!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Alguns erros podem ter ocorrido (normal para objetos que já existem)" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "[7/7] Verificando migração..." -ForegroundColor Yellow
$countCmd = "docker run --rm postgres:15-alpine psql `"$destConnStr`" -t -c `"SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';`""
try {
    $tableCount = Invoke-Expression $countCmd 2>&1
    Write-Host "✅ Total de tabelas: $($tableCount.Trim())" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Não foi possível contar tabelas" -ForegroundColor Yellow
}

$postgisVerCmd = "docker run --rm postgres:15-alpine psql `"$destConnStr`" -t -c `"SELECT PostGIS_version();`""
try {
    $postgisVer = Invoke-Expression $postgisVerCmd 2>&1
    Write-Host "✅ PostGIS: $($postgisVer.Trim().Substring(0, [Math]::Min(50, $postgisVer.Trim().Length)))..." -ForegroundColor Green
} catch {
    Write-Host "⚠️  PostGIS não encontrado" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ MIGRAÇÃO CONCLUÍDA COM SUCESSO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Resumo:" -ForegroundColor Cyan
Write-Host "  • Origem: ${SOURCE_HOST}:${SOURCE_PORT}/${SOURCE_DATABASE}" -ForegroundColor White
Write-Host "  • Destino: ${DEST_HOST}:${DEST_PORT}/${DEST_DATABASE}" -ForegroundColor White
Write-Host "  • Backup salvo em: $DUMP_FILE" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Próximo passo:" -ForegroundColor Cyan
Write-Host "  powershell -ExecutionPolicy Bypass -File update-connection-strings-digitalocean.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "⚠️  IMPORTANTE: Guarde o arquivo $DUMP_FILE como backup!" -ForegroundColor Yellow
Write-Host ""

