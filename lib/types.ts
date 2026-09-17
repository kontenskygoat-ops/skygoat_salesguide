export type MediaAsset = {
  id: string;
  title: string;
  slug: string;
  category: "mesin" | "produksi" | "peternakan" | "produk" | "video";
  description: string | null;
  image_url: string | null;
  video_url: string | null;
  sort_order: number;
  is_active: boolean;
};

export type SalesSection = {
  id: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  button_text: string | null;
  button_url: string | null;
  sort_order: number;
  is_active: boolean;
};
