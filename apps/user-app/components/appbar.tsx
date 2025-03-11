"use client"
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Topbar } from "@repo/ui/topbar";

export function AppbarClient() {
  const session = useSession();
  // const session = await getServerSession(authOptions)
  const router = useRouter()
  console.log(session)
  if (session.status === "loading") return <p>Loading...</p>;
  return (
    
   <div>
      <Topbar onSignin={signIn} onSignout={
       async ()=>{
        await signOut()
        router.push("/api/auth/signin")
        }
        } user={session.data?.user} update={session.update}/>
   </div>
  );
}
