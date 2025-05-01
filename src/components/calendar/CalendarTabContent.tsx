
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay } from "date-fns";
import { useCalendarStore } from "@/store/useCalendarStore";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { MonthCalendarView } from "@/components/calendar/MonthCalendarView";

interface CalendarTabContentProps {
  events: any[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export function CalendarTabContent({ events, selectedDate, setSelectedDate }: CalendarTabContentProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<any[]>([]);
  
  useEffect(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });
    
    // Getting the days in the month
    const dayObjects = days.map(day => {
      const dayEvents = events.filter(event => isSameDay(new Date(event.date), day));
      return {
        date: day,
        events: dayEvents,
        isToday: isSameDay(day, new Date()),
      };
    });
    
    // Calculate first day offset
    const firstDayOfMonth = getDay(start);
    const prevMonthDays = [];
    
    for (let i = firstDayOfMonth; i > 0; i--) {
      const prevDay = new Date(start);
      prevDay.setDate(prevDay.getDate() - i);
      prevMonthDays.push({
        date: prevDay,
        events: [],
        isPreviousMonth: true,
      });
    }
    
    // Calculate next month days to fill the grid
    const lastDayOfMonth = getDay(end);
    const nextMonthDays = [];
    
    for (let i = 1; i < 7 - lastDayOfMonth; i++) {
      const nextDay = new Date(end);
      nextDay.setDate(nextDay.getDate() + i);
      nextMonthDays.push({
        date: nextDay,
        events: [],
        isNextMonth: true,
      });
    }
    
    setCalendarDays([...prevMonthDays, ...dayObjects, ...nextMonthDays]);
  }, [currentMonth, events]);

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <CalendarHeader 
          currentMonth={currentMonth} 
          setCurrentMonth={setCurrentMonth} 
          goToToday={goToToday} 
        />
        <MonthCalendarView 
          calendarDays={calendarDays} 
          setSelectedDate={setSelectedDate} 
        />
      </CardContent>
    </Card>
  );
}
