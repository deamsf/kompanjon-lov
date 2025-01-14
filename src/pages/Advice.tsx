import { Card, CardContent } from "@/components/ui/card";

const Advice = () => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-4">Advice</h1>
          <p>Your advice content will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Advice;