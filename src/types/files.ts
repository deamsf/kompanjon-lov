
export interface FileItem {
  id: string;
  name: string;
  description?: string;
  size?: number;
  content_type?: string;
  thumbnail_url?: string;
  storage_path: string;
  document_category?: string;
  file_type: 'document' | 'bill' | 'offer' | 'photo';
  tags: string[];
  created_at?: string;
}

export type ViewMode = 'grid' | 'list';

export interface ShareItem {
  id: string;
  file_ids: string[];
  access_password: string;
  expires_at?: string;
  created_at?: string;
  created_by: string;
}
