# 🚀 Guia de Execução - Sistema PAM

## 📋 Resumo

Este guia explica como fazer build e executar todo o sistema PAM com todos os microserviços e aplicações web.

## 🔧 Configuração de Portas

Todos os serviços foram configurados para rodar no **range de portas 9000**:

### Microserviços .NET (9001-9012)
- **MS_Authentication**: http://localhost:9001
- **MS_Consumer**: http://localhost:9002
- **MS_Partner**: http://localhost:9003
- **MS_Catalog**: http://localhost:9004
- **MS_Order**: http://localhost:9005
- **MS_Billing**: http://localhost:9006
- **MS_Logistics**: http://localhost:9007
- **MS_Communication**: http://localhost:9008
- **MS_Report**: http://localhost:9009
- **MS_Storage**: http://localhost:9010
- **MS_Reputation**: http://localhost:9011
- **MS_Offer**: http://localhost:9012

### Aplicações Web (9026-9028)
- **PAM_AdminWeb**: http://localhost:9026
- **PAM_PartnerWeb**: http://localhost:9028

## 🛠️ Scripts Disponíveis

### 1. `start-services.ps1`
Inicia todos os serviços em janelas separadas do PowerShell.

```powershell
powershell -ExecutionPolicy Bypass -File start-services.ps1
```

**O que faz:**
- Inicia todos os 12 microserviços .NET
- Inicia as 2 aplicações web Next.js
- Abre cada serviço em uma janela minimizada do PowerShell
- Executa health check após 30 segundos

### 2. `stop-services.ps1`
Para todos os serviços rodando nas portas configuradas.

```powershell
powershell -ExecutionPolicy Bypass -File stop-services.ps1
```

**O que faz:**
- Verifica todas as portas do range 9000
- Para todos os processos encontrados
- Mostra resumo de processos parados

### 3. `check-health.ps1`
Verifica o status de todos os serviços.

```powershell
powershell -ExecutionPolicy Bypass -File check-health.ps1
```

**O que faz:**
- Verifica se as portas estão abertas
- Testa se os serviços HTTP estão respondendo
- Verifica endpoints de health (para APIs)
- Mostra resumo completo do sistema

## 📝 Passo a Passo para Executar

### Opção 1: Execução Automática (Recomendado)

1. **Abra o PowerShell como Administrador**

2. **Navegue até o diretório do projeto**
   ```powershell
   cd C:\Users\Emmanuel1\Documents\PAM
   ```

3. **Execute o script de inicialização**
   ```powershell
   .\start-services.ps1
   ```

4. **Aguarde os serviços iniciarem** (aproximadamente 1-2 minutos)

5. **Verifique o status**
   ```powershell
   .\check-health.ps1
   ```

### Opção 2: Execução Manual de um Serviço

Para testar um serviço específico:

1. **Navegue até o diretório do microserviço**
   ```powershell
   cd MS_Authentication
   ```

2. **Faça o build**
   ```powershell
   dotnet build --configuration Release
   ```

3. **Execute o serviço**
   ```powershell
   cd WebApi
   $env:ASPNETCORE_URLS = "http://localhost:9001"
   dotnet run --no-build --configuration Release
   ```

### Opção 3: Aplicações Web

Para executar as aplicações web:

1. **PAM_AdminWeb**
   ```powershell
   cd PAM_AdminWeb
   yarn install  # Primeira vez apenas
   yarn dev      # Inicia na porta 9026
   ```

2. **PAM_PartnerWeb**
   ```powershell
   cd PAM_PartnerWeb
   yarn install  # Primeira vez apenas
   yarn dev      # Inicia na porta 9028
   ```

## 🔍 Verificação de Serviços

### Endpoints Importantes

#### Microserviços .NET
Cada microserviço possui:
- **Health Check**: `http://localhost:900X/health`
- **Swagger UI**: `http://localhost:900X/swagger`
- **API Base**: `http://localhost:900X/api/v1/`

#### Aplicações Web
- **Admin Dashboard**: http://localhost:9026
- **Partner Portal**: http://localhost:9028

### Teste Manual de Health Check

```powershell
# Testar MS_Authentication
Invoke-WebRequest -Uri "http://localhost:9001/health"

# Testar MS_Consumer
Invoke-WebRequest -Uri "http://localhost:9002/health"

# Testar Admin Web
Invoke-WebRequest -Uri "http://localhost:9026"
```

## ⚠️ Troubleshooting

### Problema: Porta já em uso
```powershell
# Verificar qual processo está usando a porta
Get-NetTCPConnection -LocalPort 9001 | Select-Object OwningProcess

# Parar o processo
Stop-Process -Id <PID> -Force
```

### Problema: Serviço não inicia
1. Verifique se o .NET 6.0 SDK está instalado
   ```powershell
   dotnet --version
   ```

2. Verifique se há erros de compilação
   ```powershell
   cd MS_Authentication
   dotnet build
   ```

3. Verifique os logs na janela do PowerShell do serviço

### Problema: Aplicação web não inicia
1. Verifique se o Node.js está instalado
   ```powershell
   node --version
   yarn --version
   ```

2. Limpe e reinstale dependências
   ```powershell
   cd PAM_AdminWeb
   Remove-Item -Recurse -Force node_modules, .next
   yarn install
   yarn dev
   ```

## 📊 Monitoramento

### Ver todos os processos dotnet rodando
```powershell
Get-Process dotnet | Select-Object Id, StartTime, CPU
```

### Ver todos os processos node rodando
```powershell
Get-Process node | Select-Object Id, StartTime, CPU
```

### Ver uso de portas
```powershell
Get-NetTCPConnection -LocalPort 9001,9002,9003,9004,9005,9006,9007,9008,9009,9010,9011,9012,9026,9028 | Format-Table
```

## 🎯 Próximos Passos

Após todos os serviços estarem rodando:

1. **Acesse o Admin Dashboard**: http://localhost:9026
2. **Acesse o Partner Portal**: http://localhost:9028
3. **Explore as APIs via Swagger**: http://localhost:9001/swagger
4. **Execute testes de integração**
5. **Configure banco de dados** (se necessário)

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs nas janelas do PowerShell
2. Execute `check-health.ps1` para diagnóstico
3. Verifique se todas as dependências estão instaladas
4. Consulte a documentação de cada microserviço

---

**Desenvolvido com ❤️ pela equipe PAM**
