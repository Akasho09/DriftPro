"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Topbar } from "@repo/ui/topbar";

export function AppbarClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  if (status === "loading") {
    return <p className="text-gray-500 text-center mt-4">Loading...</p>;
  }

  return (
      <Topbar
        onSignin={signIn}
        onSignout={async () => {
          await signOut();
          router.push("/api/auth/signin");
        }}
        user={session?.user}
      />
  );
}