# 🚀 Guia Rápido de Deploy - PAM Kubernetes

## ✅ Pré-requisitos

- [x] kubectl instalado
- [x] Docker Desktop rodando
- [x] Node.js e npm instalados
- [x] Arquivo kubeconfig do DigitalOcean na raiz do projeto

## 📝 Passo a Passo

### 1️⃣ Configurar Credenciais

Edite o arquivo `k8s/01-secrets.yaml` e atualize:
- Credenciais do Twilio
- Outras senhas se necessário

### 2️⃣ Testar Conexão com Cluster

```powershell
cd k8s
$env:KUBECONFIG = "..\k8s-1-33-1-do-5-sfo3-1763495906297-kubeconfig.yaml"
kubectl cluster-info
kubectl get nodes
```

Você deve ver 3 nodes prontos.

### 3️⃣ Fazer Deploy Completo

```powershell
# Deploy completo (build + deploy)
.\deploy.ps1

# OU deploy sem rebuild (se já tiver as imagens)
.\deploy.ps1 -SkipBuild
```

Este comando irá:
- ✅ Construir todas as imagens Docker (se não usar -SkipBuild)
- ✅ Criar namespace `pam`
- ✅ Criar secrets e configmaps
- ✅ Fazer deploy do PostgreSQL com volume persistente
- ✅ Fazer deploy do RabbitMQ
- ✅ Fazer deploy dos 12 microserviços
- ✅ Fazer deploy das 2 aplicações web
- ✅ Criar ingress para exposição externa

### 4️⃣ Restaurar Banco de Dados

```powershell
.\restore-database.ps1
```

Este comando irá:
- ✅ Aguardar PostgreSQL ficar pronto
- ✅ Criar extensão uuid-ossp
- ✅ Copiar backup para o pod
- ✅ Restaurar dados (58 tabelas, 11 schemas)

### 5️⃣ Verificar Status

```powershell
# Ver todos os pods
kubectl get pods -n pam

# Ver services
kubectl get svc -n pam

# Ver ingress
kubectl get ingress -n pam
```

### 6️⃣ Configurar DNS

Obtenha o IP do LoadBalancer:
```powershell
kubectl get ingress -n pam
```

Configure os seguintes registros DNS:
- `administrador.meugas.app` → IP do LoadBalancer
- `parceiro.meugas.app` → IP do LoadBalancer
- `api.meugas.app` → IP do LoadBalancer

## 🎯 Acessar Aplicações

Após configurar DNS:
- **Admin Web**: https://administrador.meugas.app
- **Partner Web**: https://parceiro.meugas.app
- **API**: https://api.meugas.app

## 🔍 Comandos Úteis

### Ver logs de um pod
```powershell
kubectl logs -n pam <pod-name> -f
```

### Acessar shell do PostgreSQL
```powershell
$podName = kubectl get pod -l app=postgres -n pam -o jsonpath='{.items[0].metadata.name}'
kubectl exec -it -n pam $podName -- psql -U postgres -d pam
```

### Acessar RabbitMQ Management
```powershell
kubectl port-forward -n pam svc/rabbitmq-service 15672:15672
# Acesse http://localhost:15672 (admin/Pam9628#d)
```

### Reiniciar um deployment
```powershell
kubectl rollout restart deployment -n pam <deployment-name>
```

### Deletar tudo e recomeçar
```powershell
kubectl delete namespace pam
.\deploy.ps1
.\restore-database.ps1
```

## ⚠️ Troubleshooting

### Pod não inicia
```powershell
kubectl describe pod -n pam <pod-name>
kubectl logs -n pam <pod-name>
```

### Erro de imagem não encontrada
As imagens estão configuradas com `imagePullPolicy: Never` (uso local).
Para produção, você precisa:
1. Fazer push das imagens para um registry
2. Atualizar os manifestos para usar o registry
3. Mudar `imagePullPolicy` para `Always`

### PostgreSQL não conecta
Verifique se o pod está rodando:
```powershell
kubectl get pod -l app=postgres -n pam
kubectl logs -n pam postgres-0
```

### Microserviço não conecta ao banco
Verifique as variáveis de ambiente:
```powershell
kubectl describe pod -n pam <pod-name>
```

## 📊 Recursos do Cluster

- **Namespace**: pam
- **Pods**: ~17 (1 postgres + 1 rabbitmq + 12 microserviços + 2 web apps)
- **Services**: ~15
- **PersistentVolumes**: 1 (10GB para PostgreSQL)
- **Ingress**: 1 (NGINX)

## 🎉 Pronto!

Seu ambiente PAM está rodando no Kubernetes! 🚀

