# 🐳 PAM - Execução com Docker

## 📋 Arquivos Criados

Criei uma configuração Docker completa para todo o sistema PAM:

### Arquivos de Configuração:
- ✅ `docker-compose.yml` - Orquestração de todos os serviços
- ✅ `docker-build.bat` - Script para build das imagens
- ✅ `docker-up.bat` - Script para iniciar containers
- ✅ `docker-down.bat` - Script para parar containers

### Dockerfiles Atualizados:
- ✅ `PAM_AdminWeb/Dockerfile` - Porta 3000 (mapeada para 9026)
- ✅ `PAM_PartnerWeb/Dockerfile` - Porta 3000 (mapeada para 9028)
- ✅ Todos os microserviços já possuem Dockerfiles

## 🚀 Como Executar

### Opção 1: Scripts Batch (Recomendado)

#### 1. Build das Imagens
```batch
docker-build.bat
```

Este comando irá:
- Fazer build de todos os 12 microserviços .NET
- Fazer build das 2 aplicações web Next.js
- Usar build paralelo para maior velocidade

**Tempo estimado:** 10-20 minutos (primeira vez)

#### 2. Iniciar Containers
```batch
docker-up.bat
```

Este comando irá:
- Iniciar todos os containers em modo detached (-d)
- Aguardar 30 segundos
- Mostrar status de todos os containers
- Exibir lista de serviços disponíveis

#### 3. Parar Containers
```batch
docker-down.bat
```

### Opção 2: Comandos Docker Compose Diretos

#### Build
```bash
docker compose build --parallel
```

#### Iniciar
```bash
docker compose up -d
```

#### Ver logs
```bash
# Todos os serviços
docker compose logs -f

# Serviço específico
docker compose logs -f ms-authentication
docker compose logs -f admin-web
```

#### Parar
```bash
docker compose down
```

#### Parar e remover volumes
```bash
docker compose down -v
```

## 🌐 Portas Configuradas (Range 9000)

### Microserviços .NET (9001-9012)
| Serviço | Porta | URL | Swagger |
|---------|-------|-----|---------|
| MS_Authentication | 9001 | http://localhost:9001 | http://localhost:9001/swagger |
| MS_Consumer | 9002 | http://localhost:9002 | http://localhost:9002/swagger |
| MS_Partner | 9003 | http://localhost:9003 | http://localhost:9003/swagger |
| MS_Catalog | 9004 | http://localhost:9004 | http://localhost:9004/swagger |
| MS_Order | 9005 | http://localhost:9005 | http://localhost:9005/swagger |
| MS_Billing | 9006 | http://localhost:9006 | http://localhost:9006/swagger |
| MS_Logistics | 9007 | http://localhost:9007 | http://localhost:9007/swagger |
| MS_Communication | 9008 | http://localhost:9008 | http://localhost:9008/swagger |
| MS_Report | 9009 | http://localhost:9009 | http://localhost:9009/swagger |
| MS_Storage | 9010 | http://localhost:9010 | http://localhost:9010/swagger |
| MS_Reputation | 9011 | http://localhost:9011 | http://localhost:9011/swagger |
| MS_Offer | 9012 | http://localhost:9012 | http://localhost:9012/swagger |

### Aplicações Web (9026, 9028)
| Aplicação | Porta | URL |
|-----------|-------|-----|
| PAM_AdminWeb | 9026 | http://localhost:9026 |
| PAM_PartnerWeb | 9028 | http://localhost:9028 |

## 🔍 Comandos Úteis

### Verificar Status
```bash
docker compose ps
```

### Ver Logs em Tempo Real
```bash
# Todos os serviços
docker compose logs -f

# Apenas microserviços
docker compose logs -f ms-authentication ms-consumer ms-partner

# Apenas web apps
docker compose logs -f admin-web partner-web
```

### Reiniciar um Serviço Específico
```bash
docker compose restart ms-authentication
```

### Rebuild de um Serviço Específico
```bash
docker compose build ms-authentication
docker compose up -d ms-authentication
```

### Ver Recursos Utilizados
```bash
docker stats
```

### Acessar Shell de um Container
```bash
# Microserviço .NET
docker compose exec ms-authentication /bin/bash

# Aplicação Web
docker compose exec admin-web /bin/sh
```

## 📊 Estrutura do docker-compose.yml

```yaml
services:
  # 12 Microserviços .NET
  ms-authentication:    # Porta 9001
  ms-consumer:          # Porta 9002
  ms-partner:           # Porta 9003
  ms-catalog:           # Porta 9004
  ms-order:             # Porta 9005
  ms-billing:           # Porta 9006
  ms-logistics:         # Porta 9007
  ms-communication:     # Porta 9008
  ms-report:            # Porta 9009
  ms-storage:           # Porta 9010
  ms-reputation:        # Porta 9011
  ms-offer:             # Porta 9012
  
  # 2 Aplicações Web
  admin-web:            # Porta 9026
  partner-web:          # Porta 9028

networks:
  pam-network:          # Rede interna para comunicação entre serviços
```

## ⚙️ Configurações

### Variáveis de Ambiente
Cada microserviço está configurado com:
- `ASPNETCORE_ENVIRONMENT=Development`
- `ASPNETCORE_URLS=http://+:80`

Cada aplicação web está configurada com:
- `NODE_ENV=production`
- `PORT=3000`

### Rede
Todos os serviços estão na mesma rede `pam-network`, permitindo comunicação entre eles usando os nomes dos serviços.

Exemplo: `http://ms-authentication:80` pode ser acessado de qualquer outro container.

### Restart Policy
Todos os serviços estão configurados com `restart: unless-stopped`, garantindo que reiniciem automaticamente em caso de falha.

## 🐛 Troubleshooting

### Problema: Build falha
```bash
# Limpar cache do Docker
docker builder prune -a

# Rebuild sem cache
docker compose build --no-cache
```

### Problema: Porta já em uso
```bash
# Verificar o que está usando a porta
netstat -ano | findstr :9001

# Parar containers do PAM
docker compose down

# Parar todos os containers
docker stop $(docker ps -aq)
```

### Problema: Container não inicia
```bash
# Ver logs do container
docker compose logs ms-authentication

# Ver logs detalhados
docker compose logs --tail=100 ms-authentication
```

### Problema: Falta de espaço em disco
```bash
# Limpar imagens não utilizadas
docker image prune -a

# Limpar tudo (cuidado!)
docker system prune -a --volumes
```

## 📈 Monitoramento

### Health Check Manual
```bash
# Testar todos os microserviços
for i in {9001..9012}; do echo "Testing port $i"; curl -s http://localhost:$i/health || echo "FAILED"; done

# Testar aplicações web
curl http://localhost:9026
curl http://localhost:9028
```

### Ver Uso de Recursos
```bash
docker stats --no-stream
```

## 🎯 Próximos Passos

1. **Execute o build:**
   ```bash
   docker-build.bat
   ```

2. **Aguarde o build completar** (10-20 minutos)

3. **Inicie os containers:**
   ```bash
   docker-up.bat
   ```

4. **Verifique os logs:**
   ```bash
   docker compose logs -f
   ```

5. **Acesse os serviços:**
   - Admin Dashboard: http://localhost:9026
   - Partner Portal: http://localhost:9028
   - API Docs: http://localhost:9001/swagger

## 📝 Notas Importantes

- ⚠️ **Primeira execução:** O build pode levar 10-20 minutos
- ⚠️ **Banco de dados:** Você pode precisar configurar conexões de banco de dados nos appsettings
- ⚠️ **Memória:** Certifique-se de ter pelo menos 8GB de RAM disponível
- ⚠️ **Docker Desktop:** Deve estar rodando antes de executar os comandos

---

**Desenvolvido com ❤️ pela equipe PAM**
