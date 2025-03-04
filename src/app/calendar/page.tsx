"use client";

import { Layout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { EventForm } from "@/components/event-form";
import { YearCalendar } from "@/components/year-calendar";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTasks, Task } from "@/lib/tasks";
import { Language, getLanguage } from "@/lib/languages";
import { useTranslation } from "@/lib/translations";
import { translateCategory } from "@/lib/tasks";
import { Event, getEvents, saveEvents } from "@/lib/events";

// サンプルイベントデータ
const initialEvents: Event[] = [];

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedView, setSelectedView] = useState("day");
  const [language, setLanguage] = useState<Language>("ja");
  const { t } = useTranslation(language);

  // イベントとタスクデータの読み込み
  useEffect(() => {
    const loadedEvents = getEvents();
    const loadedTasks = getTasks();
    setEvents(loadedEvents);
    setTasks(loadedTasks);
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

  // 予定の追加
  const handleAddEvent = (newEvent: Event) => {
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
  };

  // 日付のフォーマット
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(language === 'ja' ? "ja-JP" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long"
    });
  };

  // 日付が選択されたときの処理
  const handleDateSelect = (date: Date) => {
    setCurrentDate(date);
    setSelectedView("day");
  };

  // タスクをイベント形式に変換
  const taskEvents: Event[] = tasks.map(task => ({
    id: `task-${task.id}`,
    title: task.title,
    startTime: task.dueDate,
    endTime: task.dueDate,
    location: "",
    category: task.category,
    isTask: true
  }));

  // イベントとタスクを日付ごとにカウント
  const eventCounts = [...events, ...taskEvents].reduce((acc, event) => {
    const date = new Date(event.startTime);
    const dateString = date.toISOString().split('T')[0];
    
    if (!acc[dateString]) {
      acc[dateString] = 0;
    }
    
    acc[dateString]++;
    return acc;
  }, {} as Record<string, number>);

  // カレンダーコンポーネント用のイベントデータを作成
  const calendarEvents = Object.entries(eventCounts).map(([dateString, count]) => ({
    date: new Date(dateString),
    count
  }));

  // 時間帯ごとにイベントをグループ化
  const timeSlots = Array.from({ length: 14 }, (_, i) => i + 8); // 8時から21時まで
  
  // 選択された日付のイベントとタスクをフィルタリング
  const dayEvents = [...events, ...taskEvents].filter(event => {
    const eventDate = new Date(event.startTime);
    return eventDate.getDate() === currentDate.getDate() &&
           eventDate.getMonth() === currentDate.getMonth() &&
           eventDate.getFullYear() === currentDate.getFullYear();
  });
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("schedule")}</h1>
            {selectedView === "day" && (
              <p className="text-muted-foreground">
                {formatDate(currentDate)}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Tabs value={selectedView} onValueChange={setSelectedView} className="w-[400px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="day">{language === 'ja' ? "日表示" : language === 'zh' ? "今日日程" : "Today's Schedule"}</TabsTrigger>
                <TabsTrigger value="year">{language === 'ja' ? "年表示" : "Year View"}</TabsTrigger>
              </TabsList>
            </Tabs>
            <EventForm onAddEvent={handleAddEvent} />
          </div>
        </div>

        <Tabs value={selectedView} className="w-full">
          <TabsContent value="day" className="mt-0">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{language === 'ja' ? "今日の予定" : language === 'zh' ? "今日日程" : "Today's Schedule"}</CardTitle>
                    <CardDescription>{language === 'ja' ? "すべての予定とタスクを表示しています" : language === 'zh' ? "显示所有日程和任务" : "Showing all events and tasks"}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        const newDate = new Date(currentDate);
                        newDate.setDate(newDate.getDate() - 1);
                        setCurrentDate(newDate);
                      }}
                    >
                      <Icons.plus className="h-4 w-4 rotate-90 -scale-y-100 mr-2" />
                      {language === 'ja' ? "前日" : "Previous Day"}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        const newDate = new Date(currentDate);
                        newDate.setDate(newDate.getDate() + 1);
                        setCurrentDate(newDate);
                      }}
                    >
                      {language === 'ja' ? "次日" : "Next Day"}
                      <Icons.plus className="h-4 w-4 rotate-90 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {timeSlots.map(hour => {
                    const hourEvents = dayEvents.filter(event => {
                      const eventHour = new Date(event.startTime).getHours();
                      return eventHour === hour;
                    });
                    
                    return (
                      <div key={hour} className="flex">
                        <div className="w-16 text-right pr-4 text-muted-foreground">
                          {`${hour}:00`}
                        </div>
                        <div className="flex-1 border-l pl-4">
                          {hourEvents.length > 0 ? (
                            <div className="space-y-2">
                              {hourEvents.map(event => {
                                const startTime = new Date(event.startTime);
                                const endTime = new Date(event.endTime);
                                const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
                                
                                return (
                                  <div 
                                    key={event.id} 
                                    className={`rounded-md p-2 ${
                                      event.category === "仕事" || translateCategory(event.category, language) === "Work"
                                        ? "bg-blue-100 border-l-4 border-blue-500" 
                                        : event.category === "家事" || translateCategory(event.category, language) === "Household"
                                          ? "bg-green-100 border-l-4 border-green-500" 
                                          : "bg-purple-100 border-l-4 border-purple-500"
                                    } ${event.isTask ? "border-dashed" : ""}`}
                                    style={{ minHeight: `${Math.max(duration / 2, 30)}px` }}
                                  >
                                    <div className="font-medium">
                                      {event.isTask ? "🔔 " : ""}{event.title}
                                    </div>
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                      <span>
                                        {startTime.toLocaleTimeString(language === 'ja' ? "ja-JP" : "en-US", { hour: "2-digit", minute: "2-digit" })} 
                                        {!event.isTask && ` - 
                                        ${endTime.toLocaleTimeString(language === 'ja' ? "ja-JP" : "en-US", { hour: "2-digit", minute: "2-digit" })}`}
                                      </span>
                                      {event.location && <span>{event.location}</span>}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="h-8 flex items-center text-sm text-muted-foreground">
                              {language === 'ja' ? "予定なし" : "No events"}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="year" className="mt-0">
            <Card>
              <CardContent className="pt-6">
                <YearCalendar 
                  events={calendarEvents} 
                  onDateSelect={handleDateSelect} 
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
} 