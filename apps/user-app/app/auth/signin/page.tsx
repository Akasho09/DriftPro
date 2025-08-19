"use client";

import { Suspense } from "react";
import SignInForm from "./SignIn";

export default function SignInPageWrapper() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading sign in...</div>}>
      <SignInForm />
    </Suspense>
  );
}
