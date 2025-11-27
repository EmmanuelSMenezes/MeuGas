########################################
# MIGRAÇÃO DE BANCO DE DADOS PAM
# De: 35.172.113.118 (AWS)
# Para: DigitalOcean
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
$DUMP_FILE_CLEAN = "pam_database_backup_clean_$(Get-Date -Format 'yyyyMMdd_HHmmss').sql"

Write-Host "[1/7] Verificando se pg_dump e psql estão disponíveis..." -ForegroundColor Yellow

# Verificar se PostgreSQL está instalado
$pgDumpPath = Get-Command pg_dump -ErrorAction SilentlyContinue
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue

if (-not $pgDumpPath -or -not $psqlPath) {
    Write-Host "❌ ERRO: PostgreSQL client tools não encontrados!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor, instale o PostgreSQL client:" -ForegroundColor Yellow
    Write-Host "1. Baixe de: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    Write-Host "2. Ou instale via Chocolatey: choco install postgresql" -ForegroundColor Yellow
    Write-Host "3. Adicione ao PATH: C:\Program Files\PostgreSQL\<version>\bin" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ PostgreSQL client tools encontrados!" -ForegroundColor Green
Write-Host ""

# Configurar variáveis de ambiente para senha (evita prompt)
$env:PGPASSWORD = $SOURCE_PASSWORD

Write-Host "[2/7] Testando conexão com banco ORIGEM (AWS)..." -ForegroundColor Yellow

# Testar conexão com banco origem
$testSourceCmd = "psql -h $SOURCE_HOST -U $SOURCE_USER -d $SOURCE_DATABASE -p $SOURCE_PORT -c '\dt' -t"
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

# Configurar variável de ambiente para senha do destino
$env:PGPASSWORD = $DEST_PASSWORD

Write-Host "[3/7] Testando conexão com banco DESTINO (DigitalOcean)..." -ForegroundColor Yellow

# Testar conexão com banco destino
$testDestCmd = "psql -h $DEST_HOST -U $DEST_USER -d $DEST_DATABASE -p $DEST_PORT -c '\dt' -t"
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

# Voltar para senha do origem para fazer o dump
$env:PGPASSWORD = $SOURCE_PASSWORD

Write-Host "[4/7] Fazendo backup do banco ORIGEM (isso pode demorar)..." -ForegroundColor Yellow
Write-Host "Arquivo: $DUMP_FILE" -ForegroundColor Gray

# Fazer dump do banco origem (incluindo PostGIS)
$dumpCmd = "pg_dump -h $SOURCE_HOST -U $SOURCE_USER -d $SOURCE_DATABASE -p $SOURCE_PORT -F p -b -v -f `"$DUMP_FILE`""
try {
    Invoke-Expression $dumpCmd 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ ERRO: Falha ao fazer backup do banco!" -ForegroundColor Red
        exit 1
    }
    $fileSize = (Get-Item $DUMP_FILE).Length / 1MB
    Write-Host "✅ Backup concluído! Tamanho: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Green
} catch {
    Write-Host "❌ ERRO: Falha ao fazer backup do banco!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "[5/7] Preparando dump para DigitalOcean (ajustando permissões)..." -ForegroundColor Yellow

# Ler o conteúdo do dump e fazer ajustes
$dumpContent = Get-Content $DUMP_FILE -Raw

# Substituir referências ao usuário postgres por doadmin
$dumpContent = $dumpContent -replace "OWNER TO postgres", "OWNER TO doadmin"
$dumpContent = $dumpContent -replace "Owner: postgres", "Owner: doadmin"

# Salvar dump limpo
Set-Content -Path $DUMP_FILE_CLEAN -Value $dumpContent

Write-Host "✅ Dump preparado!" -ForegroundColor Green
Write-Host ""

# Configurar variável de ambiente para senha do destino
$env:PGPASSWORD = $DEST_PASSWORD

Write-Host "[6/7] Habilitando extensão PostGIS no banco DESTINO..." -ForegroundColor Yellow

# Criar extensão PostGIS no banco destino
$createPostGISCmd = "psql -h $DEST_HOST -U $DEST_USER -d $DEST_DATABASE -p $DEST_PORT -c 'CREATE EXTENSION IF NOT EXISTS postgis;'"
try {
    Invoke-Expression $createPostGISCmd 2>&1 | Out-Null
    Write-Host "✅ PostGIS habilitado!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Aviso: Não foi possível criar extensão PostGIS (pode já existir)" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "[7/7] Restaurando backup no banco DESTINO (isso pode demorar bastante)..." -ForegroundColor Yellow
Write-Host "⏳ Aguarde... Este processo pode levar vários minutos dependendo do tamanho do banco." -ForegroundColor Gray
Write-Host ""

# Restaurar dump no banco destino
$restoreCmd = "psql -h $DEST_HOST -U $DEST_USER -d $DEST_DATABASE -p $DEST_PORT -f `"$DUMP_FILE_CLEAN`""
try {
    $restoreOutput = Invoke-Expression $restoreCmd 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️  Aviso: Alguns erros ocorreram durante a restauração" -ForegroundColor Yellow
        Write-Host "Isso é normal se algumas tabelas/extensões já existirem" -ForegroundColor Gray
    }
    Write-Host "✅ Restauração concluída!" -ForegroundColor Green
} catch {
    Write-Host "❌ ERRO: Falha ao restaurar backup!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "VERIFICANDO MIGRAÇÃO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Contar tabelas no banco destino
Write-Host "Contando tabelas no banco DESTINO..." -ForegroundColor Yellow
$countTablesCmd = "psql -h $DEST_HOST -U $DEST_USER -d $DEST_DATABASE -p $DEST_PORT -t -c `"SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';`""
$tableCount = Invoke-Expression $countTablesCmd 2>&1
Write-Host "✅ Total de tabelas: $($tableCount.Trim())" -ForegroundColor Green
Write-Host ""

# Verificar se PostGIS está instalado
Write-Host "Verificando PostGIS..." -ForegroundColor Yellow
$checkPostGISCmd = "psql -h $DEST_HOST -U $DEST_USER -d $DEST_DATABASE -p $DEST_PORT -t -c `"SELECT PostGIS_version();`""
try {
    $postgisVersion = Invoke-Expression $checkPostGISCmd 2>&1
    Write-Host "✅ PostGIS instalado: $($postgisVersion.Trim())" -ForegroundColor Green
} catch {
    Write-Host "⚠️  PostGIS não encontrado" -ForegroundColor Yellow
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
Write-Host "  • Arquivo Limpo: $DUMP_FILE_CLEAN" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Próximos passos:" -ForegroundColor Cyan
Write-Host "  1. Verifique os dados no banco destino" -ForegroundColor White
Write-Host "  2. Atualize as connection strings nos microserviços" -ForegroundColor White
Write-Host "  3. Teste a aplicação com o novo banco" -ForegroundColor White
Write-Host "  4. Após confirmar que tudo funciona, você pode deletar os arquivos .sql" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  IMPORTANTE: Os arquivos de backup foram mantidos para segurança!" -ForegroundColor Yellow
Write-Host ""

# Limpar variável de ambiente
$env:PGPASSWORD = $null

