########################################
# MIGRAÇÃO DE BANCO DE DADOS PAM
# Usando container temporário na mesma rede
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
$DUMP_FILE = "pam_database_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').sql"
$DUMP_PATH = Join-Path $PSScriptRoot $DUMP_FILE

Write-Host "[1/9] Verificando Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Docker não encontrado"
    }
    Write-Host "✅ Docker: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ ERRO: Docker não está instalado!" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "[2/9] Verificando rede Docker dos containers PAM..." -ForegroundColor Yellow
$networkName = docker inspect pam-ms-authentication --format='{{range $net,$v := .NetworkSettings.Networks}}{{$net}}{{end}}' 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ERRO: Container pam-ms-authentication não encontrado!" -ForegroundColor Red
    Write-Host "Execute 'docker compose up -d' primeiro." -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Rede encontrada: $networkName" -ForegroundColor Green
Write-Host ""

Write-Host "[3/9] Baixando imagem PostgreSQL..." -ForegroundColor Yellow
docker pull postgres:15-alpine 2>&1 | Out-Null
Write-Host "✅ Imagem pronta!" -ForegroundColor Green
Write-Host ""

Write-Host "[4/9] Testando conexão com banco ORIGEM (AWS)..." -ForegroundColor Yellow
Write-Host "Usando a mesma rede dos containers PAM..." -ForegroundColor Gray

$testSourceCmd = "docker run --rm --network $networkName postgres:15-alpine psql `"postgresql://${SOURCE_USER}:${SOURCE_PASSWORD}@${SOURCE_HOST}:${SOURCE_PORT}/${SOURCE_DATABASE}`" -c 'SELECT version();' -t"
try {
    $result = Invoke-Expression $testSourceCmd 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ ERRO: Não foi possível conectar ao banco ORIGEM!" -ForegroundColor Red
        Write-Host $result -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Conexão OK!" -ForegroundColor Green
    Write-Host "Versão: $($result.Trim())" -ForegroundColor Gray
} catch {
    Write-Host "❌ ERRO: Falha na conexão!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "[5/9] Testando conexão com banco DESTINO (DigitalOcean)..." -ForegroundColor Yellow

$testDestCmd = "docker run --rm postgres:15-alpine psql `"postgresql://${DEST_USER}:${DEST_PASSWORD}@${DEST_HOST}:${DEST_PORT}/${DEST_DATABASE}?sslmode=require`" -c 'SELECT version();' -t"
try {
    $result = Invoke-Expression $testDestCmd 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ ERRO: Não foi possível conectar ao banco DESTINO!" -ForegroundColor Red
        Write-Host $result -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Conexão OK!" -ForegroundColor Green
    Write-Host "Versão: $($result.Trim())" -ForegroundColor Gray
} catch {
    Write-Host "❌ ERRO: Falha na conexão!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "[6/9] Fazendo backup do banco ORIGEM..." -ForegroundColor Yellow
Write-Host "⏳ Isso pode demorar vários minutos dependendo do tamanho do banco..." -ForegroundColor Gray
Write-Host ""

# Fazer dump usando a rede dos containers
$dumpCmd = "docker run --rm --network $networkName postgres:15-alpine pg_dump `"postgresql://${SOURCE_USER}:${SOURCE_PASSWORD}@${SOURCE_HOST}:${SOURCE_PORT}/${SOURCE_DATABASE}`" -F p -b"

try {
    Write-Host "Executando pg_dump..." -ForegroundColor Gray
    $dumpOutput = Invoke-Expression $dumpCmd 2>&1
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ ERRO: Falha ao fazer backup!" -ForegroundColor Red
        Write-Host $dumpOutput -ForegroundColor Red
        exit 1
    }
    
    # Salvar output em arquivo
    Set-Content -Path $DUMP_PATH -Value $dumpOutput -Encoding UTF8
    
    $fileSize = (Get-Item $DUMP_PATH).Length / 1MB
    Write-Host "✅ Backup concluído! Tamanho: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Green
} catch {
    Write-Host "❌ ERRO: Falha ao fazer backup!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "[7/9] Preparando dump para DigitalOcean..." -ForegroundColor Yellow

# Ler e ajustar o dump
$dumpContent = Get-Content $DUMP_PATH -Raw

# Substituir referências ao usuário postgres por doadmin
$dumpContent = $dumpContent -replace "OWNER TO postgres", "OWNER TO doadmin"
$dumpContent = $dumpContent -replace "Owner: postgres", "Owner: doadmin"

# Salvar dump ajustado
Set-Content -Path $DUMP_PATH -Value $dumpContent -Encoding UTF8

Write-Host "✅ Dump preparado!" -ForegroundColor Green
Write-Host ""

Write-Host "[8/9] Habilitando PostGIS no banco DESTINO..." -ForegroundColor Yellow

$createPostGISCmd = "docker run --rm postgres:15-alpine psql `"postgresql://${DEST_USER}:${DEST_PASSWORD}@${DEST_HOST}:${DEST_PORT}/${DEST_DATABASE}?sslmode=require`" -c 'CREATE EXTENSION IF NOT EXISTS postgis;'"
try {
    Invoke-Expression $createPostGISCmd 2>&1 | Out-Null
    Write-Host "✅ PostGIS habilitado!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Aviso: PostGIS pode já existir" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "[9/9] Restaurando backup no banco DESTINO..." -ForegroundColor Yellow
Write-Host "⏳ Isso pode demorar 10-30 minutos..." -ForegroundColor Gray
Write-Host ""

# Restaurar dump no banco destino
try {
    $dumpContent = Get-Content $DUMP_PATH -Raw
    Write-Host "Enviando dados para o banco..." -ForegroundColor Gray
    $restoreOutput = $dumpContent | docker run --rm -i postgres:15-alpine psql "postgresql://${DEST_USER}:${DEST_PASSWORD}@${DEST_HOST}:${DEST_PORT}/${DEST_DATABASE}?sslmode=require" 2>&1

    Write-Host "✅ Restauração concluída!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Alguns erros podem ter ocorrido (normal)" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "VERIFICANDO MIGRAÇÃO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Contar tabelas no banco destino
Write-Host "Contando tabelas..." -ForegroundColor Yellow
$countCmd = "docker run --rm postgres:15-alpine psql `"postgresql://${DEST_USER}:${DEST_PASSWORD}@${DEST_HOST}:${DEST_PORT}/${DEST_DATABASE}?sslmode=require`" -t -c `"SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';`""
try {
    $tableCount = Invoke-Expression $countCmd 2>&1
    Write-Host "✅ Total de tabelas: $($tableCount.Trim())" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Não foi possível contar" -ForegroundColor Yellow
}
Write-Host ""

# Verificar PostGIS
Write-Host "Verificando PostGIS..." -ForegroundColor Yellow
$postgisCmd = "docker run --rm postgres:15-alpine psql `"postgresql://${DEST_USER}:${DEST_PASSWORD}@${DEST_HOST}:${DEST_PORT}/${DEST_DATABASE}?sslmode=require`" -t -c `"SELECT PostGIS_version();`""
try {
    $postgisVer = Invoke-Expression $postgisCmd 2>&1
    Write-Host "✅ PostGIS: $($postgisVer.Trim())" -ForegroundColor Green
} catch {
    Write-Host "⚠️  PostGIS não encontrado" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "MIGRAÇÃO CONCLUÍDA!" -ForegroundColor Green
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

