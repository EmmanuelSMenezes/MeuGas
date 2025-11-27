# 🚀 PAM - Setup Automático GitHub

Este guia vai te ajudar a subir todos os repositórios PAM para o GitHub automaticamente.

## 📋 Pré-requisitos

✅ Git instalado e configurado (já verificado)
✅ Conta no GitHub (EmmanuelSMenezes)

## 🔑 Passo 1: Criar Token de Acesso GitHub

1. **Acesse**: https://github.com/settings/tokens
2. **Clique em**: "Generate new token" → "Generate new token (classic)"
3. **Configure**:
   - **Note**: PAM Upload Script
   - **Expiration**: 30 days (ou conforme preferir)
   - **Scopes**: Marque as opções:
     - ✅ `repo` (Full control of private repositories)
     - ✅ `delete_repo` (Delete repositories)

4. **Clique em**: "Generate token"
5. **COPIE O TOKEN** (você só verá uma vez!)

## 🚀 Passo 2: Executar o Script

### Opção A: PowerShell (Recomendado)

```powershell
# Execute no PowerShell como Administrador
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Execute o script com seu token
.\setup_pam_github.ps1 -GitHubToken "ghp_seu_token_aqui"
```

### Opção B: Criar arquivo de token

1. Crie um arquivo chamado `github_token.txt`
2. Cole seu token dentro do arquivo
3. Execute:

```powershell
.\setup_pam_github.ps1
```

## 📦 Repositórios que serão criados

O script criará automaticamente estes repositórios:

### 🔧 Microserviços
- `PAM_MS_Authentication` ← MS_Authentication
- `PAM_MS_Billing` ← MS_Billing  
- `PAM_MS_Catalog` ← MS_Catalog
- `PAM_MS_Communication` ← MS_Communication
- `PAM_MS_Consumer` ← MS_Consumer
- `PAM_MS_Logistics` ← MS_Logistics
- `PAM_MS_Offer` ← MS_Offer
- `PAM_MS_Order` ← MS_Order
- `PAM_MS_Partner` ← MS_Partner
- `PAM_MS_Report` ← MS_Report
- `PAM_MS_Reputation` ← MS_Reputation
- `PAM_MS_Storage` ← MS_Storage

### 🌐 Aplicações Web
- `PAM_AdminWeb` ← PAM_AdminWeb
- `PAM_PartnerWeb` ← PAM_PartnerWeb

### 📱 Aplicações Mobile
- `PAM_ConsumerMobile` ← PAM_ConsumerMobile
- `PAM_APK_Delivery` ← APK_Delivery

## 🔄 O que o script faz

1. **Cria repositórios** no GitHub via API
2. **Inicializa Git** em cada pasta local
3. **Adiciona todos os arquivos**
4. **Faz commit inicial**
5. **Configura remote origin**
6. **Faz push** para GitHub

## ⚠️ Importante

- **Mantenha seu token seguro**
- **Não compartilhe o token**
- **Delete o arquivo `github_token.txt` após o uso**
- **O script sobrescreve repositórios Git existentes**

## 🆘 Solução de Problemas

### Erro de Execução PowerShell
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Erro de Autenticação
- Verifique se o token está correto
- Verifique se o token tem as permissões necessárias

### Repositório já existe
- O script continuará normalmente
- Apenas fará o push do código

## 📞 Suporte

Se houver algum problema, verifique:
1. Token válido e com permissões corretas
2. Conexão com internet
3. Git configurado corretamente
4. Pastas dos projetos existem

---

**Pronto para começar? Execute o comando PowerShell acima! 🚀**
