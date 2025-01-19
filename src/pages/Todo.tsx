import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TodoItem {
  id: string;
  title: string;
  description: string;
  author: string;
  assignee: string;
  deadline: string;
  status: "not-yet" | "todo" | "in-progress" | "waiting" | "done";
  user_id: string;
}

const Todo = () => {
  const [draggedItem, setDraggedItem] = useState<TodoItem | null>(null);
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const queryClient = useQueryClient();

  const { data: sessionData } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const userId = sessionData?.user?.id;

  const { data: todos = [], isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      if (!userId) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as TodoItem[];
    },
    enabled: !!userId,
  });

  const addTodoMutation = useMutation({
    mutationFn: async (newTodo: Omit<TodoItem, 'id' | 'created_at'>) => {
      if (!userId) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('todos')
        .insert([{ ...newTodo, user_id: userId }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success('Task created successfully');
      setIsDialogOpen(false);
      setEditingTodo(null);
      setSelectedDate(undefined);
    },
    onError: (error) => {
      toast.error('Failed to create task');
      console.error('Error:', error);
    },
  });

  const updateTodoMutation = useMutation({
    mutationFn: async (todo: TodoItem) => {
      if (!userId) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('todos')
        .update(todo)
        .eq('id', todo.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success('Task updated successfully');
      setIsDialogOpen(false);
      setEditingTodo(null);
      setSelectedDate(undefined);
    },
    onError: (error) => {
      toast.error('Failed to update task');
      console.error('Error:', error);
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success('Task deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete task');
      console.error('Error:', error);
    },
  });

  const updateTodoStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: TodoItem['status'] }) => {
      if (!userId) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('todos')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success('Task status updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update task status');
      console.error('Error:', error);
    },
  });

  const handleDragStart = (todo: TodoItem) => {
    setDraggedItem(todo);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: TodoItem['status']) => {
    if (draggedItem) {
      updateTodoStatusMutation.mutate({ id: draggedItem.id, status });
      setDraggedItem(null);
    }
  };

  const handleSaveTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) {
      toast.error('Please log in to create tasks');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const todoData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      author: formData.get('author') as string,
      assignee: formData.get('assignee') as string,
      deadline: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
      status: editingTodo ? editingTodo.status : 'not-yet' as const,
      user_id: userId,
    };

    if (editingTodo) {
      updateTodoMutation.mutate({ ...editingTodo, ...todoData });
    } else {
      addTodoMutation.mutate(todoData);
    }
  };

  const handleEditTodo = (todo: TodoItem) => {
    setEditingTodo(todo);
    setSelectedDate(new Date(todo.deadline));
    setIsDialogOpen(true);
  };

  const handleDeleteTodo = (id: string) => {
    deleteTodoMutation.mutate(id);
  };

  const columns = [
    { id: "not-yet", title: "Not Yet" },
    { id: "todo", title: "To Do" },
    { id: "in-progress", title: "In Progress" },
    { id: "waiting", title: "Waiting" },
    { id: "done", title: "Done" },
  ];

  if (!userId) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h2 className="text-xl">Please log in to manage your tasks</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">To Do Board</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingTodo(null);
              setSelectedDate(undefined);
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTodo ? "Edit Task" : "Add New Task"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveTodo} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={editingTodo?.title}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingTodo?.description}
                  required
                />
              </div>
              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  name="author"
                  defaultValue={editingTodo?.author}
                  required
                />
              </div>
              <div>
                <Label htmlFor="assignee">Assignee</Label>
                <Input
                  id="assignee"
                  name="assignee"
                  defaultValue={editingTodo?.assignee}
                  required
                />
              </div>
              <div>
                <Label>Deadline</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      {selectedDate ? (
                        format(selectedDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button type="submit">
                {editingTodo ? "Update Task" : "Create Task"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {columns.map((column) => (
          <div
            key={column.id}
            className="bg-background rounded-lg p-4"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id as TodoItem["status"])}
          >
            <h3 className="font-semibold mb-4">{column.title}</h3>
            <div className="space-y-4">
              {todos
                .filter((todo) => todo.status === column.id)
                .map((todo) => (
                  <Card
                    key={todo.id}
                    draggable
                    onDragStart={() => handleDragStart(todo)}
                    className="cursor-move"
                  >
                    <CardContent className="p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold">{todo.title}</h4>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditTodo(todo)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteTodo(todo.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {todo.description}
                      </p>
                      <div className="text-sm">
                        <p>Author: {todo.author}</p>
                        <p>Assignee: {todo.assignee}</p>
                        <p>Deadline: {todo.deadline}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Todo;
