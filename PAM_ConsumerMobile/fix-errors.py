#!/usr/bin/env python3
"""
Script para substituir blocos de tratamento de erro antigos pelo novo padrão
"""
import re
import sys

def fix_error_handling(content, context_name):
    """Substitui blocos catch antigos pelo novo padrão"""
    
    # Padrão antigo de erro
    old_pattern = r'''    } catch \(error\) \{
      openAlert\(\{
        title: "Erro inesperado",
        description: `\$\{error\?\.response\?\.data\?\.message\}`,
        type: "error",
        buttons: \{
          confirmButtonTitle: "Ok",
          cancelButton: false,
        \},
      \}\);

      if \(error\.message === "Network Error"\) \{
        openAlert\(\{
          title: "Sem conexão",
          description: "Verifique sua conexão com a rede",
          type: "error",
          buttons: \{
            confirmButtonTitle: "Ok",
            cancelButton: false,
          \},
        \}\);
      \}
    \}'''
    
    # Novo padrão
    new_pattern = f'''    }} catch (error) {{
      logError("{context_name}", error);
      
      if (shouldShowError(error)) {{
        const errorMsg = getErrorMessage(error);
        openAlert({{
          title: errorMsg.title,
          description: errorMsg.description,
          type: errorMsg.type,
          buttons: {{
            confirmButtonTitle: "Ok",
            cancelButton: false,
          }},
        }});
      }}
    }}'''
    
    # Substituir
    content = re.sub(old_pattern, new_pattern, content, flags=re.MULTILINE)
    
    # Padrão alternativo (com mensagem customizada)
    old_pattern2 = r'''    } catch \(error\) \{
      openAlert\(\{
        title: "Erro inesperado",
        description: `([^`]+)`,
        type: "error",
        buttons: \{
          confirmButtonTitle: "Ok",
          cancelButton: false,
        \},
      \}\);

      if \(error\.message === "Network Error"\) \{
        openAlert\(\{
          title: "Sem conexão",
          description: "Verifique sua conexão com a rede",
          type: "error",
          buttons: \{
            confirmButtonTitle: "Ok",
            cancelButton: false,
          \},
        \}\);
      \}
    \}'''
    
    content = re.sub(old_pattern2, new_pattern, content, flags=re.MULTILINE)
    
    return content

def comment_console_logs(content):
    """Comenta console.log, console.error, console.warn, console.info"""
    content = re.sub(r'^(\s*)console\.(log|error|warn|info)\(', r'\1// console.\2(', content, flags=re.MULTILINE)
    return content

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Uso: python fix-errors.py <arquivo> <context_name>")
        sys.exit(1)
    
    filename = sys.argv[1]
    context_name = sys.argv[2]
    
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Aplicar correções
        content = fix_error_handling(content, context_name)
        content = comment_console_logs(content)
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ {filename} atualizado com sucesso!")
    except Exception as e:
        print(f"❌ Erro: {e}")
        sys.exit(1)

