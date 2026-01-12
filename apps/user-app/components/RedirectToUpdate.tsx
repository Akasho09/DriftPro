"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectToUpdate({ mobile }: { mobile?: string }) {
  const router = useRouter();

  useEffect(() => {
    if (!mobile) {
      alert("Update Mobile First");
      router.push("/profile/update");
    }
  }, [mobile, router]);

  return null;
}
