"use client";

import { Layout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { TaskForm } from "@/components/task-form";
import { useState, useEffect } from "react";
import { Task, getTasks, addTask, toggleTaskCompletion, getTasksByCategory, translateCategory } from "@/lib/tasks";
import { toast } from "@/components/ui/use-toast";
import { Language, getLanguage } from "@/lib/languages";
import { useTranslation } from "@/lib/translations";

// サンプルタスクデータ
const initialTasks = [
  {
    id: 1,
    title: "会議の準備",
    description: "プレゼン資料を確認する",
    dueDate: "2025-03-03T14:00:00",
    completed: false,
    category: "仕事"
  },
  {
    id: 2,
    title: "買い物",
    description: "夕食の材料を購入する",
    dueDate: "2025-03-03T18:00:00",
    completed: false,
    category: "家事"
  },
  {
    id: 3,
    title: "薬を受け取る",
    description: "薬局に立ち寄る",
    dueDate: "2025-03-03T17:30:00",
    completed: false,
    category: "個人"
  },
  {
    id: 4,
    title: "メールの返信",
    description: "クライアントからの問い合わせに返信する",
    dueDate: "2025-03-03T12:00:00",
    completed: true,
    category: "仕事"
  },
  {
    id: 5,
    title: "洗濯",
    description: "洗濯物を干す",
    dueDate: "2025-03-03T08:00:00",
    completed: true,
    category: "家事"
  }
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [language, setLanguage] = useState<Language>("ja");
  const { t } = useTranslation(language);

  // 初期データの読み込み
  useEffect(() => {
    setTasks(getTasks());
  }, []);

  // 言語設定の読み込み
  useEffect(() => {
    const currentLanguage = getLanguage();
    setLanguage(currentLanguage);

    // 言語変更イベントをリッスン
    const handleLanguageChange = (e: CustomEvent<{ language: Language }>) => {
      setLanguage(e.detail.language);
    };

    window.addEventListener('languagechange', handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener('languagechange', handleLanguageChange as EventListener);
    };
  }, []);

  // タスクの追加
  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    const addedTask = addTask(newTask);
    setTasks(prev => [...prev, addedTask]);
    toast({
      title: language === 'ja' ? "タスクを追加しました" : "Task added",
      description: language === 'ja' 
        ? `「${newTask.title}」を追加しました` 
        : `Added "${newTask.title}"`,
    });
  };

  // タスクの完了状態を切り替え
  const handleToggleTaskCompletion = (taskId: number) => {
    const updatedTasks = toggleTaskCompletion(taskId);
    setTasks(updatedTasks);
    
    const task = updatedTasks.find(t => t.id === taskId);
    if (task) {
      toast({
        title: language === 'ja' 
          ? (task.completed ? "タスクを完了しました" : "タスクを未完了に戻しました")
          : (task.completed ? "Task completed" : "Task marked as incomplete"),
        description: language === 'ja'
          ? `「${task.title}」の状態を変更しました`
          : `Changed status of "${task.title}"`,
      });
    }
  };

  // カテゴリー別にタスクをグループ化
  const tasksByCategory = getTasksByCategory(tasks);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("tasks")}</h1>
            <p className="text-muted-foreground">
              {language === 'ja' ? "あなたのタスクを管理します" : "Manage your tasks"}
            </p>
          </div>
          <TaskForm onAddTask={handleAddTask} />
        </div>

        <div className="grid gap-4">
          {Object.entries(tasksByCategory).map(([category, categoryTasks]) => (
            <Card key={category}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>{translateCategory(category, language)}</CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {categoryTasks.length}{language === 'ja' ? "件" : ""}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="grid gap-2">
                {categoryTasks.map(task => (
                  <div
                    key={task.id}
                    className={`flex items-start justify-between rounded-lg border p-3 ${
                      task.completed ? "bg-muted/50" : ""
                    } cursor-pointer hover:bg-muted/30 transition-colors`}
                    onClick={() => handleToggleTaskCompletion(task.id)}
                  >
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${task.completed ? "bg-primary" : "bg-orange-500"}`} />
                        <span className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                          {task.title}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {task.description}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icons.clock className="h-4 w-4" />
                      {new Date(task.dueDate).toLocaleTimeString(language === 'ja' ? "ja-JP" : "en-US", {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
 