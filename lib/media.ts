import { getSupabaseClient } from "@/lib/supabase";
import type { MediaAsset } from "@/lib/types";

const fallback: MediaAsset[] = [
  {
    id: "demo-1",
    title: "Mesin Evaporasi",
    slug: "mesin-evaporasi",
    category: "mesin",
    description: "Dokumentasi mesin evaporasi. Ganti foto dan video melalui Supabase setelah asset Google Drive siap.",
    image_url: null,
    video_url: null,
    sort_order: 1,
    is_active: true
  },
  {
    id: "demo-2",
    title: "Mesin Mixing",
    slug: "mesin-mixing",
    category: "mesin",
    description: "Dokumentasi proses mixing bahan baku SKYGOAT.",
    image_url: null,
    video_url: null,
    sort_order: 2,
    is_active: true
  },
  {
    id: "demo-3",
    title: "Mesin Filling",
    slug: "mesin-filling",
    category: "mesin",
    description: "Dokumentasi proses filling dan pengemasan produk.",
    image_url: null,
    video_url: null,
    sort_order: 3,
    is_active: true
  }
];

export async function getMediaAssets(): Promise<MediaAsset[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return fallback;

  const { data, error } = await supabase
    .from("media_assets")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data) {
    console.error("Supabase media error:", error);
    return fallback;
  }

  return data as MediaAsset[];
}
