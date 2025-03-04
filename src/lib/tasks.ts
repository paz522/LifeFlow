// タスクの型定義
export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  category: string;
}

// カテゴリーの翻訳マッピング
export const categoryTranslations = {
  ja: {
    "仕事": "仕事",
    "家事": "家事",
    "個人": "個人"
  },
  en: {
    "仕事": "Work",
    "家事": "Household",
    "個人": "Personal"
  }
};

// カテゴリーを翻訳する関数
export function translateCategory(category: string, language: string): string {
  if (language === 'en' && categoryTranslations.en[category as keyof typeof categoryTranslations.en]) {
    return categoryTranslations.en[category as keyof typeof categoryTranslations.en];
  }
  return category;
}

// ローカルストレージのキー
const TASKS_STORAGE_KEY = 'lifeflow-tasks';

// 今日の日付を取得
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

// 初期タスクデータ
const initialTasks: Task[] = [];

// タスクをローカルストレージから取得
export function getTasks(): Task[] {
  if (typeof window === 'undefined') {
    return initialTasks;
  }
  
  const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
  if (!storedTasks) {
    // 初回アクセス時は初期データを保存
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(initialTasks));
    return initialTasks;
  }
  
  try {
    return JSON.parse(storedTasks);
  } catch (error) {
    console.error('タスクの読み込みに失敗しました:', error);
    return initialTasks;
  }
}

// タスクをローカルストレージに保存
export function saveTasks(tasks: Task[]): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('タスクの保存に失敗しました:', error);
  }
}

// 新しいタスクを追加
export function addTask(task: Omit<Task, 'id'>): Task {
  const tasks = getTasks();
  const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
  
  const newTask: Task = {
    ...task,
    id: newId
  };
  
  const updatedTasks = [...tasks, newTask];
  saveTasks(updatedTasks);
  
  return newTask;
}

// タスクの完了状態を切り替え
export function toggleTaskCompletion(taskId: number): Task[] {
  const tasks = getTasks();
  const updatedTasks = tasks.map(task => 
    task.id === taskId 
      ? { ...task, completed: !task.completed } 
      : task
  );
  
  saveTasks(updatedTasks);
  return updatedTasks;
}

// タスクを削除
export function deleteTask(taskId: number): Task[] {
  const tasks = getTasks();
  const updatedTasks = tasks.filter(task => task.id !== taskId);
  
  saveTasks(updatedTasks);
  return updatedTasks;
}

// ローカルストレージをクリア
export function clearTasksStorage(): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.removeItem(TASKS_STORAGE_KEY);
  } catch (error) {
    console.error('タスクの削除に失敗しました:', error);
  }
}

// カテゴリー別にタスクをグループ化
export function getTasksByCategory(tasks: Task[]): Record<string, Task[]> {
  return tasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = [];
    }
    acc[task.category].push(task);
    return acc;
  }, {} as Record<string, Task[]>);
} 