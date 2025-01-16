import { useState, useEffect } from "react";
import { format, addDays, isSameDay, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Agenda = () => {
  const [weekStart, setWeekStart] = useState(new Date());
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [savedSlots, setSavedSlots] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchSavedSlots();
  }, [weekStart]);

  const fetchSavedSlots = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from("availability_slots")
      .select("*")
      .eq("user_id", session.user.id)
      .gte("start_time", format(weekStart, "yyyy-MM-dd"))
      .lt("end_time", format(addDays(weekStart, 7), "yyyy-MM-dd"));

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch availability slots",
        variant: "destructive",
      });
      return;
    }

    setSavedSlots(data || []);
  };

  const handleTimeSlotClick = (dateTime: string) => {
    setSelectedTimeSlots(prev => {
      if (prev.includes(dateTime)) {
        return prev.filter(slot => slot !== dateTime);
      }
      return [...prev, dateTime];
    });
  };

  const handleMouseDown = (dateTime: string) => {
    setIsDragging(true);
    setSelectedTimeSlots([dateTime]);
  };

  const handleMouseEnter = (dateTime: string) => {
    if (isDragging) {
      setSelectedTimeSlots(prev => {
        if (!prev.includes(dateTime)) {
          return [...prev, dateTime];
        }
        return prev;
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const saveAvailabilitySlots = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Error",
        description: "You must be logged in to save availability slots",
        variant: "destructive",
      });
      return;
    }

    // First, delete existing slots for the current week
    const { error: deleteError } = await supabase
      .from("availability_slots")
      .delete()
      .eq("user_id", session.user.id)
      .gte("start_time", format(weekStart, "yyyy-MM-dd"))
      .lt("end_time", format(addDays(weekStart, 7), "yyyy-MM-dd"));

    if (deleteError) {
      toast({
        title: "Error",
        description: "Failed to update availability slots",
        variant: "destructive",
      });
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
      const lastEnd = parseISO(lastRange.end_time);

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

    // Save ranges to database
    const { error } = await supabase
      .from("availability_slots")
      .insert(ranges);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save availability slots",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Availability slots saved successfully",
    });

    fetchSavedSlots();
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

  const isSlotSelected = (date: Date, time: string) => {
    const dateString = format(date, "yyyy-MM-dd");
    return selectedTimeSlots.includes(`${dateString}-${time}`);
  };

  const isSlotSaved = (date: Date, time: string) => {
    return savedSlots.some(slot => {
      const slotStart = new Date(slot.start_time);
      return (
        isSameDay(date, slotStart) &&
        format(slotStart, "HH:mm") === time
      );
    });
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

          {generateTimeSlots().map((time) => (
            <>
              <div key={`time-${time}`} className="text-right pr-2">
                {time}
              </div>
              {generateWeekDays().map((date, dateIndex) => {
                const dateTime = `${format(date, "yyyy-MM-dd")}-${time}`;
                return (
                  <div
                    key={`slot-${dateIndex}-${time}`}
                    className={`border p-2 cursor-pointer transition-colors ${
                      isSlotSelected(date, time)
                        ? "bg-primary text-primary-foreground"
                        : isSlotSaved(date, time)
                        ? "bg-secondary"
                        : "hover:bg-muted"
                    }`}
                    onMouseDown={() => handleMouseDown(dateTime)}
                    onMouseEnter={() => handleMouseEnter(dateTime)}
                    onMouseUp={handleMouseUp}
                    onClick={() => handleTimeSlotClick(dateTime)}
                  ></div>
                );
              })}
            </>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Agenda;