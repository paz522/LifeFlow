"use client";

import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { Language, getLanguage } from "@/lib/languages";
import { useTranslation } from "@/lib/translations";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [language, setLanguage] = useState<Language>("ja");
  const { t } = useTranslation(language);

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

  // SNSでシェアする関数
  const shareOnX = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('LifeFlow')}&url=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 pl-0 sm:pl-14 lg:pl-64">
          <div className="px-4 py-6">{children}</div>
        </main>
      </div>
      
      {/* SNSシェアボタンを含むフッター */}
      <footer className="w-full bg-muted/40 py-4 border-t">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <p className="text-sm text-muted-foreground mb-2">{t("shareThisPage")}</p>
          <div className="flex space-x-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={shareOnX} 
              title={t("shareOnTwitter")}
              className="bg-black hover:bg-black/90 border-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1200 1227"
                className="h-5 w-5"
                fill="white"
              >
                <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 87.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1143.69H892.476L569.165 687.854V687.828Z" />
              </svg>
            </Button>
            <Button variant="outline" size="icon" onClick={shareOnFacebook} title={t("shareOnFacebook")}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
                className="h-5 w-5 fill-[#1877f2]"
              >
                <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
              </svg>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">{t("copyright")}</p>
        </div>
      </footer>
      
      <Toaster />
    </div>
  );
} 