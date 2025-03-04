"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Notification,
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
} from "@/lib/notifications";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { toast } from "@/components/ui/use-toast";

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  // 通知データの読み込み
  useEffect(() => {
    const loadNotifications = () => {
      const notifs = getNotifications();
      setNotifications(notifs);
      setUnreadCount(getUnreadCount());
    };

    loadNotifications();

    // 1分ごとに通知を更新
    const interval = setInterval(loadNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  // 通知を開いたときに既読にする
  useEffect(() => {
    if (open && unreadCount > 0) {
      const updatedNotifications = markAllAsRead();
      setNotifications(updatedNotifications);
      setUnreadCount(0);
    }
  }, [open, unreadCount]);

  // 通知をクリックしたときの処理
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      const updatedNotifications = markAsRead(notification.id);
      setNotifications(updatedNotifications);
      setUnreadCount(getUnreadCount());
    }

    // 通知タイプに応じた処理
    switch (notification.type) {
      case "task":
        // タスクページに遷移する処理を追加
        window.location.href = "/tasks";
        break;
      case "schedule":
        // カレンダーページに遷移する処理を追加
        window.location.href = "/calendar";
        break;
      case "system":
        // システム通知は特に何もしない
        break;
    }
  };

  // 通知を削除する
  const handleDeleteNotification = (e: React.MouseEvent, notificationId: number) => {
    e.stopPropagation();
    const updatedNotifications = deleteNotification(notificationId);
    setNotifications(updatedNotifications);
    setUnreadCount(getUnreadCount());
    toast({
      title: "削除",
      description: "通知が削除されました",
    });
  };

  // すべての通知を既読にする
  const handleMarkAllAsRead = () => {
    const updatedNotifications = markAllAsRead();
    setNotifications(updatedNotifications);
    setUnreadCount(0);
    toast({
      title: "すべて既読にする",
      description: "すべての通知が既読になりました",
    });
  };

  // 通知アイコンのスタイル
  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "task":
        return <Icons.listTodo className="h-4 w-4 text-blue-500" />;
      case "schedule":
        return <Icons.calendar className="h-4 w-4 text-green-500" />;
      case "system":
        return <Icons.info className="h-4 w-4 text-purple-500" />;
    }
  };

  // 時間を「〜前」の形式でフォーマット
  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), {
        addSuffix: true,
        locale: ja,
      });
    } catch (error) {
      return "不明な時間";
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Icons.bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b p-3">
          <h3 className="font-medium">通知</h3>
          {notifications.some((n) => !n.read) && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={handleMarkAllAsRead}
            >
              すべて既読にする
            </Button>
          )}
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex cursor-pointer items-start gap-3 border-b p-3 hover:bg-muted/50 ${
                  !notification.read ? "bg-muted/20" : ""
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="mt-1 flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{notification.title}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-50 hover:opacity-100"
                      onClick={(e) => handleDeleteNotification(e, notification.id)}
                    >
                      <Icons.close className="h-3 w-3" />
                      <span className="sr-only">削除</span>
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {notification.message}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatTime(notification.timestamp)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-6">
              <Icons.inbox className="mb-2 h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">通知はありません</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
} 