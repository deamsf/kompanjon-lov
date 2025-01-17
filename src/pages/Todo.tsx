import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

interface TodoItem {
  id: string;
  title: string;
  description: string;
  author: string;
  assignee: string;
  deadline: string;
  status: "not-yet" | "todo" | "in-progress" | "waiting" | "done";
}

const Todo = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [draggedItem, setDraggedItem] = useState<TodoItem | null>(null);
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const columns = [
    { id: "not-yet", title: "Not Yet" },
    { id: "todo", title: "To Do" },
    { id: "in-progress", title: "In Progress" },
    { id: "waiting", title: "Waiting" },
    { id: "done", title: "Done" },
  ];

  const handleDragStart = (todo: TodoItem) => {
    setDraggedItem(todo);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: TodoItem["status"]) => {
    if (draggedItem) {
      const updatedTodos = todos.map((todo) =>
        todo.id === draggedItem.id ? { ...todo, status } : todo
      );
      setTodos(updatedTodos);
      setDraggedItem(null);
      toast.success("Task status updated successfully");
    }
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    toast.success("Task deleted successfully");
  };

  const handleEditTodo = (todo: TodoItem) => {
    setEditingTodo(todo);
    setSelectedDate(new Date(todo.deadline));
    setIsDialogOpen(true);
  };

  const handleSaveTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const todoData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      author: formData.get("author") as string,
      assignee: formData.get("assignee") as string,
      deadline: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
    };

    if (editingTodo) {
      const updatedTodos = todos.map((todo) =>
        todo.id === editingTodo.id
          ? { ...todo, ...todoData }
          : todo
      );
      setTodos(updatedTodos);
      toast.success("Task updated successfully");
    } else {
      const newTodo: TodoItem = {
        id: Math.random().toString(36).substr(2, 9),
        status: "not-yet",
        ...todoData,
      };
      setTodos([...todos, newTodo]);
      toast.success("Task created successfully");
    }
    
    setIsDialogOpen(false);
    setEditingTodo(null);
    setSelectedDate(undefined);
  };

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