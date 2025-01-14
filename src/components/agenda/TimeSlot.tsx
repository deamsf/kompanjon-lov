import React from "react";
import { cn } from "@/lib/utils";

interface TimeSlotProps {
  time: string;
  day: Date;
  isSelected: boolean;
  isBeingDragged: boolean;
  onMouseDown: () => void;
  onMouseEnter: () => void;
  onMouseUp: () => void;
}

export const TimeSlot = ({
  time,
  day,
  isSelected,
  isBeingDragged,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}: TimeSlotProps) => {
  return (
    <div
      className={cn(
        "col-span-1 border rounded-md cursor-pointer transition-colors h-8",
        isSelected && "bg-primary text-primary-foreground",
        isBeingDragged && "bg-primary/50",
        !isSelected && !isBeingDragged && "hover:bg-accent"
      )}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseUp={onMouseUp}
    >
      &nbsp;
    </div>
  );
};