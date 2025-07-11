// Configurações da API
export const API_CONFIG = {
  // Para teste no simulador/emulador, use localhost
  // Para teste em device físico, use o IP da sua máquina
  BASE_URL: __DEV__ ? 'http://localhost:8000' : 'https://your-api-url.com',
  
  // Timeout para requisições (em milissegundos)
  TIMEOUT: 10000,
};

// Para testar no device físico, substitua localhost pelo IP da sua máquina
// Exemplo: 'http://192.168.1.100:8000'
// Para encontrar seu IP: ipconfig (Windows) ou ifconfig (Mac/Linux)
