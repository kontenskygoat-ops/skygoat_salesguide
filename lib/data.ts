import { cache } from "react";
import { getSupabaseClient } from "@/lib/supabase";
import type { MediaAsset, SalesSection } from "@/lib/types";
export type ContentResult<T> = { data: T; error: boolean };
export const getMediaAssets = cache(async (): Promise<ContentResult<MediaAsset[]>> => {
  try {
    const { data, error } = await getSupabaseClient().from("media_assets").select("*").eq("is_active", true).order("sort_order").order("id");
    if (error) throw error;
    return { data: data ?? [], error: false };
  } catch {
    console.error("Failed to load media_assets");
    return { data: [], error: true };
  }
});
export const getSalesSections = cache(async (): Promise<ContentResult<SalesSection[]>> => {
  try {
    const { data, error } = await getSupabaseClient().from("sales_sections").select("*").eq("is_active", true).order("sort_order").order("id");
    if (error) throw error;
    return { data: data ?? [], error: false };
  } catch {
    console.error("Failed to load sales_sections");
    return { data: [], error: true };
  }
});
export const getSiteSettings = cache(async (): Promise<ContentResult<Record<string, string>>> => {
  try {
    const { data, error } = await getSupabaseClient().from("site_settings").select("setting_key,setting_value");
    if (error) throw error;
    return { data: Object.fromEntries((data ?? []).map(row => [row.setting_key, row.setting_value ?? ""])), error: false };
  } catch {
    console.error("Failed to load site_settings");
    return { data: {}, error: true };
  }
});
