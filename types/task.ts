// Tipos centralizados para o app Taskaio

export interface Task {
  id: string;
  task_id: number;
  title: string;
  done: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  title: string;
  priority: number;
  done?: boolean;
  task_id?: number; // Será gerado automaticamente se não fornecido
}

export interface TaskUpdate {
  title?: string;
  done?: boolean;
  priority?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface TaskFilters {
  done?: boolean;
  priority?: number;
}

export interface TaskSort {
  field: 'priority' | 'created_at' | 'updated_at' | 'title';
  direction: 'asc' | 'desc';
}
