import React from "react";
import { format } from "date-fns";
import { TimeSlot } from "./TimeSlot";

interface TimeGridProps {
  weekDays: Date[];
  timeSlots: string[];
  selectedTimeSlots: string[];
  isDragging: boolean;
  dragStartSlot: string | null;
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
            const isBeingDragged =
              isDragging &&
              dragStartSlot &&
              ((dragStartSlot <= slotKey && selectedTimeSlots.includes(slotKey)) ||
                (dragStartSlot >= slotKey && selectedTimeSlots.includes(slotKey)));

            return (
              <TimeSlot
                key={`${day}-${time}`}
                time={time}
                day={day}
                isSelected={selectedTimeSlots.includes(slotKey)}
                isBeingDragged={isBeingDragged}
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