import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { File, Folder, Share, Tag, Upload, Filter, ArrowUpDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface FileItem {
  id: string;
  name: string;
  size?: number;
  type?: string;
  tags: string[];
  shared?: boolean;
}

const Index = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [sortField, setSortField] = useState<'name' | 'size' | 'type'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: 'name' | 'size' | 'type') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Files</h1>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90">
            <Upload className="w-4 h-4" />
            Upload
          </button>
          <button className="flex items-center gap-2 border border-input bg-background px-4 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left sidebar */}
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Folders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent cursor-pointer">
                  <Folder className="w-4 h-4" />
                  <span>All Files</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent cursor-pointer">
                  <Share className="w-4 h-4" />
                  <span>Shared</span>
                </div>
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent cursor-pointer w-full">
                    <Tag className="w-4 h-4" />
                    <span>Tags</span>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-6 space-y-1">
                    <div className="p-2 rounded-lg hover:bg-accent cursor-pointer">Documents</div>
                    <div className="p-2 rounded-lg hover:bg-accent cursor-pointer">Images</div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="col-span-9">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox />
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                      <div className="flex items-center gap-2">
                        Name
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('type')}>
                      <div className="flex items-center gap-2">
                        Type
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('size')}>
                      <div className="flex items-center gap-2">
                        Size
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </TableHead>
                    <TableHead>Shared</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {files.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <File className="w-8 h-8 text-muted-foreground" />
                          <p className="text-muted-foreground">No files uploaded yet</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    files.map((file) => (
                      <TableRow key={file.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedFiles.includes(file.id)}
                            onCheckedChange={() => handleFileSelect(file.id)}
                          />
                        </TableCell>
                        <TableCell>{file.name}</TableCell>
                        <TableCell>{file.tags.join(', ')}</TableCell>
                        <TableCell>{file.type}</TableCell>
                        <TableCell>{file.size}</TableCell>
                        <TableCell>{file.shared ? 'Yes' : 'No'}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;