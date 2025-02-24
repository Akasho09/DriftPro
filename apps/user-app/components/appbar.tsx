"use client"
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Topbar } from "@repo/ui/topbar";

export function AppbarClient() {
  const session = useSession();
  const router = useRouter()
  return (
   <div>
      <Topbar onSignin={signIn} onSignout={
       async ()=>{
        await signOut()
        router.push("/api/auth/signin")
        }
        } user={session.data?.user} />
   </div>
  );
}
