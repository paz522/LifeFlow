"use client";

import { useEffect, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Theme, getTheme, setTheme } from '@/lib/themes';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

// カスタムイベント名
const THEME_CHANGE_EVENT = 'theme-change';

export function ThemeToggle() {
  const [currentTheme, setCurrentTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // マウント後にのみテーマを取得（SSRとの互換性のため）
  useEffect(() => {
    // 現在のテーマを取得
    const theme = getTheme();
    setCurrentTheme(theme);
    
    // テーマを適用
    setTheme(theme);
    
    setMounted(true);
    
    // テーマの変更を監視
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'lifeflow-theme') {
        const updatedTheme = getTheme();
        setCurrentTheme(updatedTheme);
      }
    };
    
    // カスタムイベントの監視
    const handleThemeChangeEvent = () => {
      const updatedTheme = getTheme();
      setCurrentTheme(updatedTheme);
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChangeEvent);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChangeEvent);
    };
  }, []);

  // テーマを変更する関数
  const handleThemeChange = (theme: Theme) => {
    setTheme(theme);
    setCurrentTheme(theme);
    
    // カスタムイベントを発火させる（同一ウィンドウ内の他のコンポーネントに通知するため）
    window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT));
  };

  // マウント前は何も表示しない（SSRとの互換性のため）
  if (!mounted) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
          {currentTheme === 'light' && <Sun className="h-4 w-4" />}
          {currentTheme === 'dark' && <Moon className="h-4 w-4" />}
          {currentTheme === 'system' && <Monitor className="h-4 w-4" />}
          <span className="sr-only">テーマ</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1">
        <div className="grid grid-cols-1 gap-1">
          <Button
            variant="ghost"
            className={cn(
              "flex items-center justify-start gap-2 px-2 py-1.5",
              currentTheme === 'light' && "bg-accent"
            )}
            onClick={() => handleThemeChange('light')}
          >
            <Sun className="h-4 w-4" />
            <span>ライト</span>
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "flex items-center justify-start gap-2 px-2 py-1.5",
              currentTheme === 'dark' && "bg-accent"
            )}
            onClick={() => handleThemeChange('dark')}
          >
            <Moon className="h-4 w-4" />
            <span>ダーク</span>
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "flex items-center justify-start gap-2 px-2 py-1.5",
              currentTheme === 'system' && "bg-accent"
            )}
            onClick={() => handleThemeChange('system')}
          >
            <Monitor className="h-4 w-4" />
            <span>システム</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
} 