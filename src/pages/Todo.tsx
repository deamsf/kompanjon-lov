import { Card, CardContent } from "@/components/ui/card";

const Todo = () => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-4">To Do</h1>
          <p>Your todo list will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Todo;