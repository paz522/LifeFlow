"use client";

import { Layout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Theme, getTheme, setTheme } from "@/lib/themes";
import { Language, getLanguage, setLanguage } from "@/lib/languages";
import { useTranslation } from "@/lib/translations";

export default function SettingsPage() {
  const [language, setCurrentLanguage] = useState<Language>("ja");
  const { t } = useTranslation(language);
  
  const [settings, setSettings] = useState({
    name: "",
    email: "",
    language: "ja" as Language,
    theme: "light" as Theme,
  });

  // マウント時に現在のテーマと言語を取得
  useEffect(() => {
    const currentTheme = getTheme();
    const currentLanguage = getLanguage();
    setSettings(prev => ({ 
      ...prev, 
      theme: currentTheme,
      language: currentLanguage
    }));
    setCurrentLanguage(currentLanguage);
    
    // 言語変更イベントをリッスン
    const handleLanguageChange = (e: CustomEvent<{ language: Language }>) => {
      setCurrentLanguage(e.detail.language);
    };

    window.addEventListener('languagechange', handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener('languagechange', handleLanguageChange as EventListener);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setSettings(prev => ({ ...prev, [name]: value }));

    // テーマが変更された場合、実際にテーマを適用
    if (name === "theme") {
      setTheme(value as Theme);
      console.log('設定ページ: テーマを変更しました', value);
    }
    
    // 言語が変更された場合、実際に言語を適用
    if (name === "language") {
      console.log('設定ページ: 言語を変更します', value);
      setLanguage(value as Language, true);
      // 言語変更後に現在の言語状態を更新
      setCurrentLanguage(value as Language);
      // ページのリロードを防止するため、ここでは言語変更イベントを手動で発行
      const event = new CustomEvent('languagechange', { detail: { language: value } });
      window.dispatchEvent(event);
      console.log('設定ページ: 言語変更イベントを発行しました', value);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert(language === 'ja' ? "設定が保存されました。" : "Settings have been saved.");
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("settings")}</h1>
          <p className="text-muted-foreground">
            {language === 'ja' ? "アプリケーションの設定を管理します" : "Manage your application settings"}
          </p>
        </div>

        <form onSubmit={handleSave}>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("profile")}</CardTitle>
                <CardDescription>{language === 'ja' ? "個人情報とアカウント設定" : "Personal information and account settings"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">{language === 'ja' ? "名前" : "Name"}</Label>
                  <Input
                    id="name"
                    name="name"
                    value={settings.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">{language === 'ja' ? "メールアドレス" : "Email"}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={settings.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="language">{t("language")}</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => handleSelectChange("language", value)}
                  >
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ja">日本語</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="theme">{t("theme")}</Label>
                  <Select
                    value={settings.theme}
                    onValueChange={(value) => handleSelectChange("theme", value)}
                  >
                    <SelectTrigger id="theme">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">{t("light")}</SelectItem>
                      <SelectItem value="dark">{t("dark")}</SelectItem>
                      <SelectItem value="system">{t("system")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit">{t("save")}</Button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
} 