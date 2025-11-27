# 🔄 Migração de Banco de Dados PAM para DigitalOcean

## 📋 Resumo

Este guia descreve o processo completo de migração do banco de dados PostgreSQL do PAM do servidor AWS atual para o DigitalOcean.

---

## 🎯 Objetivo

Migrar **estrutura + dados + PostGIS** do banco atual para o novo banco DigitalOcean mantendo total compatibilidade.

---

## 📊 Informações dos Bancos

### Banco ORIGEM (AWS - Atual)
```
Host: 35.172.113.118
Port: 5432
Username: postgres
Password: Pam9628#d
Database: pam
SSL: Não
```

### Banco DESTINO (DigitalOcean - Novo)
```
Host: db-meugas-do-user-28455173-0.k.db.ondigitalocean.com
Port: 25060
Username: doadmin
Password: AVNS_dadGCvarjg_jSehm-IO
Database: defaultdb
SSL: Require
```

---

## 🔧 Pré-requisitos

### 1. PostgreSQL Client Tools

Você precisa ter o `pg_dump` e `psql` instalados no seu computador.

**Verificar se está instalado:**
```powershell
pg_dump --version
psql --version
```

**Se não estiver instalado:**

**Opção 1 - Download direto:**
- Baixe de: https://www.postgresql.org/download/windows/
- Instale apenas as ferramentas de cliente (não precisa do servidor)
- Adicione ao PATH: `C:\Program Files\PostgreSQL\<version>\bin`

**Opção 2 - Via Chocolatey:**
```powershell
choco install postgresql
```

### 2. Espaço em Disco

Certifique-se de ter espaço suficiente para o arquivo de backup (pode ser grande dependendo do tamanho do banco).

---

## 🚀 Processo de Migração

### Passo 1: Fazer Backup e Migrar o Banco

Execute o script de migração:

```powershell
powershell -ExecutionPolicy Bypass -File migrate-database-to-digitalocean.ps1
```

**O que este script faz:**

1. ✅ Verifica se as ferramentas PostgreSQL estão instaladas
2. ✅ Testa conexão com o banco ORIGEM (AWS)
3. ✅ Testa conexão com o banco DESTINO (DigitalOcean)
4. ✅ Faz backup completo do banco origem (estrutura + dados)
5. ✅ Ajusta permissões no dump (postgres → doadmin)
6. ✅ Habilita extensão PostGIS no banco destino
7. ✅ Restaura o backup no banco destino
8. ✅ Verifica se a migração foi bem-sucedida

**Tempo estimado:** 5-30 minutos (dependendo do tamanho do banco)

---

### Passo 2: Atualizar Connection Strings nos Microserviços

Após confirmar que a migração foi bem-sucedida, atualize as connection strings:

```powershell
powershell -ExecutionPolicy Bypass -File update-connection-strings-digitalocean.ps1
```

**O que este script faz:**

1. ✅ Atualiza todos os arquivos `appsettings.Development.json` dos 12 microserviços
2. ✅ Substitui a connection string antiga (AWS) pela nova (DigitalOcean)
3. ✅ Adiciona configuração SSL necessária para DigitalOcean

**Microserviços atualizados:**
- MS_Authentication
- MS_Billing
- MS_Catalog
- MS_Communication
- MS_Consumer
- MS_Logistics
- MS_Offer
- MS_Order
- MS_Partner
- MS_Report
- MS_Reputation
- MS_Storage

---

### Passo 3: Reconstruir e Reiniciar os Containers

Após atualizar as connection strings, reconstrua os containers:

```powershell
# Parar todos os containers
docker compose down

# Reconstruir e iniciar (isso pode demorar)
docker compose up -d --build
```

**Tempo estimado:** 10-20 minutos

---

### Passo 4: Verificar Funcionamento

1. **Verificar status dos containers:**
```powershell
docker compose ps
```

2. **Verificar logs dos microserviços:**
```powershell
docker compose logs -f ms-authentication
docker compose logs -f ms-consumer
```

3. **Testar aplicação:**
- Admin Web: http://localhost:9026
- Partner Web: http://localhost:9028

4. **Verificar conexão com banco:**
```powershell
# Conectar ao banco DigitalOcean
$env:PGPASSWORD="AVNS_dadGCvarjg_jSehm-IO"
psql -h db-meugas-do-user-28455173-0.k.db.ondigitalocean.com -U doadmin -d defaultdb -p 25060 -c "\dt"
```

---

## 📝 Nova Connection String

A nova connection string que será usada em todos os microserviços:

```
Host=db-meugas-do-user-28455173-0.k.db.ondigitalocean.com;Port=25060;Username=doadmin;Password=AVNS_dadGCvarjg_jSehm-IO;Database=defaultdb;SSL Mode=Require;Trust Server Certificate=true;
```

---

## ⚠️ Observações Importantes

### PostGIS

O script automaticamente:
- ✅ Habilita a extensão PostGIS no banco destino
- ✅ Migra todos os dados geoespaciais
- ✅ Mantém todos os tipos de dados espaciais (geometry, geography, etc.)

### SSL/TLS

O DigitalOcean **requer** SSL. A connection string inclui:
- `SSL Mode=Require` - Força uso de SSL
- `Trust Server Certificate=true` - Aceita certificado auto-assinado

### Permissões

O script ajusta automaticamente as permissões de `postgres` para `doadmin` durante a migração.

---

## 🔍 Troubleshooting

### Erro: "pg_dump: command not found"

**Solução:** Instale o PostgreSQL client tools (veja Pré-requisitos)

### Erro: "connection refused"

**Solução:** Verifique:
- Firewall/Security Groups permitem conexão nas portas 5432 e 25060
- Credenciais estão corretas
- Hosts estão acessíveis

### Erro: "SSL connection required"

**Solução:** Certifique-se de que a connection string inclui `SSL Mode=Require`

### Erro: "permission denied"

**Solução:** O script já ajusta permissões automaticamente. Se persistir, verifique se o usuário `doadmin` tem permissões de superuser no DigitalOcean.

---

## 📦 Arquivos Gerados

Após a migração, você terá:

- `pam_database_backup_YYYYMMDD_HHMMSS.sql` - Backup original
- `pam_database_backup_clean_YYYYMMDD_HHMMSS.sql` - Backup com permissões ajustadas

**⚠️ IMPORTANTE:** Mantenha estes arquivos até confirmar que tudo está funcionando perfeitamente!

---

## ✅ Checklist Final

- [ ] PostgreSQL client tools instalados
- [ ] Script de migração executado com sucesso
- [ ] Banco destino verificado (tabelas, PostGIS)
- [ ] Connection strings atualizadas nos microserviços
- [ ] Containers reconstruídos
- [ ] Aplicação testada e funcionando
- [ ] Backups salvos em local seguro

---

## 🆘 Suporte

Se encontrar problemas durante a migração:

1. Verifique os logs do script
2. Verifique os logs dos containers: `docker compose logs`
3. Teste conexão manual com o banco usando `psql`
4. Verifique se o PostGIS está instalado: `SELECT PostGIS_version();`

---

**Data de criação:** 2025-11-18
**Versão:** 1.0

