
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: number;
  category?: 'work' | 'personal' | 'health' | 'growth';
}

export type ViewType = 'home' | 'widget-preview' | 'all-tasks';
