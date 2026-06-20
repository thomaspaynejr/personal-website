import { createClient } from '@/lib/supabase/server';
import { signout } from '@/app/actions/auth';
import NavbarClient from './NavbarClient';

export default async function Navbar() {
  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  const isAdmin = user?.user_metadata?.role === 'admin';

  return <NavbarClient user={user} isAdmin={isAdmin} signoutAction={signout} />;
}