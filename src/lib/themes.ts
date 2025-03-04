// テーマの型定義
export type Theme = 'light' | 'dark' | 'system';

// ローカルストレージのキー
const THEME_STORAGE_KEY = 'lifeflow-theme';

// デフォルトのテーマ
const DEFAULT_THEME: Theme = 'light';

// 有効なテーマかどうかをチェック
function isValidTheme(theme: string | null): theme is Theme {
  return theme === 'light' || theme === 'dark' || theme === 'system';
}

// テーマをローカルストレージから取得
export function getTheme(): Theme {
  if (typeof window === 'undefined') {
    return DEFAULT_THEME;
  }
  
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (!storedTheme || !isValidTheme(storedTheme)) {
    return DEFAULT_THEME;
  }
  
  return storedTheme;
}

// テーマをローカルストレージに保存
export function setTheme(theme: Theme): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  // テーマが無効な場合はデフォルトテーマを使用
  if (!isValidTheme(theme)) {
    theme = DEFAULT_THEME;
  }
  
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  
  // HTML要素のdata-theme属性を更新
  const root = window.document.documentElement;
  
  // 以前のテーマクラスを削除
  root.classList.remove('light', 'dark');
  
  // システムテーマの場合はメディアクエリに基づいて設定
  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    root.classList.add(systemTheme);
    root.setAttribute('data-theme', systemTheme);
    root.style.colorScheme = systemTheme;
  } else {
    // テーマが空でないことを確認
    if (theme) {
      root.classList.add(theme);
      root.setAttribute('data-theme', theme);
      root.style.colorScheme = theme;
    }
  }
}

// システムテーマの変更を監視
export function initTheme(): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }
  
  // 初期テーマを設定
  const theme = getTheme();
  setTheme(theme);
  
  // システムテーマの変更を監視
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleChange = () => {
    if (getTheme() === 'system') {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      
      const systemTheme = mediaQuery.matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
      root.setAttribute('data-theme', systemTheme);
      root.style.colorScheme = systemTheme;
    }
  };
  
  mediaQuery.addEventListener('change', handleChange);
  
  // クリーンアップ関数を返す
  return () => mediaQuery.removeEventListener('change', handleChange);
} 