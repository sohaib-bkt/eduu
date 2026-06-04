import { createClient } from '@supabase/supabase-js';
import { existsSync, readFileSync } from 'fs';

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const separator = trimmed.indexOf('=');
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile('.env');
loadEnvFile('.env.local');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://qcuazhxsfuejsdrzhjmd.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const TEACHER_ID = '550e8400-e29b-41d4-a716-446655440003';
const EMAIL = 'prof.teacher@example.com';
const PASSWORD = 'password';

if (!SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function findUserByEmail(email) {
  let page = 1;
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const user = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (user) return user;
    if (data.users.length < 200) return null;
    page += 1;
  }
}

async function ensureAuthUser() {
  const existing = await findUserByEmail(EMAIL);

  if (existing) {
    const { data, error } = await supabase.auth.admin.updateUserById(existing.id, {
      password: PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: 'Professor Teacher' },
    });
    if (error) throw error;
    console.log('Updated existing auth user:', data.user.id);
    return data.user.id;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    id: TEACHER_ID,
    email: EMAIL,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: 'Professor Teacher' },
  });

  if (error) {
    throw error;
  }

  console.log('Created auth user:', data.user.id);
  return data.user.id;
}

async function ensureProfile(userId) {
  const { data: existing, error: fetchError } = await supabase
    .from('profiles')
    .select('id, email, role')
    .eq('id', userId)
    .maybeSingle();

  if (fetchError) throw fetchError;

  const profilePayload = {
    id: userId,
    email: EMAIL,
    full_name: 'Professor Teacher',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Professor',
    role: 'admin',
  };

  if (existing) {
    const { error } = await supabase.from('profiles').update(profilePayload).eq('id', userId);
    if (error) throw error;
    console.log('Updated profile to admin');
    return;
  }

  const { error } = await supabase.from('profiles').insert([profilePayload]);
  if (error) throw error;
  console.log('Created admin profile');
}

async function ensureActiveSubscription(userId) {
  const { data: existing, error: fetchError } = await supabase
    .from('subscriptions')
    .select('id, status, plan_type')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (fetchError) throw fetchError;

  if (existing) {
    const { error } = await supabase
      .from('subscriptions')
      .update({ status: 'active', plan_type: 'pro' })
      .eq('id', existing.id);
    if (error) throw error;
    console.log('Activated existing subscription');
    return;
  }

  const { error } = await supabase.from('subscriptions').insert([
    {
      user_id: userId,
      plan_type: 'pro',
      status: 'active',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);
  if (error) throw error;
  console.log('Created active pro subscription');
}

async function main() {
  const userId = await ensureAuthUser();
  await ensureProfile(userId);
  await ensureActiveSubscription(userId);
  console.log('\nDone. Login with:');
  console.log(`  Email: ${EMAIL}`);
  console.log(`  Password: ${PASSWORD}`);
  console.log(`  Role: admin (principal)`);
}

main().catch((err) => {
  console.error('Setup failed:', err.message || err);
  process.exit(1);
});
