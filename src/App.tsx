import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Index from "./pages/Index";
import Agenda from "./pages/Agenda";
import Planning from "./pages/Planning";
import Todo from "./pages/Todo";
import Communication from "./pages/Communication";
import Partners from "./pages/Partners";
import Advice from "./pages/Advice";
import Preferences from "./pages/Preferences";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/planning" element={<Planning />} />
          <Route path="/todo" element={<Todo />} />
          <Route path="/communication" element={<Communication />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/advice" element={<Advice />} />
          <Route path="/preferences" element={<Preferences />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;