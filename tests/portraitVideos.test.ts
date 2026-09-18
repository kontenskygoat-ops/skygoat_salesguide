import { test } from "node:test";
import assert from "node:assert/strict";
import { readPortraitSlot, writePortraitSlot } from "../lib/portraitVideos";

test("portrait settings map only the single portrait video keys", () => {
  const settings = {
    home_portrait_video_url: "portrait.mp4",
    home_portrait_video_archive: "[]",
    home_video_url: "landscape.mp4",
  };

  assert.deepEqual(readPortraitSlot(settings), {
    home_portrait_video_url: "portrait.mp4",
    home_portrait_video_archive: "[]",
  });

  assert.deepEqual(
    writePortraitSlot({
      home_portrait_video_url: "replacement.mp4",
      home_portrait_video_archive: "[]",
    }),
    {
      home_portrait_video_url: "replacement.mp4",
      home_portrait_video_archive: "[]",
    },
  );
});
