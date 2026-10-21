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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      akpd: {
        Row: {
          bidang_prioritas: string | null
          butir_masalah: string | null
          catatan: string | null
          created_at: string
          id: string
          siswa_id: string | null
          tanggal: string
          user_id: string
        }
        Insert: {
          bidang_prioritas?: string | null
          butir_masalah?: string | null
          catatan?: string | null
          created_at?: string
          id?: string
          siswa_id?: string | null
          tanggal?: string
          user_id?: string
        }
        Update: {
          bidang_prioritas?: string | null
          butir_masalah?: string | null
          catatan?: string | null
          created_at?: string
          id?: string
          siswa_id?: string | null
          tanggal?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "akpd_siswa_id_fkey"
            columns: ["siswa_id"]
            isOneToOne: false
            referencedRelation: "siswa"
            referencedColumns: ["id"]
          },
        ]
      }
      daftar_hadir: {
        Row: {
          created_at: string
          id: string
          kegiatan: string | null
          keterangan: string | null
          siswa_id: string | null
          status: string | null
          tanggal: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          kegiatan?: string | null
          keterangan?: string | null
          siswa_id?: string | null
          status?: string | null
          tanggal?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          kegiatan?: string | null
          keterangan?: string | null
          siswa_id?: string | null
          status?: string | null
          tanggal?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daftar_hadir_siswa_id_fkey"
            columns: ["siswa_id"]
            isOneToOne: false
            referencedRelation: "siswa"
            referencedColumns: ["id"]
          },
        ]
      }
      dokumen: {
        Row: {
          created_at: string
          file_path: string | null
          id: string
          judul: string
          kategori: string | null
          keterangan: string | null
          tanggal: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_path?: string | null
          id?: string
          judul: string
          kategori?: string | null
          keterangan?: string | null
          tanggal?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          file_path?: string | null
          id?: string
          judul?: string
          kategori?: string | null
          keterangan?: string | null
          tanggal?: string
          user_id?: string
        }
        Relationships: []
      }
      konseling_individu: {
        Row: {
          bidang: string | null
          created_at: string
          hasil: string | null
          id: string
          masalah: string | null
          siswa_id: string | null
          tanggal: string
          tindakan: string | null
          user_id: string
        }
        Insert: {
          bidang?: string | null
          created_at?: string
          hasil?: string | null
          id?: string
          masalah?: string | null
          siswa_id?: string | null
          tanggal?: string
          tindakan?: string | null
          user_id?: string
        }
        Update: {
          bidang?: string | null
          created_at?: string
          hasil?: string | null
          id?: string
          masalah?: string | null
          siswa_id?: string | null
          tanggal?: string
          tindakan?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "konseling_individu_siswa_id_fkey"
            columns: ["siswa_id"]
            isOneToOne: false
            referencedRelation: "siswa"
            referencedColumns: ["id"]
          },
        ]
      }
      konseling_kelompok: {
        Row: {
          anggota: string | null
          bidang: string | null
          created_at: string
          hasil: string | null
          id: string
          tanggal: string
          topik: string
          user_id: string
        }
        Insert: {
          anggota?: string | null
          bidang?: string | null
          created_at?: string
          hasil?: string | null
          id?: string
          tanggal?: string
          topik: string
          user_id?: string
        }
        Update: {
          anggota?: string | null
          bidang?: string | null
          created_at?: string
          hasil?: string | null
          id?: string
          tanggal?: string
          topik?: string
          user_id?: string
        }
        Relationships: []
      }
      kunjungan: {
        Row: {
          created_at: string
          id: string
          keperluan: string | null
          siswa_id: string | null
          tanggal: string
          tindak_lanjut: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          keperluan?: string | null
          siswa_id?: string | null
          tanggal?: string
          tindak_lanjut?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          keperluan?: string | null
          siswa_id?: string | null
          tanggal?: string
          tindak_lanjut?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kunjungan_siswa_id_fkey"
            columns: ["siswa_id"]
            isOneToOne: false
            referencedRelation: "siswa"
            referencedColumns: ["id"]
          },
        ]
      }
      pelanggaran: {
        Row: {
          created_at: string
          id: string
          jenis: string | null
          pembinaan: string | null
          poin: number | null
          siswa_id: string | null
          status: string | null
          tanggal: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          jenis?: string | null
          pembinaan?: string | null
          poin?: number | null
          siswa_id?: string | null
          status?: string | null
          tanggal?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          jenis?: string | null
          pembinaan?: string | null
          poin?: number | null
          siswa_id?: string | null
          status?: string | null
          tanggal?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pelanggaran_siswa_id_fkey"
            columns: ["siswa_id"]
            isOneToOne: false
            referencedRelation: "siswa"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          kelas_binaan: string | null
          nama: string
          nip: string | null
        }
        Insert: {
          created_at?: string
          id: string
          kelas_binaan?: string | null
          nama?: string
          nip?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          kelas_binaan?: string | null
          nama?: string
          nip?: string | null
        }
        Relationships: []
      }
      program_bk: {
        Row: {
          bidang: string | null
          created_at: string
          id: string
          jenis: string | null
          judul: string
          kelas: string | null
          keterangan: string | null
          tujuan: string | null
          user_id: string
          waktu: string | null
        }
        Insert: {
          bidang?: string | null
          created_at?: string
          id?: string
          jenis?: string | null
          judul: string
          kelas?: string | null
          keterangan?: string | null
          tujuan?: string | null
          user_id?: string
          waktu?: string | null
        }
        Update: {
          bidang?: string | null
          created_at?: string
          id?: string
          jenis?: string | null
          judul?: string
          kelas?: string | null
          keterangan?: string | null
          tujuan?: string | null
          user_id?: string
          waktu?: string | null
        }
        Relationships: []
      }
      siswa: {
        Row: {
          alamat: string | null
          created_at: string
          id: string
          jenis_kelamin: string | null
          kelas: string | null
          nama: string
          nama_ortu: string | null
          nis: string | null
          telepon: string | null
          user_id: string
        }
        Insert: {
          alamat?: string | null
          created_at?: string
          id?: string
          jenis_kelamin?: string | null
          kelas?: string | null
          nama: string
          nama_ortu?: string | null
          nis?: string | null
          telepon?: string | null
          user_id?: string
        }
        Update: {
          alamat?: string | null
          created_at?: string
          id?: string
          jenis_kelamin?: string | null
          kelas?: string | null
          nama?: string
          nama_ortu?: string | null
          nis?: string | null
          telepon?: string | null
          user_id?: string
        }
        Relationships: []
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
