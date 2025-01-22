export interface FileItem {
  id: string;
  name: string;
  size?: number;
  content_type?: string;
  created_at?: string;
  tags: string[];
}

export interface ShareItem {
  id: string;
  file_ids: string[];
  access_password: string;
  expires_at?: string;
  created_at?: string;
  created_by: string;
}