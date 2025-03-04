// 言語の型定義
export type Language = 'ja' | 'en' | 'zh';

// ローカルストレージのキー
const LANGUAGE_STORAGE_KEY = 'lifeflow-language';

// デフォルトの言語
const DEFAULT_LANGUAGE: Language = 'ja';

// 有効な言語かどうかをチェック
function isValidLanguage(language: string | null): language is Language {
  return language === 'ja' || language === 'en' || language === 'zh';
}

// 言語をローカルストレージから取得
export function getLanguage(): Language {
  if (typeof window === 'undefined') {
    console.log('サーバーサイドでの実行: デフォルト言語を返します', DEFAULT_LANGUAGE);
    return DEFAULT_LANGUAGE;
  }
  
  try {
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    console.log('ストレージから取得した言語:', storedLanguage);
    
    if (!storedLanguage || !isValidLanguage(storedLanguage)) {
      console.log('有効な言語が見つからないため、デフォルト言語を使用します:', DEFAULT_LANGUAGE);
      return DEFAULT_LANGUAGE;
    }
    
    return storedLanguage;
  } catch (error) {
    console.error('言語の取得中にエラーが発生しました:', error);
    return DEFAULT_LANGUAGE;
  }
}

// 言語をローカルストレージに保存
export function setLanguage(language: Language, skipReload: boolean = false): void {
  if (typeof window === 'undefined') {
    console.log('サーバーサイドでの実行: 言語設定をスキップします');
    return;
  }
  
  try {
    // 言語が無効な場合はデフォルト言語を使用
    if (!isValidLanguage(language)) {
      console.warn('無効な言語が指定されました。デフォルト言語を使用します:', DEFAULT_LANGUAGE);
      language = DEFAULT_LANGUAGE;
    }
    
    // 現在の言語を取得
    const currentLanguage = getLanguage();
    
    // 同じ言語の場合は何もしない
    if (currentLanguage === language) {
      console.log('言語は既に設定されています:', language);
      return;
    }
    
    console.log('言語を設定します:', language);
    
    // ローカルストレージに保存
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    console.log('ローカルストレージに言語を保存しました:', language);
    
    // HTML要素のlang属性を更新
    document.documentElement.lang = language;
    console.log('HTML lang属性を更新しました:', language);
    
    // イベントを発行して言語変更を通知
    const event = new CustomEvent('languagechange', { detail: { language } });
    window.dispatchEvent(event);
    console.log('言語変更イベントを発行しました:', language);
    
    // 言語変更を確認するためのコンソールログ
    console.log('言語が変更されました:', language);
    
    // skipReloadがtrueの場合はリロードをスキップ
    if (!skipReload) {
      // ページをリロード
      console.log('ページをリロードします...');
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } else {
      console.log('ページリロードをスキップします');
    }
  } catch (error) {
    console.error('言語の設定中にエラーが発生しました:', error);
  }
}

// 初期言語を設定
export function initLanguage(): () => void {
  if (typeof window === 'undefined') {
    console.log('サーバーサイドでの実行: 言語初期化をスキップします');
    return () => {};
  }
  
  try {
    // 初期言語を設定
    const language = getLanguage();
    
    // HTML要素のlang属性を更新
    document.documentElement.lang = language;
    
    console.log('初期言語が設定されました:', language);
  } catch (error) {
    console.error('言語の初期化中にエラーが発生しました:', error);
  }
  
  // クリーンアップ関数を返す
  return () => {
    console.log('言語設定のクリーンアップを実行します');
  };
} 