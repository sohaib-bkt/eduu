export function formatAuthError(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes('failed to fetch') || lower.includes('network')) {
    return 'Impossible de joindre le serveur Supabase. Vérifiez que votre projet est actif sur supabase.com (projet non en pause) et que les variables VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY sont correctes.';
  }

  if (lower.includes('invalid login credentials')) {
    return 'Email ou mot de passe incorrect. Pour les comptes de démo, exécutez : npm run seed:auth';
  }

  if (lower.includes('email not confirmed')) {
    return 'Confirmez votre adresse email, ou exécutez npm run seed:auth pour recréer les comptes de test.';
  }

  return message;
}
