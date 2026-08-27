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
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      app_settings: {
        Row: {
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      business_case_drafts: {
        Row: {
          audience_role: string | null
          budget_range: string | null
          company_name: string
          created_at: string
          decision_maker: string | null
          desired_outcomes: string[] | null
          extra_notes: string | null
          has_champions: string | null
          has_formal_training: string | null
          headcount_bracket: string | null
          id: string
          preferred_city: string | null
          preferred_quarter: string | null
          presenter_email: string | null
          presenter_name: string | null
          presenter_role: string | null
          primary_ask: string | null
          research_snapshot: Json | null
          seats_requested: string | null
          selected_challenges: string[] | null
          sponsor_name: string | null
        }
        Insert: {
          audience_role?: string | null
          budget_range?: string | null
          company_name: string
          created_at?: string
          decision_maker?: string | null
          desired_outcomes?: string[] | null
          extra_notes?: string | null
          has_champions?: string | null
          has_formal_training?: string | null
          headcount_bracket?: string | null
          id?: string
          preferred_city?: string | null
          preferred_quarter?: string | null
          presenter_email?: string | null
          presenter_name?: string | null
          presenter_role?: string | null
          primary_ask?: string | null
          research_snapshot?: Json | null
          seats_requested?: string | null
          selected_challenges?: string[] | null
          sponsor_name?: string | null
        }
        Update: {
          audience_role?: string | null
          budget_range?: string | null
          company_name?: string
          created_at?: string
          decision_maker?: string | null
          desired_outcomes?: string[] | null
          extra_notes?: string | null
          has_champions?: string | null
          has_formal_training?: string | null
          headcount_bracket?: string | null
          id?: string
          preferred_city?: string | null
          preferred_quarter?: string | null
          presenter_email?: string | null
          presenter_name?: string | null
          presenter_role?: string | null
          primary_ask?: string | null
          research_snapshot?: Json | null
          seats_requested?: string | null
          selected_challenges?: string[] | null
          sponsor_name?: string | null
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          created_at: string
          id: string
          intent_signal: string | null
          referrer: string | null
          updated_at: string
          user_agent: string | null
          visitor_company: string | null
          visitor_email: string | null
          visitor_name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          intent_signal?: string | null
          referrer?: string | null
          updated_at?: string
          user_agent?: string | null
          visitor_company?: string | null
          visitor_email?: string | null
          visitor_name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          intent_signal?: string | null
          referrer?: string | null
          updated_at?: string
          user_agent?: string | null
          visitor_company?: string | null
          visitor_email?: string | null
          visitor_name?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      host_applications: {
        Row: {
          booking_lead_time: string
          champion_readiness: string
          city: string | null
          company: string
          contribution_level: string
          created_at: string
          email: string
          full_name: string
          id: string
          interest_reason: string | null
          preferred_quarter: string
          venue_capacity: string
        }
        Insert: {
          booking_lead_time: string
          champion_readiness: string
          city?: string | null
          company: string
          contribution_level: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          interest_reason?: string | null
          preferred_quarter: string
          venue_capacity: string
        }
        Update: {
          booking_lead_time?: string
          champion_readiness?: string
          city?: string | null
          company?: string
          contribution_level?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          interest_reason?: string | null
          preferred_quarter?: string
          venue_capacity?: string
        }
        Relationships: []
      }
      interest_submissions: {
        Row: {
          campus: string
          company: string
          created_at: string
          email: string
          excitement: string | null
          full_name: string
          id: string
          interest_type: string
        }
        Insert: {
          campus: string
          company: string
          created_at?: string
          email: string
          excitement?: string | null
          full_name: string
          id?: string
          interest_type: string
        }
        Update: {
          campus?: string
          company?: string
          created_at?: string
          email?: string
          excitement?: string | null
          full_name?: string
          id?: string
          interest_type?: string
        }
        Relationships: []
      }
      mailto_clicks: {
        Row: {
          created_at: string
          cta_label: string
          cta_location: string | null
          email_to: string
          id: string
          page_path: string | null
          referrer: string | null
          subject: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          cta_label: string
          cta_location?: string | null
          email_to: string
          id?: string
          page_path?: string | null
          referrer?: string | null
          subject?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          cta_label?: string
          cta_location?: string | null
          email_to?: string
          id?: string
          page_path?: string | null
          referrer?: string | null
          subject?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      purchase_inquiries: {
        Row: {
          company: string
          created_at: string
          email: string
          extra_notes: string | null
          full_name: string
          id: string
          pack: string
          payment_method: string
          preferred_campus: string | null
          role: string | null
          seats_notes: string | null
        }
        Insert: {
          company: string
          created_at?: string
          email: string
          extra_notes?: string | null
          full_name: string
          id?: string
          pack: string
          payment_method: string
          preferred_campus?: string | null
          role?: string | null
          seats_notes?: string | null
        }
        Update: {
          company?: string
          created_at?: string
          email?: string
          extra_notes?: string | null
          full_name?: string
          id?: string
          pack?: string
          payment_method?: string
          preferred_campus?: string | null
          role?: string | null
          seats_notes?: string | null
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      email_queue_dispatch: { Args: never; Returns: undefined }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
