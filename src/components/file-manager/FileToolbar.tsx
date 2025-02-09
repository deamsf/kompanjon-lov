
import { LayoutGrid, List, MoveHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ViewMode } from "@/types/files";

interface FileToolbarProps {
  viewMode: ViewMode;
  selectedCount: number;
  onViewModeChange: (mode: ViewMode) => void;
  onUpdateFileType: (fileIds: string[], newType: string) => void;
}

export const FileToolbar = ({
  viewMode,
  selectedCount,
  onViewModeChange,
  onUpdateFileType,
}: FileToolbarProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'ghost'}
          size="icon"
          onClick={() => onViewModeChange('grid')}
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'ghost'}
          size="icon"
          onClick={() => onViewModeChange('list')}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>

      {selectedCount > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <MoveHorizontal className="mr-2 h-4 w-4" />
              Move {selectedCount} item(s)
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => onUpdateFileType([], 'document')}>
              To Documents
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onUpdateFileType([], 'bill')}>
              To Bills
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onUpdateFileType([], 'offer')}>
              To Offers
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onUpdateFileType([], 'photo')}>
              To Photos
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
