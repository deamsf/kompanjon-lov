import { useState, useEffect } from "react";
import { format, addDays, isSameDay, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TimeGrid } from "@/components/agenda/TimeGrid";

const Agenda = () => {
  const [weekStart, setWeekStart] = useState(new Date());
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartSlot, setDragStartSlot] = useState<string | null>(null);
  const [savedSlots, setSavedSlots] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchSavedSlots();
  }, [weekStart]);

  const fetchSavedSlots = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to view availability slots",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from("availability_slots")
        .select("*")
        .eq("user_id", session.user.id)
        .gte("start_time", format(weekStart, "yyyy-MM-dd"))
        .lt("end_time", format(addDays(weekStart, 7), "yyyy-MM-dd"));

      if (error) throw error;
      setSavedSlots(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch availability slots",
        variant: "destructive",
      });
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
    const slotKey = `${format(day, "yyyy-MM-dd")}-${time}`;
    setIsDragging(true);
    setDragStartSlot(slotKey);
    setSelectedTimeSlots([slotKey]);
  };

  const handleTimeSlotMouseEnter = (day: Date, time: string) => {
    if (isDragging && dragStartSlot) {
      const slotKey = `${format(day, "yyyy-MM-dd")}-${time}`;
      setSelectedTimeSlots(prev => {
        if (!prev.includes(slotKey)) {
          return [...prev, slotKey];
        }
        return prev;
      });
    }
  };

  const handleTimeSlotMouseUp = () => {
    setIsDragging(false);
    setDragStartSlot(null);
  };

  const saveAvailabilitySlots = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to save availability slots",
          variant: "destructive",
        });
        return;
      }

      // Delete existing slots for the current week
      const { error: deleteError } = await supabase
        .from("availability_slots")
        .delete()
        .eq("user_id", session.user.id)
        .gte("start_time", format(weekStart, "yyyy-MM-dd"))
        .lt("end_time", format(addDays(weekStart, 7), "yyyy-MM-dd"));

      if (deleteError) throw deleteError;

      if (selectedTimeSlots.length === 0) {
        await fetchSavedSlots();
        return;
      }

      // Group consecutive slots into ranges
      const ranges = selectedTimeSlots.sort().reduce((acc: any[], slot) => {
        const [date, time] = slot.split("-");
        const current = parseISO(`${date}T${time}`);

        if (acc.length === 0) {
          return [{
            start_time: current.toISOString(),
            end_time: new Date(current.getTime() + 30 * 60 * 1000).toISOString(),
            user_id: session.user.id
          }];
        }

        const lastRange = acc[acc.length - 1];
        const lastEnd = new Date(lastRange.end_time);

        if (current.getTime() - lastEnd.getTime() === 0) {
          lastRange.end_time = new Date(current.getTime() + 30 * 60 * 1000).toISOString();
          return acc;
        }

        return [...acc, {
          start_time: current.toISOString(),
          end_time: new Date(current.getTime() + 30 * 60 * 1000).toISOString(),
          user_id: session.user.id
        }];
      }, []);

      const { error } = await supabase
        .from("availability_slots")
        .insert(ranges);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Availability slots saved successfully",
      });

      await fetchSavedSlots();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save availability slots",
        variant: "destructive",
      });
    }
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
          <Button onClick={saveAvailabilitySlots}>Save Availability</Button>
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