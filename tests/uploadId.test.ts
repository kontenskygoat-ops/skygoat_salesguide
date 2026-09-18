import { test } from "node:test";
import assert from "node:assert/strict";
import { createUploadId } from "../lib/uploadId";

test("upload names work without the secure-context randomUUID API", () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, "crypto");
  Object.defineProperty(globalThis, "crypto", {
    configurable: true,
    value: { getRandomValues: (bytes: Uint8Array) => bytes.fill(173) },
  });
  try {
    assert.equal(createUploadId(), "ad".repeat(16));
  } finally {
    if (descriptor) Object.defineProperty(globalThis, "crypto", descriptor);
  }
});

test("repeated uploads receive distinct, storage-safe names", () => {
  const ids = Array.from({ length: 100 }, createUploadId);
  assert.ok(ids.every(id => /^[a-f0-9]{32}$/.test(id)));
  assert.equal(new Set(ids).size, ids.length);
});
