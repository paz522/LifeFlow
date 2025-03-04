import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export type CalendarProps = React.HTMLAttributes<HTMLDivElement> & {
  month: Date
  onMonthChange?: (date: Date) => void
  events?: {
    date: Date
    count: number
  }[]
  onDateSelect?: (date: Date) => void
  selectedDate?: Date
}

export function Calendar({
  className,
  month,
  onMonthChange,
  events = [],
  onDateSelect,
  selectedDate,
  ...props
}: CalendarProps) {
  // 月の最初の日を取得
  const firstDayOfMonth = new Date(month.getFullYear(), month.getMonth(), 1)
  
  // 月の最後の日を取得
  const lastDayOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0)
  
  // 月の最初の日の曜日を取得（0: 日曜日, 1: 月曜日, ..., 6: 土曜日）
  const firstDayOfWeek = firstDayOfMonth.getDay()
  
  // 月の日数を取得
  const daysInMonth = lastDayOfMonth.getDate()
  
  // 前月の最後の日を取得
  const lastDayOfPrevMonth = new Date(month.getFullYear(), month.getMonth(), 0).getDate()
  
  // カレンダーの行数を計算
  const weeksInMonth = Math.ceil((firstDayOfWeek + daysInMonth) / 7)
  
  // 曜日の配列
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"]
  
  // 月の名前の配列
  const monthNames = [
    "1月", "2月", "3月", "4月", "5月", "6月",
    "7月", "8月", "9月", "10月", "11月", "12月"
  ]
  
  // 前月に移動
  const handlePrevMonth = () => {
    if (onMonthChange) {
      const prevMonth = new Date(month.getFullYear(), month.getMonth() - 1, 1)
      onMonthChange(prevMonth)
    }
  }
  
  // 次月に移動
  const handleNextMonth = () => {
    if (onMonthChange) {
      const nextMonth = new Date(month.getFullYear(), month.getMonth() + 1, 1)
      onMonthChange(nextMonth)
    }
  }
  
  // 日付をクリックしたときの処理
  const handleDateClick = (date: Date) => {
    if (onDateSelect) {
      onDateSelect(date)
    }
  }
  
  // 日付に対応するイベント数を取得
  const getEventCount = (date: Date) => {
    const matchingEvent = events.find(event => 
      event.date.getDate() === date.getDate() && 
      event.date.getMonth() === date.getMonth() && 
      event.date.getFullYear() === date.getFullYear()
    )
    return matchingEvent ? matchingEvent.count : 0
  }
  
  // 日付が今日かどうかを判定
  const isToday = (date: Date) => {
    const today = new Date()
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear()
  }
  
  // 日付が選択されているかどうかを判定
  const isSelected = (date: Date) => {
    if (!selectedDate) return false
    return date.getDate() === selectedDate.getDate() && 
           date.getMonth() === selectedDate.getMonth() && 
           date.getFullYear() === selectedDate.getFullYear()
  }
  
  return (
    <div className={cn("w-full", className)} {...props}>
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevMonth}
          className="h-7 w-7"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">前月</span>
        </Button>
        <h2 className="text-lg font-semibold">
          {month.getFullYear()}年 {monthNames[month.getMonth()]}
        </h2>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNextMonth}
          className="h-7 w-7"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">次月</span>
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weekdays.map((day, index) => (
          <div
            key={index}
            className="text-center text-sm font-medium text-muted-foreground h-8 flex items-center justify-center"
          >
            {day}
          </div>
        ))}
        {Array.from({ length: weeksInMonth * 7 }).map((_, index) => {
          const dayOffset = index - firstDayOfWeek
          const day = dayOffset + 1
          
          // 日付オブジェクトを作成
          let date: Date
          let isCurrentMonth = true
          
          if (day <= 0) {
            // 前月の日付
            date = new Date(month.getFullYear(), month.getMonth() - 1, lastDayOfPrevMonth + day)
            isCurrentMonth = false
          } else if (day > daysInMonth) {
            // 次月の日付
            date = new Date(month.getFullYear(), month.getMonth() + 1, day - daysInMonth)
            isCurrentMonth = false
          } else {
            // 当月の日付
            date = new Date(month.getFullYear(), month.getMonth(), day)
          }
          
          const eventCount = getEventCount(date)
          const today = isToday(date)
          const selected = isSelected(date)
          
          return (
            <button
              key={index}
              className={cn(
                "h-10 text-center text-sm p-0 relative",
                !isCurrentMonth && "text-muted-foreground opacity-50",
                today && "bg-accent text-accent-foreground",
                selected && "bg-primary text-primary-foreground",
                (today || selected) && "font-semibold",
                "hover:bg-accent hover:text-accent-foreground rounded-md"
              )}
              onClick={() => handleDateClick(date)}
              disabled={!isCurrentMonth}
            >
              <time dateTime={date.toISOString()}>{date.getDate()}</time>
              {eventCount > 0 && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                  <div className="h-1 w-1 rounded-full bg-primary"></div>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
} 