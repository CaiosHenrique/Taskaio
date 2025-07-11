# Taskaio - Gerenciador de Tarefas

Um app mobile moderno para gerenciar tarefas e metas, desenvolvido com React Native e Expo.

## 🚀 Funcionalidades

- ✅ **Criar tarefas** com títulos personalizados
- 🔢 **Sistema de ID incremental** (`task_id`) para cada tarefa
- 📝 **Marcar tarefas como concluídas** com feedback visual
- 🗑️ **Apagar tarefas concluídas** com gesto de swipe para a direita
- 🎯 **Organizar por prioridade** com drag and drop
- 🔄 **Sincronização com backend** FastAPI
- 💾 **Modo offline** com dados de fallback
- 🎨 **Interface moderna** com design responsivo

## 🛠️ Tecnologias

- **Frontend**: React Native + Expo
- **Backend**: FastAPI + Python
- **Banco de dados**: MongoDB
- **Gestos**: React Native Gesture Handler
- **Animações**: React Native Reanimated

## 📱 Estrutura do Projeto

```
Taskaio/
├── app/
│   ├── (tabs)/
│   │   └── index.tsx          # Tela principal
│   └── _layout.tsx            # Layout raiz
├── components/
│   ├── FloatingHeader.tsx     # Header flutuante
│   ├── ThemedText.tsx         # Texto com tema
│   └── ThemedView.tsx         # View com tema
├── services/
│   └── taskService.ts         # Serviço de API
├── types/
│   └── task.ts               # Tipos TypeScript
├── utils/
│   └── taskUtils.ts          # Utilitários para tasks
├── config/
│   └── api.ts                # Configuração da API
└── backend-requirements.md    # Requisitos do backend
```

## � Modelo de Dados

### Task
```typescript
interface Task {
  id: string;          // MongoDB ObjectId
  task_id: number;     // ID incremental único (1, 2, 3...)
  title: string;       // Título da tarefa
  done: boolean;       // Status de conclusão
  priority: number;    // Prioridade (para ordenação)
  created_at: string;  // Data de criação
  updated_at: string;  // Data de atualização
}
```

### TaskCreate
```typescript
interface TaskCreate {
  title: string;
  priority: number;
  done?: boolean;
  task_id?: number;    // Gerado automaticamente
}
```

## 🔧 Validações Implementadas

### Frontend
- ✅ Validação de título obrigatório
- ✅ Sanitização de entrada (255 caracteres max)
- ✅ Validação de prioridade (número positivo)
- ✅ Filtragem de tasks inválidas
- ✅ Geração automática de `task_id` incremental

### Backend (Requisitos)
- ✅ Validação de dados de entrada
- ✅ Índices únicos para `task_id`
- ✅ Tratamento de erros HTTP
- ✅ Suporte a busca por `id` ou `task_id`

## 🎯 Funcionalidades Principais

### 1. Criação de Tarefas
- Modal intuitivo para criar novas tasks
- Validação em tempo real
- Geração automática de `task_id` incremental
- Prioridade automática baseada na ordem

### 2. Visualização
- Lista com drag and drop para reordenação
- Visual diferenciado para tasks concluídas
- Indicador de `task_id` (#1, #2, #3...)
- Feedback visual durante interações

### 3. Sincronização
- Tentativa de sync com backend
- Fallback para dados locais quando offline
- Tratamento de erros de rede
- Logs detalhados para debugging

## 🚀 Como Executar

### Pré-requisitos
- Node.js 16+
- Expo CLI
- Android Studio ou Xcode (para emuladores)

### Instalação
```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npx expo start

# Executar no Android
npx expo run:android

# Executar no iOS
npx expo run:ios
```

### Configuração da API
1. Edite `config/api.ts`
2. Configure a URL do backend
3. Para device físico, use IP da máquina
4. Para emulador, use `localhost`

## 📝 Próximos Passos

### Backend
- [ ] Implementar endpoints conforme `backend-requirements.md`
- [ ] Configurar MongoDB com índices apropriados
- [ ] Implementar autenticação de usuário
- [ ] Adicionar paginação para grandes listas

### Frontend
- [ ] Adicionar filtros (concluídas, pendentes)
- [ ] Implementar busca de tarefas
- [ ] Adicionar categorias/tags
- [ ] Sincronização em tempo real
- [ ] Notificações push

## 🧪 Testes

### Validações Testadas
- ✅ Criação de tasks com `task_id` único
- ✅ Validação de entrada de dados
- ✅ Drag and drop funcional
- ✅ Modo offline
- ✅ Filtragem de dados inválidos

### Casos de Teste
1. **Criação de task válida**
   - Título: "Estudar React Native"
   - Resultado: task_id = 1, priority = 1

2. **Validação de entrada**
   - Título vazio → Erro
   - Título muito longo → Truncado para 255 chars

3. **Reordenação**
   - Drag and drop → Prioridades atualizadas
   - Sincronização com backend

## 📊 Estrutura de Dados

### Exemplo de Task
```json
{
  "id": "64a1b2c3d4e5f6789012345",
  "task_id": 1,
  "title": "Estudar React Native",
  "done": false,
  "priority": 1,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### Fluxo de Criação
1. Usuário digita título
2. Sistema valida entrada
3. Gera `task_id` incremental
4. Calcula próxima prioridade
5. Envia para backend
6. Atualiza UI local

## 🔒 Validações de Segurança

- Sanitização de entrada
- Validação de tipos
- Limites de tamanho
- Tratamento de erros
- Logs seguros (sem dados sensíveis)

## 📚 Documentação

- [Tipos TypeScript](./types/task.ts)
- [Utilitários](./utils/taskUtils.ts)
- [Configuração API](./config/api.ts)

---

## 🤝 Contribuindo

1. Fork do projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**Desenvolvido com ❤️ usando React Native e Expo**
