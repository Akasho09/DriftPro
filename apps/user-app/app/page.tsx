// import { getServerSession } from "next-auth";
import { redirect } from 'next/navigation'
// import { authOptions } from "../lib/auth";
export default async function Page() {
  // const session = await getServerSession(authOptions);
  redirect('/dashboard')
  // if (session?.user) {
  //   redirect('/dashboard')
  // } else {
  //   redirect('/api/auth/signin')
  // }
}