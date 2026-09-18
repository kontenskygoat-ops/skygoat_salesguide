import { safeUrl } from "./validation";

export const portraitSlots = [1, 2, 3] as const;
export type PortraitSlot = (typeof portraitSlots)[number];

const portraitSuffixes = [
  "url",
  "storage_path",
  "file_name",
  "file_size",
  "width",
  "height",
  "title",
  "description",
  "poster_url",
  "archive",
] as const;

export function portraitPrefix(slot: PortraitSlot) {
  return slot === 1 ? "home_portrait_video" : `home_portrait_video_${slot}`;
}

export function readPortraitSlot(
  settings: Record<string, string>,
  slot: PortraitSlot,
) {
  const prefix = portraitPrefix(slot);
  const entries = portraitSuffixes.flatMap((suffix) => {
    const storedKey = `${prefix}_${suffix}`;
    const value = settings[storedKey];
    if (value === undefined) return [];
    return [[`home_portrait_video_${suffix}`, value] as const];
  });
  return Object.fromEntries(entries);
}

export function writePortraitSlot(
  values: Record<string, string>,
  slot: PortraitSlot,
) {
  const prefix = portraitPrefix(slot);
  const entries = portraitSuffixes.flatMap((suffix) => {
    const localKey = `home_portrait_video_${suffix}`;
    const value = values[localKey];
    if (value === undefined) return [];
    return [[`${prefix}_${suffix}`, value] as const];
  });
  return Object.fromEntries(entries);
}

export type PortraitVideoConfig = {
  slot: PortraitSlot;
  videoUrl: string;
  title: string;
  description: string;
  posterUrl: string;
};

/**
 * Build all three homepage slots without silently dropping a configured slot.
 * Rendering/format validation is intentionally left to HomePortraitVideo so a
 * bad URL becomes visible to the admin/user instead of making a card disappear.
 */
export function getPortraitVideoConfigs(
  settings: Record<string, string>,
): PortraitVideoConfig[] {
  return portraitSlots.map((slot) => {
    const prefix = portraitPrefix(slot);
    return {
      slot,
      videoUrl: safeUrl(settings[`${prefix}_url`]),
      title: settings[`${prefix}_title`]?.trim() || `Video SKYGOAT ${slot}`,
      description: settings[`${prefix}_description`]?.trim() || "",
      posterUrl: safeUrl(settings[`${prefix}_poster_url`]),
    };
  });
}
