"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Language, getLanguage, setLanguage } from "@/lib/languages";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check } from "lucide-react";

export function LanguageDropdown() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("ja");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // マウント時に現在の言語を取得
    try {
      const language = getLanguage();
      setCurrentLanguage(language);
      console.log('LanguageDropdown: 初期言語を取得しました', language);
    } catch (error) {
      console.error('LanguageDropdown: 初期言語の取得に失敗しました', error);
    }

    // 言語変更イベントをリッスン
    const handleLanguageChange = (e: CustomEvent<{ language: Language }>) => {
      console.log('LanguageDropdown: 言語変更イベントを受信しました', e.detail.language);
      setCurrentLanguage(e.detail.language);
    };

    window.addEventListener('languagechange', handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener('languagechange', handleLanguageChange as EventListener);
    };
  }, []);

  function changeLanguage(lang: Language) {
    try {
      if (lang === currentLanguage) {
        setOpen(false);
        return;
      }
      
      console.log('LanguageDropdown: 言語切り替え', currentLanguage, '->', lang);
      
      // 言語を設定（setLanguage関数内でローカルストレージへの保存とイベント発行を行う）
      setLanguage(lang);
      
      // 状態を更新（実際にはsetLanguage内のページリロードにより、この行は実行されない可能性が高い）
      setCurrentLanguage(lang);
      setOpen(false);
      
      console.log('LanguageDropdown: 言語切り替え完了', lang);
    } catch (error) {
      console.error('LanguageDropdown: 言語切り替えに失敗しました', error);
    }
  }

  // 言語名を取得
  const getLanguageName = (lang: Language): string => {
    switch (lang) {
      case "ja": return "日本語";
      case "en": return "English";
      case "zh": return "中文";
      default: return lang;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          title="言語を選択"
        >
          <span className="font-bold">{currentLanguage.toUpperCase()}</span>
          <span className="sr-only">言語を選択</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0" align="end">
        <div className="flex flex-col py-1">
          {["ja", "en", "zh"].map((lang) => (
            <Button
              key={lang}
              variant="ghost"
              className="justify-start px-3 py-2 text-sm font-normal"
              onClick={() => changeLanguage(lang as Language)}
            >
              <div className="flex w-full items-center justify-between">
                <span>{getLanguageName(lang as Language)}</span>
                {currentLanguage === lang && <Check className="h-4 w-4" />}
              </div>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
} 