import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface TimeSlotProps {
  time: string;
  day: Date;
  isSelected: boolean;
  isBeingDragged: boolean;
  categories: string[];
  onMouseDown: () => void;
  onMouseEnter: () => void;
  onMouseUp: () => void;
}

export const TimeSlot = ({
  time,
  day,
  isSelected,
  isBeingDragged,
  categories,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}: TimeSlotProps) => {
  return (
    <div
      className={cn(
        "col-span-1 border rounded-md cursor-pointer transition-colors min-h-[4rem] p-1",
        isSelected && "bg-primary/20 border-primary",
        isBeingDragged && "bg-primary/10",
        !isSelected && !isBeingDragged && "hover:bg-accent"
      )}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseUp={onMouseUp}
    >
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {categories.map((category) => (
            <Badge key={category} variant="outline" className="text-xs">
              {category}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};