import { test } from "node:test";
import assert from "node:assert/strict";
import {
  portraitPrefix,
  portraitSlots,
  readPortraitSlot,
  writePortraitSlot,
} from "../lib/portraitVideos";

test("portrait video exposes three independent slots", () => {
  assert.deepEqual([...portraitSlots], [1, 2, 3]);
  assert.equal(portraitPrefix(1), "home_portrait_video");
  assert.equal(portraitPrefix(2), "home_portrait_video_2");
  assert.equal(portraitPrefix(3), "home_portrait_video_3");
});

test("portrait settings isolate slot 1 from slot 2 and 3", () => {
  const settings = {
    home_portrait_video_url: "portrait-1.mp4",
    home_portrait_video_archive: "[]",
    home_portrait_video_2_url: "portrait-2.mp4",
    home_portrait_video_3_url: "portrait-3.mp4",
    home_video_url: "landscape.mp4",
  };

  assert.deepEqual(readPortraitSlot(settings, 1), {
    home_portrait_video_url: "portrait-1.mp4",
    home_portrait_video_archive: "[]",
  });
  assert.deepEqual(readPortraitSlot(settings, 2), {
    home_portrait_video_url: "portrait-2.mp4",
  });
  assert.deepEqual(readPortraitSlot(settings, 3), {
    home_portrait_video_url: "portrait-3.mp4",
  });
});

test("portrait settings write to the selected database slot", () => {
  const values = {
    home_portrait_video_url: "replacement.mp4",
    home_portrait_video_archive: "[]",
  };

  assert.deepEqual(writePortraitSlot(values, 1), {
    home_portrait_video_url: "replacement.mp4",
    home_portrait_video_archive: "[]",
  });
  assert.deepEqual(writePortraitSlot(values, 2), {
    home_portrait_video_2_url: "replacement.mp4",
    home_portrait_video_2_archive: "[]",
  });
  assert.deepEqual(writePortraitSlot(values, 3), {
    home_portrait_video_3_url: "replacement.mp4",
    home_portrait_video_3_archive: "[]",
  });
});
