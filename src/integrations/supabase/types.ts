export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      availability_slots: {
        Row: {
          created_at: string | null
          end_time: string
          id: string
          partner_categories: string[]
          start_time: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_time: string
          id?: string
          partner_categories?: string[]
          start_time: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_time?: string
          id?: string
          partner_categories?: string[]
          start_time?: string
          user_id?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          body: string
          created_at: string | null
          id: string
          name: string
          subject: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: string
          name: string
          subject: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          name?: string
          subject?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      file_tags: {
        Row: {
          file_id: string
          tag_id: string
        }
        Insert: {
          file_id: string
          tag_id: string
        }
        Update: {
          file_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "file_tags_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "file_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      files: {
        Row: {
          content_type: string | null
          created_at: string | null
          created_by: string
          description: string | null
          document_category:
            | Database["public"]["Enums"]["document_category"]
            | null
          file_type: Database["public"]["Enums"]["file_type"]
          folder_id: string | null
          id: string
          name: string
          project_id: string | null
          size: number | null
          storage_path: string
          thumbnail_url: string | null
          type: string
        }
        Insert: {
          content_type?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          document_category?:
            | Database["public"]["Enums"]["document_category"]
            | null
          file_type?: Database["public"]["Enums"]["file_type"]
          folder_id?: string | null
          id?: string
          name: string
          project_id?: string | null
          size?: number | null
          storage_path: string
          thumbnail_url?: string | null
          type?: string
        }
        Update: {
          content_type?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          document_category?:
            | Database["public"]["Enums"]["document_category"]
            | null
          file_type?: Database["public"]["Enums"]["file_type"]
          folder_id?: string | null
          id?: string
          name?: string
          project_id?: string | null
          size?: number | null
          storage_path?: string
          thumbnail_url?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "files_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      folders: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          name: string
          parent_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: string
          name: string
          parent_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          name?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "folders_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          components: string[]
          created_at: string | null
          email: string
          id: string
          name: string
          tags: string[]
          user_id: string
        }
        Insert: {
          components: string[]
          created_at?: string | null
          email: string
          id?: string
          name: string
          tags: string[]
          user_id: string
        }
        Update: {
          components?: string[]
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          tags?: string[]
          user_id?: string
        }
        Relationships: []
      }
      planning_items: {
        Row: {
          created_at: string | null
          end_date: string
          id: string
          order_index: number
          partner_id: string | null
          start_date: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          order_index: number
          partner_id?: string | null
          start_date: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          order_index?: number
          partner_id?: string | null
          start_date?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "planning_items_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      project_members: {
        Row: {
          created_at: string
          project_id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          project_id: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          project_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      share_files: {
        Row: {
          file_id: string
          share_id: string
        }
        Insert: {
          file_id: string
          share_id: string
        }
        Update: {
          file_id?: string
          share_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "share_files_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "share_files_share_id_fkey"
            columns: ["share_id"]
            isOneToOne: false
            referencedRelation: "shares"
            referencedColumns: ["id"]
          },
        ]
      }
      share_page_access: {
        Row: {
          granted_at: string | null
          granted_by: string
          partner_id: string
          share_page_id: string
        }
        Insert: {
          granted_at?: string | null
          granted_by: string
          partner_id: string
          share_page_id: string
        }
        Update: {
          granted_at?: string | null
          granted_by?: string
          partner_id?: string
          share_page_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "share_page_access_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "share_page_access_share_page_id_fkey"
            columns: ["share_page_id"]
            isOneToOne: false
            referencedRelation: "share_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      share_page_files: {
        Row: {
          added_at: string | null
          added_by: string
          file_id: string
          share_page_id: string
        }
        Insert: {
          added_at?: string | null
          added_by: string
          file_id: string
          share_page_id: string
        }
        Update: {
          added_at?: string | null
          added_by?: string
          file_id?: string
          share_page_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "share_page_files_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "share_page_files_share_page_id_fkey"
            columns: ["share_page_id"]
            isOneToOne: false
            referencedRelation: "share_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      share_pages: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          is_public: boolean | null
          name: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
        }
        Relationships: []
      }
      shares: {
        Row: {
          access_password: string
          created_at: string | null
          created_by: string
          expires_at: string | null
          id: string
        }
        Insert: {
          access_password: string
          created_at?: string | null
          created_by: string
          expires_at?: string | null
          id?: string
        }
        Update: {
          access_password?: string
          created_at?: string | null
          created_by?: string
          expires_at?: string | null
          id?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_by: string
          id: string
          name: string
        }
        Insert: {
          created_by: string
          id?: string
          name: string
        }
        Update: {
          created_by?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      todos: {
        Row: {
          assignee: string
          author: string
          created_at: string | null
          deadline: string
          description: string
          id: string
          project_id: string | null
          status: string
          title: string
          user_id: string
        }
        Insert: {
          assignee: string
          author: string
          created_at?: string | null
          deadline: string
          description: string
          id?: string
          project_id?: string | null
          status: string
          title: string
          user_id: string
        }
        Update: {
          assignee?: string
          author?: string
          created_at?: string | null
          deadline?: string
          description?: string
          id?: string
          project_id?: string | null
          status?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "todos_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      document_category:
        | "architect_report"
        | "permit"
        | "photo"
        | "offer"
        | "bill"
        | "other"
      file_type: "document" | "bill" | "offer" | "photo"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
