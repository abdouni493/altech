/**
 * Row shapes for the Supabase Postgres tables defined in supabase/schema.sql.
 * Columns are snake_case here and mapped to the app's camelCase types in api.ts.
 */

export interface CategoryRow {
  id: string;
  name: string;
  created_at: string;
}

export interface ProgramRow {
  id: string;
  name: string;
  description: string;
  image: string;
  price_online: number;
  price_offline: number;
  demo_url_enabled: boolean;
  demo_url: string;
  category_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface PromotionRow {
  id: string;
  base_program_id: string | null;
  name: string;
  description: string;
  image: string;
  category_id: string | null;
  price_online: number;
  price_offline: number;
  new_price_online: number;
  new_price_offline: number;
  end_date: string | null;
  demo_url_enabled: boolean;
  demo_url: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CommandRow {
  id: string;
  client_name: string;
  phone: string;
  wilaya: string;
  program_id: string | null;
  type: "online" | "offline";
  price: number;
  status: "pending" | "accepted" | "cancelled";
  image: string;
  program_name: string;
  created_at: string;
}

export interface CustomOrderRow {
  id: string;
  client_name: string;
  phone: string;
  wilaya: string;
  description: string;
  created_at: string;
}

export interface ShowroomRow {
  id: number;
  logo: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  updated_at: string;
}

export interface ContactsRow {
  id: number;
  facebook_url: string;
  instagram_url: string;
  tiktok_url: string;
  maps_url: string;
  whatsapp_number: string;
  updated_at: string;
}

export interface AdminAccountRow {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  updated_at: string;
}
