// Database types for AnimeForge
export type AppRole = 'admin' | 'creator' | 'patron';
export type ProjectStatus = 'draft' | 'pilot' | 'funding' | 'funded' | 'production' | 'completed';
export type FundingTier = 'seed' | 'hype' | 'production' | 'premiere';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JsonValue = any;

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface StyleLibrary {
  id: string;
  name: string;
  description: string | null;
  tags: string[];
  preview_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  genre: string | null;
  status: ProjectStatus;
  funding_tier: FundingTier;
  funding_goal: number;
  funding_current: number;
  funding_percentage: number;
  bonding_curve_price: number;
  cover_image_url: string | null;
  story_bible: JsonValue;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CharacterSeed {
  id: string;
  project_id: string;
  name: string;
  role: string;
  style_dna: JsonValue;
  personality: string[];
  backstory: string | null;
  abilities: string[];
  appearance: string | null;
  reference_image_url: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface MangaPanel {
  id: string;
  project_id: string;
  chapter_number: number;
  page_number: number;
  panel_position: number;
  prompt_data: JsonValue;
  dialogue: string | null;
  description: string | null;
  image_url: string | null;
  is_keyframe: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface DirectorChoice {
  id: string;
  project_id: string;
  panel_id: string | null;
  choice_type: string;
  variations: Variation[];
  selected_index: number | null;
  selected_by: string | null;
  selected_at: string | null;
  metadata: JsonValue;
  created_at: string;
}

export interface Variation {
  id: string;
  prompt: string;
  preview_url?: string;
  description: string;
  style_tags: string[];
}

export interface ProvenanceLog {
  id: string;
  project_id: string | null;
  entity_type: string;
  entity_id: string;
  action: string;
  user_id: string | null;
  details: JsonValue;
  prompt_hash: string | null;
  created_at: string;
}

export interface FundingTransaction {
  id: string;
  project_id: string;
  user_id: string | null;
  amount: number;
  credits_received: number;
  price_at_purchase: number;
  transaction_type: string;
  metadata: JsonValue;
  created_at: string;
}

export interface ProjectRights {
  id: string;
  project_id: string;
  holder_id: string | null;
  rights_type: string;
  percentage: number;
  is_tradeable: boolean;
  acquired_at: string;
  price_paid: number | null;
  metadata: JsonValue;
}
