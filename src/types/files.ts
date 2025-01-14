export interface FileItem {
  id: string;
  name: string;
  size?: number;
  content_type?: string;
  created_at?: string;
  tags: string[];
}