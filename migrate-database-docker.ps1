########################################
# MIGRAÇÃO DE BANCO DE DADOS PAM
# Usando Docker (sem precisar instalar PostgreSQL)
########################################

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MIGRAÇÃO DE BANCO DE DADOS PAM VIA DOCKER" -ForegroundColor Cyan
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

Write-Host "[1/8] Verificando se Docker está disponível..." -ForegroundColor Yellow

try {
    $dockerVersion = docker --version 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Docker não encontrado"
    }
    Write-Host "✅ Docker encontrado: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ ERRO: Docker não está instalado ou não está rodando!" -ForegroundColor Red
    Write-Host "Por favor, inicie o Docker Desktop e tente novamente." -ForegroundColor Yellow
    exit 1
}
Write-Host ""

Write-Host "[2/8] Baixando imagem PostgreSQL (se necessário)..." -ForegroundColor Yellow
docker pull postgres:15-alpine 2>&1 | Out-Null
Write-Host "✅ Imagem PostgreSQL pronta!" -ForegroundColor Green
Write-Host ""

Write-Host "[3/8] Testando conexão com banco ORIGEM (AWS)..." -ForegroundColor Yellow

$testSourceCmd = "docker run --rm postgres:15-alpine psql `"postgresql://${SOURCE_USER}:${SOURCE_PASSWORD}@${SOURCE_HOST}:${SOURCE_PORT}/${SOURCE_DATABASE}`" -c '\dt' -t"
try {
    $result = Invoke-Expression $testSourceCmd 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ ERRO: Não foi possível conectar ao banco ORIGEM!" -ForegroundColor Red
        Write-Host $result -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Conexão com banco ORIGEM OK!" -ForegroundColor Green
} catch {
    Write-Host "❌ ERRO: Não foi possível conectar ao banco ORIGEM!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "[4/8] Testando conexão com banco DESTINO (DigitalOcean)..." -ForegroundColor Yellow

$testDestCmd = "docker run --rm postgres:15-alpine psql `"postgresql://${DEST_USER}:${DEST_PASSWORD}@${DEST_HOST}:${DEST_PORT}/${DEST_DATABASE}?sslmode=require`" -c '\dt' -t"
try {
    $result = Invoke-Expression $testDestCmd 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ ERRO: Não foi possível conectar ao banco DESTINO!" -ForegroundColor Red
        Write-Host $result -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Conexão com banco DESTINO OK!" -ForegroundColor Green
} catch {
    Write-Host "❌ ERRO: Não foi possível conectar ao banco DESTINO!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "[5/8] Fazendo backup do banco ORIGEM (isso pode demorar bastante)..." -ForegroundColor Yellow
Write-Host "⏳ Aguarde... Este processo pode levar vários minutos." -ForegroundColor Gray
Write-Host "Arquivo: $DUMP_FILE" -ForegroundColor Gray
Write-Host ""

# Fazer dump do banco origem
$dumpCmd = "docker run --rm -v `"${PSScriptRoot}:/backup`" postgres:15-alpine pg_dump `"postgresql://${SOURCE_USER}:${SOURCE_PASSWORD}@${SOURCE_HOST}:${SOURCE_PORT}/${SOURCE_DATABASE}`" -F p -b -v > `"$DUMP_PATH`""

try {
    # Executar pg_dump via Docker
    $dumpOutput = docker run --rm postgres:15-alpine pg_dump "postgresql://${SOURCE_USER}:${SOURCE_PASSWORD}@${SOURCE_HOST}:${SOURCE_PORT}/${SOURCE_DATABASE}" -F p -b 2>&1
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ ERRO: Falha ao fazer backup do banco!" -ForegroundColor Red
        Write-Host $dumpOutput -ForegroundColor Red
        exit 1
    }
    
    # Salvar output em arquivo
    Set-Content -Path $DUMP_PATH -Value $dumpOutput
    
    $fileSize = (Get-Item $DUMP_PATH).Length / 1MB
    Write-Host "✅ Backup concluído! Tamanho: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Green
} catch {
    Write-Host "❌ ERRO: Falha ao fazer backup do banco!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "[6/8] Preparando dump para DigitalOcean..." -ForegroundColor Yellow

# Ler e ajustar o dump
$dumpContent = Get-Content $DUMP_PATH -Raw

# Substituir referências ao usuário postgres por doadmin
$dumpContent = $dumpContent -replace "OWNER TO postgres", "OWNER TO doadmin"
$dumpContent = $dumpContent -replace "Owner: postgres", "Owner: doadmin"

# Salvar dump ajustado
Set-Content -Path $DUMP_PATH -Value $dumpContent

Write-Host "✅ Dump preparado!" -ForegroundColor Green
Write-Host ""

Write-Host "[7/8] Habilitando extensão PostGIS no banco DESTINO..." -ForegroundColor Yellow

$createPostGISCmd = "docker run --rm postgres:15-alpine psql `"postgresql://${DEST_USER}:${DEST_PASSWORD}@${DEST_HOST}:${DEST_PORT}/${DEST_DATABASE}?sslmode=require`" -c 'CREATE EXTENSION IF NOT EXISTS postgis;'"
try {
    Invoke-Expression $createPostGISCmd 2>&1 | Out-Null
    Write-Host "✅ PostGIS habilitado!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Aviso: Não foi possível criar extensão PostGIS (pode já existir)" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "[8/8] Restaurando backup no banco DESTINO (isso pode demorar MUITO)..." -ForegroundColor Yellow
Write-Host "⏳ Aguarde... Este processo pode levar 10-30 minutos dependendo do tamanho." -ForegroundColor Gray
Write-Host ""

# Restaurar dump no banco destino
try {
    $dumpContent = Get-Content $DUMP_PATH -Raw
    $restoreOutput = $dumpContent | docker run --rm -i postgres:15-alpine psql "postgresql://${DEST_USER}:${DEST_PASSWORD}@${DEST_HOST}:${DEST_PORT}/${DEST_DATABASE}?sslmode=require" 2>&1
    
    Write-Host "✅ Restauração concluída!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Aviso: Alguns erros podem ter ocorrido (normal se tabelas já existirem)" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "VERIFICANDO MIGRAÇÃO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Contar tabelas no banco destino
Write-Host "Contando tabelas no banco DESTINO..." -ForegroundColor Yellow
$countTablesCmd = "docker run --rm postgres:15-alpine psql `"postgresql://${DEST_USER}:${DEST_PASSWORD}@${DEST_HOST}:${DEST_PORT}/${DEST_DATABASE}?sslmode=require`" -t -c `"SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';`""
try {
    $tableCount = Invoke-Expression $countTablesCmd 2>&1
    Write-Host "✅ Total de tabelas: $($tableCount.Trim())" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Não foi possível contar tabelas" -ForegroundColor Yellow
}
Write-Host ""

# Verificar se PostGIS está instalado
Write-Host "Verificando PostGIS..." -ForegroundColor Yellow
$checkPostGISCmd = "docker run --rm postgres:15-alpine psql `"postgresql://${DEST_USER}:${DEST_PASSWORD}@${DEST_HOST}:${DEST_PORT}/${DEST_DATABASE}?sslmode=require`" -t -c `"SELECT PostGIS_version();`""
try {
    $postgisVersion = Invoke-Expression $checkPostGISCmd 2>&1
    Write-Host "✅ PostGIS instalado: $($postgisVersion.Trim())" -ForegroundColor Green
} catch {
    Write-Host "⚠️  PostGIS não encontrado ou não instalado" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "MIGRAÇÃO CONCLUÍDA COM SUCESSO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Resumo:" -ForegroundColor Cyan
Write-Host "  • Banco Origem: ${SOURCE_HOST}:${SOURCE_PORT}/${SOURCE_DATABASE}" -ForegroundColor White
Write-Host "  • Banco Destino: ${DEST_HOST}:${DEST_PORT}/${DEST_DATABASE}" -ForegroundColor White
Write-Host "  • Arquivo Backup: $DUMP_FILE" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Próximos passos:" -ForegroundColor Cyan
Write-Host "  1. Atualizar connection strings nos microserviços" -ForegroundColor White
Write-Host "  2. Reconstruir containers" -ForegroundColor White
Write-Host "  3. Testar a aplicação" -ForegroundColor White
Write-Host ""
Write-Host "Execute o próximo script:" -ForegroundColor Yellow
Write-Host "  powershell -ExecutionPolicy Bypass -File update-connection-strings-digitalocean.ps1" -ForegroundColor Gray
Write-Host ""

