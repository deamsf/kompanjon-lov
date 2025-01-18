import { useState } from "react";
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

  const createMutation = useMutation({
    mutationFn: async (newItem: Omit<PlanningItem, 'id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('planning_items')
        .insert([{ ...newItem, user_id: user.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planningItems'] });
      toast.success("Planning item created successfully");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Failed to create planning item");
      console.error(error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (item: PlanningItem) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('planning_items')
        .update({ ...item, user_id: user.id })
        .eq('id', item.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planningItems'] });
      toast.success("Planning item updated successfully");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Failed to update planning item");
      console.error(error);
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
      toast.success("Planning item deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete planning item");
      console.error(error);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    const itemData = {
      title: formData.get('title') as string,
      start_date: format(startDate, 'yyyy-MM-dd'),
      end_date: format(endDate, 'yyyy-MM-dd'),
      order_index: editingItem ? editingItem.order_index : planningItems.length,
      user_id: user.id
    };

    if (editingItem) {
      updateMutation.mutate({ ...itemData, id: editingItem.id });
    } else {
      createMutation.mutate(itemData);
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const handleQuickDateSelect = (type: 'today' | 'sameAsStart') => {
    const today = new Date();
    if (type === 'today') {
      setStartDate(today);
      setEndDate(today);
    } else if (type === 'sameAsStart' && startDate) {
      setEndDate(startDate);
    }
  };

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
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? "Edit Planning Item" : "Add Planning Item"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={editingItem?.title}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          {startDate ? format(startDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          {endDate ? format(endDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleQuickDateSelect('today')}
                  >
                    Today
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleQuickDateSelect('sameAsStart')}
                    disabled={!startDate}
                  >
                    Same as Start Date
                  </Button>
                </div>
                <Button type="submit" className="w-full">
                  {editingItem ? "Update Item" : "Create Item"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {viewMode === "list" ? (
        <div className="grid gap-4">
          {isLoading ? (
            <Card>
              <CardContent className="p-6">Loading...</CardContent>
            </Card>
          ) : planningItems.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No planning items yet. Create one to get started.
              </CardContent>
            </Card>
          ) : (
            planningItems.map((item: PlanningItem) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(item.start_date), "PPP")} -{" "}
                        {format(new Date(item.end_date), "PPP")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingItem(item);
                          setStartDate(new Date(item.start_date));
                          setEndDate(new Date(item.end_date));
                          setIsDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      ) : (
        <div className="h-[500px] bg-muted rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">Gantt view coming soon...</p>
        </div>
      )}
    </div>
  );
};

export default Planning;