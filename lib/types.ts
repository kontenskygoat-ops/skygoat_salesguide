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
