
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SharePage } from "@/types/shares";
import { Plus } from "lucide-react";
import { CreateSharePageDialog } from "@/components/shares/CreateSharePageDialog";
import { SharePageList } from "@/components/shares/SharePageList";

const Shares = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: sharePages = [], isLoading } = useQuery({
    queryKey: ['share-pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('share_pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as SharePage[];
    },
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Shared Resources</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Share Page
        </Button>
      </div>

      <SharePageList sharePages={sharePages} isLoading={isLoading} />

      <CreateSharePageDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
};

export default Shares;
