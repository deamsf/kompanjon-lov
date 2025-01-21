import { Button } from "@/components/ui/button";
import { addDays, format } from "date-fns";

interface WeekNavigationProps {
  weekStart: Date;
  onWeekChange: (date: Date) => void;
}

export const WeekNavigation = ({ weekStart, onWeekChange }: WeekNavigationProps) => {
  const weekEnd = addDays(weekStart, 6);
  
  return (
    <div className="flex items-center gap-4">
      <Button
        onClick={() => onWeekChange(addDays(weekStart, -7))}
        variant="outline"
        size="sm"
      >
        Previous Week
      </Button>
      <span className="text-sm text-muted-foreground">
        {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
      </span>
      <Button
        onClick={() => onWeekChange(addDays(weekStart, 7))}
        variant="outline"
        size="sm"
      >
        Next Week
      </Button>
    </div>
  );
};