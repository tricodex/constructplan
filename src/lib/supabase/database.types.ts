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
      chat_memory: {
        Row: {
          context: string | null
          created_at: string | null
          id: string
          messages: Json | null
          project_id: string | null
          summary: string | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          context?: string | null
          created_at?: string | null
          id?: string
          messages?: Json | null
          project_id?: string | null
          summary?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          context?: string | null
          created_at?: string | null
          id?: string
          messages?: Json | null
          project_id?: string | null
          summary?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_memory_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          role: string
          session_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          role: string
          session_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          role?: string
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          context: Json | null
          created_at: string | null
          id: string
          project_id: string | null
          summary: string | null
        }
        Insert: {
          context?: Json | null
          created_at?: string | null
          id?: string
          project_id?: string | null
          summary?: string | null
        }
        Update: {
          context?: Json | null
          created_at?: string | null
          id?: string
          project_id?: string | null
          summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string | null
          id: string
          messages: Json
          summary: string | null
          tags: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          messages?: Json
          summary?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          messages?: Json
          summary?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      document_analyses: {
        Row: {
          analysis_result: Json
          analysis_type: string
          created_at: string | null
          creator_id: string | null
          document_id: string | null
          id: string
          project_id: string | null
          updated_at: string | null
        }
        Insert: {
          analysis_result: Json
          analysis_type: string
          created_at?: string | null
          creator_id?: string | null
          document_id?: string | null
          id?: string
          project_id?: string | null
          updated_at?: string | null
        }
        Update: {
          analysis_result?: Json
          analysis_type?: string
          created_at?: string | null
          creator_id?: string | null
          document_id?: string | null
          id?: string
          project_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_analyses_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_analyses_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      document_templates: {
        Row: {
          category: string
          created_at: string | null
          created_by: string | null
          default_content: Json | null
          id: string
          name: string
          template_fields: Json
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          created_by?: string | null
          default_content?: Json | null
          id?: string
          name: string
          template_fields: Json
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by?: string | null
          default_content?: Json | null
          id?: string
          name?: string
          template_fields?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      document_versions: {
        Row: {
          changes_summary: string | null
          content: Json
          created_at: string | null
          created_by: string | null
          document_id: string | null
          id: string
          version_number: number
        }
        Insert: {
          changes_summary?: string | null
          content: Json
          created_at?: string | null
          created_by?: string | null
          document_id?: string | null
          id?: string
          version_number: number
        }
        Update: {
          changes_summary?: string | null
          content?: Json
          created_at?: string | null
          created_by?: string | null
          document_id?: string | null
          id?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "document_versions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          analysis_result: Json | null
          approval_status: string | null
          category: string | null
          content: Json | null
          created_at: string
          id: string
          last_reviewed_at: string | null
          last_reviewed_by: string | null
          metadata: Json | null
          name: string
          project_id: string | null
          revision_history: Json[] | null
          tags: string[] | null
          type: string
          updated_at: string | null
          uploader_id: string
          url: string
          version: number | null
        }
        Insert: {
          analysis_result?: Json | null
          approval_status?: string | null
          category?: string | null
          content?: Json | null
          created_at?: string
          id?: string
          last_reviewed_at?: string | null
          last_reviewed_by?: string | null
          metadata?: Json | null
          name: string
          project_id?: string | null
          revision_history?: Json[] | null
          tags?: string[] | null
          type: string
          updated_at?: string | null
          uploader_id: string
          url: string
          version?: number | null
        }
        Update: {
          analysis_result?: Json | null
          approval_status?: string | null
          category?: string | null
          content?: Json | null
          created_at?: string
          id?: string
          last_reviewed_at?: string | null
          last_reviewed_by?: string | null
          metadata?: Json | null
          name?: string
          project_id?: string | null
          revision_history?: Json[] | null
          tags?: string[] | null
          type?: string
          updated_at?: string | null
          uploader_id?: string
          url?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      material_usage: {
        Row: {
          cost: number | null
          created_at: string | null
          id: string
          name: string
          phase_id: string | null
          project_id: string | null
          quantity: number | null
          status: string | null
          supplier: string | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          cost?: number | null
          created_at?: string | null
          id?: string
          name: string
          phase_id?: string | null
          project_id?: string | null
          quantity?: number | null
          status?: string | null
          supplier?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          cost?: number | null
          created_at?: string | null
          id?: string
          name?: string
          phase_id?: string | null
          project_id?: string | null
          quantity?: number | null
          status?: string | null
          supplier?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "material_usage_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      photo_analyses: {
        Row: {
          analysis_result: Json
          created_at: string | null
          creator_id: string | null
          id: string
          photo_url: string
          project_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          analysis_result: Json
          created_at?: string | null
          creator_id?: string | null
          id?: string
          photo_url: string
          project_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          analysis_result?: Json
          created_at?: string | null
          creator_id?: string | null
          id?: string
          photo_url?: string
          project_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "photo_analyses_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photo_analyses_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          certifications: string | null
          created_at: string
          expertise: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          certifications?: string | null
          created_at?: string
          expertise?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          certifications?: string | null
          created_at?: string
          expertise?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      project_analysis: {
        Row: {
          analysis_result: Json | null
          created_at: string | null
          creator_id: string | null
          id: string
          project_id: string | null
          status: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          analysis_result?: Json | null
          created_at?: string | null
          creator_id?: string | null
          id?: string
          project_id?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          analysis_result?: Json | null
          created_at?: string | null
          creator_id?: string | null
          id?: string
          project_id?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_analysis_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_analysis_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_insights: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          insight_type: string | null
          project_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          insight_type?: string | null
          project_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          insight_type?: string | null
          project_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_insights_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_stats: {
        Row: {
          budget: Json | null
          created_at: string | null
          id: string
          progress: number | null
          project_id: string | null
          resources: Json | null
          timeline: Json | null
          updated_at: string | null
        }
        Insert: {
          budget?: Json | null
          created_at?: string | null
          id?: string
          progress?: number | null
          project_id?: string | null
          resources?: Json | null
          timeline?: Json | null
          updated_at?: string | null
        }
        Update: {
          budget?: Json | null
          created_at?: string | null
          id?: string
          progress?: number | null
          project_id?: string | null
          resources?: Json | null
          timeline?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_stats_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_timelines: {
        Row: {
          ai_suggestions: string[] | null
          created_at: string | null
          estimates: Json | null
          id: string
          phases: Json | null
          project_id: string | null
          updated_at: string | null
        }
        Insert: {
          ai_suggestions?: string[] | null
          created_at?: string | null
          estimates?: Json | null
          id?: string
          phases?: Json | null
          project_id?: string | null
          updated_at?: string | null
        }
        Update: {
          ai_suggestions?: string[] | null
          created_at?: string | null
          estimates?: Json | null
          id?: string
          phases?: Json | null
          project_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_timelines_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          budget: number | null
          created_at: string
          creator_id: string
          description: string | null
          end_date: string | null
          id: string
          location: string | null
          name: string
          priority: string | null
          start_date: string | null
          status: string | null
          team_ids: string[] | null
          updated_at: string | null
        }
        Insert: {
          budget?: number | null
          created_at?: string
          creator_id: string
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          name: string
          priority?: string | null
          start_date?: string | null
          status?: string | null
          team_ids?: string[] | null
          updated_at?: string | null
        }
        Update: {
          budget?: number | null
          created_at?: string
          creator_id?: string
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          name?: string
          priority?: string | null
          start_date?: string | null
          status?: string | null
          team_ids?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      resource_estimates: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          equipment: Json | null
          id: string
          labor: Json | null
          materials: Json | null
          phase_id: string | null
          project_id: string | null
          total_estimated_cost: number | null
          updated_at: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          equipment?: Json | null
          id?: string
          labor?: Json | null
          materials?: Json | null
          phase_id?: string | null
          project_id?: string | null
          total_estimated_cost?: number | null
          updated_at?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          equipment?: Json | null
          id?: string
          labor?: Json | null
          materials?: Json | null
          phase_id?: string | null
          project_id?: string | null
          total_estimated_cost?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resource_estimates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          actual_hours: number | null
          assignee_id: string | null
          created_at: string
          creator_id: string
          dependencies: string[] | null
          description: string | null
          due_date: string | null
          estimated_hours: number | null
          id: string
          priority: string | null
          project_id: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          actual_hours?: number | null
          assignee_id?: string | null
          created_at?: string
          creator_id: string
          dependencies?: string[] | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          priority?: string | null
          project_id?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          actual_hours?: number | null
          assignee_id?: string | null
          created_at?: string
          creator_id?: string
          dependencies?: string[] | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          priority?: string | null
          project_id?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_phases: {
        Row: {
          created_at: string | null
          dependencies: string[] | null
          end_date: string | null
          id: string
          name: string
          progress: number | null
          project_id: string | null
          resources: string[] | null
          start_date: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dependencies?: string[] | null
          end_date?: string | null
          id?: string
          name: string
          progress?: number | null
          project_id?: string | null
          resources?: string[] | null
          start_date?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dependencies?: string[] | null
          end_date?: string | null
          id?: string
          name?: string
          progress?: number | null
          project_id?: string | null
          resources?: string[] | null
          start_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "timeline_phases_project_id_fkey"
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
      [_ in never]: never
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
