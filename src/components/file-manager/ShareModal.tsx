import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Copy, ExternalLink } from "lucide-react";

interface ShareModalProps {
  fileIds: string[];
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal = ({ fileIds, isOpen, onClose }: ShareModalProps) => {
  const [password, setPassword] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const { toast } = useToast();

  const handleShare = async () => {
    if (!password) {
      toast({
        title: "Error",
        description: "Password is required",
        variant: "destructive",
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
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

      const shareUrl = `${window.location.origin}/shared/${shareData.id}`;
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

  const handleCopyLink = async () => {
    if (shareLink) {
      await navigator.clipboard.writeText(shareLink);
      toast({
        title: "Success",
        description: "Share link copied to clipboard",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Files</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password Protection</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expires">Expires At (Optional)</Label>
            <Input
              id="expires"
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>
          {shareLink && (
            <div className="space-y-2">
              <Label>Share Link</Label>
              <div className="flex gap-2">
                <Input
                  value={shareLink}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyLink}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                >
                  <a href={shareLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {!shareLink && (
            <Button onClick={handleShare} disabled={isCreating}>
              <Lock className="w-4 h-4 mr-2" />
              {isCreating ? "Creating..." : "Create Share Link"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};