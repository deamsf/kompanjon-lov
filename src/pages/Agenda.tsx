import { Card, CardContent } from "@/components/ui/card";

const Agenda = () => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-4">Agenda</h1>
          <p>Your agenda content will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Agenda;