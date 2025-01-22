import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileIds: string[];
}

export const ShareModal = ({ isOpen, onClose, fileIds }: ShareModalProps) => {
  const [password, setPassword] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const { toast } = useToast();

  const { data: sessionData } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const user = sessionData?.user;

  const handleCreateShare = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to share files",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      // First create the share record
      const { data: shareData, error: shareError } = await supabase
        .from('shares')
        .insert({
          access_password: password,
          expires_at: expiresAt || null,
          created_by: user.id,
        })
        .select()
        .single();

      if (shareError) throw shareError;

      // Then create the share_files associations
      const shareFileRecords = fileIds.map(fileId => ({
        share_id: shareData.id,
        file_id: fileId
      }));

      const { error: shareFilesError } = await supabase
        .from('share_files')
        .insert(shareFileRecords);

      if (shareFilesError) throw shareFilesError;

      // Construct the share URL using window.location.origin without extra colons
      const shareUrl = new URL(`/shared/${shareData.id}`, window.location.origin).toString();
      setShareLink(shareUrl);

      toast({
        title: "Success",
        description: "Share link created successfully",
      });
    } catch (error: any) {
      console.error('Share creation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create share link",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast({
      title: "Success",
      description: "Share link copied to clipboard",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Files</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="password">Password (optional)</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a password"
            />
          </div>
          <div>
            <Label htmlFor="expires">Expires at (optional)</Label>
            <Input
              id="expires"
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>
          {shareLink ? (
            <div className="space-y-2">
              <Input value={shareLink} readOnly />
              <Button onClick={handleCopyLink} className="w-full">
                Copy Link
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleCreateShare}
              disabled={isCreating}
              className="w-full"
            >
              {isCreating ? "Creating..." : "Create Share Link"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};