# Deploy PAM no Kubernetes (DigitalOcean)

Este diretório contém todos os manifestos e scripts necessários para fazer deploy da plataforma PAM no Kubernetes do DigitalOcean.

## 📋 Pré-requisitos

- **kubectl** instalado e configurado
- **Docker** instalado
- **Node.js** e **npm** instalados (para build das aplicações web)
- Acesso ao cluster Kubernetes do DigitalOcean
- Arquivo `k8s-1-33-1-do-5-sfo3-1763495906297-kubeconfig.yaml` na raiz do projeto

## 🏗️ Arquitetura

### Infraestrutura
- **PostgreSQL 17**: Banco de dados com volume persistente (10GB)
- **RabbitMQ 3.13**: Message broker para comunicação entre microserviços

### Aplicações
- **12 Microserviços .NET 6.0**: Authentication, Billing, Catalog, Communication, Consumer, Logistics, Offer, Order, Partner, Report, Reputation, Storage
- **2 Aplicações Web Next.js**: Admin Web e Partner Web

### Recursos Kubernetes
- **Namespace**: `pam`
- **StatefulSet**: PostgreSQL com volume persistente
- **Deployments**: RabbitMQ, 12 microserviços, 2 web apps
- **Services**: ClusterIP para comunicação interna
- **Ingress**: Exposição externa com NGINX

## 🚀 Deploy Completo

### 1. Configurar kubectl

```powershell
$env:KUBECONFIG = "k8s-1-33-1-do-5-sfo3-1763495906297-kubeconfig.yaml"
kubectl cluster-info
```

### 2. Construir imagens Docker

```powershell
cd k8s
.\build-images.ps1
```

Este script irá:
- Construir imagens Docker de todos os 12 microserviços
- Fazer build do Next.js e construir imagens das aplicações web
- Tagear todas as imagens como `pam/<service>:latest`

### 3. Fazer deploy no Kubernetes

```powershell
.\deploy.ps1
```

Este script irá:
- Configurar kubectl para usar o cluster do DigitalOcean
- Aplicar todos os manifestos Kubernetes
- Aguardar todos os pods ficarem prontos
- Mostrar status dos recursos

### 4. Restaurar banco de dados

```powershell
.\restore-database.ps1
```

Este script irá:
- Aguardar o pod do PostgreSQL ficar pronto
- Criar a extensão uuid-ossp
- Copiar o backup para o pod
- Restaurar o backup no banco de dados
- Verificar os dados restaurados

## 📁 Estrutura de Arquivos

```
k8s/
├── 00-namespace.yaml              # Namespace 'pam'
├── 01-secrets.yaml                # Credenciais (DB, RabbitMQ, Twilio, JWT)
├── 02-configmap.yaml              # Configurações gerais
├── 03-postgres-pvc.yaml           # PersistentVolumeClaim (não usado - StatefulSet cria automaticamente)
├── 04-postgres-deployment.yaml    # PostgreSQL StatefulSet + Service
├── 05-rabbitmq-deployment.yaml    # RabbitMQ Deployment + Service
├── 06-microservices.yaml          # MS Authentication, Billing, Catalog
├── 07-microservices-part2.yaml    # MS Communication, Consumer, Logistics
├── 08-microservices-part3.yaml    # MS Offer, Order, Partner
├── 09-microservices-part4.yaml    # MS Report, Reputation, Storage
├── 10-web-apps.yaml               # Admin Web e Partner Web
├── 11-ingress.yaml                # Ingress NGINX
├── build-images.ps1               # Script para construir imagens
├── deploy.ps1                     # Script para fazer deploy
├── restore-database.ps1           # Script para restaurar banco
└── README.md                      # Este arquivo
```

## 🔧 Configurações Importantes

### Secrets (01-secrets.yaml)

**IMPORTANTE**: Antes de fazer deploy, edite o arquivo `01-secrets.yaml` e atualize:
- Credenciais do Twilio (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER)
- JWT Secret (se necessário)
- Senhas do PostgreSQL e RabbitMQ (se necessário)

### Ingress (11-ingress.yaml)

O Ingress está configurado para os seguintes domínios:
- `administrador.meugas.app` → Admin Web
- `parceiro.meugas.app` → Partner Web
- `api.meugas.app` → API Gateway (microserviços)

**Você precisa**:
1. Configurar DNS para apontar esses domínios para o IP do LoadBalancer
2. Instalar cert-manager para SSL (ou remover a configuração TLS)

## 📊 Comandos Úteis

### Ver status dos pods
```powershell
kubectl get pods -n pam
```

### Ver logs de um pod
```powershell
kubectl logs -n pam <pod-name>
```

### Ver logs em tempo real
```powershell
kubectl logs -n pam <pod-name> -f
```

### Acessar shell de um pod
```powershell
kubectl exec -it -n pam <pod-name> -- /bin/sh
```

### Ver services
```powershell
kubectl get svc -n pam
```

### Ver ingress e IP do LoadBalancer
```powershell
kubectl get ingress -n pam
```

### Deletar tudo
```powershell
kubectl delete namespace pam
```

## 🔍 Troubleshooting

### Pod não inicia
```powershell
kubectl describe pod -n pam <pod-name>
kubectl logs -n pam <pod-name>
```

### Verificar volume do PostgreSQL
```powershell
kubectl get pvc -n pam
kubectl describe pvc -n pam postgres-storage-postgres-0
```

### Testar conexão com PostgreSQL
```powershell
$podName = kubectl get pod -l app=postgres -n pam -o jsonpath='{.items[0].metadata.name}'
kubectl exec -it -n pam $podName -- psql -U postgres -d pam
```

### Testar conexão com RabbitMQ
```powershell
kubectl port-forward -n pam svc/rabbitmq-service 15672:15672
# Acesse http://localhost:15672 (admin/Pam9628#d)
```

## 🌐 Acessar Aplicações

Após configurar o DNS e o Ingress:
- Admin Web: https://administrador.meugas.app
- Partner Web: https://parceiro.meugas.app
- API: https://api.meugas.app

## 📝 Notas

- As imagens Docker usam `imagePullPolicy: Never` porque são construídas localmente
- Para produção, você deve fazer push das imagens para um registry (Docker Hub, DigitalOcean Container Registry, etc.)
- O PostgreSQL usa `do-block-storage` como StorageClass (padrão do DigitalOcean)
- Todos os pods têm resource limits configurados

