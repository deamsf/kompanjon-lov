
export interface SharePage {
  id: string;
  name: string;
  description?: string;
  created_by: string;
  created_at: string;
  is_public: boolean;
}

export interface SharePageFile {
  share_page_id: string;
  file_id: string;
  added_at: string;
  added_by: string;
}

export interface SharePageAccess {
  share_page_id: string;
  partner_id: string;
  granted_at: string;
  granted_by: string;
}
