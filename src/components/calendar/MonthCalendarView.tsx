
import { format, isSameDay } from "date-fns";
import { useCalendarStore } from "@/store/useCalendarStore";
import { CalendarEvent } from "@/lib/calendar-data";

interface MonthCalendarViewProps {
  calendarDays: Array<{
    date: Date;
    events: CalendarEvent[];
    isToday?: boolean;
    isPreviousMonth?: boolean;
    isNextMonth?: boolean;
  }>;
  setSelectedDate: (date: Date) => void;
}

export function MonthCalendarView({ calendarDays, setSelectedDate }: MonthCalendarViewProps) {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`min-h-[80px] p-1 border rounded-md cursor-pointer ${
              day.isPreviousMonth || day.isNextMonth
                ? 'bg-muted/30 text-muted-foreground'
                : day.isToday
                  ? 'bg-primary/10 border-primary'
                  : 'bg-card hover:bg-muted/50'
            }`}
            onClick={() => setSelectedDate(day.date)}
          >
            <div className="text-xs p-1">{format(day.date, 'd')}</div>
            {day.events.length > 0 && !day.isPreviousMonth && !day.isNextMonth && (
              <div className="mt-1">
                {day.events.slice(0, 2).map((event: any, i: number) => (
                  <div 
                    key={i}
                    className={`${
                      event.status === 'confirmed' 
                        ? 'bg-primary/20 text-primary' 
                        : event.status === 'cancelled'
                          ? 'bg-destructive/20 text-destructive' 
                          : 'bg-orange-500/20 text-orange-700 dark:text-orange-300'
                    } rounded-sm p-1 text-xs mb-1 truncate`}
                  >
                    {event.time.split(' - ')[0]} {event.title.split(' with')[0]}
                  </div>
                ))}
                {day.events.length > 2 && (
                  <div className="text-xs text-muted-foreground text-center">
                    +{day.events.length - 2} more
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
