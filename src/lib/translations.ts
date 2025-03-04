import { Language } from "./languages";

// 翻訳データ
const translations = {
  ja: {
    // アプリ全般
    appName: "LifeFlow",
    settings: "設定",
    userSettings: "ユーザー設定",
    tasks: "タスク",
    schedule: "スケジュール",
    notifications: "通知",
    profile: "プロフィール",
    
    // 設定関連
    language: "言語",
    theme: "テーマ",
    light: "ライト",
    dark: "ダーク",
    system: "システム設定に合わせる",
    save: "保存",
    cancel: "キャンセル",
    
    // ホーム画面
    welcome: "LifeFlowへようこそ",
    mainFeatures: "主な機能と使い方",
    featuresDescription: "LifeFlowは、あなたの日常をサポートする多機能アプリです。",
    taskManagement: "タスク管理",
    taskManagementDesc: "タスクを簡単に作成、編集、完了できます。優先度や期限を設定して効率的に管理しましょう。",
    voiceInput: "音声入力",
    voiceInputDesc: "音声でタスクやメモを素早く入力できます。忙しい時や移動中に便利です。",
    notificationSystem: "通知機能",
    notificationSystemDesc: "重要な予定や期限が近いタスクを通知します。必要な情報を見逃しません。",
    todaysTasks: "今日のタスク",
    todaysSchedule: "今日の予定",
    count: "件",
    tasksStatus: "{completed}件完了、{pending}件未完了",
    nextSchedule: "次の予定: 13:00 会議",
    quickActions: "クイックアクション",
    quickActionsDescription: "よく使う機能にすぐアクセス",
    addNewTask: "新しいタスクを追加",
    addTaskByVoice: "音声でタスクを追加",
    viewCalendar: "カレンダーを表示",
    
    // タスク関連
    addTask: "タスクを追加",
    editTask: "タスクを編集",
    deleteTask: "タスクを削除",
    taskName: "タスク名",
    taskDescription: "説明",
    priority: "優先度",
    dueDate: "期限",
    completed: "完了",
    taskAdded: "タスクを追加しました",
    addedTaskName: "「{taskName}」を追加しました",
    createTask: "タスクを作成",
    personal: "個人",
    
    // 音声認識関連
    voiceRecognitionError: "音声認識エラー",
    errorOccurred: "エラーが発生しました",
    cannotStartVoiceRecognition: "音声認識を開始できません",
    browserDoesNotSupportVoiceRecognition: "ブラウザが音声認識をサポートしていないか、権限がありません。モックデータを使用します。",
    voiceRecognitionNotSupported: "音声認識がサポートされていません",
    taskCreatedFromVoiceInput: "音声入力から作成されたタスク",
    taskCreatedFromVoice: "音声からタスクを作成しました",
    recognizedText: "認識されたテキスト",
    listening: "聞いています...",
    noVoiceRecognized: "音声が認識されていません",
    pressTheMicrophoneButton: "マイクボタンを押して話しかけてください。",
    
    // 通知関連
    noNotifications: "通知はありません",
    markAllAsRead: "すべて既読にする",
    deleteAll: "すべて削除",
    
    // フッター関連
    shareThisPage: "このページをシェアする",
    shareOnTwitter: "Twitterでシェア",
    shareOnFacebook: "Facebookでシェア",
    shareOnLine: "LINEでシェア",
    copyright: "© 2025 LifeFlow. All rights reserved.",
    
    // 使い方ガイド
    howToUse: "使い方",
    taskUsage: "タスク管理: 「+」ボタンをクリックしてタスクを追加。チェックボックスでタスク完了を記録できます。",
    voiceUsage: "音声入力: マイクアイコンをクリックして話すだけで、テキストが自動的に入力されます。",
    notificationUsage: "通知: 右上のベルアイコンから通知を確認できます。重要な情報を見逃しません。"
  },
  en: {
    // App general
    appName: "LifeFlow",
    settings: "Settings",
    userSettings: "User Settings",
    tasks: "Tasks",
    schedule: "Schedule",
    notifications: "Notifications",
    profile: "Profile",
    
    // Settings related
    language: "Language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    system: "System",
    save: "Save",
    cancel: "Cancel",
    
    // Home screen
    welcome: "Welcome to LifeFlow",
    mainFeatures: "Main Features & Usage",
    featuresDescription: "LifeFlow is a multi-functional app that supports your daily life.",
    taskManagement: "Task Management",
    taskManagementDesc: "Easily create, edit, and complete tasks. Set priorities and deadlines for efficient management.",
    voiceInput: "Voice Input",
    voiceInputDesc: "Quickly input tasks and notes by voice. Convenient when you're busy or on the move.",
    notificationSystem: "Notification System",
    notificationSystemDesc: "Get notified of important schedules and tasks with approaching deadlines. Never miss essential information.",
    todaysTasks: "Today's Tasks",
    todaysSchedule: "Today's Schedule",
    count: "",
    tasksStatus: "{completed} completed, {pending} pending",
    nextSchedule: "Next: 13:00 Meeting",
    quickActions: "Quick Actions",
    quickActionsDescription: "Quick access to frequently used features",
    addNewTask: "Add New Task",
    addTaskByVoice: "Add Task by Voice",
    viewCalendar: "View Calendar",
    
    // Task related
    addTask: "Add Task",
    editTask: "Edit Task",
    deleteTask: "Delete Task",
    taskName: "Task Name",
    taskDescription: "Description",
    priority: "Priority",
    dueDate: "Due Date",
    completed: "Completed",
    taskAdded: "Task added",
    addedTaskName: "Added \"{taskName}\"",
    createTask: "Create Task",
    personal: "Personal",
    
    // Voice recognition related
    voiceRecognitionError: "Voice Recognition Error",
    errorOccurred: "Error occurred",
    cannotStartVoiceRecognition: "Cannot start voice recognition",
    browserDoesNotSupportVoiceRecognition: "Your browser doesn't support voice recognition or permission is denied. Using mock data.",
    voiceRecognitionNotSupported: "Voice recognition not supported",
    taskCreatedFromVoiceInput: "Task created from voice input",
    taskCreatedFromVoice: "Task created from voice",
    recognizedText: "Recognized Text",
    listening: "Listening...",
    noVoiceRecognized: "No voice recognized",
    pressTheMicrophoneButton: "Press the microphone button and speak.",
    
    // Notification related
    noNotifications: "No notifications",
    markAllAsRead: "Mark all as read",
    deleteAll: "Delete all",
    
    // Footer related
    shareThisPage: "Share this page",
    shareOnTwitter: "Share on Twitter",
    shareOnFacebook: "Share on Facebook",
    shareOnLine: "Share on LINE",
    copyright: "© 2025 LifeFlow. All rights reserved.",
    
    // Usage guide
    howToUse: "How to Use",
    taskUsage: "Task Management: Click the '+' button to add a task. Use checkboxes to mark tasks as completed.",
    voiceUsage: "Voice Input: Click the microphone icon and speak - text will be entered automatically.",
    notificationUsage: "Notifications: Check notifications from the bell icon in the top right. Never miss important information."
  },
  zh: {
    // 应用程序一般
    appName: "LifeFlow",
    settings: "设置",
    userSettings: "用户设置",
    tasks: "任务",
    schedule: "日程",
    notifications: "通知",
    profile: "个人资料",
    
    // 设置相关
    language: "语言",
    theme: "主题",
    light: "浅色",
    dark: "深色",
    system: "跟随系统",
    save: "保存",
    cancel: "取消",
    
    // 主页
    welcome: "欢迎使用 LifeFlow",
    mainFeatures: "主要功能和使用方法",
    featuresDescription: "LifeFlow 是一款支持您日常生活的多功能应用。",
    taskManagement: "任务管理",
    taskManagementDesc: "轻松创建、编辑和完成任务。设置优先级和截止日期以实现高效管理。",
    voiceInput: "语音输入",
    voiceInputDesc: "通过语音快速输入任务和笔记。在您忙碌或移动时非常方便。",
    notificationSystem: "通知系统",
    notificationSystemDesc: "获取重要日程和即将到期任务的通知。不会错过重要信息。",
    todaysTasks: "今日任务",
    todaysSchedule: "今日日程",
    count: "个",
    tasksStatus: "{completed}个已完成，{pending}个待办",
    nextSchedule: "下一个：13:00 会议",
    quickActions: "快速操作",
    quickActionsDescription: "快速访问常用功能",
    addNewTask: "添加新任务",
    addTaskByVoice: "通过语音添加任务",
    viewCalendar: "查看日历",
    
    // 任务相关
    addTask: "添加任务",
    editTask: "编辑任务",
    deleteTask: "删除任务",
    taskName: "任务名称",
    taskDescription: "描述",
    priority: "优先级",
    dueDate: "截止日期",
    completed: "已完成",
    taskAdded: "任务已添加",
    addedTaskName: "已添加\"{taskName}\"",
    createTask: "创建任务",
    personal: "个人",
    
    // 语音识别相关
    voiceRecognitionError: "语音识别错误",
    errorOccurred: "发生错误",
    cannotStartVoiceRecognition: "无法启动语音识别",
    browserDoesNotSupportVoiceRecognition: "您的浏览器不支持语音识别或权限被拒绝。使用模拟数据。",
    voiceRecognitionNotSupported: "不支持语音识别",
    taskCreatedFromVoiceInput: "从语音输入创建的任务",
    taskCreatedFromVoice: "从语音创建的任务",
    recognizedText: "识别的文本",
    listening: "正在听取...",
    noVoiceRecognized: "未识别到语音",
    pressTheMicrophoneButton: "按下麦克风按钮并说话。",
    
    // 通知相关
    noNotifications: "没有通知",
    markAllAsRead: "标记所有为已读",
    deleteAll: "删除所有",
    
    // 页脚相关
    shareThisPage: "分享此页面",
    shareOnTwitter: "在Twitter上分享",
    shareOnFacebook: "在Facebook上分享",
    shareOnLine: "在LINE上分享",
    copyright: "© 2025 LifeFlow. 保留所有权利。",
    
    // 使用指南
    howToUse: "使用方法",
    taskUsage: "任务管理：点击"+"按钮添加任务。使用复选框标记任务为已完成。",
    voiceUsage: "语音输入：点击麦克风图标并说话 - 文本将自动输入。",
    notificationUsage: "通知：从右上角的铃铛图标查看通知。不会错过重要信息。"
  }
};

// 翻訳を取得する関数
export function getTranslation(key: keyof typeof translations.ja, language: Language): string {
  try {
    // 指定された言語の翻訳を取得
    const translationSet = translations[language];
    
    // キーに対応する翻訳があれば返す
    if (translationSet && key in translationSet) {
      return translationSet[key];
    }
    
    // 翻訳がない場合は日本語の翻訳を返す
    return translations.ja[key] || key;
  } catch (error) {
    console.error('翻訳の取得中にエラーが発生しました:', error);
    return key;
  }
}

// 現在の言語で翻訳を取得するヘルパー関数
export function useTranslation(language: Language) {
  return {
    t: (key: keyof typeof translations.ja) => getTranslation(key, language)
  };
} 