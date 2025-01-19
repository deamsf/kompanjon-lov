import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Bot } from "lucide-react";
import { faqData } from "@/data/faq";

const Advice = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex gap-6">
        <div className="w-2/3">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                {faqData.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
        <div className="w-1/3">
          <Card className="h-1/2">
            <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center">
              <Bot className="w-16 h-16 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Your AI Partner</h3>
              <p className="text-muted-foreground">Coming soon</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Advice;