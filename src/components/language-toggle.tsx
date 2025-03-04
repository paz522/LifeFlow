"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Language, getLanguage, setLanguage } from "@/lib/languages";

export function LanguageToggle() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("ja");

  useEffect(() => {
    // マウント時に現在の言語を取得
    try {
      const language = getLanguage();
      setCurrentLanguage(language);
      console.log('LanguageToggle: 初期言語を取得しました', language);
    } catch (error) {
      console.error('LanguageToggle: 初期言語の取得に失敗しました', error);
    }

    // 言語変更イベントをリッスン
    const handleLanguageChange = (e: CustomEvent<{ language: Language }>) => {
      console.log('LanguageToggle: 言語変更イベントを受信しました', e.detail.language);
      setCurrentLanguage(e.detail.language);
    };

    window.addEventListener('languagechange', handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener('languagechange', handleLanguageChange as EventListener);
    };
  }, []);

  function toggleLanguage() {
    try {
      const newLanguage: Language = currentLanguage === "ja" ? "en" : "ja";
      console.log('LanguageToggle: 言語切り替え', currentLanguage, '->', newLanguage);
      
      // 言語を設定（setLanguage関数内でローカルストレージへの保存とイベント発行を行う）
      setLanguage(newLanguage);
      
      // 状態を更新（実際にはsetLanguage内のページリロードにより、この行は実行されない可能性が高い）
      setCurrentLanguage(newLanguage);
      
      console.log('LanguageToggle: 言語切り替え完了', newLanguage);
    } catch (error) {
      console.error('LanguageToggle: 言語切り替えに失敗しました', error);
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleLanguage}
      className="relative"
      title={currentLanguage === "ja" ? "Switch to English" : "日本語に切り替え"}
    >
      <span className="font-bold">{currentLanguage.toUpperCase()}</span>
      <span className="sr-only">
        {currentLanguage === "ja" ? "英語に切り替え" : "Switch to Japanese"}
      </span>
    </Button>
  );
} 