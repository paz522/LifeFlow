"use client";

import { ReactNode, useEffect } from "react";
import { initTheme } from "@/lib/themes";
import { initLanguage } from "@/lib/languages";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    // テーマの初期化
    const cleanupTheme = initTheme();
    // 言語の初期化
    const cleanupLanguage = initLanguage();
    
    return () => {
      cleanupTheme();
      cleanupLanguage();
    };
  }, []);

  return children;
} 