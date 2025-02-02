import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNavigate, useLocation } from "react-router-dom";
import Files from "./Files";

const RESOURCE_TYPES = [
  { value: "documents", label: "Documents" },
  { value: "bills", label: "Bills" },
  { value: "offers", label: "Offers" },
  { value: "photos", label: "Photos" },
];

const Resources = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname.split("/")[1];
  const [activeTab, setActiveTab] = useState(currentPath || "documents");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/${value}`);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Resources</h1>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full justify-start mb-6">
          {RESOURCE_TYPES.map((type) => (
            <TabsTrigger key={type.value} value={type.value} className="flex-1">
              {type.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {RESOURCE_TYPES.map((type) => (
          <TabsContent key={type.value} value={type.value}>
            <Files fileType={type.value} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Resources;