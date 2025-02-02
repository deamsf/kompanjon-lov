import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, BarChart2, List, Eye, Edit2 } from "lucide-react";
import { format } from "date-fns";
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
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  partner_id?: string | null;
}

interface Partner {
  id: string;
  name: string;
  email: string;
}

const Planning = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>();
  const [viewMode, setViewMode] = useState<"list" | "gantt">("list");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingItem, setEditingItem] = useState<PlanningItem | null>(null);
  const ganttRef = useRef<HTMLDivElement>(null);
  const ganttInstance = useRef<any>(null);
  
  const queryClient = useQueryClient();

  // Get current user
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    },
  });

  const { data: partners = [] } = useQuery({
    queryKey: ['partners'],
    queryFn: async () => {
      if (!session?.user?.id) throw new Error('No user logged in');
      
      const { data, error } = await supabase
        .from('partners')
        .select('*');
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const { data: planningItems = [], isLoading } = useQuery({
    queryKey: ['planningItems'],
    queryFn: async () => {
      if (!session?.user?.id) throw new Error('No user logged in');
      
      const { data, error } = await supabase
        .from('planning_items')
        .select('*, partners(name)')
        .eq('user_id', session.user.id)
        .order('order_index');
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const createMutation = useMutation({
    mutationFn: async (newItem: Omit<PlanningItem, 'id'>) => {
      if (!session?.user?.id) throw new Error('No user logged in');
      
      const { data, error } = await supabase
        .from('planning_items')
        .insert([{
          ...newItem,
          user_id: session.user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planningItems'] });
      setIsDialogOpen(false);
      resetForm();
      toast.success("Task added successfully");
    },
    onError: (error) => {
      console.error('Error creating task:', error);
      toast.error("Failed to add task");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (item: Partial<PlanningItem> & { id: string }) => {
      const { data, error } = await supabase
        .from('planning_items')
        .update(item)
        .eq('id', item.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planningItems'] });
      setIsDialogOpen(false);
      resetForm();
      toast.success("Task updated successfully");
    },
    onError: (error) => {
      console.error('Error updating task:', error);
      toast.error("Failed to update task");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('planning_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planningItems'] });
      toast.success("Task deleted successfully");
    },
    onError: (error) => {
      console.error('Error deleting task:', error);
      toast.error("Failed to delete task");
    },
  });

  const resetForm = () => {
    setTitle("");
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedPartnerId(undefined);
    setEditingItem(null);
  };

  const handleSubmit = () => {
    if (!title || !startDate || !endDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!session?.user?.id) {
      toast.error("Please log in to add tasks");
      return;
    }

    const itemData = {
      title,
      start_date: format(startDate, 'yyyy-MM-dd'),
      end_date: format(endDate, 'yyyy-MM-dd'),
      order_index: editingItem ? editingItem.order_index : (planningItems?.length || 0) + 1,
      user_id: session.user.id,
      partner_id: selectedPartnerId,
    };

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, ...itemData });
    } else {
      createMutation.mutate(itemData);
    }
  };

  const handleEdit = (item: PlanningItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setStartDate(new Date(item.start_date));
    setEndDate(new Date(item.end_date));
    setSelectedPartnerId(item.partner_id || undefined);
    setIsDialogOpen(true);
  };

  useEffect(() => {
    if (viewMode === "gantt" && ganttRef.current && planningItems.length > 0) {
      const tasks = planningItems.map(item => ({
        id: item.id,
        name: item.title,
        start: item.start_date,
        end: item.end_date,
        progress: 100,
      }));

      if (ganttRef.current) {
        while (ganttRef.current.firstChild) {
          ganttRef.current.removeChild(ganttRef.current.firstChild);
        }
      }

      try {
        ganttInstance.current = new Gantt(ganttRef.current, tasks, {
          view_modes: ['Day', 'Week', 'Month'],
          view_mode: 'Week',
          date_format: 'YYYY-MM-DD',
          bar_height: 40,
          padding: 18,
          readonly: !isEditMode,
        });

        // Add event listener for task updates
        if (isEditMode) {
          ganttInstance.current.on('date_change', (task: any) => {
            const updatedTask = {
              id: task.id,
              start_date: task.start,
              end_date: task.end,
            };
            updateMutation.mutate(updatedTask);
          });
        }

        const updateWidth = () => {
          if (ganttRef.current && ganttInstance.current) {
            ganttInstance.current.change_view_mode();
          }
        };

        window.addEventListener('resize', updateWidth);
        updateWidth();

        return () => {
          window.removeEventListener('resize', updateWidth);
          if (ganttRef.current) {
            while (ganttRef.current.firstChild) {
              ganttRef.current.removeChild(ganttRef.current.firstChild);
            }
          }
        };
      } catch (error) {
        console.error("Error initializing Gantt chart:", error);
        toast.error("Failed to initialize Gantt chart");
      }
    }
  }, [viewMode, planningItems, isEditMode, updateMutation]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-96">Loading...</div>;
  }

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

          {viewMode === "gantt" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditMode(!isEditMode)}
            >
              {isEditMode ? <Eye className="h-4 w-4 mr-2" /> : <Edit2 className="h-4 w-4 mr-2" />}
              {isEditMode ? "View Mode" : "Edit Mode"}
            </Button>
          )}

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingItem ? "Edit Task" : "Add New Task"}</DialogTitle>
                <DialogDescription>
                  {editingItem ? "Update the task details below." : "Create a new task by filling out the form below."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter task title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        {startDate ? format(startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        {endDate ? format(endDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <Label>Assign Partner</Label>
                  <Select value={selectedPartnerId} onValueChange={setSelectedPartnerId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a partner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {partners.map((partner) => (
                        <SelectItem key={partner.id} value={partner.id}>
                          {partner.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSubmit}>
                  {editingItem ? "Update Task" : "Add Task"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {viewMode === "list" ? (
        <div className="grid gap-4">
          {planningItems.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(item.start_date), "PPP")} - {format(new Date(item.end_date), "PPP")}
                  </p>
                  {item.partner_id && (
                    <p className="text-sm text-muted-foreground">
                      Assigned to: {partners.find(p => p.id === item.partner_id)?.name}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Task</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this task? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate(item.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-background rounded-lg p-4">
          <div ref={ganttRef} className="w-full overflow-x-auto"></div>
        </div>
      )}
    </div>
  );
};

export default Planning;