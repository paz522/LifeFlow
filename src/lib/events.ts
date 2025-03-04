// イベントの型定義
export interface Event {
  id: number | string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location: string;
  category: string;
  isTask?: boolean;
}

// ローカルストレージのキー
const EVENTS_STORAGE_KEY = 'lifeflow-events';

// 初期イベントデータ
const initialEvents: Event[] = [];

// イベントをローカルストレージから取得
export function getEvents(): Event[] {
  if (typeof window === 'undefined') {
    return initialEvents;
  }
  
  const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
  if (!storedEvents) {
    // 初回アクセス時は初期データを保存
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(initialEvents));
    return initialEvents;
  }
  
  try {
    return JSON.parse(storedEvents);
  } catch (error) {
    console.error('イベントの読み込みに失敗しました:', error);
    return initialEvents;
  }
}

// イベントをローカルストレージに保存
export function saveEvents(events: Event[]): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('イベントの保存に失敗しました:', error);
  }
}

// 新しいイベントを追加
export function addEvent(event: Omit<Event, 'id'>): Event {
  const events = getEvents();
  const newId = events.length > 0 ? Math.max(...events.map(e => Number(e.id))) + 1 : 1;
  
  const newEvent: Event = {
    ...event,
    id: newId
  };
  
  const updatedEvents = [...events, newEvent];
  saveEvents(updatedEvents);
  
  return newEvent;
}

// イベントを削除
export function deleteEvent(eventId: number | string): Event[] {
  const events = getEvents();
  const updatedEvents = events.filter(event => event.id !== eventId);
  
  saveEvents(updatedEvents);
  return updatedEvents;
}

// ローカルストレージをクリア
export function clearEventsStorage(): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.removeItem(EVENTS_STORAGE_KEY);
  } catch (error) {
    console.error('イベントの削除に失敗しました:', error);
  }
} 