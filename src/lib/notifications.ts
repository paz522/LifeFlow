// 通知の型定義
export interface Notification {
  id: number;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'task' | 'schedule' | 'system';
}

// ローカルストレージのキー
const NOTIFICATIONS_STORAGE_KEY = 'lifeflow-notifications';

// 現在時刻を取得
const now = new Date();

// サンプル通知データ
const initialNotifications: Notification[] = [
  {
    id: 1,
    title: "LifeFlowへようこそ",
    message: "タスクと予定を管理して、生活をスムーズに。",
    timestamp: new Date().toISOString(),
    read: false,
    type: 'system'
  }
];

// 通知をローカルストレージから取得
export function getNotifications(): Notification[] {
  if (typeof window === 'undefined') {
    return initialNotifications;
  }
  
  const storedNotifications = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
  if (!storedNotifications) {
    // 初回アクセス時は初期データを保存
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(initialNotifications));
    return initialNotifications;
  }
  
  try {
    return JSON.parse(storedNotifications);
  } catch (error) {
    console.error('通知の読み込みに失敗しました:', error);
    return initialNotifications;
  }
}

// 通知をローカルストレージに保存
export function saveNotifications(notifications: Notification[]): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
  } catch (error) {
    console.error('通知の保存に失敗しました:', error);
  }
}

// 新しい通知を追加
export function addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): Notification {
  const notifications = getNotifications();
  const newId = notifications.length > 0 ? Math.max(...notifications.map(n => n.id)) + 1 : 1;
  
  const newNotification: Notification = {
    ...notification,
    id: newId,
    timestamp: new Date().toISOString(),
    read: false
  };
  
  const updatedNotifications = [newNotification, ...notifications];
  saveNotifications(updatedNotifications);
  
  return newNotification;
}

// 通知を既読にする
export function markAsRead(notificationId: number): Notification[] {
  const notifications = getNotifications();
  const updatedNotifications = notifications.map(notification => 
    notification.id === notificationId 
      ? { ...notification, read: true } 
      : notification
  );
  
  saveNotifications(updatedNotifications);
  return updatedNotifications;
}

// すべての通知を既読にする
export function markAllAsRead(): Notification[] {
  const notifications = getNotifications();
  const updatedNotifications = notifications.map(notification => ({ ...notification, read: true }));
  
  saveNotifications(updatedNotifications);
  return updatedNotifications;
}

// 通知を削除
export function deleteNotification(notificationId: number): Notification[] {
  const notifications = getNotifications();
  const updatedNotifications = notifications.filter(notification => notification.id !== notificationId);
  
  saveNotifications(updatedNotifications);
  return updatedNotifications;
}

// 未読の通知の数を取得
export function getUnreadCount(): number {
  const notifications = getNotifications();
  return notifications.filter(notification => !notification.read).length;
}

// タスク関連の通知を作成
export function createTaskNotification(taskTitle: string): Notification {
  return addNotification({
    title: "タスクのリマインダー",
    message: `「${taskTitle}」の期限が近づいています`,
    type: 'task'
  });
}

// 予定関連の通知を作成
export function createScheduleNotification(eventTitle: string): Notification {
  return addNotification({
    title: "予定の通知",
    message: `${eventTitle}の時間になりました`,
    type: 'schedule'
  });
}

// システム通知を作成
export function createSystemNotification(title: string, message: string): Notification {
  return addNotification({
    title,
    message,
    type: 'system'
  });
}

// ローカルストレージをクリア
export function clearNotificationsStorage(): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.removeItem(NOTIFICATIONS_STORAGE_KEY);
  } catch (error) {
    console.error('通知の削除に失敗しました:', error);
  }
} 