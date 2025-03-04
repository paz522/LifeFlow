"use client";

import Link from "next/link";
import { Icons } from "./ui/icons";
import { useEffect, useState } from "react";
import { Language, getLanguage } from "@/lib/languages";

export function Sidebar() {
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

  // 言語に応じたタイトルを取得する関数
  const getTitle = (ja: string, en: string, zh: string) => {
    if (language === 'ja') return ja;
    if (language === 'zh') return zh;
    return en; // デフォルトは英語
  };

  const sidebarItems = [
    {
      title: getTitle('ホーム', 'Home', '首页'),
      href: "/",
      icon: Icons.home,
    },
    {
      title: getTitle('カレンダー', 'Calendar', '日历'),
      href: "/calendar",
      icon: Icons.calendar,
    },
    {
      title: getTitle('タスク', 'Tasks', '任务'),
      href: "/tasks",
      icon: Icons.listTodo,
    },
    {
      title: getTitle('設定', 'Settings', '设置'),
      href: "/settings",
      icon: Icons.settings,
    },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-14 flex-col border-r bg-background sm:flex lg:w-64">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px]">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Icons.logo className="h-6 w-6" />
          <span className="hidden lg:inline-block">LifeFlow</span>
        </Link>
      </div>
      <nav className="grid gap-1 p-2">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:bg-accent hover:text-accent-foreground"
          >
            <item.icon className="h-5 w-5" />
            <span className="hidden lg:inline-block">{item.title}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
} 