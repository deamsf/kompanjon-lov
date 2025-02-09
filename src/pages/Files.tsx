
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import FileManager from "@/components/file-manager/FileManager";
import { FileType } from "@/types/files";

const Files = () => {
  const location = useLocation();
  const defaultTab = location.pathname.split('/').pop() || 'documents';
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Resources</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start mb-6 bg-background">
          <TabsTrigger value="documents" className="flex-1">Documents</TabsTrigger>
          <TabsTrigger value="bills" className="flex-1">Bills</TabsTrigger>
          <TabsTrigger value="offers" className="flex-1">Offers</TabsTrigger>
          <TabsTrigger value="photos" className="flex-1">Photos</TabsTrigger>
        </TabsList>

        <TabsContent value="documents">
          <FileManager fileType="document" showDocumentCategories />
        </TabsContent>
        <TabsContent value="bills">
          <FileManager fileType="bill" />
        </TabsContent>
        <TabsContent value="offers">
          <FileManager fileType="offer" />
        </TabsContent>
        <TabsContent value="photos">
          <FileManager fileType="photo" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Files;
