
import { useCalendarStore } from "@/store/useCalendarStore";
import { CalendarTypeCard } from "@/components/calendar/CalendarTypeCard";
import { CreateCalendarCard } from "@/components/calendar/CreateCalendarCard";
import { CalendarEmbedSection } from "@/components/calendar/CalendarEmbedSection";

export function CalendarsTabContent() {
  const { calendarTypes } = useCalendarStore();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {calendarTypes.map((type) => (
          <CalendarTypeCard key={type.id} type={type} />
        ))}
        
        <CreateCalendarCard />
      </div>
      
      <CalendarEmbedSection />
    </>
  );
}
