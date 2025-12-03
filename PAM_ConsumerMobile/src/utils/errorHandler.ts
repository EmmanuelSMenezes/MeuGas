/**
 * Sistema centralizado de tratamento de erros
 * Evita que erros técnicos sejam exibidos para o usuário final
 */

export interface ErrorResponse {
  title: string;
  description: string;
  type: 'error' | 'warning' | 'info';
}

/**
 * Extrai mensagem amigável de um erro da API
 */
export function getErrorMessage(error: any): ErrorResponse {
  // Erro de rede
  if (error?.message === 'Network Error' || error?.code === 'ERR_NETWORK') {
    return {
      title: 'Sem conexão',
      description: 'Verifique sua conexão com a internet e tente novamente',
      type: 'error',
    };
  }

  // Timeout
  if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
    return {
      title: 'Tempo esgotado',
      description: 'A operação demorou muito. Tente novamente',
      type: 'error',
    };
  }

  // Erro 401 - Não autorizado
  if (error?.response?.status === 401) {
    return {
      title: 'Sessão expirada',
      description: 'Faça login novamente para continuar',
      type: 'error',
    };
  }

  // Erro 403 - Proibido
  if (error?.response?.status === 403) {
    return {
      title: 'Acesso negado',
      description: 'Você não tem permissão para realizar esta ação',
      type: 'error',
    };
  }

  // Erro 404 - Não encontrado
  if (error?.response?.status === 404) {
    return {
      title: 'Não encontrado',
      description: 'O recurso solicitado não foi encontrado',
      type: 'error',
    };
  }

  // Erro 422 - Validação
  if (error?.response?.status === 422) {
    const message = error?.response?.data?.message || 'Verifique os dados informados';
    return {
      title: 'Dados inválidos',
      description: message,
      type: 'error',
    };
  }

  // Erro 500 - Servidor
  if (error?.response?.status >= 500) {
    return {
      title: 'Erro no servidor',
      description: 'Estamos com problemas temporários. Tente novamente em instantes',
      type: 'error',
    };
  }

  // Mensagem da API (se existir e for amigável)
  const apiMessage = error?.response?.data?.message;
  if (apiMessage && typeof apiMessage === 'string' && apiMessage.length < 200) {
    return {
      title: 'Atenção',
      description: apiMessage,
      type: 'error',
    };
  }

  // Erro genérico (fallback)
  return {
    title: 'Ops! Algo deu errado',
    description: 'Ocorreu um erro inesperado. Tente novamente',
    type: 'error',
  };
}

/**
 * Log de erro apenas em desenvolvimento
 * Em produção, não exibe nada no console
 */
export function logError(context: string, error: any): void {
  if (__DEV__) {
    console.group(`🔴 Erro em ${context}`);
    console.error('Error:', error);
    if (error?.response) {
      console.error('Response:', error.response);
    }
    if (error?.config) {
      console.error('Config:', {
        url: error.config.url,
        method: error.config.method,
        data: error.config.data,
      });
    }
    console.groupEnd();
  }
}

/**
 * Log de informação apenas em desenvolvimento
 */
export function logInfo(context: string, data: any): void {
  if (__DEV__) {
    console.log(`ℹ️ [${context}]`, data);
  }
}

/**
 * Log de warning apenas em desenvolvimento
 */
export function logWarning(context: string, message: string): void {
  if (__DEV__) {
    console.warn(`⚠️ [${context}] ${message}`);
  }
}

/**
 * Valida se uma resposta de erro deve ser exibida ao usuário
 */
export function shouldShowError(error: any): boolean {
  // Não mostrar erros de cancelamento de requisição
  if (error?.message === 'canceled' || error?.code === 'ERR_CANCELED') {
    return false;
  }

  // Não mostrar erro 401 (sessão expirada) - o interceptor já redireciona para login
  if (error?.response?.status === 401) {
    return false;
  }

  return true;
}

