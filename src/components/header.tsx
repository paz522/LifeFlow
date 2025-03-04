"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icons } from "./ui/icons";
import { Button } from "./ui/button";
import { NotificationDropdown } from "./notification-dropdown";
import { ThemeToggle } from "./theme-toggle";
import { LanguageDropdown } from "./language-dropdown";
import { Language, getLanguage } from "@/lib/languages";
import { useTranslation } from "@/lib/translations";

export function Header() {
  const [language, setLanguage] = useState<Language>("ja");
  const { t } = useTranslation(language);

  useEffect(() => {
    // 初期言語を取得
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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <div className="flex">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.logo className="h-6 w-6" />
            <span className="font-bold">{t("appName")}</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center space-x-2">
            <ThemeToggle />
            <LanguageDropdown />
            <NotificationDropdown />
            <Button variant="ghost" size="icon" asChild>
              <Link href="/settings">
                <Icons.user className="h-5 w-5" />
                <span className="sr-only">{t("userSettings")}</span>
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
} 