"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface YearCalendarProps {
  events?: {
    date: Date;
    count: number;
  }[];
  onDateSelect?: (date: Date) => void;
  className?: string;
}

export function YearCalendar({ events = [], onDateSelect, className }: YearCalendarProps) {
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // 前年に移動
  const handlePrevYear = () => {
    setYear(year - 1);
  };

  // 次年に移動
  const handleNextYear = () => {
    setYear(year + 1);
  };

  // 日付が選択されたときの処理
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  // 月ごとのイベントをフィルタリング
  const getMonthEvents = (month: number) => {
    return events.filter(event => event.date.getMonth() === month);
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{year}年</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handlePrevYear}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">前年</span>
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextYear}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">次年</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="border rounded-lg p-3">
            <Calendar
              month={new Date(year, index, 1)}
              events={getMonthEvents(index)}
              onDateSelect={handleDateSelect}
              selectedDate={selectedDate}
              className="w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
} 