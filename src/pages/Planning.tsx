import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, BarChart2, List } from "lucide-react";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import Gantt from "frappe-gantt";

interface PlanningItem {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  order_index: number;
  user_id: string;
}

const Planning = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PlanningItem | null>(null);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [viewMode, setViewMode] = useState<"list" | "gantt">("list");
  const ganttRef = useRef<HTMLDivElement>(null);
  const ganttInstance = useRef<any>(null);
  
  const queryClient = useQueryClient();

  const { data: planningItems = [], isLoading } = useQuery({
    queryKey: ['planningItems'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('planning_items')
        .select('*')
        .order('order_index');
      
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (viewMode === "gantt" && ganttRef.current && planningItems.length > 0) {
      const tasks = planningItems.map(item => ({
        id: item.id,
        name: item.title,
        start: item.start_date,
        end: item.end_date,
        progress: 100,
      }));

      // Clear previous instance if it exists
      if (ganttInstance.current) {
        try {
          // Remove the DOM element completely
          while (ganttRef.current.firstChild) {
            ganttRef.current.removeChild(ganttRef.current.firstChild);
          }
        } catch (error) {
          console.error("Error cleaning up Gantt chart:", error);
        }
      }

      try {
        // Create new instance
        ganttInstance.current = new Gantt(ganttRef.current, tasks, {
          view_modes: ['Day', 'Week', 'Month'],
          view_mode: 'Week',
          date_format: 'YYYY-MM-DD',
          bar_height: 40,
          padding: 18,
        });
      } catch (error) {
        console.error("Error initializing Gantt chart:", error);
        toast.error("Failed to initialize Gantt chart");
      }
    }

    return () => {
      if (ganttRef.current) {
        // Clean up by removing all children
        while (ganttRef.current.firstChild) {
          ganttRef.current.removeChild(ganttRef.current.firstChild);
        }
        ganttInstance.current = null;
      }
    };
  }, [viewMode, planningItems]);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Planning</h1>
        <div className="flex items-center gap-4">
          <ToggleGroup type="single" value={viewMode} onValueChange={(value: "list" | "gantt") => setViewMode(value)}>
            <ToggleGroupItem value="list" aria-label="List view">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="gantt" aria-label="Gantt view">
              <BarChart2 className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingItem(null);
                setStartDate(undefined);
                setEndDate(undefined);
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            {/* ... Dialog content remains unchanged ... */}
          </Dialog>
        </div>
      </div>

      {viewMode === "list" ? (
        <div className="grid gap-4">
          {/* ... List view content remains unchanged ... */}
        </div>
      ) : (
        <div className="bg-background rounded-lg p-4">
          <div ref={ganttRef}></div>
        </div>
      )}
    </div>
  );
};

export default Planning;