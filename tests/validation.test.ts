import { test } from 'node:test';
import assert from 'node:assert/strict';
import { safeUrl, validEmail } from '../lib/validation';
import { extractGoogleDriveFileId, videoSource } from '../lib/googleDrive';
import { resolveSettings } from '../lib/official';
test('rejects executable, protocol-relative and credential-bearing links', () => {
 for (const value of ['javascript:alert(1)', 'data:text/html,hello', '//evil.test', '/\\evil.test', 'https://user:pass@example.com', 'https://example.com/\nhidden']) assert.equal(safeUrl(value, true), '');
 assert.equal(safeUrl('/gallery', true), '/gallery'); assert.equal(safeUrl('#flow', true), '#flow');
 assert.equal(safeUrl('https://example.com/a'), 'https://example.com/a');
});
test('only recognizes real Drive hosts and supported video types', () => {
 assert.equal(extractGoogleDriveFileId('https://evil.test/file/d/abc'), null);
 assert.equal(extractGoogleDriveFileId('https://drive.google.com/file/d/abc_123/view'), 'abc_123');
 assert.equal(videoSource('https://evil.test/login'), null);
 assert.equal(videoSource('https://cdn.example.com/movie.mp4?token=abc')?.kind, 'video');
 assert.equal(videoSource('https://abc.supabase.co/storage/v1/object/public/site-media/video-object')?.kind, 'video');
 assert.equal(videoSource('https://drive.google.com/file/d/abc/view')?.url, 'https://drive.google.com/file/d/abc/preview');
});
test('official contact bootstrap respects explicit removal after save', () => {
 assert.equal(resolveSettings({whatsapp_url:''}).whatsapp_url, 'https://wa.me/6287700330005');
 assert.equal(resolveSettings({whatsapp_url:'',official_defaults_version:'1'}).whatsapp_url, '');
 assert.equal(validEmail('hello@example.com'),true); assert.equal(validEmail('a@b.com\nBcc:foo'),false);
});
