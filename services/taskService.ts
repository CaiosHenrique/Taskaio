import { API_CONFIG } from '@/config/api';
import { Task, TaskCreate, TaskUpdate } from '@/types/task';
import { filterValidTasks, sanitizeTaskTitle, validateTaskPriority, validateTaskTitle } from '@/utils/taskUtils';

const API_URL = API_CONFIG.BASE_URL;

// Dados de fallback para quando a API não estiver disponível
const fallbackTasks: Task[] = [
  {
    id: '1',
    task_id: 1,
    title: 'Estudar React Native',
    done: false,
    priority: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    task_id: 2,
    title: 'Ler 10 páginas de um livro',
    done: false,
    priority: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    task_id: 3,
    title: 'Fazer exercício físico',
    done: false,
    priority: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

class TaskService {
  private static nextTaskId = 1;

  // Método para testar conectividade com o backend
  async testConnection(): Promise<boolean> {
    try {
      console.log('🔗 Testando conexão com:', API_URL);
      const response = await fetch(API_URL, { method: 'GET' });
      console.log('📡 Status da conexão:', response.status);
      return response.ok;
    } catch (error) {
      console.error('❌ Erro de conexão:', error);
      return false;
    }
  }

  // Método para gerar próximo task_id incremental
  private getNextTaskId(): number {
    return TaskService.nextTaskId++;
  }

  // Método para inicializar o counter do task_id baseado nas tasks existentes
  private initializeTaskIdCounter(tasks: Task[]): void {
    if (tasks.length > 0) {
      const maxTaskId = Math.max(...tasks.map(task => task.task_id));
      TaskService.nextTaskId = maxTaskId + 1;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getTasks(): Promise<Task[]> {
    console.log('🔍 Iniciando carregamento de tasks...');
    console.log('🌐 API_URL:', API_URL);
    
    // Primeiro, testar a conexão
    const isConnected = await this.testConnection();
    console.log('🔗 Conexão com backend:', isConnected ? 'OK' : 'FALHOU');
    
    if (!isConnected) {
      console.warn('🔄 Backend não disponível, usando dados de fallback');
      this.initializeTaskIdCounter(fallbackTasks);
      return fallbackTasks;
    }
    
    try {
      console.log('📡 Fazendo requisição para /tasks...');
      const tasks = await this.request<Task[]>('/tasks');
      console.log('✅ Resposta da API recebida:', tasks);
      console.log('✅ Tipo da resposta:', typeof tasks, Array.isArray(tasks));
      
      // Temporariamente, vamos aceitar qualquer task e ver o que acontece
      const validTasks = Array.isArray(tasks) ? tasks : [];
      console.log('✅ Tasks após verificação de array:', validTasks);
      
      // Transformar tasks com id null para string
      const normalizedTasks = validTasks.map(task => ({
        ...task,
        id: task.id || `task-${task.task_id}` // Gerar id se for null
      }));
      console.log('✅ Tasks após normalização:', normalizedTasks);
      
      // Aplicar filtro de validação
      console.log('🔍 Iniciando validação das tasks...');
      const filteredTasks = filterValidTasks(normalizedTasks);
      console.log('✅ Tasks válidas após filtro:', filteredTasks.length);
      console.log('❌ Tasks inválidas:', normalizedTasks.length - filteredTasks.length);
      
      // Se não há tasks válidas, mas há tasks na resposta, mostrar detalhes
      if (filteredTasks.length === 0 && normalizedTasks.length > 0) {
        console.log('⚠️ Nenhuma task passou na validação. Exemplos de tasks recebidas:');
        normalizedTasks.slice(0, 2).forEach((task, index) => {
          console.log(`Task ${index + 1}:`, JSON.stringify(task, null, 2));
        });
      }
      
      // Mostrar as tasks válidas
      if (filteredTasks.length > 0) {
        console.log('✅ Tasks válidas encontradas:');
        filteredTasks.forEach((task, index) => {
          console.log(`  ${index + 1}. [${task.task_id}] ${task.title} (done: ${task.done})`);
        });
      }
      
      this.initializeTaskIdCounter(filteredTasks);
      console.log('✅ Retornando tasks válidas:', filteredTasks.length, 'tasks');
      
      return filteredTasks;
    } catch (error) {
      console.error('❌ Erro ao carregar tasks da API:', error);
      console.warn('🔄 Usando dados de fallback devido ao erro');
      
      this.initializeTaskIdCounter(fallbackTasks);
      console.log('✅ Retornando fallback tasks:', fallbackTasks.length, 'tasks');
      
      return fallbackTasks;
    }
  }

  async createTask(task: TaskCreate): Promise<Task> {
    // Validar dados de entrada
    if (!validateTaskTitle(task.title)) {
      throw new Error('Título da task é obrigatório');
    }
    
    if (!validateTaskPriority(task.priority)) {
      throw new Error('Prioridade deve ser um número positivo');
    }

    try {
      const newTaskId = this.getNextTaskId();
      const sanitizedTitle = sanitizeTaskTitle(task.title);
      const taskWithId = { ...task, task_id: newTaskId, title: sanitizedTitle };
      
      return await this.request<Task>('/tasks', {
        method: 'POST',
        body: JSON.stringify(taskWithId),
      });
    } catch (error) {
      console.warn('API não disponível, simulando criação de task:', error);
      const newTaskId = this.getNextTaskId();
      const sanitizedTitle = sanitizeTaskTitle(task.title);
      const newTask: Task = {
        id: Date.now().toString(),
        task_id: newTaskId,
        title: sanitizedTitle,
        done: task.done || false,
        priority: task.priority,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return newTask;
    }
  }

  async updateTask(id: string, task: TaskUpdate): Promise<Task> {
    try {
      return await this.request<Task>(`/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(task),
      });
    } catch {
      console.warn('API não disponível, simulando atualização de task');
      // Simular atualização local
      const existingTask = fallbackTasks.find(t => t.id === id || t.task_id.toString() === id);
      if (existingTask) {
        return {
          ...existingTask,
          ...task,
          updated_at: new Date().toISOString(),
        };
      }
      throw new Error('Task não encontrada');
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      return await this.request<void>(`/tasks/${id}`, {
        method: 'DELETE',
      });
    } catch {
      console.warn('API não disponível, simulando exclusão de task');
      // Simular exclusão local
      return;
    }
  }
}

export const taskService = new TaskService();
