
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { FileItem } from "@/types/files";
import { FileIcon, defaultStyles } from 'react-file-icon';

interface FileCardProps {
  file: FileItem;
  isSelected: boolean;
  onSelect: () => void;
}

export const FileCard = ({ file, isSelected, onSelect }: FileCardProps) => {
  const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
  
  return (
    <Card className={`relative ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      <CardContent className="p-4">
        <div className="absolute top-2 right-2">
          <Checkbox checked={isSelected} onCheckedChange={() => onSelect()} />
        </div>
        
        {file.thumbnail_url ? (
          <img
            src={file.thumbnail_url}
            alt={file.name}
            className="w-full aspect-square object-cover rounded-md"
          />
        ) : (
          <div className="w-full aspect-square flex items-center justify-center bg-muted rounded-md p-4">
            <div className="w-20 h-20">
              <FileIcon
                extension={fileExtension}
                {...defaultStyles[fileExtension]}
              />
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col items-start gap-2 p-4">
        <h3 className="font-medium truncate w-full" title={file.name}>
          {file.name}
        </h3>
        {file.tags && file.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {file.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
