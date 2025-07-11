import { Task } from '@/types/task';

/**
 * Valida se uma task tem todos os campos obrigatórios
 */
export function validateTask(task: any): task is Task {
  if (!task) {
    console.log('❌ Task inválida: task é null/undefined');
    return false;
  }

  const validations = [
    { field: 'id', value: task.id, type: 'string', test: typeof task.id === 'string' },
    { field: 'task_id', value: task.task_id, type: 'number', test: typeof task.task_id === 'number' },
    { field: 'title', value: task.title, type: 'string', test: typeof task.title === 'string' },
    { field: 'done', value: task.done, type: 'boolean', test: typeof task.done === 'boolean' },
    { field: 'priority', value: task.priority, type: 'number', test: typeof task.priority === 'number' },
    { field: 'created_at', value: task.created_at, type: 'string', test: typeof task.created_at === 'string' },
    { field: 'updated_at', value: task.updated_at, type: 'string', test: typeof task.updated_at === 'string' },
  ];

  let isValid = true;
  validations.forEach(validation => {
    if (!validation.test) {
      console.log(`❌ Campo ${validation.field} inválido: esperado ${validation.type}, recebido ${typeof validation.value} (${validation.value})`);
      isValid = false;
    }
  });

  // Validações adicionais
  if (typeof task.title === 'string' && task.title.trim().length === 0) {
    console.log('❌ Título da task está vazio');
    isValid = false;
  }

  if (typeof task.priority === 'number' && task.priority <= 0) {
    console.log('❌ Prioridade deve ser > 0:', task.priority);
    isValid = false;
  }

  if (typeof task.task_id === 'number' && task.task_id <= 0) {
    console.log('❌ task_id deve ser > 0:', task.task_id);
    isValid = false;
  }

  if (isValid) {
    console.log('✅ Task válida:', task.task_id, task.title);
  }

  return isValid;
}

/**
 * Filtra tasks válidas, removendo qualquer item que não atenda aos critérios
 */
export function filterValidTasks(tasks: any[]): Task[] {
  return tasks.filter(validateTask);
}

/**
 * Ordena tasks por prioridade
 */
export function sortTasksByPriority(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => a.priority - b.priority);
}

/**
 * Encontra uma task por ID (aceita tanto id quanto task_id)
 */
export function findTaskById(tasks: Task[], id: string | number): Task | undefined {
  return tasks.find(task => {
    if (typeof id === 'string') {
      return task.id === id;
    }
    return task.task_id === id;
  });
}

/**
 * Gera o próximo task_id baseado nas tasks existentes
 */
export function getNextTaskId(tasks: Task[]): number {
  if (tasks.length === 0) return 1;
  
  const maxTaskId = Math.max(...tasks.map(task => task.task_id));
  return maxTaskId + 1;
}

/**
 * Valida se um título de task é válido
 */
export function validateTaskTitle(title: string): boolean {
  return typeof title === 'string' && title.trim().length > 0;
}

/**
 * Valida se uma prioridade é válida
 */
export function validateTaskPriority(priority: number): boolean {
  return typeof priority === 'number' && priority > 0 && Number.isInteger(priority);
}

/**
 * Sanitiza o título de uma task
 */
export function sanitizeTaskTitle(title: string): string {
  return title.trim().substring(0, 255); // Limita a 255 caracteres
}

/**
 * Calcula a próxima prioridade disponível
 */
export function getNextPriority(tasks: Task[]): number {
  if (tasks.length === 0) return 1;
  
  const maxPriority = Math.max(...tasks.map(task => task.priority));
  return maxPriority + 1;
}
