#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('========================================');
console.log('MIGRAÇÃO DE BANCO DE DADOS PAM');
console.log('========================================\n');

// Configurações
const SOURCE = {
  host: '35.172.113.118',
  port: 5432,
  user: 'postgres',
  password: 'Pam9628#d',
  database: 'pam'
};

const DEST = {
  host: 'db-meugas-do-user-28455173-0.k.db.ondigitalocean.com',
  port: 25060,
  user: 'doadmin',
  password: 'AVNS_dadGCvarjg_jSehm-IO',
  database: 'defaultdb',
  ssl: true
};

const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + '_' + new Date().toTimeString().split(' ')[0].replace(/:/g, '');
const DUMP_FILE = `pam_database_backup_${timestamp}.sql`;

// Função para executar comando
function runCommand(cmd, description) {
  return new Promise((resolve, reject) => {
    console.log(`\n[${description}]`);
    console.log(`Executando: ${cmd.substring(0, 100)}...`);
    
    exec(cmd, { maxBuffer: 1024 * 1024 * 100 }, (error, stdout, stderr) => {
      if (error && !stdout) {
        console.error(`❌ ERRO: ${error.message}`);
        if (stderr) console.error(stderr);
        reject(error);
        return;
      }
      
      if (stderr && !stderr.includes('NOTICE') && !stderr.includes('WARNING')) {
        console.log(`⚠️  Avisos: ${stderr.substring(0, 200)}`);
      }
      
      resolve(stdout);
    });
  });
}

// Função principal
async function migrate() {
  try {
    // Passo 1: Verificar Docker
    console.log('\n[1/8] Verificando Docker...');
    const dockerVersion = await runCommand('docker --version', 'Verificar Docker');
    console.log(`✅ Docker encontrado: ${dockerVersion.trim()}`);

    // Passo 2: Pull da imagem PostgreSQL
    console.log('\n[2/8] Baixando imagem PostgreSQL...');
    await runCommand('docker pull postgres:15-alpine', 'Pull imagem');
    console.log('✅ Imagem pronta!');

    // Passo 3: Testar conexão ORIGEM
    console.log('\n[3/8] Testando conexão com banco ORIGEM...');
    const sourceConnStr = `postgresql://${SOURCE.user}:${SOURCE.password}@${SOURCE.host}:${SOURCE.port}/${SOURCE.database}`;
    const testSourceCmd = `docker run --rm --network pam_pam-network postgres:15-alpine psql "${sourceConnStr}" -c "SELECT version();" -t`;
    
    try {
      const sourceVersion = await runCommand(testSourceCmd, 'Testar ORIGEM');
      console.log(`✅ Conexão OK! Versão: ${sourceVersion.trim().substring(0, 50)}...`);
    } catch (err) {
      console.log('⚠️  Tentando sem rede específica...');
      const testSourceCmd2 = `docker run --rm postgres:15-alpine psql "${sourceConnStr}" -c "SELECT version();" -t`;
      const sourceVersion = await runCommand(testSourceCmd2, 'Testar ORIGEM (sem rede)');
      console.log(`✅ Conexão OK! Versão: ${sourceVersion.trim().substring(0, 50)}...`);
    }

    // Passo 4: Testar conexão DESTINO
    console.log('\n[4/8] Testando conexão com banco DESTINO...');
    const destConnStr = `postgresql://${DEST.user}:${DEST.password}@${DEST.host}:${DEST.port}/${DEST.database}?sslmode=require`;
    const testDestCmd = `docker run --rm postgres:15-alpine psql "${destConnStr}" -c "SELECT version();" -t`;
    const destVersion = await runCommand(testDestCmd, 'Testar DESTINO');
    console.log(`✅ Conexão OK! Versão: ${destVersion.trim().substring(0, 50)}...`);

    // Passo 5: Fazer backup
    console.log('\n[5/8] Fazendo backup do banco ORIGEM...');
    console.log('⏳ Isso pode demorar vários minutos...\n');
    
    const dumpCmd = `docker run --rm --network pam_pam-network postgres:15-alpine pg_dump "${sourceConnStr}" -F p -b`;
    let dumpData;
    
    try {
      dumpData = await runCommand(dumpCmd, 'Backup com rede');
    } catch (err) {
      console.log('⚠️  Tentando sem rede específica...');
      const dumpCmd2 = `docker run --rm postgres:15-alpine pg_dump "${sourceConnStr}" -F p -b`;
      dumpData = await runCommand(dumpCmd2, 'Backup sem rede');
    }
    
    fs.writeFileSync(DUMP_FILE, dumpData, 'utf8');
    const fileSize = (fs.statSync(DUMP_FILE).size / 1024 / 1024).toFixed(2);
    console.log(`✅ Backup concluído! Tamanho: ${fileSize} MB`);

    // Passo 6: Ajustar dump
    console.log('\n[6/8] Preparando dump para DigitalOcean...');
    let dumpContent = fs.readFileSync(DUMP_FILE, 'utf8');
    dumpContent = dumpContent.replace(/OWNER TO postgres/g, 'OWNER TO doadmin');
    dumpContent = dumpContent.replace(/Owner: postgres/g, 'Owner: doadmin');
    fs.writeFileSync(DUMP_FILE, dumpContent, 'utf8');
    console.log('✅ Dump preparado!');

    // Passo 7: Habilitar PostGIS
    console.log('\n[7/8] Habilitando PostGIS no banco DESTINO...');
    const postgisCmd = `docker run --rm postgres:15-alpine psql "${destConnStr}" -c "CREATE EXTENSION IF NOT EXISTS postgis;"`;
    try {
      await runCommand(postgisCmd, 'Criar PostGIS');
      console.log('✅ PostGIS habilitado!');
    } catch (err) {
      console.log('⚠️  PostGIS pode já existir');
    }

    // Passo 8: Restaurar
    console.log('\n[8/8] Restaurando backup no banco DESTINO...');
    console.log('⏳ Isso pode demorar 10-30 minutos...\n');
    
    const restoreCmd = `docker run --rm -i postgres:15-alpine psql "${destConnStr}"`;
    await new Promise((resolve, reject) => {
      const child = exec(restoreCmd, { maxBuffer: 1024 * 1024 * 100 }, (error, stdout, stderr) => {
        if (error && !stdout) {
          reject(error);
          return;
        }
        resolve(stdout);
      });
      
      child.stdin.write(dumpContent);
      child.stdin.end();
    });
    
    console.log('✅ Restauração concluída!');

    // Verificação
    console.log('\n========================================');
    console.log('VERIFICANDO MIGRAÇÃO');
    console.log('========================================\n');

    const countCmd = `docker run --rm postgres:15-alpine psql "${destConnStr}" -t -c "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';"`;
    const tableCount = await runCommand(countCmd, 'Contar tabelas');
    console.log(`✅ Total de tabelas: ${tableCount.trim()}`);

    const postgisVerCmd = `docker run --rm postgres:15-alpine psql "${destConnStr}" -t -c "SELECT PostGIS_version();"`;
    try {
      const postgisVer = await runCommand(postgisVerCmd, 'Verificar PostGIS');
      console.log(`✅ PostGIS: ${postgisVer.trim().substring(0, 50)}...`);
    } catch (err) {
      console.log('⚠️  PostGIS não encontrado');
    }

    console.log('\n========================================');
    console.log('✅ MIGRAÇÃO CONCLUÍDA COM SUCESSO!');
    console.log('========================================\n');
    console.log('📊 Resumo:');
    console.log(`  • Origem: ${SOURCE.host}:${SOURCE.port}/${SOURCE.database}`);
    console.log(`  • Destino: ${DEST.host}:${DEST.port}/${DEST.database}`);
    console.log(`  • Backup: ${DUMP_FILE}\n`);
    console.log('🔧 Próximo passo:');
    console.log('  powershell -ExecutionPolicy Bypass -File update-connection-strings-digitalocean.ps1\n');

  } catch (error) {
    console.error('\n❌ ERRO NA MIGRAÇÃO:', error.message);
    process.exit(1);
  }
}

// Executar
migrate();

