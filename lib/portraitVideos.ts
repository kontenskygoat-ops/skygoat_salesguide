export const portraitSlots = [1] as const;
export type PortraitSlot = 1;

export function portraitPrefix(_slot: PortraitSlot = 1) {
  return "home_portrait_video";
}

export function readPortraitSlot(
  settings: Record<string, string>,
  _slot: PortraitSlot = 1,
) {
  const prefix = "home_portrait_video_";
  return Object.fromEntries(
    Object.entries(settings).filter(
      ([key]) =>
        key.startsWith(prefix) &&
        !/^home_portrait_video_\d+_/.test(key),
    ),
  );
}

export function writePortraitSlot(
  values: Record<string, string>,
  _slot: PortraitSlot = 1,
) {
  return { ...values };
}
