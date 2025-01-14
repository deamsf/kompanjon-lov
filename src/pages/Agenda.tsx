import React from "react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

const timeSlots = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return `${hour}:00`;
});

const Agenda = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("17:00");

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const handlePreviousWeek = () => {
    setSelectedDate(addDays(weekStart, -7));
  };

  const handleNextWeek = () => {
    setSelectedDate(addDays(weekStart, 7));
  };

  const handleTimeSlotClick = (day: Date, time: string) => {
    const slotKey = `${format(day, 'yyyy-MM-dd')}-${time}`;
    setSelectedTimeSlots((prev) =>
      prev.includes(slotKey) ? prev.filter((slot) => slot !== slotKey) : [...prev, slotKey]
    );
  };

  const isTimeSlotSelected = (day: Date, time: string) => {
    const slotKey = `${format(day, 'yyyy-MM-dd')}-${time}`;
    return selectedTimeSlots.includes(slotKey);
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
                Week of {format(weekStart, 'MMMM d, yyyy')}
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
            </div>
          </div>

          <div className="grid grid-cols-8 gap-4">
            <div className="col-span-1"></div>
            {weekDays.map((day) => (
              <div key={day.toString()} className="col-span-1 text-center">
                <div className="font-semibold mb-2">
                  {format(day, 'EEE')}
                </div>
                <div className="text-sm text-muted-foreground">
                  {format(day, 'MMM d')}
                </div>
              </div>
            ))}

            {timeSlots
              .filter(
                (time) =>
                  time >= startTime &&
                  time <= endTime
              )
              .map((time) => (
                <React.Fragment key={time}>
                  <div className="col-span-1 py-2 text-right pr-4 text-sm text-muted-foreground">
                    {time}
                  </div>
                  {weekDays.map((day) => (
                    <div
                      key={`${day}-${time}`}
                      className={`col-span-1 border rounded-md cursor-pointer transition-colors ${
                        isTimeSlotSelected(day, time)
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent"
                      }`}
                      onClick={() => handleTimeSlotClick(day, time)}
                    >
                      &nbsp;
                    </div>
                  ))}
                </React.Fragment>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Agenda;