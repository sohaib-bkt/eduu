/**
 * Creates demo Auth users matching supabase/seed.sql profile IDs.
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env (Settings → API → Secret key).
 *
 * Usage: npm run seed:auth
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function loadEnvFile() {
  const envPath = resolve(root, '.env');
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    'Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.\n' +
      'Add your Secret key from Supabase → Settings → API Keys.'
  );
  process.exit(1);
}

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const TEST_USERS = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    email: 'john.doe@example.com',
    full_name: 'John Doe',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    email: 'jane.smith@example.com',
    full_name: 'Jane Smith',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    email: 'prof.teacher@example.com',
    full_name: 'Professor Teacher',
  },
];

const PASSWORD = 'password';

async function findUserByEmail(email) {
  const { data, error } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (error) throw error;
  return data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
}

async function ensureTestUser({ id, email, full_name }) {
  const existing = await findUserByEmail(email);

  if (existing && existing.id !== id) {
    console.log(`Removing mismatched account for ${email} (${existing.id})`);
    const { error } = await admin.auth.admin.deleteUser(existing.id);
    if (error) throw error;
  } else if (existing?.id === id) {
    const { error } = await admin.auth.admin.updateUserById(id, {
      password: PASSWORD,
      email_confirm: true,
      user_metadata: { full_name },
    });
    if (error) throw error;
    console.log(`Updated ${email}`);
    return;
  }

  const { error } = await admin.auth.admin.createUser({
    id,
    email,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { full_name },
  });
  if (error) throw error;
  console.log(`Created ${email}`);
}

console.log('Seeding demo auth users (password: password)...\n');

for (const user of TEST_USERS) {
  await ensureTestUser(user);
}

const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
const publicClient = createClient(supabaseUrl, anonKey);
const { error: loginError } = await publicClient.auth.signInWithPassword({
  email: 'prof.teacher@example.com',
  password: PASSWORD,
});

if (loginError) {
  console.error('\nVerification failed:', loginError.message);
  process.exit(1);
}

console.log('\nDone. Login verified for prof.teacher@example.com');
