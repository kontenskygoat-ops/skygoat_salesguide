import nextEnv from '@next/env';
import { createClient } from '@supabase/supabase-js';
nextEnv.loadEnvConfig(process.cwd());
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key || !URL.canParse(url) || !url.startsWith('https://') || /YOUR_|example/.test(url + key)) throw new Error('Configure real Supabase URL and public anon key.');
if (key.startsWith('sb_secret_')) throw new Error('Never expose a secret key through NEXT_PUBLIC variables.');
try { if (JSON.parse(Buffer.from(key.split('.')[1] ?? '', 'base64url').toString()).role === 'service_role') throw new Error('service_role key is not allowed'); } catch (error) { if (error.message.includes('service_role')) throw error; }
const client = createClient(url, key, { auth: { persistSession: false }, global: { fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(10000) }) } });
for (const table of ['media_assets', 'sales_sections', 'site_settings']) {
  const { error } = await client.from(table).select('*').limit(1);
  if (error) throw new Error(table + ': ' + error.message);
  console.log('PASS public read: ' + table);
}
const { data, error } = await client.rpc('is_admin');
if (error || data !== false) throw new Error('Anonymous is_admin must return false.');
console.log('PASS anonymous user has no admin role');
const { data: admins, error: adminError } = await client.from('admin_users').select('user_id').limit(1);
if (!adminError && admins?.length) throw new Error('Admin membership table must not be publicly readable.');
console.log('PASS admin membership is not exposed');
console.log('Deployment configuration checks passed. Authenticated CRUD still requires an admin session.');
