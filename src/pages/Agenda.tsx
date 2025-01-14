import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, startOfWeek, addDays, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TimeGrid } from "@/components/agenda/TimeGrid";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute of [0, 30]) {
      slots.push(
        `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
      );
    }
  }
  return slots;
};

const Agenda = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartSlot, setDragStartSlot] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("17:00");
  const { toast } = useToast();

  const timeSlots = generateTimeSlots();
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  useEffect(() => {
    fetchAvailabilitySlots();
  }, [selectedDate]);

  const fetchAvailabilitySlots = async () => {
    const { data, error } = await supabase
      .from("availability_slots")
      .select("*")
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

    if (data) {
      const slots = data.flatMap((slot) => {
        const start = parseISO(slot.start_time);
        const end = parseISO(slot.end_time);
        const slotKeys = [];
        let current = start;

        while (current < end) {
          slotKeys.push(
            `${format(current, "yyyy-MM-dd")}-${format(current, "HH:mm")}`
          );
          current = new Date(current.getTime() + 30 * 60 * 1000); // Add 30 minutes
        }

        return slotKeys;
      });

      setSelectedTimeSlots(slots);
    }
  };

  const saveAvailabilitySlots = async () => {
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user.id;
    
    if (!userId) {
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
      const current = new Date(`${date}T${time}`);

      if (acc.length === 0) {
        return [{
          start: current,
          end: new Date(current.getTime() + 30 * 60 * 1000)
        }];
      }

      const lastRange = acc[acc.length - 1];
      if (current.getTime() === lastRange.end.getTime()) {
        lastRange.end = new Date(current.getTime() + 30 * 60 * 1000);
        return acc;
      }

      return [...acc, {
        start: current,
        end: new Date(current.getTime() + 30 * 60 * 1000)
      }];
    }, []);

    // Save ranges to database
    const { error } = await supabase.from("availability_slots").insert(
      ranges.map((range) => ({
        start_time: range.start.toISOString(),
        end_time: range.end.toISOString(),
        user_id: userId
      }))
    );

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
  };

  const handleTimeSlotMouseDown = (day: Date, time: string) => {
    const slotKey = `${format(day, "yyyy-MM-dd")}-${time}`;
    setIsDragging(true);
    setDragStartSlot(slotKey);
    setSelectedTimeSlots((prev) =>
      prev.includes(slotKey) ? prev.filter((s) => s !== slotKey) : [...prev, slotKey]
    );
  };

  const handleTimeSlotMouseEnter = (day: Date, time: string) => {
    if (!isDragging || !dragStartSlot) return;

    const slotKey = `${format(day, "yyyy-MM-dd")}-${time}`;
    const [startDate] = dragStartSlot.split("-");
    const [currentDate] = slotKey.split("-");

    if (startDate === currentDate) {
      const slots = timeSlots
        .slice(
          timeSlots.indexOf(dragStartSlot.split("-")[1]),
          timeSlots.indexOf(time) + 1
        )
        .map((t) => `${startDate}-${t}`);

      setSelectedTimeSlots((prev) => {
        const withoutCurrentDay = prev.filter(
          (s) => !s.startsWith(startDate)
        );
        return [...withoutCurrentDay, ...slots];
      });
    }
  };

  const handleTimeSlotMouseUp = () => {
    setIsDragging(false);
    setDragStartSlot(null);
  };

  const handlePreviousWeek = () => {
    setSelectedDate(addDays(weekStart, -7));
  };

  const handleNextWeek = () => {
    setSelectedDate(addDays(weekStart, 7));
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-semibold">
                Week of {format(weekStart, "MMMM d, yyyy")}
              </h2>
              <Button variant="outline" size="icon" onClick={handleNextWeek}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Start time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span>to</span>
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="End time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={saveAvailabilitySlots}>Save Slots</Button>
            </div>
          </div>

          <div className="grid grid-cols-8 gap-4">
            <div className="col-span-1"></div>
            {weekDays.map((day) => (
              <div key={day.toString()} className="col-span-1 text-center">
                <div className="font-semibold mb-2">{format(day, "EEE")}</div>
                <div className="text-sm text-muted-foreground">
                  {format(day, "MMM d")}
                </div>
              </div>
            ))}

            <TimeGrid
              weekDays={weekDays}
              timeSlots={timeSlots.filter(
                (time) => time >= startTime && time <= endTime
              )}
              selectedTimeSlots={selectedTimeSlots}
              isDragging={isDragging}
              dragStartSlot={dragStartSlot}
              onTimeSlotMouseDown={handleTimeSlotMouseDown}
              onTimeSlotMouseEnter={handleTimeSlotMouseEnter}
              onTimeSlotMouseUp={handleTimeSlotMouseUp}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Agenda;