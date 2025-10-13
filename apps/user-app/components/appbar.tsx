"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Topbar } from "@repo/ui/topbar";

export function AppbarClient() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl h-16 bg-gray-400/50 rounded-2xl animate-pulse" />
    );
  }

  return (
    <Topbar
      onSignin={() => signIn(undefined, { callbackUrl: window.location.pathname })}
      onSignout={() => signOut({ callbackUrl: "/auth/signin" })}
      user={session?.user ?? undefined}
    />
  );
}