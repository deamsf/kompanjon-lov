import React from "react";
import { format } from "date-fns";
import { TimeSlot } from "./TimeSlot";

interface TimeGridProps {
  weekDays: Date[];
  timeSlots: string[];
  selectedTimeSlots: Map<string, string[]>;
  isDragging: boolean;
  dragStartSlot: string | null;
  currentDaySlots: Set<string>;
  onTimeSlotMouseDown: (day: Date, time: string) => void;
  onTimeSlotMouseEnter: (day: Date, time: string) => void;
  onTimeSlotMouseUp: (day: Date, time: string) => void;
}

export const TimeGrid = ({
  weekDays,
  timeSlots,
  selectedTimeSlots,
  isDragging,
  dragStartSlot,
  currentDaySlots,
  onTimeSlotMouseDown,
  onTimeSlotMouseEnter,
  onTimeSlotMouseUp,
}: TimeGridProps) => {
  return (
    <>
      {timeSlots.map((time) => (
        <React.Fragment key={time}>
          <div className="col-span-1 py-2 text-right pr-4 text-sm text-muted-foreground">
            {time}
          </div>
          {weekDays.map((day) => {
            const slotKey = `${format(day, "yyyy-MM-dd")}-${time}`;
            const isBeingDragged = isDragging && currentDaySlots.has(slotKey);

            return (
              <TimeSlot
                key={`${day}-${time}`}
                time={time}
                day={day}
                isSelected={selectedTimeSlots.has(slotKey)}
                isBeingDragged={isBeingDragged}
                categories={selectedTimeSlots.get(slotKey) || []}
                onMouseDown={() => onTimeSlotMouseDown(day, time)}
                onMouseEnter={() => onTimeSlotMouseEnter(day, time)}
                onMouseUp={() => onTimeSlotMouseUp(day, time)}
              />
            );
          })}
        </React.Fragment>
      ))}
    </>
  );
};