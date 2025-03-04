"use client";

import { Layout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { TaskForm } from "@/components/task-form";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Task, getTasks, addTask } from "@/lib/tasks";
import { Language, getLanguage } from "@/lib/languages";
import { useTranslation } from "@/lib/translations";
import { Event, getEvents } from "@/lib/events";

// Web Speech API用の型定義
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [voiceDialogOpen, setVoiceDialogOpen] = useState(false);
  const [voiceInput, setVoiceInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState<Language>("ja");
  const { t } = useTranslation(language);
  const recognitionRef = useRef<any>(null);

  // 初期データの読み込み
  useEffect(() => {
    setTasks(getTasks());
    setEvents(getEvents());
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

  // 音声認識の初期化
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.lang = language === 'ja' ? 'ja-JP' : language === 'zh' ? 'zh-CN' : 'en-US';
        recognitionRef.current.interimResults = false;
        recognitionRef.current.maxAlternatives = 1;
        
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setVoiceInput(transcript);
          setIsListening(false);
        };
        
        recognitionRef.current.onerror = (event: any) => {
          console.error('音声認識エラー:', event.error);
          setIsListening(false);
          toast({
            title: t("voiceRecognitionError"),
            description: `${t("errorOccurred")}: ${event.error}`,
            variant: "destructive"
          });
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language, t]);

  // タスク追加処理
  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    const addedTask = addTask(newTask);
    setTasks(prev => [...prev, addedTask]);
    toast({
      title: t("taskAdded"),
      description: t("addedTaskName").replace("{taskName}", newTask.title),
    });
  };

  // 音声入力の開始
  const startVoiceRecognition = () => {
    if (recognitionRef.current) {
      try {
        // 言語設定を更新
        recognitionRef.current.lang = language === 'ja' ? 'ja-JP' : language === 'zh' ? 'zh-CN' : 'en-US';
        
        setIsListening(true);
        recognitionRef.current.start();
      } catch (error) {
        console.error('音声認識の開始に失敗しました:', error);
        setIsListening(false);
        
        // ブラウザが音声認識をサポートしていない場合はモックを使用
        toast({
          title: t("cannotStartVoiceRecognition"),
          description: t("browserDoesNotSupportVoiceRecognition"),
        });
        
        // モックデータを使用
        setTimeout(() => {
          setVoiceInput(language === 'ja' ? "明日7時に会議、その前に薬局に寄る" : 
                        language === 'zh' ? "明天7点开会，之前去一趟药店" : 
                        "Meeting at 7 tomorrow, stop by the pharmacy before that");
          setIsListening(false);
        }, 2000);
      }
    } else {
      // Web Speech APIがサポートされていない場合はモックを使用
      setIsListening(true);
      toast({
        title: t("voiceRecognitionNotSupported"),
        description: t("browserDoesNotSupportVoiceRecognition"),
      });
      
      setTimeout(() => {
        setVoiceInput(language === 'ja' ? "明日7時に会議、その前に薬局に寄る" : 
                      language === 'zh' ? "明天7点开会，之前去一趟药店" : 
                      "Meeting at 7 tomorrow, stop by the pharmacy before that");
        setIsListening(false);
      }, 2000);
    }
  };

  // 音声入力からタスク作成
  const createTaskFromVoice = () => {
    if (!voiceInput) return;
    
    // 現在の日時を取得
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // 音声入力をそのままタスクとして追加
    const voiceTask: Omit<Task, 'id'> = {
      title: voiceInput,
      description: t("taskCreatedFromVoiceInput"),
      dueDate: `${tomorrow.toISOString().split("T")[0]}T09:00:00`,
      completed: false,
      category: t("personal"),
    };
    
    const addedTask = addTask(voiceTask);
    setTasks(prev => [...prev, addedTask]);
    
    toast({
      title: t("taskCreatedFromVoice"),
      description: t("addedTaskName").replace("{taskName}", voiceInput),
    });
    
    setVoiceInput("");
    setVoiceDialogOpen(false);
  };

  // 今日の予定数を計算
  const todaysEvents = events.filter(event => {
    const eventDate = new Date(event.startTime);
    const today = new Date();
    return eventDate.getDate() === today.getDate() &&
           eventDate.getMonth() === today.getMonth() &&
           eventDate.getFullYear() === today.getFullYear();
  }).length;

  // 完了タスクと未完了タスクの数を計算
  const completedTasks = tasks.filter(task => task.completed).length;
  const incompleteTasks = tasks.length - completedTasks;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">{t("welcome")}</h1>
          <p className="text-muted-foreground">
            {language === 'ja' 
              ? "仕事と家庭のタスクを一元管理するアプリケーション" 
              : "An application to centrally manage work and home tasks"}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <Link href="/tasks" className="block">
            <Card className="transition-all hover:bg-muted/50 hover:shadow-md cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("todaysTasks")}
                </CardTitle>
                <Icons.listTodo className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tasks.length}{language === 'ja' || language === 'zh' ? t("count") : ""}</div>
                <p className="text-xs text-muted-foreground">
                  {t("tasksStatus").replace("{completed}", completedTasks.toString()).replace("{pending}", incompleteTasks.toString())}
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/calendar" className="block">
            <Card className="transition-all hover:bg-muted/50 hover:shadow-md cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("todaysSchedule")}
                </CardTitle>
                <Icons.calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todaysEvents}{language === 'ja' || language === 'zh' ? t("count") : ""}</div>
                <p className="text-xs text-muted-foreground">
                  {t("nextSchedule")}
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>{t("mainFeatures")}</CardTitle>
              <CardDescription>{t("featuresDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex flex-col gap-1">
                  <div className="flex items-start gap-2">
                    <Icons.listTodo className="h-5 w-5 text-primary mt-0.5" />
                    <span className="font-medium">{t("taskManagement")}</span>
                  </div>
                  <p className="text-sm text-muted-foreground ml-7">
                    {t("taskUsage")}
                  </p>
                </li>
                <li className="flex flex-col gap-1">
                  <div className="flex items-start gap-2">
                    <Icons.mic className="h-5 w-5 text-primary mt-0.5" />
                    <span className="font-medium">{t("voiceInput")}</span>
                  </div>
                  <p className="text-sm text-muted-foreground ml-7">
                    {t("voiceUsage")}
                  </p>
                </li>
                <li className="flex flex-col gap-1">
                  <div className="flex items-start gap-2">
                    <Icons.bell className="h-5 w-5 text-primary mt-0.5" />
                    <span className="font-medium">{t("notificationSystem")}</span>
                  </div>
                  <p className="text-sm text-muted-foreground ml-7">
                    {t("notificationUsage")}
                  </p>
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>{t("quickActions")}</CardTitle>
              <CardDescription>{t("quickActionsDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <TaskForm 
                onAddTask={handleAddTask} 
                buttonText={language === 'ja' ? "新しいタスクを追加" : language === 'zh' ? "添加新任务" : "Add New Task"} 
                fullWidth={true}
              />
              
              <Dialog open={voiceDialogOpen} onOpenChange={setVoiceDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full justify-start" variant="outline">
                    <Icons.mic className="mr-2 h-4 w-4" />
                    {language === 'ja' ? "音声でタスクを追加" : language === 'zh' ? "通过语音添加任务" : "Add Task by Voice"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{t("addTaskByVoice")}</DialogTitle>
                    <DialogDescription>
                      {t("pressTheMicrophoneButton")}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="flex items-center justify-center">
                      <Button
                        variant={isListening ? "destructive" : "outline"}
                        size="icon"
                        className="h-16 w-16 rounded-full"
                        onClick={startVoiceRecognition}
                        disabled={isListening}
                      >
                        <Icons.mic className="h-8 w-8" />
                      </Button>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="voiceInput">{t("recognizedText")}</Label>
                      <Input
                        id="voiceInput"
                        value={voiceInput}
                        onChange={(e) => setVoiceInput(e.target.value)}
                        placeholder={isListening 
                          ? t("listening") 
                          : t("noVoiceRecognized")}
                        readOnly={isListening}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={createTaskFromVoice} disabled={!voiceInput}>
                      {t("createTask")}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/calendar">
                  <Icons.calendar className="mr-2 h-4 w-4" />
                  {t("viewCalendar")}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
} 