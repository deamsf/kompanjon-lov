import { Button } from "@/components/ui/button";
import { addDays } from "date-fns";

interface WeekNavigationProps {
  weekStart: Date;
  onWeekChange: (date: Date) => void;
}

export const WeekNavigation = ({ weekStart, onWeekChange }: WeekNavigationProps) => {
  return (
    <div className="flex gap-4">
      <Button
        onClick={() => onWeekChange(addDays(weekStart, -7))}
        variant="outline"
      >
        Previous Week
      </Button>
      <Button
        onClick={() => onWeekChange(addDays(weekStart, 7))}
        variant="outline"
      >
        Next Week
      </Button>
    </div>
  );
};