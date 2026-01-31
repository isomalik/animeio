export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      character_seeds: {
        Row: {
          abilities: string[] | null
          appearance: string | null
          backstory: string | null
          created_at: string
          created_by: string | null
          id: string
          name: string
          personality: string[] | null
          project_id: string
          reference_image_url: string | null
          role: string
          style_dna: Json
          updated_at: string
        }
        Insert: {
          abilities?: string[] | null
          appearance?: string | null
          backstory?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          personality?: string[] | null
          project_id: string
          reference_image_url?: string | null
          role?: string
          style_dna?: Json
          updated_at?: string
        }
        Update: {
          abilities?: string[] | null
          appearance?: string | null
          backstory?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          personality?: string[] | null
          project_id?: string
          reference_image_url?: string | null
          role?: string
          style_dna?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "character_seeds_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      director_choices: {
        Row: {
          choice_type: string
          created_at: string
          id: string
          metadata: Json | null
          panel_id: string | null
          project_id: string
          selected_at: string | null
          selected_by: string | null
          selected_index: number | null
          variations: Json
        }
        Insert: {
          choice_type?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          panel_id?: string | null
          project_id: string
          selected_at?: string | null
          selected_by?: string | null
          selected_index?: number | null
          variations?: Json
        }
        Update: {
          choice_type?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          panel_id?: string | null
          project_id?: string
          selected_at?: string | null
          selected_by?: string | null
          selected_index?: number | null
          variations?: Json
        }
        Relationships: [
          {
            foreignKeyName: "director_choices_panel_id_fkey"
            columns: ["panel_id"]
            isOneToOne: false
            referencedRelation: "manga_panels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "director_choices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      funding_transactions: {
        Row: {
          amount: number
          created_at: string
          credits_received: number
          id: string
          metadata: Json | null
          price_at_purchase: number
          project_id: string
          transaction_type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          credits_received?: number
          id?: string
          metadata?: Json | null
          price_at_purchase: number
          project_id: string
          transaction_type?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          credits_received?: number
          id?: string
          metadata?: Json | null
          price_at_purchase?: number
          project_id?: string
          transaction_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "funding_transactions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      manga_panels: {
        Row: {
          chapter_number: number
          created_at: string
          created_by: string | null
          description: string | null
          dialogue: string | null
          id: string
          image_url: string | null
          is_keyframe: boolean
          page_number: number
          panel_position: number
          project_id: string
          prompt_data: Json
          updated_at: string
        }
        Insert: {
          chapter_number?: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          dialogue?: string | null
          id?: string
          image_url?: string | null
          is_keyframe?: boolean
          page_number?: number
          panel_position?: number
          project_id: string
          prompt_data?: Json
          updated_at?: string
        }
        Update: {
          chapter_number?: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          dialogue?: string | null
          id?: string
          image_url?: string | null
          is_keyframe?: boolean
          page_number?: number
          panel_position?: number
          project_id?: string
          prompt_data?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "manga_panels_project_id_fkey"
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
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_rights: {
        Row: {
          acquired_at: string
          holder_id: string | null
          id: string
          is_tradeable: boolean
          metadata: Json | null
          percentage: number
          price_paid: number | null
          project_id: string
          rights_type: string
        }
        Insert: {
          acquired_at?: string
          holder_id?: string | null
          id?: string
          is_tradeable?: boolean
          metadata?: Json | null
          percentage?: number
          price_paid?: number | null
          project_id: string
          rights_type?: string
        }
        Update: {
          acquired_at?: string
          holder_id?: string | null
          id?: string
          is_tradeable?: boolean
          metadata?: Json | null
          percentage?: number
          price_paid?: number | null
          project_id?: string
          rights_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_rights_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          bonding_curve_price: number
          cover_image_url: string | null
          created_at: string
          created_by: string | null
          description: string | null
          funding_current: number
          funding_goal: number
          funding_percentage: number | null
          funding_tier: Database["public"]["Enums"]["funding_tier"]
          genre: string | null
          id: string
          name: string
          status: Database["public"]["Enums"]["project_status"]
          story_bible: Json | null
          updated_at: string
        }
        Insert: {
          bonding_curve_price?: number
          cover_image_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          funding_current?: number
          funding_goal?: number
          funding_percentage?: number | null
          funding_tier?: Database["public"]["Enums"]["funding_tier"]
          genre?: string | null
          id?: string
          name: string
          status?: Database["public"]["Enums"]["project_status"]
          story_bible?: Json | null
          updated_at?: string
        }
        Update: {
          bonding_curve_price?: number
          cover_image_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          funding_current?: number
          funding_goal?: number
          funding_percentage?: number | null
          funding_tier?: Database["public"]["Enums"]["funding_tier"]
          genre?: string | null
          id?: string
          name?: string
          status?: Database["public"]["Enums"]["project_status"]
          story_bible?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      provenance_logs: {
        Row: {
          action: string
          created_at: string
          details: Json
          entity_id: string
          entity_type: string
          id: string
          project_id: string | null
          prompt_hash: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json
          entity_id: string
          entity_type: string
          id?: string
          project_id?: string | null
          prompt_hash?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json
          entity_id?: string
          entity_type?: string
          id?: string
          project_id?: string | null
          prompt_hash?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provenance_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      style_library: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          preview_url: string | null
          tags: string[]
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          preview_url?: string | null
          tags?: string[]
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          preview_url?: string | null
          tags?: string[]
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_project_owner: { Args: { _project_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "creator" | "patron"
      funding_tier: "seed" | "hype" | "production" | "premiere"
      project_status:
        | "draft"
        | "pilot"
        | "funding"
        | "funded"
        | "production"
        | "completed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "creator", "patron"],
      funding_tier: ["seed", "hype", "production", "premiere"],
      project_status: [
        "draft",
        "pilot",
        "funding",
        "funded",
        "production",
        "completed",
      ],
    },
  },
} as const
