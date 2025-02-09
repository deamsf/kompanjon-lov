
import { SharePage } from "@/types/shares";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface SharePageListProps {
  sharePages: SharePage[];
  isLoading: boolean;
}

export const SharePageList = ({ sharePages, isLoading }: SharePageListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-muted rounded w-1/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (sharePages.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No share pages created yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sharePages.map((sharePage) => (
        <Card key={sharePage.id} className="hover:bg-accent/50 transition-colors">
          <CardHeader>
            <CardTitle>{sharePage.name}</CardTitle>
            <CardDescription>
              {sharePage.description || "No description"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Created {formatDistanceToNow(new Date(sharePage.created_at), { addSuffix: true })}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
