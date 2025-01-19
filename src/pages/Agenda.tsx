import { useState, useEffect } from "react";
import { format, addDays, startOfWeek, isSameDay, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { TimeGrid } from "@/components/agenda/TimeGrid";
import { Badge } from "@/components/ui/badge";

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
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<Map<string, string[]>>(new Map());
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartSlot, setDragStartSlot] = useState<string | null>(null);
  const [currentDaySlots, setCurrentDaySlots] = useState<Set<string>>(new Set());
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dragStartDay, setDragStartDay] = useState<Date | null>(null);

  useEffect(() => {
    fetchSavedSlots();
  }, [weekStart]);

  const fetchSavedSlots = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in to view availability slots");
        return;
      }

      const weekEndDate = addDays(weekStart, 7);
      
      const { data, error } = await supabase
        .from("availability_slots")
        .select("*")
        .eq("user_id", session.user.id)
        .gte("start_time", format(weekStart, "yyyy-MM-dd'T'HH:mm:ss'Z'"))
        .lt("end_time", format(weekEndDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"));

      if (error) throw error;

      const slotsMap = new Map<string, string[]>();
      data?.forEach(slot => {
        const slotKey = `${format(parseISO(slot.start_time), "yyyy-MM-dd")}-${format(parseISO(slot.start_time), "HH:mm")}`;
        slotsMap.set(slotKey, slot.partner_categories);
      });
      setSelectedTimeSlots(slotsMap);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch availability slots");
    }
  };

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
      days.push(addDays(weekStart, i));
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

      // Delete existing slots for the affected time range
      const slotsToSave = Array.from(currentDaySlots).map(slotKey => {
        const [date, time] = slotKey.split("-");
        return {
          user_id: session.user.id,
          start_time: `${date}T${time}:00Z`,
          end_time: `${date}T${time}:00Z`,
          partner_categories: selectedCategories
        };
      });

      // Delete existing slots for the affected time range
      const { error: deleteError } = await supabase
        .from("availability_slots")
        .delete()
        .eq("user_id", session.user.id)
        .in("start_time", slotsToSave.map(slot => slot.start_time));

      if (deleteError) throw deleteError;

      // Insert new slots
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
        <div className="flex gap-4">
          <Button
            onClick={() => setWeekStart(addDays(weekStart, -7))}
            variant="outline"
          >
            Previous Week
          </Button>
          <Button
            onClick={() => setWeekStart(addDays(weekStart, 7))}
            variant="outline"
          >
            Next Week
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Partner Categories</h2>
        <div className="flex flex-wrap gap-2">
          {partnerCategories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategories.includes(category) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

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