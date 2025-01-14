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
import { Plus } from "lucide-react";

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
    }
  };

  const handleAddTodo = (data: Omit<TodoItem, "id" | "status">) => {
    const newTodo: TodoItem = {
      id: Math.random().toString(36).substr(2, 9),
      status: "not-yet",
      ...data,
    };
    setTodos([...todos, newTodo]);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">To Do Board</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleAddTodo({
                  title: formData.get("title") as string,
                  description: formData.get("description") as string,
                  author: formData.get("author") as string,
                  assignee: formData.get("assignee") as string,
                  deadline: formData.get("deadline") as string,
                });
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" required />
              </div>
              <div>
                <Label htmlFor="author">Author</Label>
                <Input id="author" name="author" required />
              </div>
              <div>
                <Label htmlFor="assignee">Assignee</Label>
                <Input id="assignee" name="assignee" required />
              </div>
              <div>
                <Label htmlFor="deadline">Deadline</Label>
                <Input id="deadline" name="deadline" type="date" required />
              </div>
              <Button type="submit">Create Task</Button>
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
                      <h4 className="font-semibold">{todo.title}</h4>
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