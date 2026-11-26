/** Row shapes for the tables in supabase/schema.sql. */

export type CountsAs = "kits" | "meals" | "other";

export type ProgramRow = {
  id: number;
  slug: string;
  name_en: string;
  name_ml: string;
  icon: string;
  counts_as: CountsAs;
  sort_order: number;
  is_active: boolean;
};

export type LedgerEntryRow = {
  id: string;
  entry_date: string; // YYYY-MM-DD
  quantity: number;
  place: string;
  program_id: number;
  note: string | null;
  photo_url: string | null;
  created_at: string;
};

export type VideoRow = {
  id: string;
  youtube_id: string;
  title_en: string | null;
  title_ml: string | null;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
  created_at: string;
};

export type PhotoRow = {
  id: string;
  photo_url: string;
  thumb_url: string;
  width: number;
  height: number;
  caption_en: string | null;
  caption_ml: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
};

export type PressReleaseRow = {
  id: string;
  slug: string;
  title_en: string;
  title_ml: string | null;
  body_en: string;
  body_ml: string | null;
  photo_url: string | null;
  photo_social_url: string | null;
  photo_thumb_url: string | null;
  photo_width: number | null;
  photo_height: number | null;
  photo_alt: string | null;
  release_date: string;
  place: string | null;
  meta_description: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type ProgramTotal = {
  id: number;
  slug: string;
  name_en: string;
  name_ml: string;
  icon: string;
  counts_as: CountsAs;
  total: number;
  entries: number;
};

export type MonthTotal = { month: string; kits: number; meals: number; other: number; total: number };

/** Shape returned by the get_impact_stats() RPC. */
export type ImpactStats = {
  kits: number;
  meals: number;
  days: number | null;
  start_date: string | null;
  total_entries: number;
  last_entry_at: string | null;
  by_program: ProgramTotal[];
  by_place: { place: string; total: number; entries: number }[];
  by_month: MonthTotal[];
};

/** Public columns for ledger lists. */
export const LEDGER_COLUMNS = "id,entry_date,quantity,place,program_id,note,photo_url,created_at";
export const VIDEO_COLUMNS = "id,youtube_id,title_en,title_ml,is_featured,is_published,sort_order,created_at";
export const PHOTO_COLUMNS = "id,photo_url,thumb_url,width,height,caption_en,caption_ml,is_published,sort_order,created_at";
export const PRESS_LIST_COLUMNS =
  "id,slug,title_en,title_ml,body_en,body_ml,photo_thumb_url,photo_url,photo_width,photo_height,photo_alt,release_date,place,meta_description,is_published,created_at,updated_at";
