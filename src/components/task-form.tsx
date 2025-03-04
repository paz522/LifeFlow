import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icons } from "@/components/ui/icons";
import { Task, categoryTranslations } from "@/lib/tasks";
import { Language, getLanguage } from "@/lib/languages";

interface TaskFormProps {
  onAddTask?: (task: Omit<Task, 'id'>) => void;
  buttonText?: string;
  buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link";
  buttonIcon?: boolean;
  fullWidth?: boolean;
}

export function TaskForm({
  onAddTask,
  buttonText = "新しいタスク",
  buttonVariant = "default",
  buttonIcon = true,
  fullWidth = false,
}: TaskFormProps) {
  const [open, setOpen] = useState(false);
  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    dueTime: "",
    category: "仕事",
  });
  const [language, setLanguage] = useState<Language>("ja");

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setTask((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 現在の日時を取得
    const now = new Date();
    const formattedDate = task.dueDate || now.toISOString().split("T")[0];
    const formattedTime = task.dueTime || `${now.getHours()}:${now.getMinutes()}`;
    
    // ISO形式の日時文字列を作成
    const dueDate = `${formattedDate}T${formattedTime}:00`;
    
    const newTask: Omit<Task, 'id'> = {
      title: task.title,
      description: task.description,
      dueDate,
      completed: false,
      category: task.category,
    };
    
    if (onAddTask) {
      onAddTask(newTask);
    }
    
    // フォームをリセット
    setTask({
      title: "",
      description: "",
      dueDate: "",
      dueTime: "",
      category: "仕事",
    });
    
    setOpen(false);
  };

  // ボタンテキストの翻訳
  const translatedButtonText = language === 'ja' ? buttonText : "New Task";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={buttonVariant} 
          className={fullWidth ? "w-full justify-start" : ""}
        >
          {buttonIcon && <Icons.plus className="mr-2 h-4 w-4" />}
          {translatedButtonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{language === 'ja' ? "タスクを追加" : "Add Task"}</DialogTitle>
            <DialogDescription>
              {language === 'ja' ? "新しいタスクの詳細を入力してください。" : "Enter details for your new task."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">{language === 'ja' ? "タイトル" : "Title"}</Label>
              <Input
                id="title"
                name="title"
                value={task.title}
                onChange={handleChange}
                placeholder={language === 'ja' ? "タスクのタイトルを入力" : "Enter task title"}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">{language === 'ja' ? "説明" : "Description"}</Label>
              <Textarea
                id="description"
                name="description"
                value={task.description}
                onChange={handleChange}
                placeholder={language === 'ja' ? "タスクの詳細を入力" : "Enter task details"}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dueDate">{language === 'ja' ? "日付" : "Date"}</Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={task.dueDate}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dueTime">{language === 'ja' ? "時間" : "Time"}</Label>
                <Input
                  id="dueTime"
                  name="dueTime"
                  type="time"
                  value={task.dueTime}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">{language === 'ja' ? "カテゴリー" : "Category"}</Label>
              <Select
                value={task.category}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder={language === 'ja' ? "カテゴリーを選択" : "Select category"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="仕事">{language === 'ja' ? "仕事" : "Work"}</SelectItem>
                  <SelectItem value="家事">{language === 'ja' ? "家事" : "Household"}</SelectItem>
                  <SelectItem value="個人">{language === 'ja' ? "個人" : "Personal"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{language === 'ja' ? "追加" : "Add"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 