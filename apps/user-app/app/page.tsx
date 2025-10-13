import { getServerSession } from "next-auth";
import { redirect } from 'next/navigation';
import { authOptions } from "../lib/auth";

export default async function Page() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/auth/signup');
  }

  if (!session.user.mobile) {
    redirect('/profile/update');
  }

  redirect('/dashboard');
}
