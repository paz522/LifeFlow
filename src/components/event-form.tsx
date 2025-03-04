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
import { Language, getLanguage } from "@/lib/languages";
import { categoryTranslations } from "@/lib/tasks";

// イベントの型定義
export interface Event {
  id: number | string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location: string;
  category: string;
  isTask?: boolean;
}

interface EventFormProps {
  onAddEvent?: (event: Event) => void;
  buttonText?: string;
  buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link";
  buttonIcon?: boolean;
  fullWidth?: boolean;
}

export function EventForm({
  onAddEvent,
  buttonText = "予定を追加",
  buttonVariant = "default",
  buttonIcon = true,
  fullWidth = false,
}: EventFormProps) {
  const [open, setOpen] = useState(false);
  const [event, setEvent] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
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
    setEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setEvent((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 現在の日時を取得
    const now = new Date();
    const formattedDate = event.date || now.toISOString().split("T")[0];
    const formattedStartTime = event.startTime || `${now.getHours()}:${now.getMinutes()}`;
    const formattedEndTime = event.endTime || `${now.getHours() + 1}:${now.getMinutes()}`;
    
    // ISO形式の日時文字列を作成
    const startTime = `${formattedDate}T${formattedStartTime}:00`;
    const endTime = `${formattedDate}T${formattedEndTime}:00`;
    
    const newEvent: Event = {
      id: Date.now(),
      title: event.title,
      description: event.description,
      startTime,
      endTime,
      location: event.location,
      category: event.category,
    };
    
    if (onAddEvent) {
      onAddEvent(newEvent);
    }
    
    // フォームをリセット
    setEvent({
      title: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
      category: "仕事",
    });
    
    setOpen(false);
  };

  // ボタンテキストの翻訳
  const translatedButtonText = language === 'ja' ? buttonText : "Add Event";

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
            <DialogTitle>{language === 'ja' ? "予定を追加" : "Add Event"}</DialogTitle>
            <DialogDescription>
              {language === 'ja' ? "新しい予定の詳細を入力してください。" : "Enter details for your new event."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">{language === 'ja' ? "タイトル" : "Title"}</Label>
              <Input
                id="title"
                name="title"
                value={event.title}
                onChange={handleChange}
                placeholder={language === 'ja' ? "予定のタイトルを入力" : "Enter event title"}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">{language === 'ja' ? "説明" : "Description"}</Label>
              <Textarea
                id="description"
                name="description"
                value={event.description}
                onChange={handleChange}
                placeholder={language === 'ja' ? "予定の詳細を入力" : "Enter event details"}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">{language === 'ja' ? "日付" : "Date"}</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={event.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startTime">{language === 'ja' ? "開始時間" : "Start Time"}</Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={event.startTime}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endTime">{language === 'ja' ? "終了時間" : "End Time"}</Label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={event.endTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">{language === 'ja' ? "場所" : "Location"}</Label>
              <Input
                id="location"
                name="location"
                value={event.location}
                onChange={handleChange}
                placeholder={language === 'ja' ? "予定の場所を入力" : "Enter event location"}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">{language === 'ja' ? "カテゴリー" : "Category"}</Label>
              <Select
                value={event.category}
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