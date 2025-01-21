import { useState } from "react";
import { format, startOfWeek, isSameDay } from "date-fns";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { TimeGrid } from "@/components/agenda/TimeGrid";
import { CategorySelector } from "@/components/agenda/CategorySelector";
import { WeekNavigation } from "@/components/agenda/WeekNavigation";
import { useAvailabilitySlots } from "@/hooks/useAvailabilitySlots";

const partnerCategories = [
  "Frontend Development",
  "Backend Development",
  "UI/UX Design",
  "Project Management",
  "Quality Assurance",
];

const Agenda = () => {
  const [weekStart, setWeekStart] = useState(() => {
    const today = new Date();
    return startOfWeek(today, { weekStartsOn: 1 });
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  const {
    selectedTimeSlots,
    setSelectedTimeSlots,
    isDragging,
    setIsDragging,
    dragStartSlot,
    setDragStartSlot,
    currentDaySlots,
    setCurrentDaySlots,
    dragStartDay,
    setDragStartDay,
  } = useAvailabilitySlots(weekStart);

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 18; hour++) {
      for (let minute of [0, 30]) {
        slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
      }
    }
    return slots;
  };

  const generateWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const handleTimeSlotMouseDown = (day: Date, time: string) => {
    setIsDragging(true);
    setDragStartDay(day);
    const slotKey = `${format(day, "yyyy-MM-dd")}-${time}`;
    setDragStartSlot(slotKey);
    updateCurrentDaySlots(day, slotKey);
  };

  const handleTimeSlotMouseEnter = (day: Date, time: string) => {
    if (isDragging && dragStartDay && isSameDay(day, dragStartDay)) {
      const slotKey = `${format(day, "yyyy-MM-dd")}-${time}`;
      updateCurrentDaySlots(day, slotKey);
    }
  };

  const updateCurrentDaySlots = (day: Date, currentSlot: string) => {
    if (!dragStartSlot) return;

    const daySlots = new Set<string>();
    const timeSlots = generateTimeSlots();
    const [startTime, endTime] = dragStartSlot < currentSlot 
      ? [dragStartSlot, currentSlot] 
      : [currentSlot, dragStartSlot];

    timeSlots.forEach(time => {
      const slotKey = `${format(day, "yyyy-MM-dd")}-${time}`;
      if (slotKey >= startTime && slotKey <= endTime) {
        daySlots.add(slotKey);
      }
    });

    setCurrentDaySlots(daySlots);
  };

  const handleTimeSlotMouseUp = async () => {
    if (!isDragging) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in to save availability slots");
        return;
      }

      if (selectedCategories.length === 0) {
        toast.error("Please select at least one partner category");
        return;
      }

      const newSlots = new Map(selectedTimeSlots);
      currentDaySlots.forEach(slotKey => {
        newSlots.set(slotKey, selectedCategories);
      });
      setSelectedTimeSlots(newSlots);

      const slotsToSave = Array.from(currentDaySlots).map(slotKey => {
        const [date, time] = slotKey.split("-");
        return {
          user_id: session.user.id,
          start_time: `${date}T${time}:00.000Z`,
          end_time: `${date}T${time}:59.999Z`,
          partner_categories: selectedCategories
        };
      });

      const { error: deleteError } = await supabase
        .from("availability_slots")
        .delete()
        .eq("user_id", session.user.id)
        .in("start_time", slotsToSave.map(slot => slot.start_time));

      if (deleteError) throw deleteError;

      const { error: insertError } = await supabase
        .from("availability_slots")
        .insert(slotsToSave);

      if (insertError) throw insertError;

      toast.success("Availability slots saved successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to save availability slots");
    } finally {
      setIsDragging(false);
      setDragStartSlot(null);
      setDragStartDay(null);
      setCurrentDaySlots(new Set());
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Agenda</h1>
        <WeekNavigation weekStart={weekStart} onWeekChange={setWeekStart} />
      </div>

      <CategorySelector
        categories={partnerCategories}
        selectedCategories={selectedCategories}
        onToggleCategory={toggleCategory}
      />

      <Card className="p-4">
        <div className="grid grid-cols-8 gap-1">
          <div className="col-span-1"></div>
          {generateWeekDays().map((date, index) => (
            <div key={index} className="text-center font-semibold">
              {format(date, "EEE dd/MM")}
            </div>
          ))}

          <TimeGrid
            weekDays={generateWeekDays()}
            timeSlots={generateTimeSlots()}
            selectedTimeSlots={selectedTimeSlots}
            isDragging={isDragging}
            dragStartSlot={dragStartSlot}
            currentDaySlots={currentDaySlots}
            onTimeSlotMouseDown={handleTimeSlotMouseDown}
            onTimeSlotMouseEnter={handleTimeSlotMouseEnter}
            onTimeSlotMouseUp={handleTimeSlotMouseUp}
          />
        </div>
      </Card>
    </div>
  );
};

export default Agenda;